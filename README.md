<div align="center">
  <img src="https://raw.githubusercontent.com/VANSH-SHARMA-web/Portfolio-Generator/main/client/public/logo.svg" alt="PortGen Logo" width="220" />
  <br />
  <p>
    <strong>A highly customizable, developer-focused portfolio generator and instant deployment engine built with React and TailwindCSS.</strong>
  </p>

  <p>
    <a href="https://github.com/VANSH-SHARMA-web/Portfolio-Generator/blob/main/LICENSE"><img src="https://img.shields.io/github/license/VANSH-SHARMA-web/Portfolio-Generator?color=06b6d4&style=flat-square" alt="License" /></a>
    <img src="https://img.shields.io/github/stars/VANSH-SHARMA-web/Portfolio-Generator?color=8b5cf6&style=flat-square" alt="Stars" />
    <img src="https://img.shields.io/github/forks/VANSH-SHARMA-web/Portfolio-Generator?color=d946ef&style=flat-square" alt="Forks" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="TailwindCSS v4" />
    <img src="https://img.shields.io/badge/Vite-v8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  </p>
</div>

---

## 📖 Introduction

**PortGen** is an open-source, framework-independent portfolio builder designed specifically for software engineers, designer developers, and creators. It solves the pain point of creating, designing, and hosting developer portfolios by providing a sleek web-based customizer that compiles and deploys your personalized site to **GitHub Pages in 1-Click** or packages it as a standalone high-performance HTML/ZIP archive—all directly in the browser.

---

## ✨ Key Features

- **🚀 1-Click GitHub Pages Deploy:** Authenticate securely using a GitHub Personal Access Token (PAT) and instantly build a new repository or update an existing one. Witness the deployment live with our interactive, terminal-style console logs.
- **📦 Multi-Format Instant Exports:** 
  - **Standalone HTML:** Download a single, portable, heavily optimized HTML file with styles fully bundled.
  - **Source Code ZIP:** Extract a complete React/Vite/Tailwind project structure to run and modify locally on your machine.
- **🔄 Auto-Import GitHub Repositories:** Speed up portfolio creation by instantly pulling your public GitHub repository list and auto-populating titles, descriptions, and URLs in your projects section.
- **🎨 Premium Modular Templates:** Toggle between responsive, handcrafted developer templates with real-time CSS rendering:
  - **Modern:** Deep-slate dark modes with rich gradient accents.
  - **Glass:** High-end glassmorphism panels, translucent borders, and ambient firefly glow animations.
  - **Minimal:** Ultra-clean spacing, classic type scales, and black-and-white print layouts.
  - **Neo-Brutalist:** High-contrast borders, raw layouts, retro neon colors, and offset shadows.
  - **Terminal:** Retro command-line hacker look with glowing green monospaced typography.
- **🌐 Social SEO Optimization:** Out-of-the-box OpenGraph `<meta>` tags inject tags dynamically, making your shared links render premium cards on LinkedIn, Twitter/X, Discord, and Slack.
- **📝 Automatic GitHub Profile README Generator:** Convert your portfolio details into clean, copy-pasteable Markdown optimized for your `username/username` profile README.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React 19 (Functional Components, Lifted Hooks State)
- **Build Tool:** Vite v8 (Fast HMR & build bundling)
- **Styling:** TailwindCSS v4 + Custom PostCSS configurations
- **Icons:** Lucide React

### Deployment & Exports
- **GitHub API:** Custom client-side integration via `fetch` to create repositories, write files, commit, and enable GitHub Pages configurations.
- **Compression:** `JSZip` for creating and bundling custom project structures on-the-fly.
- **Download Handler:** `FileSaver.js` for clean binary downloads in the client.

### Project Structure
```text
portfolio-generator/
├── client/                     # Frontend Application
│   ├── public/                 # Static assets (logo, favicon)
│   ├── src/
│   │   ├── components/         # Modular Components
│   │   │   ├── PortfolioTemplates/  # Template Files (Modern, Glass, etc.)
│   │   │   ├── CustomizerForm.jsx   # Side-by-side editing settings
│   │   │   ├── DeployModal.jsx      # GitHub connection interface
│   │   │   └── GithubImporter.jsx   # Repo fetch controls
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Launch page
│   │   │   └── Generate.jsx         # App Editor Core
│   │   ├── utils/              # Export & Deploy Engines
│   │   │   ├── githubDeploy.js      # Octokit-free API client
│   │   │   ├── exportPortfolio.js   # HTML/ZIP builder
│   │   │   └── markdownExport.js    # Profile README compiler
│   │   ├── App.jsx             # Main Router & Layout
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
└── server/                     # Future backend routes (Phase 4 placeholder)
```

---

## 🧑‍💻 Running Locally

### Prerequisites
Make sure you have Node.js (version 18 or above) installed on your system.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/VANSH-SHARMA-web/Portfolio-Generator.git
   cd Portfolio-Generator/portfolio-generator
   ```

2. **Navigate to the Client Directory and Install Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📋 Roadmap & Future Work

- [x] **Phase 1:** Core Customizer UI, real-time live preview, and text state synchronization.
- [x] **Phase 2:** Advanced exports (Source ZIP and standalone HTML) + GitHub public repo auto-importer.
- [x] **Phase 3:** Instant Git-based Pages deployment pipeline with real-time log outputs.
- [ ] **Phase 4:** Node.js/Express & MongoDB backend integration to save user dashboards, authenticate via OAuth, and host custom domains directly on Cloudflare/Vercel.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

*Designed and engineered with care by [Vansh Sharma](https://github.com/vansharmaweb).*
