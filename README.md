# 🚀 BlogCraft - Modern Responsive Frontend Application

A complete frontend blog application built with vanilla **HTML5**, **CSS3**, and modern **JavaScript (ES6+)**. This project covers fundamental frontend concepts: semantic markup, responsive design layouts (Flexbox & CSS Grid), client-side state management (`localStorage`), dynamic DOM manipulation, form validation, and accessible UI engineering.

---

## 🎯 Key Objectives Covered

### Objective 1: Set Up Your Local Development Environment
1. **Editor**: Visual Studio Code (recommended) or any modern code editor.
2. **Extensions**:
   - **Live Server** (by Ritwick Dey): Launch a local development server with live reload on file changes.
   - **Prettier**: Code formatting for HTML, CSS, and JS.
3. **Browser DevTools**:
   - Inspect elements, debug responsive CSS viewports with the Device Toolbar (`Ctrl + Shift + M`), and monitor console logs / `localStorage` under the **Application** tab.
4. **Project Directory Structure**:
   ```text
   internship/
   ├── index.html          # Home Feed Page
   ├── login.html          # Authentication / Login Page
   ├── register.html       # User Registration Page
   ├── dashboard.html      # Author Metrics & Post Management
   ├── create-blog.html    # Blog Creation & Editor Page
   ├── post.html           # Full Article Reader View
   ├── css/
   │   └── style.css       # Design System & Responsive Styles
   ├── js/
   │   ├── storage.js      # Mock Database & Session Manager (localStorage)
   │   ├── app.js          # Shared Logic (Navigation, Theme Toggle, Toasts)
   │   ├── home.js         # Feed Rendering, Category Filter & Live Search
   │   ├── auth.js         # Form Validation & Authentication Logic
   │   ├── dashboard.js    # Metric Calculations & Post CRUD Table
   │   ├── create-blog.js  # Editor Form, Image Preview & Word Counter
   │   └── post.js         # Single Article Reader & Like Handler
   └── README.md           # Documentation & Educational Guide
   ```

---

### Objective 2: Learn Basics of HTML, CSS, and JavaScript

#### 1. HTML5 (Structure & Semantics)
- **Document Skeleton**: `<!DOCTYPE html>`, `<html lang="en">`, `<head>` (meta viewport, title, stylesheets), and `<body>`.
- **Semantic Tags**: Replaced generic `<div>` with meaningful structural elements:
  - `<header>` and `<nav>` for main navigation.
  - `<main>` for primary page content.
  - `<section>` and `<article>` for self-contained article cards and detail views.
  - `<footer>` for copyright and reference links.
- **Form Controls & Accessibility**: `<label for="...">`, accessible `aria-expanded` attributes, explicit input types (`email`, `password`, `search`, `url`), and semantic buttons.

#### 2. CSS3 (Styling & Responsive Layouts)
- **CSS Custom Properties (Variables)**: Defined in `:root` for effortless color theming, spacing, and dark mode toggling:
  ```css
  :root {
    --primary: #4f46e5;
    --bg-body: #f8fafc;
    --bg-surface: #ffffff;
    --text-main: #0f172a;
  }
  ```
- **Flexbox**: Used for 1D layouts such as the sticky navigation bar, search toolbar, card footers, and modal actions.
- **CSS Grid**: Used for 2D layouts such as the dynamic article card grid (`grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`) and the two-column blog editor layout.
- **Mobile-First & Media Queries**: Handled responsive breakpoints (`@media (max-width: 768px)`) with collapsible hamburger navigation, adaptive font sizing, and single-column mobile wrapping.

#### 3. JavaScript ES6+ (Behavior & Interactivity)
- **DOM Traversal & Manipulation**: `document.getElementById()`, `querySelector()`, and dynamic innerHTML generation with secure HTML entity escaping (`escapeHtml`).
- **Event-Driven Architecture**: Click listeners, form `submit` handlers, dynamic inputs (debounced live search), and input preview changes.
- **Client-Side State (`localStorage`)**: Persisting articles, active user sessions, likes count, and theme preferences across page reloads without requiring an external backend server.

---

### Objective 3: Design a Responsive Blog Application Interface
- **Mobile Friendly**: Seamlessly scales from 320px mobile screens to large desktop monitors.
- **Theme Switching**: Built-in Light and Dark modes with persistent storage.
- **Interactive Feedback**: Custom toast notifications for actions (publishing, liking, logging in, errors).
- **Accessible & Visual Aesthetics**: Clean typography, card hover elevations, category badges, and smooth transitions.
- **Blog CRUD**: Signed-in authors can create and publish or save drafts, read published articles, edit their own articles, and delete them from the dashboard. Article data is stored in the browser's `localStorage`; the dashboard does not expose other authors' articles for editing or deletion.

---

### Objective 4: Pages Created

| Page | File | Description & Features |
| :--- | :--- | :--- |
| **Home** | `index.html` | Hero banner, instant search bar, category chips filter, dynamic card grid with like counter, and newsletter section. |
| **Login** | `login.html` | Sign-in form with client-side validation, password show/hide toggle, and a **One-Click Demo Autofill** button. |
| **Register** | `register.html` | Account creation with input validation (name, email, password strength, confirmation check, terms). |
| **Dashboard** | `dashboard.html` | Author performance analytics (Total Articles, Views, Likes, Drafts) and an interactive table with Edit / Delete actions. |
| **Create Blog** | `create-blog.html` | Rich post composer with title, category, live image preview, tags, live word counter & reading time estimate, and Publish / Draft options. |
| **Post Reader** | `post.html` | Full article reading interface with author avatar, publication date, view counter, and interactive like button. |

---

## ⚡ How to Run and Test Locally

1. **Option A: Direct Browser Opening**
   - Double-click `index.html` in your file explorer, or right-click `index.html` and choose **Open with Google Chrome / Edge / Firefox**.

2. **Option B: Using VS Code Live Server (Recommended)**
   - Open the `internship/` directory in VS Code.
   - Right-click `index.html` and select **"Open with Live Server"**.
   - Your browser will open at `http://127.0.0.1:5500/index.html`.

3. **Option C: Using any HTTP Server via Terminal**
   ```powershell
   # Python built-in server
   python -m http.server 3000
   ```
   Open `http://localhost:3000` in your browser.

---

## 🔑 Demo Account Credentials
- **Email**: `demo@blogcraft.com`
- **Password**: `password123`
*(Or simply click the **"⚡ Autofill Demo Credentials"** button on the Login page!)*
