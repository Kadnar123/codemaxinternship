/**
 * ============================================================================
 * BLOGCRAFT - DATA LAYER (LocalStorage Mock Database)
 * ============================================================================
 * Handles persistent client-side storage for:
 * - Articles / Blog Posts
 * - User Profiles & Authentication
 * - Theme Preferences
 */

const STORAGE_KEYS = {
  POSTS: 'blogcraft_posts',
  USERS: 'blogcraft_users',
  SESSION: 'blogcraft_session',
  THEME: 'blogcraft_theme'
};

// Default seed blog posts to provide instant rich content on first launch
const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Getting Started with Modern Frontend Development in 2026',
    slug: 'getting-started-frontend-2026',
    excerpt: 'Explore the fundamental building blocks of modern web engineering: HTML5 semantics, responsive CSS architectures, and vanilla JavaScript mastery.',
    content: `Frontend development continues to evolve at a blistering pace. Yet, the immutable foundation of the open web remains grounded in three core pillars: HTML, CSS, and JavaScript.

### 1. HTML5: Semantic Structure
Semantic markup is about meaning, accessibility, and search engine discoverability. Elements such as <header>, <nav>, <main>, <article>, and <footer> convey structure to screen readers and search bots alike.

### 2. Modern CSS: Flexible and Responsive
Gone are the days of brittle floats and bloated frameworks. Modern CSS brings native Flexbox, CSS Grid, Custom Properties (variables), and container queries straight into the browser.

### 3. JavaScript: The Engine of Interactivity
Modern JavaScript (ES6+) enables powerful asynchronous workflows, modular logic, and direct DOM manipulation without needing heavyweight dependencies for simple interfaces.

Start with the basics, build projects consistently, and focus on web accessibility!`,
    category: 'Technology',
    author: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'AJ'
    },
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    tags: ['Frontend', 'HTML', 'CSS', 'JavaScript'],
    views: 1240,
    likes: 87,
    status: 'published',
    createdAt: '2026-10-20T10:30:00.000Z'
  },
  {
    id: 'post-2',
    title: 'Mastering CSS Grid and Flexbox for Responsive Layouts',
    slug: 'mastering-css-grid-and-flexbox',
    excerpt: 'Learn when to use Flexbox versus CSS Grid, how to create fluid layouts, and how to conquer responsive design across all screen sizes.',
    content: `When building web interfaces, choosing between Flexbox and CSS Grid is one of the most common design dilemmas.

### Flexbox: One-Dimensional Layouts
Flexbox is designed for laying out items in a single dimension—either as a row or as a column. It excels at:
- Header and navigation toolbars
- Vertical centering of elements
- Distributing space evenly among items of dynamic width

### CSS Grid: Two-Dimensional Layouts
Grid is built for two-dimensional layouts—rows and columns at the same time. It is unmatched for:
- Magazine-style article feeds
- Dashboards with distinct widget zones
- Asymmetric card grids

Combine both! Use CSS Grid for the macro page skeleton and Flexbox for micro-components within cards.`,
    category: 'Design',
    author: {
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      avatar: 'SC'
    },
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['CSS', 'Web Design', 'Responsive'],
    views: 950,
    likes: 64,
    status: 'published',
    createdAt: '2026-10-22T14:15:00.000Z'
  },
  {
    id: 'post-3',
    title: 'Demystifying JavaScript Asynchronous Programming and APIs',
    slug: 'demystifying-javascript-async-apis',
    excerpt: 'Understand promises, async/await, and Fetch API to communicate seamlessly with REST services and backend endpoints.',
    content: `The modern web is asynchronous. User actions, network requests, animations, and timer tasks all operate in an event-driven loop.

### Promises & Async/Await
A Promise represents a value that may be available now, in the future, or never. With the async/await syntax, handling asynchronous requests feels as clear and linear as synchronous code:

\`\`\`javascript
async function loadUserData() {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to load user', err);
  }
}
\`\`\`

Always handle network errors gracefully with clear user feedback!`,
    category: 'Development',
    author: {
      name: 'Marcus Brody',
      email: 'marcus@example.com',
      avatar: 'MB'
    },
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['JavaScript', 'API', 'Async'],
    views: 610,
    likes: 42,
    status: 'published',
    createdAt: '2026-10-24T09:00:00.000Z'
  }
];

// Seed default users
const INITIAL_USERS = [
  {
    id: 'user-demo',
    name: 'Demo Developer',
    email: 'demo@blogcraft.com',
    password: 'password123',
    bio: 'Internship frontend developer building modern web apps.'
  }
];

// Storage Initialization
class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
  }

  // --- Post Operations ---
  getPosts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    } catch {
      return [];
    }
  }

  getPostById(id) {
    const posts = this.getPosts();
    return posts.find((p) => p.id === id);
  }

  isPostOwnedByUser(id, user) {
    if (!user) return false;

    const post = this.getPostById(id);
    if (!post || !post.author) return false;

    return (
      (user.id && post.author.id === user.id) ||
      (user.email && post.author.email?.toLowerCase() === user.email.toLowerCase())
    );
  }

  savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }

  createPost(postData) {
    const posts = this.getPosts();
    const newPost = {
      id: 'post-' + Date.now(),
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      ...postData
    };
    posts.unshift(newPost);
    this.savePosts(posts);
    return newPost;
  }

  updatePost(id, updatedFields) {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    posts[index] = { ...posts[index], ...updatedFields, updatedAt: new Date().toISOString() };
    this.savePosts(posts);
    return posts[index];
  }

  deletePost(id) {
    const posts = this.getPosts();
    const remainingPosts = posts.filter((p) => p.id !== id);
    if (remainingPosts.length === posts.length) return false;

    this.savePosts(remainingPosts);
    return true;
  }

  incrementLikes(id) {
    const post = this.getPostById(id);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.updatePost(id, { likes: post.likes });
      return post.likes;
    }
    return 0;
  }

  // --- Auth & Session Operations ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    } catch {
      return [];
    }
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION)) || null;
    } catch {
      return null;
    }
  }

  registerUser(name, email, password) {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email: email.toLowerCase(),
      password, // Mock storage
      bio: 'Enthusiastic writer and reader.'
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Auto login
    this.setSession(newUser);
    return { success: true, user: newUser };
  }

  loginUser(email, password) {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    this.setSession(user);
    return { success: true, user };
  }

  setSession(user) {
    const safeUser = { id: user.id, name: user.name, email: user.email, bio: user.bio };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeUser));
  }

  logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  // --- Theme ---
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  }

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// Global DB instance
window.blogStorage = new StorageManager();
