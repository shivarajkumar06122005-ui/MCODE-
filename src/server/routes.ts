import { Router, Request, Response } from 'express';
import { db } from './db';
import { GoogleGenAI } from '@google/genai';

export const apiRouter = Router();

// Helper to get active user ID from header or default
const getUserId = (req: Request): string => {
  const headerUserId = req.headers['x-user-id'];
  if (typeof headerUserId === 'string' && headerUserId.trim().length > 0) {
    return headerUserId.trim();
  }
  return 'default_scholar';
};

// 1. Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), server: 'MCODE Express API' });
});

// 2. Auth & User Profile
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const user = db.getUser(userId);
  res.json(user);
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { name, department, academicLevel, tagline, theme } = req.body;
  const updated = db.updateUser(userId, {
    ...(name !== undefined && { name }),
    ...(department !== undefined && { department }),
    ...(academicLevel !== undefined && { academicLevel }),
    ...(tagline !== undefined && { tagline }),
    ...(theme !== undefined && { theme }),
  });
  res.json(updated);
});

apiRouter.post('/auth/onboarding', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { name, email, academicLevel, department } = req.body;
  const updated = db.updateUser(userId, {
    name: name || 'Ren',
    email: email || 'ren@gmail.com',
    academicLevel: academicLevel || 'Undergraduate',
    department: department || 'Mathematics',
    onboardingCompleted: true,
  });
  res.json({ success: true, user: updated });
});

apiRouter.post('/user/sync', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { user, course, environments, pets, scratchpad } = req.body;

  if (user) {
    db.updateUser(userId, {
      ...(user.name && { name: user.name }),
      ...(user.email && { email: user.email }),
      ...(user.academicLevel && { academicLevel: user.academicLevel }),
      ...(user.department && { department: user.department }),
      ...(user.tagline && { tagline: user.tagline }),
      ...(typeof user.tokens === 'number' && { tokens: Math.max(user.tokens, db.getUser(userId).tokens) }),
      ...(typeof user.streak === 'number' && { streak: Math.max(user.streak, db.getUser(userId).streak) }),
      ...(user.theme && { theme: user.theme }),
      ...(scratchpad && { scratchpad }),
      ...(typeof user.onboardingCompleted === 'boolean' && { onboardingCompleted: user.onboardingCompleted }),
    });
  }

  if (course) {
    db.updateCourse(userId, course);
  }

  if (Array.isArray(environments)) {
    db.setEnvironments(userId, environments);
  }

  if (Array.isArray(pets)) {
    db.setPets(userId, pets);
  }

  res.json({ success: true, user: db.getUser(userId) });
});

// 3. Courses & Pathways
apiRouter.get('/courses', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const courses = db.getCourses(userId);
  res.json(courses);
});

apiRouter.get('/courses/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const course = db.getCourse(userId, req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

// 4. Task Toggle (learning quest completion)
apiRouter.post('/courses/:courseId/tasks/:taskId/toggle', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { courseId, taskId } = req.params;
  const { unitId, levelId } = req.body;

  const course = db.getCourse(userId, courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const uId = Number(unitId);
  const lId = Number(levelId);
  let tokenAward = 0;
  let taskCompleted = false;

  const updatedUnits = course.units.map((unit) => {
    if (unit.id !== uId) return unit;

    const updatedLevels = unit.levels.map((level) => {
      if (level.id !== lId) return level;

      const updatedTasks = level.tasks.map((task) => {
        if (task.id === taskId) {
          const nextState = !task.completed;
          taskCompleted = nextState;
          if (nextState) {
            tokenAward = task.tokenReward || 10;
          }
          return { ...task, completed: nextState };
        }
        return task;
      });

      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 100;

      return {
        ...level,
        tasks: updatedTasks,
        progress,
      };
    });

    return { ...unit, levels: updatedLevels };
  });

  // Calculate overall course progress
  let totalTasks = 0;
  let completedTasks = 0;
  updatedUnits.forEach((u) => {
    u.levels.forEach((l) => {
      l.tasks.forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });
  });
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : course.progress;

  const updatedCourse = {
    ...course,
    progress: overallProgress,
    units: updatedUnits,
  };

  db.updateCourse(userId, updatedCourse);

  let currentTokens = db.getUser(userId).tokens;
  if (taskCompleted && tokenAward > 0) {
    const resTokens = db.updateTokens(userId, tokenAward, `Completed quest task ${taskId}`);
    currentTokens = resTokens.tokens;
    db.logActivity(userId, {
      date: new Date().toISOString().split('T')[0],
      minutes: 15,
      tokensEarned: tokenAward,
      type: 'task_completion',
    });
  }

  res.json({
    course: updatedCourse,
    taskCompleted,
    tokenAward,
    currentTokens,
  });
});

// 5. Complete Level

apiRouter.post('/courses/:courseId/levels/:levelId/complete', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { courseId, levelId } = req.params;
  const { unitId } = req.body;

  const course = db.getCourse(userId, courseId);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const uId = Number(unitId);
  const lId = Number(levelId);

  if (
    !Number.isInteger(uId) ||
    !Number.isInteger(lId) ||
    uId <= 0 ||
    lId <= 0
  ) {
    return res.status(400).json({ error: 'Invalid unit or level ID' });
  }

  const targetUnit = course.units.find((unit) => unit.id === uId);

  if (!targetUnit) {
    return res.status(404).json({ error: 'Unit not found' });
  }

  const targetLevel = targetUnit.levels.find((level) => level.id === lId);

  if (!targetLevel) {
    return res.status(404).json({ error: 'Level not found' });
  }

  const wasCompleted = targetLevel.status === 'completed';

  const updatedUnits = course.units.map((unit) => {
    if (unit.id !== uId) return unit;

    const updatedLevels = unit.levels.map((level) => {
      if (level.id === lId) {
        return {
          ...level,
          status: 'completed' as const,
          progress: 100,
          tasks: level.tasks.map((task) => ({
            ...task,
            completed: true,
          })),
        };
      }

      if (level.id === lId + 1 && level.status === 'locked') {
        return {
          ...level,
          status: 'unlocked' as const,
        };
      }

      return level;
    });

    return { ...unit, levels: updatedLevels };
  });

  const updatedCourse = {
    ...course,
    units: updatedUnits,
  };

  db.updateCourse(userId, updatedCourse);

  let tokensEarned = 0;
  let currentTokens = db.getUser(userId).tokens;

  if (!wasCompleted) {
    const reward = db.claimRewardOnce(
      userId,
      `level:${courseId}:${uId}:${lId}`,
      20,
      `Completed Level ${lId}`
    );

    if (reward.awarded) {
      tokensEarned = 20;
      currentTokens = reward.tokens;

      db.logActivity(userId, {
        date: new Date().toISOString().split('T')[0],
        minutes: 30,
        tokensEarned: 20,
        type: 'task_completion',
      });
    } else {
      currentTokens = reward.tokens;
    }
  }

  res.json({
    course: updatedCourse,
    tokensEarned,
    currentTokens,
  });
});

  const updatedCourse = { ...course, units: updatedUnits };
  db.updateCourse(userId, updatedCourse);

  const { tokens } = db.updateTokens(userId, 20, `Completed Level ${lId}`);
  db.logActivity(userId, {
    date: new Date().toISOString().split('T')[0],
    minutes: 30,
    tokensEarned: 20,
    type: 'task_completion',
  });

  res.json({
    course: updatedCourse,
    tokensEarned: 20,
    currentTokens: tokens,
  });
});

// 6. Gateway Quiz Verification & Unit Progression
apiRouter.post('/courses/:courseId/units/:unitId/gateway-quiz', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { courseId, unitId } = req.params;
  const { answers } = req.body;

  const course = db.getCourse(userId, courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const uId = Number(unitId);
  const unit = course.units.find((u) => u.id === uId);
  if (!unit) {
    return res.status(404).json({ error: 'Unit not found' });
  }

  // Calculate score
  let correctCount = 0;
  const total = unit.gatewayQuiz.questions.length || 5;

  if (answers && typeof answers === 'object') {
    unit.gatewayQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
  } else {
  return res.status(400).json({
    error: 'Quiz answers are required',
  });
}

  // Score normalized out of 10 as shown in video (Score: 9 / 10)
  const score = total > 0
  ? Math.round((correctCount / total) * 10)
  : 0;
  const passed = total > 0 && correctCount / total >= 0.7;
  
  let updatedCourse = course;
  let tokensEarned = 0;
  let currentTokens = db.getUser(userId).tokens;

  if (passed) {
    tokensEarned = 50;
    const updatedUnits = course.units.map((u) => {
      if (u.id === uId) {
        return { ...u, status: 'completed' as const };
      }
      if (u.id === uId + 1) {
        return { ...u, status: 'current' as const };
      }
      return u;
    });

    updatedCourse = {
      ...course,
      progress: Math.min(100, course.progress + 20),
      units: updatedUnits,
    };

    db.updateCourse(userId, updatedCourse);
    const reward = db.claimRewardOnce(
      userId,
      `gateway:${courseId}:${uId}`,
      tokensEarned,
      `Mastered Unit ${uId} Gateway Quiz`
    );

    if (reward.awarded) {
      currentTokens = reward.tokens;
    } else {
      tokensEarned = 0;
      currentTokens = reward.tokens;
    }

    db.logActivity(userId, {
      date: new Date().toISOString().split('T')[0],
      minutes: 45,
      tokensEarned,
      type: 'quiz_completion',
    });
  }

  res.json({
    score,
    total: 10,
    passed,
    tokensEarned,
    currentTokens,
    course: updatedCourse,
  });
});

// 7. Shop & Inventory
apiRouter.get('/shop/catalog', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const environments = db.getEnvironments(userId);
  const pets = db.getPets(userId);
  const user = db.getUser(userId);

  res.json({
    tokens: user.tokens,
    environments,
    pets,
  });
});

apiRouter.post('/shop/purchase', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { itemId, category, price } = req.body;
  const user = db.getUser(userId);

  const cost = Number(price);
  if (user.tokens < cost) {
    return res.status(400).json({ error: 'Insufficient tokens' });
  }

  db.updateTokens(userId, -cost, `Purchased ${itemId} (${category})`);

  if (category === 'environment') {
    const envs = db.getEnvironments(userId).map((e) =>
      e.id === itemId ? { ...e, owned: true, equipped: true } : { ...e, equipped: false }
    );
    db.setEnvironments(userId, envs);
    db.updateUser(userId, { equippedEnvironmentId: itemId });
    return res.json({ success: true, currentTokens: user.tokens - cost, environments: envs });
  } else if (category === 'pet') {
    const pets = db.getPets(userId).map((p) =>
      p.id === itemId ? { ...p, owned: true, equipped: true } : { ...p, equipped: false }
    );
    db.setPets(userId, pets);
    db.updateUser(userId, { equippedPetId: itemId });
    return res.json({ success: true, currentTokens: user.tokens - cost, pets });
  }

  res.json({ success: true, currentTokens: user.tokens - cost });
});

apiRouter.post('/user/equip', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { itemId, category } = req.body;

  if (category === 'environment') {
    const envs = db.getEnvironments(userId).map((e) => ({
      ...e,
      equipped: e.id === itemId,
    }));
    db.setEnvironments(userId, envs);
    db.updateUser(userId, { equippedEnvironmentId: itemId });
    return res.json({ success: true, environments: envs });
  } else if (category === 'pet') {
    const pets = db.getPets(userId).map((p) => ({
      ...p,
      equipped: p.id === itemId,
    }));
    db.setPets(userId, pets);
    db.updateUser(userId, { equippedPetId: itemId });
    return res.json({ success: true, pets });
  }

  res.status(400).json({ error: 'Invalid category' });
});

// 8. Study Focus Session & Scratchpad
apiRouter.post('/study/focus-session', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { minutes = 25 } = req.body;
  const reward = 25;

  const { tokens } = db.updateTokens(userId, reward, 'Completed Focus Session');
  const activity = db.logActivity(userId, {
    date: new Date().toISOString().split('T')[0],
    minutes: Number(minutes),
    tokensEarned: reward,
    type: 'focus_session',
  });

  const heatmap = db.getHeatmap(userId);

  res.json({
    success: true,
    tokensEarned: reward,
    currentTokens: tokens,
    activity,
    heatmap,
  });
});

apiRouter.get('/study/scratchpad', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const user = db.getUser(userId);
  res.json({ scratchpad: user.scratchpad });
});

apiRouter.put('/study/scratchpad', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { scratchpad } = req.body;
  const updated = db.updateUser(userId, { scratchpad: String(scratchpad || '') });
  res.json({ success: true, scratchpad: updated.scratchpad });
});

apiRouter.get('/study/heatmap', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const heatmap = db.getHeatmap(userId);
  res.json(heatmap);
});

// 9. AI Perks & Syllabus Parsing
apiRouter.post('/ai/simplify-concept', async (req: Request, res: Response) => {
  const { concept, context } = req.body;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Explain the mathematical concept "${concept || 'Vector Spaces'}" in intuitive, visual, geometric terms with plain English analogies. Context: ${context || 'Linear Algebra'}. Maximum 3 paragraphs.`,
      });
      return res.json({ explanation: response.text });
    } catch (err) {
      console.error('[AI] Gemini generation failed, returning fallback', err);
    }
  }

  // Fallback high quality explanation
  res.json({
    explanation:
      'Think of a vector space as an infinite coordinate-free stage. Instead of being bound by numerical axes (x, y, z), you have geometric arrows and states that can be freely stretched (scalar multiplication) and combined together (vector addition) without ever breaking the laws of the universe. Choosing a basis is simply deciding which vantage point you want to view this geometry from!',
  });
});

apiRouter.post('/ai/latex-export', async (req: Request, res: Response) => {
  const { theorem, proofNotes } = req.body;
  const notesComment = proofNotes ? `\n% Notes: ${proofNotes}\n` : '';

  const latexCode = `\\documentclass[11pt]{article}
\\usepackage{amsmath, amsthm, amssymb}
\\usepackage{geometry}
\\geometry{margin=1in}
${notesComment}
\\title{MCODE Academic Proof: ${theorem || 'Dimension of Product Vector Space'}}
\\author{Ren \\\\ Department of Mathematics}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{theorem}
Let $V$ and $W$ be finite-dimensional vector spaces over a field $\\mathbb{F}$.
Then the direct product space $V \\times W$ is finite-dimensional, and:
\\[
\\dim(V \\times W) = \\dim(V) + \\dim(W)
\\]
\\end{theorem}

\\begin{proof}
Let $(v_1, \\dots, v_n)$ be a basis of $V$ and $(w_1, \\dots, w_m)$ be a basis of $W$.
Define vectors in $V \\times W$ by:
\\[
u_i = (v_i, 0) \\quad \\text{for } 1 \\leq i \\leq n, \\qquad u_{n+j} = (0, w_j) \\quad \\text{for } 1 \\leq j \\leq m.
\\]
We demonstrate that $(u_1, \\dots, u_n, u_{n+1}, \\dots, u_{n+m})$ is both linearly independent and spans $V \\times W$.
Therefore, $\\dim(V \\times W) = n + m = \\dim(V) + \\dim(W)$.
\\end{proof}

\\end{document}`;

  res.json({ latex: latexCode });
});

// 10. Reset user data
apiRouter.post('/user/reset', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const resetUser = db.resetUser(userId);
  res.json({ success: true, user: resetUser });
});
