# Win Together Alpha 易用性与 CLI 激活计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前“可启动、可创建任务、可查看基础时间线”的版本推进成更接近 Alpha 的可演示版本：默认亮色主题、清理无效桌面菜单、提供独立的 `Codex CLI` 测试入口，并把真实 CLI 调用接回首页任务流。

**Architecture:** 继续沿用当前 `Electron + React + Runtime Core + CodexCliAdapter + WIN_MEMORY` 架构，不引入新框架。下一阶段重点是让“真实执行链路”先以单次 CLI 调用的方式稳定打通，再逐步回接到 `Captain -> Team Room` 主流程，同时收紧 UI 视觉和桌面壳体验。

**Tech Stack:** Electron, React, TypeScript, Zustand, React Router, Node.js, Vitest, Testing Library

---

## 文件结构

- Modify: `src/renderer/styles.css`
  - 把默认视觉从深色切到亮色，统一页面、侧边栏、面板、输入区和状态块的亮色样式变量。
- Modify: `src/renderer/components/layout/AppShell.tsx`
  - 精简桌面壳可见入口，保留有价值的侧边栏导航和运行状态。
- Modify: `src/main/index.ts`
  - 收敛或移除当前无实际价值的应用菜单。
- Modify: `src/runtime/adapters/CodexCliAdapter.ts`
  - 增加一个最小可运行的 `runSmokePrompt()` 或等价接口，用来真正触发一次 `codex` 调用。
- Modify: `src/runtime/core/AppRuntime.ts`
  - 暴露独立 CLI 测试和首页任务触发所需的运行时接口。
- Modify: `src/runtime/core/AppRuntimeImpl.ts`
  - 串起 CLI 测试入口和首页任务流里的真实调用。
- Modify: `src/main/services/runtime/AppRuntimeService.ts`
  - 向 IPC 暴露 CLI 测试与真实任务运行结果。
- Modify: `src/main/ipc/channels/runtimeChannels.ts`
  - 新增 `runCodexSmokeTest` 和更新后的任务启动通道。
- Modify: `src/preload/index.ts`
  - 把 CLI 测试 API 和更新后的任务 API 暴露给渲染层。
- Modify: `src/renderer/store/appStore.ts`
  - 管理 CLI 测试状态、结果、错误信息，以及首页任务启动后的真实执行结果。
- Modify: `src/renderer/routes/HomePage.tsx`
  - 增加独立的“测试 Codex CLI”入口，并展示测试结果；保留“开始任务”主路径。
- Modify: `src/renderer/routes/TeamRoomPage.tsx`
  - 把首页真实调用产生的结果映射进时间线，让用户看见不是纯假数据。
- Modify: `src/renderer/components/team-room/MessageTimeline.tsx`
  - 支持显示 CLI 测试成功/失败、Captain 调用结果等更具体的消息块。
- Modify: `src/renderer/i18n.ts`
  - 补充亮色主题、CLI 测试入口、真实运行状态等中英文文案。
- Modify: `WIN_MEMORY/work-log/current.md`
  - 记录这轮“Alpha 易用性 + CLI 激活”方向的产品判断与实施阶段。
- Test: `tests/runtime/CodexCliAdapter.test.ts`
  - 覆盖最小 CLI 调用接口的成功与失败分支。
- Test: `tests/main/runtimeChannels.test.ts`
  - 覆盖新增的 CLI 测试 IPC 与更新后的任务启动链路。
- Test: `tests/renderer/HomePage.test.tsx`
  - 覆盖首页独立 CLI 测试入口与结果展示。
- Test: `tests/renderer/TeamRoomPage.test.tsx`
  - 覆盖真实任务调用后时间线展示变化。
- Test: `tests/renderer/AppShell.test.tsx`
  - 覆盖亮色壳层和精简导航/菜单相关行为。

## Task 1: 切换到默认亮色主题并收紧视觉层级

**Files:**
- Modify: `src/renderer/styles.css`
- Modify: `src/renderer/components/layout/AppShell.tsx`
- Modify: `src/renderer/routes/HomePage.tsx`
- Modify: `src/renderer/routes/TeamRoomPage.tsx`
- Test: `tests/renderer/AppShell.test.tsx`

- [ ] **Step 1: 先写渲染层失败测试，要求工作台默认使用亮色语义类名或亮色样式标记**
- [ ] **Step 2: 运行 `npx vitest run tests/renderer/AppShell.test.tsx`，确认测试先失败**
- [ ] **Step 3: 在 `src/renderer/styles.css` 中把页面、侧边栏、卡片、输入框和状态块切换到亮色变量与更高对比度**
- [ ] **Step 4: 在 `AppShell`、`HomePage`、`TeamRoomPage` 中删除依赖深色背景才能成立的样式结构**
- [ ] **Step 5: 再次运行 `npx vitest run tests/renderer/AppShell.test.tsx`，确认测试通过**
- [ ] **Step 6: 运行 `npm run lint`，确认样式和组件修改没有引入问题**
- [ ] **Step 7: 提交**

## Task 2: 清理没有实际价值的桌面菜单

**Files:**
- Modify: `src/main/index.ts`
- Test: `tests/main/window.test.ts`

- [ ] **Step 1: 先写主进程失败测试，要求应用菜单为空、极简，或只保留真正有用的开发期菜单**
- [ ] **Step 2: 运行 `npx vitest run tests/main/window.test.ts`，确认测试先失败**
- [ ] **Step 3: 在 `src/main/index.ts` 中移除当前默认 `File / Edit` 这类无实际价值的菜单项，改成极简菜单配置**
- [ ] **Step 4: 再次运行 `npx vitest run tests/main/window.test.ts`，确认菜单相关测试通过**
- [ ] **Step 5: 提交**

## Task 3: 增加独立的 Codex CLI 测试入口

**Files:**
- Modify: `src/runtime/adapters/CodexCliAdapter.ts`
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
- Test: `tests/renderer/HomePage.test.tsx`

- [ ] **Step 1: 先写运行时失败测试，要求 `CodexCliAdapter` 能执行一次最小 smoke prompt，并返回成功或错误结果**
- [ ] **Step 2: 运行 `npx vitest run tests/runtime/CodexCliAdapter.test.ts`，确认测试先失败**
- [ ] **Step 3: 在 `CodexCliAdapter` 中实现最小 CLI 调用接口，优先返回简短文本，不做复杂多轮对话**
- [ ] **Step 4: 先写 IPC 失败测试，要求渲染层能请求一次 `runCodexSmokeTest` 并收到结果**
- [ ] **Step 5: 运行 `npx vitest run tests/main/runtimeChannels.test.ts`，确认测试先失败**
- [ ] **Step 6: 在 `AppRuntime`、`AppRuntimeImpl`、`AppRuntimeService`、`runtimeChannels`、`preload` 中接通 CLI 测试链路**
- [ ] **Step 7: 先写首页失败测试，要求点击“测试 Codex CLI”后能显示运行中、成功结果或错误提示**
- [ ] **Step 8: 运行 `npx vitest run tests/renderer/HomePage.test.tsx`，确认测试先失败**
- [ ] **Step 9: 在 `appStore` 与 `HomePage` 中实现独立 CLI 测试入口和结果展示**
- [ ] **Step 10: 运行 `npm test` 与 `npm run lint`，确认整个测试面通过**
- [ ] **Step 11: 提交**

## Task 4: 把真实 CLI 调用接回首页任务流和 Team Room

**Files:**
- Modify: `src/runtime/core/MissionOrchestrator.ts`
- Modify: `src/runtime/core/AppRuntime.ts`
- Modify: `src/runtime/core/AppRuntimeImpl.ts`
- Modify: `src/renderer/store/appStore.ts`
- Modify: `src/renderer/routes/HomePage.tsx`
- Modify: `src/renderer/routes/TeamRoomPage.tsx`
- Modify: `src/renderer/components/team-room/MessageTimeline.tsx`
- Modify: `src/renderer/i18n.ts`
- Test: `tests/runtime/MissionOrchestrator.test.ts`
- Test: `tests/renderer/TeamRoomPage.test.tsx`

- [ ] **Step 1: 先写运行时失败测试，要求任务启动后至少产生一条基于真实 CLI 返回的 Captain 消息**
- [ ] **Step 2: 运行 `npx vitest run tests/runtime/MissionOrchestrator.test.ts`，确认测试先失败**
- [ ] **Step 3: 在 `AppRuntimeImpl` 和 `MissionOrchestrator` 中把首页任务启动接到最小 CLI 调用结果**
- [ ] **Step 4: 先写页面失败测试，要求 `TeamRoomPage` 显示真实 CLI 结果而不是只显示假时间线**
- [ ] **Step 5: 运行 `npx vitest run tests/renderer/TeamRoomPage.test.tsx`，确认测试先失败**
- [ ] **Step 6: 在 `appStore`、`MessageTimeline`、`TeamRoomPage` 中映射真实返回结果和错误状态**
- [ ] **Step 7: 运行 `npm test` 与 `npm run lint`，确认主流程没有回归**
- [ ] **Step 8: 提交**

## Task 5: 更新测试记录与 Alpha 检查点

**Files:**
- Modify: `WIN_MEMORY/work-log/current.md`
- Modify: `docs/superpowers/specs/2026-04-14-foundation-checkpoint.md`
- Modify: `docs/superpowers/plans/2026-04-14-alpha-usability-and-cli-activation.md`

- [ ] **Step 1: 在 `WIN_MEMORY` 中记录这轮“亮色主题 + 独立 CLI 测试 + 真实任务接通”的阶段目标**
- [ ] **Step 2: 更新 checkpoint 文档，明确当前 Alpha 版能测什么、怎么测、已知缺口是什么**
- [ ] **Step 3: 运行一次 `start-dev.bat` 做手动冒烟检查**
- [ ] **Step 4: 提交**

