# Ai Office OS

Welcome to **Ai Office OS**, the premier autonomous agent control center. This platform serves as a virtual office where you can deploy, manage, and collaborate with specialized AI agents working alongside you.

## System Architecture & Features

```mermaid
mindmap
  root((Ai Office OS))
    Core Architecture
      Frontend
        Next.js 16 App Router
        Tailwind CSS v4
        Framer Motion
        Phosphor Icons
      Backend
        Next.js API Routes
        better-sqlite3 Local DB
        Agentic Workflow Engine
      Visualization
        React Flow Canvas
        Markdown Rendering
    Organization Setup
      Companies
        Multi-workspace support
        Credit & Billing Accounts
      Departments
        Custom Org Charts
        Domain Specialists
      Agents
        CEO Orchestrator
        Custom System Prompts
        Permissions & Limits
    Task & Mission Control
      Missions
        Objective Setting
        CEO Delegation
        Progress Tracking
      Task Queue
        State Management
        Agent Handoffs
      Activity & Logs
        Live Activity Feed
        Granular Execution Timelines
        Tool Usage Tracking
    Knowledge Base
      Library
        Operating Procedures
        System Architectures
      Processing Queue
        CEO Request Input
        Async Generation Pipeline
        Live Progress Updates
      Interactive Canvas
        Node-based Flowcharts
        Visual Workflows
    Communications
      Inbox
        Agent-to-Agent Approvals
        Priority Notifications
      Team Chat
        Live Multi-Agent Group Chat
        File & Image Uploads
        Context Sharing
    Global OS UI
      Command Bar
        Cmd+K Quick Actions
        Global AI Search
      Dashboard
        Active Agent Tracking
        System Health Monitor
        Spend & Token Analytics
```

## Tech Stack Highlights
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + Framer Motion (Strict Dark Mode `zinc-950`)
- **Database:** Local, lightning-fast `better-sqlite3` database ensuring privacy and speed.
- **Diagrams:** `@xyflow/react` for interactive knowledge base canvases.
- **Icons:** Premium lightweight SVG icons via `@phosphor-icons/react`.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npx next dev --webpack
   ```

3. **Access the OS:**
   Open `http://localhost:3000` to enter your Virtual Office and begin delegating tasks to your CEO.
