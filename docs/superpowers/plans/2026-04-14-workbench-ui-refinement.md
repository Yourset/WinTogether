# Workbench UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前偏开发骨架的界面收成更接近桌面工作台的可用版本，默认采用左侧导航 + 右侧新建任务页，并让任务创建后自然切入 Team Room。

**Architecture:** 保持现有 `Electron + React + Zustand + React Router` 结构不变，只重做渲染层布局、首页交互和少量状态组织。首页不再依赖文本链接承担主要入口，而是由稳定侧边栏和右侧任务输入页一起完成任务创建和页面切换。

**Tech Stack:** Electron, React, TypeScript, Zustand, React Router, Vitest, Testing Library

---

## 文件结构

- 修改: `src/renderer/components/layout/AppShell.tsx`
  - 改造成稳定侧边栏工作台布局，包含主入口、最近任务、workspace 摘要、语言切换
- 修改: `src/renderer/routes/HomePage.tsx`
  - 改造成右侧默认的新建任务页，而不是链接集合页
- 修改: `src/renderer/components/team-room/MissionComposer.tsx`
  - 拆出可复用的创建任务表单能力，供首页和 Team Room 共用
- 修改: `src/renderer/routes/TeamRoomPage.tsx`
  - 保持三栏协作室，但和新布局衔接更自然
- 修改: `src/renderer/store/appStore.ts`
  - 增加最近任务与当前 workspace 摘要，支撑左侧栏
- 修改: `src/renderer/i18n.ts`
  - 增加工作台布局和首页新文案
- 测试: `tests/renderer/AppShell.test.tsx`
  - 验证侧边栏、默认中文、英文切换、首页主入口
- 测试: `tests/renderer/TeamRoomPage.test.tsx`
  - 验证新表单复用后 Team Room 仍可正常启动任务

### Task 1: 先用测试锁定新布局和入口

**Files:**
- Modify: `tests/renderer/AppShell.test.tsx`
- Modify: `tests/renderer/TeamRoomPage.test.tsx`

- [ ] **Step 1: 写失败测试，描述新的工作台布局**
- [ ] **Step 2: 运行测试，确认它们先失败**
- [ ] **Step 3: 最小实现侧边栏和首页入口**
- [ ] **Step 4: 重新运行渲染层测试，确认通过**
- [ ] **Step 5: 提交**

### Task 2: 把任务创建入口从“链接”升级成真正表单

**Files:**
- Modify: `src/renderer/routes/HomePage.tsx`
- Modify: `src/renderer/components/team-room/MissionComposer.tsx`
- Modify: `src/renderer/store/appStore.ts`
- Modify: `src/renderer/i18n.ts`

- [ ] **Step 1: 写失败测试，要求首页可直接输入目标并启动任务**
- [ ] **Step 2: 运行测试，确认首页还不具备这个能力**
- [ ] **Step 3: 抽出可复用创建任务表单，把首页和 Team Room 都接到同一逻辑**
- [ ] **Step 4: 跑测试确认首页和协作室都能启动任务**
- [ ] **Step 5: 提交**

### Task 3: 补齐侧边栏上下文和视觉收口

**Files:**
- Modify: `src/renderer/components/layout/AppShell.tsx`
- Modify: `src/renderer/routes/HomePage.tsx`
- Modify: `src/renderer/routes/TeamRoomPage.tsx`
- Modify: `src/renderer/i18n.ts`

- [ ] **Step 1: 写失败测试，覆盖最近任务和当前 workspace 摘要**
- [ ] **Step 2: 运行测试，确认缺失项存在**
- [ ] **Step 3: 最小实现最近任务、当前 workspace 摘要和更清晰的视觉层级**
- [ ] **Step 4: 跑 `npm test` 和 `npm run lint`，确认整体通过**
- [ ] **Step 5: 提交**
