import { Course, PetItem, ShopItem, StudyDay, UserProfile } from '../types';

// Asset paths
export const IMAGES = {
  pathwayMap: '/src/assets/images/scholars_sanctuary_path_1791915353202.jpg',
  vintageLibrary: '/src/assets/images/vintage_library_1791915373462.jpg',
  scholarsDesk: '/src/assets/images/scholars_desk_1791915397551.jpg',
  botanistsSanctuary: '/src/assets/images/botanists_sanctuary_1791915423343.jpg',
  carraraMarble: '/src/assets/images/white_carrara_marble_1791918498342.jpg',
  blueWhiteTile: '/src/assets/images/blue_white_tile_1791918548241.jpg',
  petFrodo: '/src/assets/images/pet_frodo_kitten_1791915456806.jpg',
  petLumis: '/src/assets/images/pet_lumis_candle_1791915491071.jpg',
  petVellum: '/src/assets/images/pet_vellum_dragon_1791915526612.jpg',
  petAstrofel: '/src/assets/images/pet_astrofel_owl_1791915569937.jpg',
  petQuill: '/src/assets/images/pet_quill_owl_1791915614431.jpg',
};

export const DEFAULT_USER: UserProfile = {
  name: 'Ren',
  email: 'ren@gmail.com',
  academicLevel: 'Undergraduate',
  department: 'Mathematics',
  tagline: "MATH & CS '26",
};

export const DEFAULT_ENVIRONMENTS: ShopItem[] = [
  {
    id: 'carrara_atrium',
    name: 'The Carrara & Azulejo Atrium',
    category: 'environment',
    description: 'Polished Italian White Carrara marble paired with vibrant blue and white patterned tiles.',
    price: 0,
    image: IMAGES.carraraMarble,
    equipped: true,
    owned: true,
  },
  {
    id: 'scholars_desk',
    name: "The Scholar's Desk",
    category: 'environment',
    description: 'A warm mahogany desk overlooking the misty campus courtyard.',
    price: 0,
    image: IMAGES.scholarsDesk,
    equipped: false,
    owned: true,
  },
  {
    id: 'vintage_library',
    name: 'The Vintage Library',
    category: 'environment',
    description: 'Tall mahogany bookcases filled with ancient tomes and arched glass windows.',
    price: 150,
    image: IMAGES.vintageLibrary,
    equipped: false,
    owned: true,
  },
  {
    id: 'botanists_sanctuary',
    name: "The Botanist's Sanctuary",
    category: 'environment',
    description: 'Lush greenery and sun-drenched atrium of botanical wonders.',
    price: 200,
    image: IMAGES.botanistsSanctuary,
    equipped: false,
    owned: false,
  },
];

export const DEFAULT_PETS: PetItem[] = [
  {
    id: 'lumis',
    name: 'Lumis',
    title: 'Lumis',
    description: 'A radiant companion that glows when you focus.',
    quote: 'Keep your focus lit, and no theorem stays dark.',
    image: IMAGES.petLumis,
    price: 100,
    owned: true,
    equipped: false,
    buff: '+5% Focus Clarity bonus',
  },
  {
    id: 'frodo',
    name: 'Frodo',
    title: 'Frodo',
    description: 'An energetic cozy buddy who loves complex theorems.',
    quote: 'Mrow! Linear transformations are just vector dances!',
    image: IMAGES.petFrodo,
    price: 150,
    owned: true,
    equipped: true,
    buff: '+10% Token yield on level completions',
  },
  {
    id: 'astrofel',
    name: 'Astrofel',
    title: 'Astrofel',
    description: 'A cosmic owl bearing ancient knowledge.',
    quote: 'The geometry of the universe is inscribed in linear algebra.',
    image: IMAGES.petAstrofel,
    price: 200,
    owned: false,
    equipped: false,
    buff: '+15% Gateway Quiz preparation insight',
  },
  {
    id: 'vellum',
    name: 'Vellum',
    title: 'Vellum',
    description: 'Guardian of the old scrolls. A tiny scholarly dragon.',
    quote: 'I protect every proof from logical fallacies!',
    image: IMAGES.petVellum,
    price: 250,
    owned: false,
    equipped: false,
    buff: '+20% Proof stamina',
  },
  {
    id: 'quill',
    name: 'Quill',
    title: 'Quill',
    description: 'Messenger of the skies. Timeless wisdom delivered.',
    quote: 'Precision in definition is the soul of mathematics.',
    image: IMAGES.petQuill,
    price: 180,
    owned: false,
    equipped: false,
    buff: '+10% Speed reading bonus',
  },
];

export const DEFAULT_PERKS: ShopItem[] = [
  {
    id: 'latex_template',
    name: 'AI LaTeX Template',
    category: 'perk',
    description: 'Export clean paper-ready LaTeX proof for your current homework.',
    price: 50,
    image: '',
    owned: false,
  },
  {
    id: 'dynamic_flashcards',
    name: 'Dynamic Flashcards',
    category: 'perk',
    description: 'AI flashcards generated for current unit and definitions.',
    price: 75,
    image: '',
    owned: false,
  },
  {
    id: 'concept_simplifier',
    name: 'Concept Simplifier',
    category: 'perk',
    description: 'Translates dense abstract proofs into plain intuition and geometric diagrams.',
    price: 60,
    image: '',
    owned: false,
  },
];

export const INITIAL_COURSE: Course = {
  id: 'linear-algebra-110a',
  code: 'MATH 110 A',
  title: 'Linear Algebra',
  instructor: 'Department of Mathematics',
  referenceBook: 'Linear Algebra Done Right by S. Axler',
  progress: 35,
  totalUnits: 5,
  totalLevels: 25,
  units: [
    {
      id: 1,
      roman: 'I',
      title: 'Vector Spaces',
      subtitle: 'Linear Algebra • Unit 1',
      status: 'current',
      topics: [
        '1. Vector Properties',
        '2. Subspaces & Span',
        '3. Linear Independence',
        '4. Bases and Dimension',
        '5. Gateway Quiz',
      ],
      coords: { angle: 270, radius: 155 },
      levels: [
        {
          id: 1,
          name: 'Lvl 1',
          title: 'Vector Spaces',
          description: 'Axioms, fields, vectors, and linear combinations.',
          status: 'unlocked',
          progress: 50,
          coords: { x: 30, y: 64 }, // On the open book dais
          tasks: [
            {
              id: 't1',
              title: "Read: Chapter 1 (Vector Spaces) in 'Linear Algebra Done Right' by S. Axler",
              type: 'read',
              completed: true,
              tokenReward: 10,
            },
            {
              id: 't2',
              title: "Watch: 'Vectors, what even are they?' by 3Blue1Brown on YouTube",
              type: 'watch',
              completed: true,
              tokenReward: 10,
            },
            {
              id: 't3',
              title: "Theory: Write the formal definitions of a vector space over a field F and linear independence",
              type: 'theory',
              completed: false,
              tokenReward: 10,
            },
            {
              id: 't4',
              title: "Practice: Prove that the set of functions {f: R -> R} form a vector space over R",
              type: 'practice',
              completed: false,
              tokenReward: 10,
            },
          ],
          quiz: {
            id: 'q1',
            question: 'The Rank-Nullity Theorem states that:',
            options: [
              'dim(V) = rank(T) + nullity(T)',
              'dim(V) = rank(T) * nullity(T)',
              'dim(V) = rank(T) - nullity(T)',
              'dim(V) = nullity(T) / rank(T)',
            ],
            correctIndex: 0,
            explanation: 'For a linear transformation T: V -> W on a finite-dimensional vector space V, dim(V) = dim(range T) + dim(null T).',
          },
        },
        {
          id: 2,
          name: 'Lvl 2',
          title: 'Subspaces & Span',
          description: 'Direct sums, spans of subsets, and subspace verification criteria.',
          status: 'unlocked',
          progress: 0,
          coords: { x: 44, y: 56 }, // Stone bridge path
          tasks: [
            {
              id: 't2_1',
              title: 'Verify that intersection of two subspaces U and W is always a subspace.',
              type: 'theory',
              completed: false,
              tokenReward: 10,
            },
            {
              id: 't2_2',
              title: 'Work through 5 problems on linear span in Axler §1.C.',
              type: 'practice',
              completed: false,
              tokenReward: 10,
            },
          ],
          quiz: {
            id: 'q2',
            question: 'Which of the following is NOT required for U to be a subspace of V?',
            options: [
              'U contains the additive identity 0',
              'U is closed under vector addition',
              'U is closed under scalar multiplication',
              'U contains all orthonormal eigenvectors',
            ],
            correctIndex: 3,
            explanation: 'Subspaces only require 0 in U, closure under addition, and closure under scalar multiplication.',
          },
        },
        {
          id: 3,
          name: 'Lvl 3',
          title: 'Linear Independence',
          description: 'Linear combinations, testing independence, and coefficients.',
          status: 'locked',
          progress: 0,
          coords: { x: 57, y: 52 }, // Courtyard lantern path
          tasks: [
            {
              id: 't3_1',
              title: 'Read: Linear Independence and Linear Dependence Lemma in §2.A.',
              type: 'read',
              completed: false,
              tokenReward: 10,
            },
            {
              id: 't3_2',
              title: 'Construct a proof for the linear dependence lemma.',
              type: 'theory',
              completed: false,
              tokenReward: 10,
            },
          ],
        },
        {
          id: 4,
          name: 'Lvl 4',
          title: 'Bases and Dimension',
          description: 'Spanning lists, minimal spanning sets, and dimension invariance.',
          status: 'locked',
          progress: 0,
          coords: { x: 67, y: 46 }, // Approaching gothic gate
          tasks: [
            {
              id: 't4_1',
              title: 'Study: Every spanning list can be reduced to a basis.',
              type: 'read',
              completed: false,
              tokenReward: 10,
            },
            {
              id: 't4_2',
              title: 'Solve dimension equations for sum of subspaces: dim(U + W).',
              type: 'practice',
              completed: false,
              tokenReward: 10,
            },
          ],
        },
        {
          id: 5,
          name: 'GATEWAY QUIZ',
          title: 'Vector Spaces Gateway Quiz',
          description: 'Complete the gateway assessment to unlock Unit II: Linear Transformations.',
          status: 'unlocked',
          progress: 0,
          coords: { x: 66, y: 39 }, // The glowing keyhole on the gothic door
          tasks: [],
        },
      ],
      gatewayQuiz: {
        title: 'Gateway Quiz',
        description: 'ATTEMPTS ALLOWED • Minimum 40% required to unlock Unit II',
        passingScore: 4,
        questions: [
          {
            id: 'gw1',
            question: 'If V and W are vector spaces over F, then dim(V x W) is:',
            options: [
              'dim(V) + dim(W)',
              'dim(V) * dim(W)',
              'max(dim V, dim W)',
              'dim(V) - dim(W)',
            ],
            correctIndex: 0,
            explanation: 'The dimension of the direct product V x W equals dim(V) + dim(W).',
          },
          {
            id: 'gw2',
            question: 'Which of the following polynomials are linearly independent in P_2(R)?',
            options: [
              '{1, x, x^2}',
              '{1, 1 + x, 2 + x}',
              '{x, x^2, x + x^2}',
              '{0, x, x^2}',
            ],
            correctIndex: 0,
            explanation: 'The standard monomial basis {1, x, x^2} is linearly independent.',
          },
          {
            id: 'gw3',
            question: 'The zero vector in a vector space V is:',
            options: [
              'Unique',
              'Non-unique',
              'Always undefined',
              'Dependent on field characteristic',
            ],
            correctIndex: 0,
            explanation: 'By the axioms of vector spaces, the additive identity is strictly unique.',
          },
          {
            id: 'gw4',
            question: 'If a list of vectors v1, ..., vn spans V, then:',
            options: [
              'Any linearly independent list in V has length <= n',
              'Any linearly independent list in V has length >= n',
              'dim(V) must equal n + 1',
              'V cannot be finite-dimensional',
            ],
            correctIndex: 0,
            explanation: 'Fundamental theorem: Length of linearly independent list <= length of spanning list.',
          },
          {
            id: 'gw5',
            question: 'The intersection of any collection of subspaces of V is:',
            options: [
              'Always a subspace of V',
              'Never a subspace unless both are trivial',
              'Only a subspace if V is real',
              'A manifold',
            ],
            correctIndex: 0,
            explanation: 'Arbitrary intersections of subspaces are always subspaces.',
          },
        ],
      },
    },
    {
      id: 2,
      roman: 'II',
      title: 'Linear Transformations',
      subtitle: 'Linear Algebra • Unit 2',
      status: 'locked',
      topics: [
        '1. Definition of Maps',
        '2. Fundamental Nullspaces',
        '3. Invertibility & Matrices',
        '4. Matrix of a Linear Map',
        '5. Gateway Quiz',
      ],
      coords: { angle: 342, radius: 155 },
      levels: [
        {
          id: 1,
          name: 'Lvl 1',
          title: 'Linear Maps',
          description: 'Definition and algebraic properties of linear transformations.',
          status: 'unlocked',
          progress: 0,
          coords: { x: 30, y: 64 },
          tasks: [
            {
              id: 'u2_t1',
              title: 'Study linear maps preservation of addition and scalar multiplication.',
              type: 'read',
              completed: false,
              tokenReward: 10,
            },
          ],
        },
      ],
      gatewayQuiz: {
        title: 'Unit II Gateway Quiz',
        description: 'Prove mastery of linear transformations.',
        passingScore: 4,
        questions: [],
      },
    },
    {
      id: 3,
      roman: 'III',
      title: 'Eigenvalues & Eigenvectors',
      subtitle: 'Linear Algebra • Unit 3',
      status: 'locked',
      topics: [
        '1. Invariant Subspaces',
        '2. Characteristic Polynomial',
        '3. Diagonalization',
        '4. Eigenspaces',
        '5. Gateway Quiz',
      ],
      coords: { angle: 54, radius: 155 },
      levels: [],
      gatewayQuiz: {
        title: 'Unit III Gateway Quiz',
        description: 'Eigenvalues assessment.',
        passingScore: 4,
        questions: [],
      },
    },
    {
      id: 4,
      roman: 'IV',
      title: 'Inner Product Spaces',
      subtitle: 'Linear Algebra • Unit 4',
      status: 'locked',
      topics: [
        '1. Inner Products & Norms',
        '2. Orthonormal Bases',
        '3. Gram-Schmidt Procedure',
        '4. Orthogonal Complements',
        '5. Gateway Quiz',
      ],
      coords: { angle: 126, radius: 155 },
      levels: [],
      gatewayQuiz: {
        title: 'Unit IV Gateway Quiz',
        description: 'Inner Product assessment.',
        passingScore: 4,
        questions: [],
      },
    },
    {
      id: 5,
      roman: 'V',
      title: 'Operators on Complex Spaces',
      subtitle: 'Linear Algebra • Unit 5',
      status: 'locked',
      topics: [
        '1. Generalized Eigenspaces',
        '2. Nilpotent Operators',
        '3. Jordan Canonical Form',
        '4. Spectral Theorem',
        '5. Final Mastery Gateway',
      ],
      coords: { angle: 198, radius: 155 },
      levels: [],
      gatewayQuiz: {
        title: 'Unit V Gateway Quiz',
        description: 'Final complex operator mastery.',
        passingScore: 4,
        questions: [],
      },
    },
  ],
};

export const SCHOLAR_QUOTES = [
  {
    quote: 'Mathematics is the art of giving the same name to different things.',
    author: 'HENRI POINCARÉ',
  },
  {
    quote: 'In mathematics, the art of proposing a question must be held of higher value than solving it.',
    author: 'GEORG CANTOR',
  },
  {
    quote: 'Pure mathematics is, in its way, the poetry of logical ideas.',
    author: 'ALBERT EINSTEIN',
  },
  {
    quote: 'My methods are really methods of working and thinking; this is why they have crept into every part of mathematics.',
    author: 'EMMY NOETHER',
  },
];

// Sample heatmap data representing study consistency
export const generateStudyHeatmap = (): StudyDay[] => {
  const days: StudyDay[] = [];
  const today = new Date();
  
  // 5 weeks of 7 days = 35 days
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Pattern similar to video (some green active days, some lighter)
    const seed = (i * 17 + 5) % 10;
    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    let minutes = 0;

    if (seed > 6) {
      intensity = 3;
      minutes = 60 + seed * 10;
    } else if (seed > 4) {
      intensity = 2;
      minutes = 45;
    } else if (seed > 2) {
      intensity = 1;
      minutes = 25;
    } else {
      intensity = 0;
      minutes = 0;
    }

    // Keep recent streak active
    if (i < 5) {
      intensity = 3;
      minutes = 75;
    }

    days.push({
      date: dateStr,
      minutes,
      intensity,
    });
  }

  return days;
};
