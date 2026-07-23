# CodeLeaper 🚀
An interactive, AI-assisted application designed to be your personalized coding mentor. CodeLeaper helps developers master algorithms through dynamic dry runs, modular solutions, and automated error analysis for LeetCode challenges.

Try it *https://code-leaper-e56c.vercel.app/*

### 🚀 Overview
CodeLeaper transforms the way you learn and debug code by breaking down complex LeetCode algorithms into digestible, visual steps. Built with a highly responsive React frontend and optimized by Vite, it orchestrates a multi-page learning pipeline that guides users from understanding the core problem to mastering expert-level solutions.

### ✨ Key Features
*   **Problem Description Enhancer:** Unlock a crystal-clear, instantly digestible summary of any LeetCode problem. Share your question number or text, and our smart engine crafts a sharply focused overview so you can start solving with confidence—no sifting through long paragraphs required.
*   **Smart Hints & Strategy Assistant:** Feeling stuck? Ignite your problem-solving journey with expert-level hints customized for your LeetCode challenge. The intelligent hint generator provides carefully designed nudges, insights, and miniature strategies to unlock creative solutions without spoiling the discovery.
*   **Advanced Code Analyzer:** Worried your code might be off track? Paste your solution and let the analyzer spot hidden errors, logical missteps, missed edge cases, and inefficiencies. Receive smart, actionable feedback to save time debugging and boost your code quality for interviews.
*   **Interactive Dry Run Visualizer:** See your code in action like never before. Simulate your program step-by-step, vividly displaying how variables evolve and decisions unfold. Instantly spot bugs, understand complex flows, and build true confidence in your logic.
*   **Expert Solution Explorer:** Want to see how the pros think? Receive comprehensive, well-explained solutions that serve as masterclasses in problem-solving. Each solution is thoughtfully commented to break down the reasoning and technique, helping you learn and grow as a coder.

### 🏗️ Architecture & Data Flow
*   **User Navigation:** The user initiates a session from the primary home interface, inputting their target LeetCode problem.
*   **Problem Breakdown:** The application routes the user through a structured flow: viewing the simplified problem (`description.jsx`), analyzing the base code (`code.jsx`), and requesting contextual clues (`hints.jsx`).
*   **AI & Logic Processing:** When a user is stuck or evaluating edge cases, the custom AI module (`ai.js`) powers the Advanced Code Analyzer (`gowrong.jsx`) to generate insights and highlight potential pitfalls in the logic.
*   **Visual Execution:** Users simulate code execution via the interactive Dry Run interface (`dryrun.jsx`), which utilizes reusable, animated slide components (`slides.jsx`) for step-by-step clarity.
*   **Expert Review:** Users can explore the optimal approach and commented breakdown in the solution view (`solution.jsx`).

### 🛠️ Tech Stack
*   **Frontend:** React.js, Vite
*   **Styling:** Modular CSS architecture mapped directly to specific page components (e.g., `home.css`, `dryrun.css`, `solution.css`)
*   **AI Integration:** Making use of Gemini API
*   **Core UI Components:** Custom-built loading states, navigation bars, and interactive presentation slides

### 🌐 Deployment Infrastructure
This application is designed for high-performance static hosting:
*   **Frontend Distribution:** Built to be deployed as a highly optimized Static Site using Vite's fast build pipeline.
*   **Routing Optimization:** Configured for strict environment routing alongside standard client-side URL rewriting to ensure seamless Single Page Application (SPA) navigation on page refreshes.
