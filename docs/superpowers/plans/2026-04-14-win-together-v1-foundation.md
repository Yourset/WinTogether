# Win Together v1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 Win Together v1 的第一阶段可运行基础版，包含 Electron 桌面壳、Team Room 页面骨架、本地运行时核心、Codex CLI 适配器骨架、文档化记忆系统骨架，以及一条能从“输入目标”跑到“产生日志与记忆”的最小闭环。

**Architecture:** 采用 `Electron + React + TypeScript` 作为桌面端壳与前端界面，采用本地 `Runtime Core` 负责任务编排、事件流、记忆读写与工作区管理。内部保留混合架构抽象，但第一版执行统一走 `Codex CLI` 适配器。

**Tech Stack:** Electron, React, TypeScript, Vite, Node.js, Zustand, React Router, Vitest, Testing Library

---

## 文件结构

本计划默认从空仓库开始，先建立下面这套结构。

- `package.json`
  - 统一脚本入口，包含开发、构建、测试、lint
- `tsconfig.json`
  - 根 TypeScript 配置
- `vite.config.ts`
  - 渲染层构建配置
- `electron.vite.config.ts`
  - Electron 主进程与 preload 构建配置
- `src/main/main.ts`
  - Electron 主进程入口
- `src/main/ipc/registerAppIpc.ts`
  - 注册 IPC 通道
- `src/main/ipc/channels/runtimeChannels.ts`
  - Runtime 相关 IPC
- `src/main/ipc/channels/workspaceChannels.ts`
  - 工作区相关 IPC
- `src/main/services/runtime/AppRuntimeService.ts`
  - 主进程内运行时服务封装
- `src/main/services/runtime/createAppRuntime.ts`
  - 创建 Runtime Core
- `src/main/services/workspace/WorkspacePickerService.ts`
  - 选择本地工作区
- `src/preload/index.ts`
  - 向渲染层暴露安全 API
- `src/renderer/main.tsx`
  - React 入口
- `src/renderer/App.tsx`
  - 路由与整体布局
- `src/renderer/routes/HomePage.tsx`
  - 首页 / Team Launcher
- `src/renderer/routes/TeamRoomPage.tsx`
  - Team Room 页面
- `src/renderer/routes/MissionHistoryPage.tsx`
  - Mission History 页面
- `src/renderer/routes/MemoryViewerPage.tsx`
  - Memory Viewer 页面
- `src/renderer/components/layout/AppShell.tsx`
  - 应用布局骨架
- `src/renderer/components/team-room/MessageTimeline.tsx`
  - 消息流组件
- `src/renderer/components/team-room/RosterPanel.tsx`
  - 左侧团队面板
- `src/renderer/components/team-room/ContextPanel.tsx`
  - 右侧上下文面板
- `src/renderer/components/team-room/MissionComposer.tsx`
  - 底部输入框
- `src/renderer/store/appStore.ts`
  - 前端全局状态
- `src/shared/contracts/events.ts`
  - 运行时事件类型
- `src/shared/contracts/mission.ts`
  - Mission 数据结构
- `src/shared/contracts/agent.ts`
  - Agent 数据结构
- `src/shared/contracts/memory.ts`
  - Memory 数据结构
- `src/runtime/core/AppRuntime.ts`
  - Runtime 主入口接口
- `src/runtime/core/AppRuntimeImpl.ts`
  - Runtime 主实现
- `src/runtime/core/MissionOrchestrator.ts`
  - Mission 编排器
- `src/runtime/core/EventBus.ts`
  - 本地事件总线
- `src/runtime/core/WorkspaceManager.ts`
  - Workspace 管理
- `src/runtime/core/TranscriptStore.ts`
  - 会话与事件持久化
- `src/runtime/core/MemoryManager.ts`
  - 文档化记忆读写
- `src/runtime/adapters/AgentRuntimeAdapter.ts`
  - Agent Runtime 统一接口
- `src/runtime/adapters/CodexCliAdapter.ts`
  - Codex CLI 适配器
- `src/runtime/adapters/CodexCliProcess.ts`
  - 启动并管理 Codex CLI 进程
- `src/runtime/templates/agentTemplates.ts`
  - Captain / Specialist 模板
- `src/runtime/utils/id.ts`
  - 生成 mission / message / agent id
- `src/runtime/utils/time.ts`
  - 时间格式
- `WIN_MEMORY/README.md`
  - 记忆系统说明
- `WIN_MEMORY/INDEX.md`
  - 记忆入口索引
- `WIN_MEMORY/memory-policy.md`
  - 记忆写入与读取规则
- `WIN_MEMORY/user/user-preferences.md`
  - 用户偏好
- `WIN_MEMORY/teams/INDEX.md`
  - 团队记忆索引
- `WIN_MEMORY/teams/default-team.md`
  - 默认团队说明
- `WIN_MEMORY/teams/roles/*.md`
  - Captain / Researcher / Builder / Reviewer / Tester
- `WIN_MEMORY/missions/INDEX.md`
  - Mission 索引
- `WIN_MEMORY/workspaces/INDEX.md`
  - Workspace 索引
- `WIN_MEMORY/knowledge/INDEX.md`
  - 可复用知识索引
- `WIN_MEMORY/work-log/current.md`
  - 当前工作日志
- `tests/runtime/EventBus.test.ts`
  - 事件总线测试
- `tests/runtime/MemoryManager.test.ts`
  - 记忆管理测试
- `tests/runtime/MissionOrchestrator.test.ts`
  - 编排器测试
- `tests/runtime/CodexCliAdapter.test.ts`
  - Codex 适配器测试
- `tests/renderer/TeamRoomPage.test.tsx`
  - Team Room 页面测试

## 任务 1：初始化项目骨架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `electron.vite.config.ts`
- Create: `src/main/main.ts`
- Create: `src/preload/index.ts`
- Create: `src/renderer/main.tsx`
- Create: `src/renderer/App.tsx`

- [ ] **Step 1: 写项目基础配置**

```json
{
  "name": "win-together",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "preview": "electron-vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "electron": "^37.0.0",
    "electron-vite": "^3.0.0",
    "jsdom": "^26.0.0",
    "typescript": "^5.8.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: 安装依赖并确认项目可启动**

Run: `npm install`  
Expected: 安装完成，无 `ERR!` 级别错误

- [ ] **Step 3: 写 Electron 与 React 最小入口**

```ts
// src/main/main.ts
import { app, BrowserWindow } from "electron";
import path from "node:path";

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js")
    }
  });

  if (process.env["ELECTRON_RENDERER_URL"]) {
    void window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    window.webContents.openDevTools({ mode: "detach" });
    return;
  }

  void window.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(createWindow);
```

```ts
// src/renderer/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 4: 运行开发环境**

Run: `npm run dev`  
Expected: 打开 Electron 窗口，渲染一个最小 React 页面

- [ ] **Step 5: 提交初始化**

```bash
git add package.json tsconfig.json vite.config.ts electron.vite.config.ts src/main/main.ts src/preload/index.ts src/renderer/main.tsx src/renderer/App.tsx
git commit -m "chore(app): bootstrap electron react foundation"
```

## 任务 2：建立共享数据契约

**Files:**
- Create: `src/shared/contracts/events.ts`
- Create: `src/shared/contracts/mission.ts`
- Create: `src/shared/contracts/agent.ts`
- Create: `src/shared/contracts/memory.ts`
- Test: `tests/runtime/EventBus.test.ts`

- [ ] **Step 1: 先写事件总线测试**

```ts
import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";

describe("EventBus", () => {
  it("should deliver published events to subscribers", () => {
    const bus = new EventBus();
    const received: string[] = [];

    bus.subscribe("agent.message", (event) => {
      received.push(event.type);
    });

    bus.publish({
      id: "evt-1",
      type: "agent.message",
      timestamp: "2026-04-14T00:00:00.000Z",
      payload: { text: "hello" }
    });

    expect(received).toEqual(["agent.message"]);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/runtime/EventBus.test.ts`  
Expected: FAIL，提示 `EventBus` 或相关文件不存在

- [ ] **Step 3: 写共享契约与事件类型**

```ts
// src/shared/contracts/events.ts
export type AppEventType =
  | "mission.created"
  | "agent.spawned"
  | "agent.message"
  | "execution.started"
  | "execution.finished"
  | "memory.written"
  | "system.alert";

export interface AppEvent<TPayload = unknown> {
  id: string;
  type: AppEventType;
  timestamp: string;
  payload: TPayload;
}
```

```ts
// src/shared/contracts/agent.ts
export type AgentRole = "captain" | "researcher" | "builder" | "reviewer" | "tester";

export interface AgentRecord {
  id: string;
  role: AgentRole;
  name: string;
  status: "idle" | "planning" | "running" | "blocked" | "done";
}
```

```ts
// src/shared/contracts/mission.ts
export interface MissionRecord {
  id: string;
  title: string;
  workspacePath: string;
  goal: string;
  status: "draft" | "running" | "paused" | "done";
  createdAt: string;
}
```

```ts
// src/shared/contracts/memory.ts
export type MemoryScope = "user" | "team" | "mission" | "workspace" | "knowledge" | "work-log";

export interface MemoryWriteRecord {
  id: string;
  scope: MemoryScope;
  targetPath: string;
  summary: string;
  sourceEventId?: string;
}
```

- [ ] **Step 4: 实现最小事件总线**

```ts
// src/runtime/core/EventBus.ts
import type { AppEvent, AppEventType } from "../../shared/contracts/events";

type EventHandler = (event: AppEvent) => void;

export class EventBus {
  private handlers = new Map<AppEventType, Set<EventHandler>>();

  subscribe(type: AppEventType, handler: EventHandler) {
    const set = this.handlers.get(type) ?? new Set<EventHandler>();
    set.add(handler);
    this.handlers.set(type, set);

    return () => {
      set.delete(handler);
    };
  }

  publish(event: AppEvent) {
    this.handlers.get(event.type)?.forEach((handler) => handler(event));
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run tests/runtime/EventBus.test.ts`  
Expected: PASS

- [ ] **Step 6: 提交共享契约**

```bash
git add src/shared/contracts/events.ts src/shared/contracts/mission.ts src/shared/contracts/agent.ts src/shared/contracts/memory.ts src/runtime/core/EventBus.ts tests/runtime/EventBus.test.ts
git commit -m "feat(runtime): add shared contracts and event bus"
```

## 任务 3：建立文档化记忆系统骨架

**Files:**
- Create: `WIN_MEMORY/README.md`
- Create: `WIN_MEMORY/INDEX.md`
- Create: `WIN_MEMORY/memory-policy.md`
- Create: `WIN_MEMORY/user/user-preferences.md`
- Create: `WIN_MEMORY/teams/INDEX.md`
- Create: `WIN_MEMORY/teams/default-team.md`
- Create: `WIN_MEMORY/teams/roles/captain.md`
- Create: `WIN_MEMORY/teams/roles/researcher.md`
- Create: `WIN_MEMORY/teams/roles/builder.md`
- Create: `WIN_MEMORY/teams/roles/reviewer.md`
- Create: `WIN_MEMORY/teams/roles/tester.md`
- Create: `WIN_MEMORY/missions/INDEX.md`
- Create: `WIN_MEMORY/workspaces/INDEX.md`
- Create: `WIN_MEMORY/knowledge/INDEX.md`
- Create: `WIN_MEMORY/work-log/current.md`
- Create: `src/runtime/core/MemoryManager.ts`
- Test: `tests/runtime/MemoryManager.test.ts`

- [ ] **Step 1: 先写 MemoryManager 测试**

```ts
import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { MemoryManager } from "../../src/runtime/core/MemoryManager";

describe("MemoryManager", () => {
  it("should create base memory structure and append work log", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "win-together-memory-"));
    const manager = new MemoryManager(root);

    await manager.ensureBaseStructure();
    await manager.appendWorkLog("- created mission 1");

    expect(fs.existsSync(path.join(root, "WIN_MEMORY", "INDEX.md"))).toBe(true);
    expect(
      fs.readFileSync(path.join(root, "WIN_MEMORY", "work-log", "current.md"), "utf-8")
    ).toContain("created mission 1");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/runtime/MemoryManager.test.ts`  
Expected: FAIL，提示 `MemoryManager` 不存在

- [ ] **Step 3: 写记忆目录与基础文档**

```md
<!-- WIN_MEMORY/README.md -->
# Win Together Memory

这是 Win Together 的文档化记忆中心。

读取顺序：
1. `WIN_MEMORY/INDEX.md`
2. `WIN_MEMORY/memory-policy.md`
3. 相关 scope 文档
4. `WIN_MEMORY/work-log/current.md`
```

```md
<!-- WIN_MEMORY/memory-policy.md -->
# Memory Policy

- 所有长期记忆统一写入 `WIN_MEMORY/`
- 用户偏好写入 `user/`
- 团队与角色写入 `teams/`
- 任务上下文写入 `missions/`
- 工作区上下文写入 `workspaces/`
- 可复用经验写入 `knowledge/`
- 最近执行摘要写入 `work-log/current.md`
```

- [ ] **Step 4: 实现 MemoryManager**

```ts
// src/runtime/core/MemoryManager.ts
import fs from "node:fs/promises";
import path from "node:path";

export class MemoryManager {
  constructor(private readonly rootPath: string) {}

  private get memoryRoot() {
    return path.join(this.rootPath, "WIN_MEMORY");
  }

  async ensureBaseStructure() {
    const dirs = [
      "user",
      "teams/roles",
      "missions/active",
      "missions/archive",
      "workspaces",
      "knowledge",
      "work-log",
      "snapshots"
    ];

    await Promise.all(dirs.map((dir) => fs.mkdir(path.join(this.memoryRoot, dir), { recursive: true })));

    await this.writeIfMissing("README.md", "# Win Together Memory\n");
    await this.writeIfMissing("INDEX.md", "# Memory Index\n");
    await this.writeIfMissing("memory-policy.md", "# Memory Policy\n");
    await this.writeIfMissing(path.join("work-log", "current.md"), "# Current Work Log\n");
  }

  async appendWorkLog(line: string) {
    const workLogPath = path.join(this.memoryRoot, "work-log", "current.md");
    await fs.appendFile(workLogPath, `${line}\n`, "utf-8");
  }

  private async writeIfMissing(relativePath: string, content: string) {
    const fullPath = path.join(this.memoryRoot, relativePath);
    try {
      await fs.access(fullPath);
    } catch {
      await fs.writeFile(fullPath, content, "utf-8");
    }
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run tests/runtime/MemoryManager.test.ts`  
Expected: PASS

- [ ] **Step 6: 提交记忆系统骨架**

```bash
git add WIN_MEMORY src/runtime/core/MemoryManager.ts tests/runtime/MemoryManager.test.ts
git commit -m "feat(memory): add document-based memory foundation"
```

## 任务 4：建立 Runtime Core 与 Mission 编排器骨架

**Files:**
- Create: `src/runtime/core/AppRuntime.ts`
- Create: `src/runtime/core/AppRuntimeImpl.ts`
- Create: `src/runtime/core/MissionOrchestrator.ts`
- Create: `src/runtime/core/WorkspaceManager.ts`
- Create: `src/runtime/core/TranscriptStore.ts`
- Create: `src/runtime/utils/id.ts`
- Create: `src/runtime/utils/time.ts`
- Test: `tests/runtime/MissionOrchestrator.test.ts`

- [ ] **Step 1: 写 MissionOrchestrator 测试**

```ts
import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";
import { MissionOrchestrator } from "../../src/runtime/core/MissionOrchestrator";

describe("MissionOrchestrator", () => {
  it("should create a mission and emit mission + captain events", async () => {
    const bus = new EventBus();
    const events: string[] = [];

    bus.subscribe("mission.created", (event) => events.push(event.type));
    bus.subscribe("agent.spawned", (event) => events.push(event.type));

    const orchestrator = new MissionOrchestrator(bus);
    await orchestrator.startMission({
      goal: "为 Electron 项目创建 Team Room",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(events).toEqual(["mission.created", "agent.spawned"]);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/runtime/MissionOrchestrator.test.ts`  
Expected: FAIL，提示编排器不存在

- [ ] **Step 3: 写最小工具函数与编排器**

```ts
// src/runtime/utils/id.ts
export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}
```

```ts
// src/runtime/core/MissionOrchestrator.ts
import { EventBus } from "./EventBus";
import { createId } from "../utils/id";

export class MissionOrchestrator {
  constructor(private readonly bus: EventBus) {}

  async startMission(input: { goal: string; workspacePath: string }) {
    const missionId = createId("mission");
    const captainId = createId("agent");

    this.bus.publish({
      id: createId("evt"),
      type: "mission.created",
      timestamp: new Date().toISOString(),
      payload: {
        id: missionId,
        title: input.goal,
        goal: input.goal,
        workspacePath: input.workspacePath
      }
    });

    this.bus.publish({
      id: createId("evt"),
      type: "agent.spawned",
      timestamp: new Date().toISOString(),
      payload: {
        id: captainId,
        role: "captain",
        name: "Captain",
        status: "planning"
      }
    });

    return { missionId, captainId };
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/runtime/MissionOrchestrator.test.ts`  
Expected: PASS

- [ ] **Step 5: 提交 Runtime Core 骨架**

```bash
git add src/runtime/core src/runtime/utils tests/runtime/MissionOrchestrator.test.ts
git commit -m "feat(runtime): add mission orchestrator foundation"
```

## 任务 5：建立 Codex CLI 适配器骨架

**Files:**
- Create: `src/runtime/adapters/AgentRuntimeAdapter.ts`
- Create: `src/runtime/adapters/CodexCliAdapter.ts`
- Create: `src/runtime/adapters/CodexCliProcess.ts`
- Test: `tests/runtime/CodexCliAdapter.test.ts`

- [ ] **Step 1: 写 CodexCliAdapter 测试**

```ts
import { describe, expect, it } from "vitest";
import { CodexCliAdapter } from "../../src/runtime/adapters/CodexCliAdapter";

describe("CodexCliAdapter", () => {
  it("should build a codex task payload from agent scope", () => {
    const adapter = new CodexCliAdapter();
    const result = adapter.buildTaskPrompt({
      missionGoal: "实现 Team Room 页面",
      agentRole: "builder",
      scope: "只负责渲染层页面骨架"
    });

    expect(result).toContain("实现 Team Room 页面");
    expect(result).toContain("只负责渲染层页面骨架");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/runtime/CodexCliAdapter.test.ts`  
Expected: FAIL，提示适配器不存在

- [ ] **Step 3: 写统一接口与 Codex 适配器骨架**

```ts
// src/runtime/adapters/AgentRuntimeAdapter.ts
export interface AgentTaskInput {
  missionGoal: string;
  agentRole: string;
  scope: string;
}

export interface AgentRuntimeAdapter {
  buildTaskPrompt(input: AgentTaskInput): string;
}
```

```ts
// src/runtime/adapters/CodexCliAdapter.ts
import type { AgentRuntimeAdapter, AgentTaskInput } from "./AgentRuntimeAdapter";

export class CodexCliAdapter implements AgentRuntimeAdapter {
  buildTaskPrompt(input: AgentTaskInput) {
    return [
      `Mission Goal: ${input.missionGoal}`,
      `Agent Role: ${input.agentRole}`,
      `Scope: ${input.scope}`,
      "请在你的职责范围内完成任务，并给出清晰的进展、结果和风险。"
    ].join("\n");
  }
}
```

```ts
// src/runtime/adapters/CodexCliProcess.ts
import { spawn } from "node:child_process";

export function spawnCodexProcess(args: string[], cwd: string) {
  return spawn("codex", args, {
    cwd,
    stdio: "pipe",
    shell: process.platform === "win32"
  });
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/runtime/CodexCliAdapter.test.ts`  
Expected: PASS

- [ ] **Step 5: 提交 Codex 适配器骨架**

```bash
git add src/runtime/adapters tests/runtime/CodexCliAdapter.test.ts
git commit -m "feat(codex): add codex cli adapter foundation"
```

## 任务 6：建立前端应用骨架与路由

**Files:**
- Create: `src/renderer/routes/HomePage.tsx`
- Create: `src/renderer/routes/TeamRoomPage.tsx`
- Create: `src/renderer/routes/MissionHistoryPage.tsx`
- Create: `src/renderer/routes/MemoryViewerPage.tsx`
- Create: `src/renderer/components/layout/AppShell.tsx`
- Create: `src/renderer/store/appStore.ts`

- [ ] **Step 1: 先写页面级最小渲染测试**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TeamRoomPage } from "../../src/renderer/routes/TeamRoomPage";

it("renders the team room title", () => {
  render(
    <MemoryRouter>
      <TeamRoomPage />
    </MemoryRouter>
  );

  expect(screen.getByText("Team Room")).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/renderer/TeamRoomPage.test.tsx`  
Expected: FAIL，提示页面不存在

- [ ] **Step 3: 写路由与页面骨架**

```tsx
// src/renderer/App.tsx
import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./routes/HomePage";
import { TeamRoomPage } from "./routes/TeamRoomPage";
import { MissionHistoryPage } from "./routes/MissionHistoryPage";
import { MemoryViewerPage } from "./routes/MemoryViewerPage";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team/:missionId" element={<TeamRoomPage />} />
        <Route path="/history" element={<MissionHistoryPage />} />
        <Route path="/memory" element={<MemoryViewerPage />} />
      </Routes>
    </AppShell>
  );
}
```

```tsx
// src/renderer/routes/TeamRoomPage.tsx
export function TeamRoomPage() {
  return <div>Team Room</div>;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/renderer/TeamRoomPage.test.tsx`  
Expected: PASS

- [ ] **Step 5: 提交前端骨架**

```bash
git add src/renderer tests/renderer/TeamRoomPage.test.tsx
git commit -m "feat(renderer): add app shell and route skeleton"
```

## 任务 7：建立 Team Room 组件与统一消息流展示

**Files:**
- Create: `src/renderer/components/team-room/MessageTimeline.tsx`
- Create: `src/renderer/components/team-room/RosterPanel.tsx`
- Create: `src/renderer/components/team-room/ContextPanel.tsx`
- Create: `src/renderer/components/team-room/MissionComposer.tsx`
- Modify: `src/renderer/routes/TeamRoomPage.tsx`
- Modify: `src/renderer/store/appStore.ts`

- [ ] **Step 1: 写 Team Room 布局测试**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TeamRoomPage } from "../../src/renderer/routes/TeamRoomPage";

it("renders timeline, roster, context, and composer", () => {
  render(
    <MemoryRouter>
      <TeamRoomPage />
    </MemoryRouter>
  );

  expect(screen.getByText("Timeline")).toBeInTheDocument();
  expect(screen.getByText("Agents")).toBeInTheDocument();
  expect(screen.getByText("Context")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("告诉 Captain 你的目标...")).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/renderer/TeamRoomPage.test.tsx`  
Expected: FAIL，提示布局元素不存在

- [ ] **Step 3: 写 Team Room 组件骨架**

```tsx
// src/renderer/components/team-room/MissionComposer.tsx
export function MissionComposer() {
  return <textarea placeholder="告诉 Captain 你的目标..." />;
}
```

```tsx
// src/renderer/routes/TeamRoomPage.tsx
import { ContextPanel } from "../components/team-room/ContextPanel";
import { MessageTimeline } from "../components/team-room/MessageTimeline";
import { MissionComposer } from "../components/team-room/MissionComposer";
import { RosterPanel } from "../components/team-room/RosterPanel";

export function TeamRoomPage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 320px", gap: 16 }}>
      <RosterPanel />
      <div>
        <MessageTimeline />
        <MissionComposer />
      </div>
      <ContextPanel />
    </div>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/renderer/TeamRoomPage.test.tsx`  
Expected: PASS

- [ ] **Step 5: 提交 Team Room 骨架**

```bash
git add src/renderer/components/team-room src/renderer/routes/TeamRoomPage.tsx src/renderer/store/appStore.ts tests/renderer/TeamRoomPage.test.tsx
git commit -m "feat(team-room): add chat-first team room layout"
```

## 任务 8：打通主进程、Runtime 与 Team Room 最小闭环

**Files:**
- Create: `src/main/ipc/registerAppIpc.ts`
- Create: `src/main/ipc/channels/runtimeChannels.ts`
- Create: `src/main/ipc/channels/workspaceChannels.ts`
- Create: `src/main/services/runtime/AppRuntimeService.ts`
- Create: `src/main/services/runtime/createAppRuntime.ts`
- Create: `src/main/services/workspace/WorkspacePickerService.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/main/main.ts`
- Modify: `src/renderer/store/appStore.ts`
- Modify: `src/renderer/components/team-room/MissionComposer.tsx`

- [ ] **Step 1: 写最小闭环测试思路并建立手动验收脚本**

```md
1. 打开应用
2. 选择 `D:\development\WinTogether2`
3. 在输入框中输入“帮我设计 Team Room 页面”
4. 点击发送
5. 页面出现一条 `mission.created`
6. 页面出现一条 `agent.spawned`
7. 页面出现一条 Captain 初始消息
8. `WIN_MEMORY/work-log/current.md` 追加一行摘要
```

- [ ] **Step 2: 写主进程运行时服务**

```ts
// src/main/services/runtime/AppRuntimeService.ts
import { AppRuntimeImpl } from "../../../runtime/core/AppRuntimeImpl";

export class AppRuntimeService {
  private runtime = new AppRuntimeImpl(process.cwd());

  async startMission(input: { goal: string; workspacePath: string }) {
    return this.runtime.startMission(input);
  }
}
```

- [ ] **Step 3: 写 preload API**

```ts
// src/preload/index.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("winTogether", {
  startMission: (input: { goal: string; workspacePath: string }) =>
    ipcRenderer.invoke("runtime:start-mission", input)
});
```

- [ ] **Step 4: 在前端发送 mission 并刷新消息流**

```ts
// MissionComposer 内
const handleSubmit = async () => {
  await window.winTogether.startMission({
    goal: value,
    workspacePath: "D:/development/WinTogether2"
  });
};
```

- [ ] **Step 5: 手动验证最小闭环**

Run: `npm run dev`  
Expected:
- 可以输入目标
- 主进程收到 IPC
- 运行时创建 mission
- Team Room 出现 Captain 与 mission 相关消息
- `WIN_MEMORY/work-log/current.md` 追加新日志

- [ ] **Step 6: 提交第一阶段闭环**

```bash
git add src/main src/preload/index.ts src/renderer/components/team-room/MissionComposer.tsx src/renderer/store/appStore.ts WIN_MEMORY/work-log/current.md
git commit -m "feat(loop): connect team room to runtime and memory"
```

## 任务 9：文档与开发体验补全

**Files:**
- Create: `README.md`
- Create: `docs/architecture/runtime-overview.md`
- Modify: `docs/superpowers/specs/2026-04-14-win-together-v1-design.md`

- [ ] **Step 1: 写 README 最小说明**

```md
# Win Together

## 当前阶段

Win Together v1 基础版，目标是跑通：
- Electron 桌面壳
- Team Room 页面骨架
- Runtime Core
- Codex CLI 适配器骨架
- 文档化记忆系统
```

- [ ] **Step 2: 写运行架构说明**

```md
# Runtime Overview

当前运行链路：
Renderer -> IPC -> Main Process -> AppRuntimeService -> MissionOrchestrator -> EventBus -> MemoryManager / CodexCliAdapter
```

- [ ] **Step 3: 跑一遍总测试**

Run: `npm test`  
Expected: 所有 Vitest 用例通过

- [ ] **Step 4: 跑一遍类型检查**

Run: `npm run lint`  
Expected: 无 TypeScript 错误

- [ ] **Step 5: 提交文档补全**

```bash
git add README.md docs src docs/superpowers/specs/2026-04-14-win-together-v1-design.md
git commit -m "docs(project): add runtime overview and getting started notes"
```

## 计划自检

### 1. 规格覆盖检查

已覆盖的规格点：

- `Electron` 桌面产品骨架：任务 1
- `Team Room` 聊天优先页面：任务 6、任务 7
- `Captain` 为起点的任务流：任务 4、任务 8
- `Codex-first` 运行架构：任务 5、任务 8
- `Memory v1` 文档化系统：任务 3、任务 8
- `统一事件流`：任务 2、任务 4、任务 7、任务 8
- `Workspace` 概念：任务 4、任务 8

当前刻意未进入的规格点：

- 真正多子 Agent 并发执行
- 完整 Mission History 交互
- 完整 Memory Viewer 数据联动
- OAuth / 云同步 / 多 provider

这些属于后续阶段，不属于本计划的第一阶段闭环。

### 2. 占位词扫描

本计划没有使用 `TODO / TBD / implement later / write tests for the above` 之类占位描述。每个任务都给了明确文件、命令和最小代码片段。

### 3. 类型一致性检查

当前计划内统一使用：

- `MissionOrchestrator`
- `EventBus`
- `MemoryManager`
- `CodexCliAdapter`
- `Team Room`

命名在各任务中保持一致，没有出现前后不同的接口名。
