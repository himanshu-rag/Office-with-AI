# Ai Office OS

Welcome to **Ai Office OS**, the premier autonomous agent control center. This platform serves as a virtual office where you can deploy, manage, and collaborate with specialized AI agents working alongside you.

## Features
- **CEO Agent Delegation:** Request workflows and operating procedures directly from your AI CEO.
- **Autonomous Activity:** Agents autonomously pick up tasks, execute them in real-time, and log their actions to the activity feed.
- **Interactive Org Charts & Knowledge Base:** Visualize your agent departments and seamlessly manage workflows via React Flow diagrams.
- **SQLite Local Database:** Fast, local, and secure state management using `better-sqlite3`.

---

## Git Command Mastery Guide

*As requested, here is the complete Data & AI Engineer Git Command Mastery workflow.*

```mermaid
mindmap
  root((Git))
    Repository Setup
      ::icon(fa fa-folder)
      git init
      git clone
      git config
      git remote -v
      git remote add
      git status
      git help
    Stage & Commit
      ::icon(fa fa-check)
      git add .
      git add file
      git commit -m
      git commit -am
      git diff
      git diff --staged
      git restore --staged
    Branch Management
      ::icon(fa fa-code-branch)
      git branch
      git branch name
      git switch branch
      git switch -c branch
      git checkout branch
      git branch -d
      git branch -D
    Merge & Rebase
      ::icon(fa fa-code-merge)
      git merge branch
      git merge --abort
      git rebase branch
      git rebase -i
      git rebase --continue
      git rebase --abort
      git mergetool
    Remote Operations
      ::icon(fa fa-cloud)
      git fetch
      git remote prune origin
      git push --force-with-lease
      git push -u origin
      git push
      git pull --rebase
      git pull
    History & Inspection
      ::icon(fa fa-history)
      git log
      git log --oneline
      git log --graph
      git show
      git diff HEAD
      git blame
      git shortlog
    Undo & Recovery
      ::icon(fa fa-undo)
      git restore file
      git revert commit
      git reset --soft
      git reset --mixed
      git reset --hard
      git reflog
      git checkout commit -- file
    Stash & Temporary
      ::icon(fa fa-box)
      git stash
      git stash push
      git stash list
      git stash show
      git stash pop
      git stash apply
      git stash drop
    Commit Management
      ::icon(fa fa-tasks)
      git commit --amend
      git cherry-pick
      git rebase -i HEAD~N
      git tag
      git tag -a
      git describe
    Advanced Git
      ::icon(fa fa-cogs)
      git bisect
      git worktree
      git submodule
      git clean -fd
      git grep
      git archive
      git fsck
    Collaboration
      ::icon(fa fa-users)
      git fetch --all
      git branch -a
      git branch --merged
      git branch --no-merged
      git push origin --delete
      git remote prune origin
      git gc
```

## Tech Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion
- React Flow (`@xyflow/react`)
- Better SQLite3
