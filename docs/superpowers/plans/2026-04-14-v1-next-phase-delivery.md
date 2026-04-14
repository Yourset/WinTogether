# Win Together v1 Next-Phase Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在“应用可正常启动、可创建任务”的基础上，把 Win Together 推进到真正可连续上手测试的阶段：能看到任务列表、能看到更真实的团队时间线、能验证 Codex CLI 可用性、能从历史和记忆页看到实际内容。

**Architecture:** 继续沿用当前的 `Electron + React + Runtime Core + CodexCliAdapter + WIN_MEMORY` 结构，不引入新的大框架。下一阶段重点不是扩平台边界，而是把现有骨架打通成完整闭环：任务创建、运行事件、历史沉淀、CLI 可用性检查和更真实的 Team Room 展示。

**Tech Stack:** Electron, React, TypeScript, Zustand, React Router, Node.js, Vitest, Testing Library

---

## 文件结构

- Modify: `src/runtime/core/AppRuntime.ts`
  - 增加任务摘要读取、最近任务读取、CLI 健康检查等运行时接口
- Modify: `src/runtime/core/AppRuntimeImpl.ts`
  - 实现最近任务、历史摘要、环境检查的聚合逻辑
- Modify: `src/runtime/core/TranscriptStore.ts`
  - 从“只写入”升级为“可列出最近任务、可读取某个任务摘要”
- Modify: `src/runtime/adapters/CodexCliAdapter.ts`
  - 增加最小可用健康检查与版本/可执行状态探测
- Modify: `src/main/services/runtime/AppRuntimeService.ts`
  - 向 IPC 暴露新的任务列表与健康检查能力
- Modify: `src/main/ipc/channels/runtimeChannels.ts`
  - 增加 list/check 类型的通道
- Modify: `src/preload/index.ts`
  - 暴露最近任务列表、Codex CLI 检查等 API 给渲染层
- Modify: `src/renderer/store/appStore.ts`
  - 增加启动初始化、最近任务同步、CLI 状态显示所需状态
- Modify: `src/renderer/components/layout/AppShell.tsx`
  - 让侧边栏最近任务不再只依赖本地启动结果，而是来自真实持久化数据
- Modify: `src/renderer/routes/HomePage.tsx`
  - 增加 Codex CLI 状态提示和更真实的最近任务恢复入口
- Modify: `src/renderer/routes/TeamRoomPage.tsx`
  - 支持从真实任务记录加载时间线/摘要，而不是只看本次内存状态
- Modify: `src/renderer/routes/MissionHistoryPage.tsx`
  - 展示最近任务列表和基本摘要
- Modify: `src/renderer/routes/MemoryViewerPage.tsx`
  - 展示 `WIN_MEMORY` 中的关键文件摘要，而不是纯占位文案
- Modify: `src/renderer/i18n.ts`
  - 补充 CLI 健康状态、历史页、记忆页的中英文文案
- Test: `tests/runtime/TranscriptStore.test.ts`
  - 覆盖最近任务索引和摘要读取
- Test: `tests/runtime/CodexCliAdapter.test.ts`
  - 覆盖 CLI 健康检查
- Test: `tests/main/runtimeChannels.test.ts`
  - 覆盖新增 IPC
- Test: `tests/renderer/AppShell.test.tsx`
  - 覆盖侧边栏加载真实最近任务和 CLI 状态
- Test: `tests/renderer/MissionHistoryPage.test.tsx`
  - 覆盖历史页真实列表
- Test: `tests/renderer/MemoryViewerPage.test.tsx`
  - 覆盖记忆页真实内容

### Task 1: 让最近任务和历史页读取真实持久化数据

**Files:**
- Modify: `src/runtime/core/TranscriptStore.ts`
- Modify: `src/runtime/core/AppRuntime.ts`
- Modify: `src/runtime/core/AppRuntimeImpl.ts`
- Modify: `src/main/services/runtime/AppRuntimeService.ts`
- Modify: `src/main/ipc/channels/runtimeChannels.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/renderer/store/appStore.ts`
- Modify: `src/renderer/components/layout/AppShell.tsx`
- Modify: `src/renderer/routes/MissionHistoryPage.tsx`
- Test: `tests/runtime/TranscriptStore.test.ts`
- Test: `tests/main/runtimeChannels.test.ts`
- Test: `tests/renderer/AppShell.test.tsx`
- Test: `tests/renderer/MissionHistoryPage.test.tsx`

- [ ] **Step 1: 先写 `TranscriptStore` 的失败测试，要求它能列出最近任务和读取单个任务摘要**
- [ ] **Step 2: 运行 `npx vitest run tests/runtime/TranscriptStore.test.ts`，确认先失败**
- [ ] **Step 3: 最小实现 `TranscriptStore.listRecentMissions()` 和 `TranscriptStore.readMissionSummary()`**
- [ ] **Step 4: 再写主进程通道失败测试，要求 runtime IPC 能把最近任务列表发到 preload**
- [ ] **Step 5: 运行 `npx vitest run tests/main/runtimeChannels.test.ts`，确认先失败**
- [ ] **Step 6: 最小实现 `AppRuntimeImpl` / `AppRuntimeService` / `runtimeChannels` / `preload` 的最近任务读取链路**
- [ ] **Step 7: 再写渲染层失败测试，要求侧边栏和历史页显示真实最近任务**
- [ ] **Step 8: 运行 `npx vitest run tests/renderer/AppShell.test.tsx tests/renderer/MissionHistoryPage.test.tsx`，确认先失败**
- [ ] **Step 9: 最小实现 `appStore` 初始化加载和 `MissionHistoryPage` 列表渲染**
- [ ] **Step 10: 运行 `npm test` 和 `npm run lint`，确认通过**
- [ ] **Step 11: 提交**

### Task 2: 给 Codex CLI 增加可见的健康检查和入口状态

**Files:**
- Modify: `src/runtime/adapters/CodexCliAdapter.ts`
- Modify: `src/runtime/adapters/CodexCliProcess.ts`
- Modify: `src/runtime/core/AppRuntime.ts`
- Modify: `src/runtime/core/AppRuntimeImpl.ts`
- Modify: `src/main/services/runtime/AppRuntimeService.ts`
- Modify: `src/main/ipc/channels/runtimeChannels.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/renderer/store/appStore.ts`
- Modify: `src/renderer/routes/HomePage.tsx`
- Modify: `src/renderer/i18n.ts`
- Test: `tests/runtime/CodexCliAdapter.test.ts`
- Test: `tests/main/runtimeChannels.test.ts`
- Test: `tests/renderer/AppShell.test.tsx`

- [ ] **Step 1: 写失败测试，要求 `CodexCliAdapter` 能返回 CLI 是否可执行、版本文本或错误状态**
- [ ] **Step 2: 运行 `npx vitest run tests/runtime/CodexCliAdapter.test.ts`，确认先失败**
- [ ] **Step 3: 最小实现 `codex --version` / 可执行探测的健康检查接口**
- [ ] **Step 4: 写主进程通道失败测试，要求渲染层可以请求 CLI 状态**
- [ ] **Step 5: 运行 `npx vitest run tests/main/runtimeChannels.test.ts`，确认失败点在新通道**
- [ ] **Step 6: 最小实现 runtime 到 preload 的 CLI 状态读取链路**
- [ ] **Step 7: 写渲染层失败测试，要求首页或侧边栏显示 `Codex CLI 已就绪 / 未就绪`**
- [ ] **Step 8: 运行 `npx vitest run tests/renderer/AppShell.test.tsx`，确认先失败**
- [ ] **Step 9: 最小实现 `HomePage` 和 `appStore` 的 CLI 状态展示**
- [ ] **Step 10: 运行 `npm test` 和 `npm run lint`，确认通过**
- [ ] **Step 11: 提交**

### Task 3: 让 Team Room 时间线更像真实团队过程

**Files:**
- Modify: `src/runtime/core/MissionOrchestrator.ts`
- Modify: `src/runtime/core/AppRuntimeImpl.ts`
- Modify: `src/runtime/core/EventBus.ts`
- Modify: `src/shared/contracts/events.ts`
- Modify: `src/renderer/store/appStore.ts`
- Modify: `src/renderer/components/team-room/MessageTimeline.tsx`
- Modify: `src/renderer/routes/TeamRoomPage.tsx`
- Modify: `src/renderer/i18n.ts`
- Test: `tests/runtime/MissionOrchestrator.test.ts`
- Test: `tests/runtime/EventBus.test.ts`
- Test: `tests/renderer/TeamRoomPage.test.tsx`

- [ ] **Step 1: 写失败测试，要求 orchestrator 在任务启动时至少发出 `mission started / captain planning / captain summary` 这类更完整事件**
- [ ] **Step 2: 运行 `npx vitest run tests/runtime/MissionOrchestrator.test.ts tests/runtime/EventBus.test.ts`，确认失败**
- [ ] **Step 3: 最小实现任务启动后的结构化事件序列**
- [ ] **Step 4: 写渲染层失败测试，要求 `TeamRoomPage` 以更像对话流的方式展示这些事件**
- [ ] **Step 5: 运行 `npx vitest run tests/renderer/TeamRoomPage.test.tsx`，确认先失败**
- [ ] **Step 6: 最小实现 `appStore` 的事件映射和 `MessageTimeline` 的视觉层级**
- [ ] **Step 7: 运行 `npm test` 和 `npm run lint`，确认通过**
- [ ] **Step 8: 提交**

### Task 4: 让记忆页和项目记忆真正可见

**Files:**
- Modify: `src/runtime/core/MemoryManager.ts`
- Modify: `src/runtime/core/AppRuntime.ts`
- Modify: `src/runtime/core/AppRuntimeImpl.ts`
- Modify: `src/main/services/runtime/AppRuntimeService.ts`
- Modify: `src/main/ipc/channels/runtimeChannels.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/renderer/routes/MemoryViewerPage.tsx`
- Modify: `src/renderer/i18n.ts`
- Test: `tests/runtime/MemoryManager.test.ts`
- Test: `tests/main/runtimeChannels.test.ts`
- Test: `tests/renderer/MemoryViewerPage.test.tsx`

- [ ] **Step 1: 写失败测试，要求 `MemoryManager` 能读取关键文档摘要，例如当前 work-log 和 user preferences**
- [ ] **Step 2: 运行 `npx vitest run tests/runtime/MemoryManager.test.ts`，确认失败**
- [ ] **Step 3: 最小实现记忆摘要读取接口**
- [ ] **Step 4: 写失败测试，要求 `MemoryViewerPage` 显示真实记忆内容而不是占位文案**
- [ ] **Step 5: 运行 `npx vitest run tests/renderer/MemoryViewerPage.test.tsx`，确认先失败**
- [ ] **Step 6: 最小实现 runtime / preload / 页面三层记忆读取**
- [ ] **Step 7: 运行 `npm test` 和 `npm run lint`，确认通过**
- [ ] **Step 8: 提交**

### Task 5: 做一轮可交付测试版收口

**Files:**
- Modify: `start-dev.bat`
- Modify: `WIN_MEMORY/work-log/current.md`
- Modify: `docs/superpowers/specs/2026-04-14-foundation-checkpoint.md`
- Modify: `docs/superpowers/plans/2026-04-14-v1-next-phase-delivery.md`

- [ ] **Step 1: 更新启动脚本提示语，让测试者知道现在重点验证什么**
- [ ] **Step 2: 在 `WIN_MEMORY` 里记录“可测试版”阶段状态和已知缺口**
- [ ] **Step 3: 更新 checkpoint 文档，列出当前能测的功能、未完成项和推荐测试路径**
- [ ] **Step 4: 手动运行 `start-dev.bat` 做一次烟雾测试**
- [ ] **Step 5: 提交**
