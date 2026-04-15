# Win Together 当前阶段交接文档

日期：2026-04-15  
分支：`feature/v1-foundation`  
用途：供下一位 agent 快速接手当前工作

## 1. 当前总体状态

`Win Together` 目前已经不再是“只能打开的壳”，而是进入了一个可持续打磨的 Alpha 阶段。

当前已经完成的核心能力有：

- Electron + React 桌面工作台已经跑通
- 首页、`Team Room`、任务记录、记忆中心都可用
- 界面为中文优先、亮色优先
- 首页可以直接输入目标并启动 mission
- `Codex CLI` 已经接入基础 smoke test 和首次 mission 响应
- 浏览器优先开发与 Playwright 自动化回归体系已建立
- Electron 真链路冒烟测试已建立
- 团队系统已经从“硬编码成员列表”升级为“默认团队模板驱动”
- 模板系统已经具备：默认模板、模板加载、模板基础校验、模板目录枚举

换句话说：

当前系统已经具备：

1. 可运行的桌面产品骨架
2. 可运行的模板驱动 Team Room
3. 可重复执行的自动化测试体系
4. 可以继续扩展到 AI 生成模板和更真实多 agent 协作的底座

## 2. 当前已经稳定跑通的能力

### 2.1 产品界面层

- 左侧工作台导航
- 首页直接输入目标
- `Team Room`
- 任务记录页
- 记忆中心页
- 语言切换
- 当前工作区、最近任务、`Codex CLI` 状态显示

### 2.2 Runtime / CLI 层

- `Codex CLI` 健康检查
- 首页 smoke test
- mission start 后第一轮真实 CLI 返回
- `WIN_MEMORY` 文档化记忆基础读写
- `TranscriptStore` 持久化最近任务

### 2.3 团队模板系统

已完成：

- 默认团队模板文件：`default-software-team.json`
- 模板 schema / 类型定义
- 默认模板加载器
- 模板最小结构校验
- 模板目录枚举/注册表
- mission 启动时根据默认模板组建初始团队
- `Team Room` roster 已改为模板驱动
- browser bridge 也同步为模板驱动团队

### 2.4 自动化测试层

#### 浏览器 Playwright 回归

已覆盖：

- 首次用户从首页启动 mission
- `Codex CLI` smoke test
- AI/CLI 等待态
- browser bridge 失败态
- 任务记录页
- 记忆中心页

#### Electron 真链路冒烟

已覆盖：

- 构建桌面应用
- 启动真实 Electron 壳
- preload 是否存在
- IPC 是否可调用
- 主工作台是否正常渲染

#### 单元 / 组件测试

已覆盖：

- runtime 核心模块
- `CodexCliAdapter`
- `TeamTemplateLoader`
- `TeamTemplateRegistry`
- `MemoryManager`
- `MissionOrchestrator`
- `TeamRoomPage`
- `AppRuntimeService`

## 3. 当前最新的重要提交

最近几条关键提交如下：

- `a779622` `feat: validate and enumerate team templates`
- `d7e3155` `feat: hydrate team template into team room`
- `d7109dc` `feat: add default team template foundation`
- `b0488c3` `feat: add electron smoke regression`
- `f66ab3f` `feat: add browser bridge mission failure regression`
- `d24b071` `feat: add history and memory ux regression`
- `be8367a` `feat: add ai waiting-state ux test`
- `528b6c9` `fix: tighten browser bridge activation`
- `8fdc8bb` `feat: add playwright browser-first workflow`

这些提交基本可以理解成当前阶段的主干演进线。

## 4. 当前推荐的验证命令

如果下一位 agent 接手，优先跑这些：

### 4.1 全量本地基础验证

```powershell
npm test
npm run lint
npm run build
```

### 4.2 浏览器 Playwright 回归

```powershell
npm run test:e2e
```

### 4.3 Electron 真链路冒烟

```powershell
npm run test:e2e:electron
```

### 4.4 手动桌面调试

```powershell
start-dev.bat
```

## 5. 当前已知风险 / 尚未完成的地方

### 5.1 多 agent 协作还不是完整后端

虽然 `Team Room` 已经比之前更像真实协作，但目前还不是完整的流式多 agent transcript 系统。

现阶段更多是：

- 模板驱动的初始团队
- 更可信的协作阶段事件
- 更像真实团队的前端表现

但还没有做到真正复杂的多 agent 并发执行和持续交互。

### 5.2 模板校验还是轻量手写版

当前模板校验已经有了，但还是轻量手写校验，不是完整 schema 系统。

这意味着：

- 现在够用
- 但未来如果模板结构更复杂，可能需要引入更正式的 schema 校验机制

### 5.3 模板注册表目前只是目录扫描

当前的模板目录管理已经能工作，但本质上还是：

- 扫描 `WIN_MEMORY/teams/templates`
- 区分 `built-in` 和 `generated`

以后如果要做更完整的模板管理 UI，可能还要补一层索引或目录元数据。

### 5.4 还没有模板选择 UI

当前默认模板已经生效，但还没有真正的模板选择界面。

这是刻意控制范围，不是遗漏。

### 5.5 还没有 AI 生成模板闭环

目前只是把模板系统底座搭好，还没有：

- 用户描述需要什么团队
- 调 `Codex` 生成模板
- 保存到 `generated/`
- 再由产品加载

这正是后面最自然的下一阶段之一。

## 6. 当前工作区特殊说明

工作区里目前还保留着一份用户之前手测生成的文件：

`WIN_MEMORY/missions/mission-1776183964124-d3505cc3.json`

这份文件目前是未跟踪状态。  
它不是错误，也不是必须删除的垃圾文件。  
除非用户明确要求清理，否则不要贸然删除。

## 7. 下一位 agent 最推荐的接手方向

如果让我给出优先级，我建议按这个顺序继续：

### 方案 A：模板系统产品化

优先级最高，建议先做。

内容包括：

- 模板列表读取接入前端
- 最小模板选择入口
- 当前默认模板显示
- 模板详情查看

原因：

- 当前底层已经准备好了
- 这是把“模板系统”从基础设施变成用户可见产品能力的自然下一步

### 方案 B：AI 生成模板最小闭环

在 A 之后推进最顺。

内容包括：

- 输入一段团队需求描述
- 调用 `Codex` 生成模板 JSON
- 做模板校验
- 保存到 `generated/`
- 重新加载模板目录

原因：

- 这正是用户明确想要的能力
- 当前模板 loader + registry 已经具备承接基础

### 方案 C：继续增强 Team Room 协作过程

也可以继续做，但建议排在模板产品化之后。

内容包括：

- 更细的 Captain / Worker 阶段
- 更多协作型事件
- 更像真实工作叙事的 timeline

原因：

- 当前已经比以前强不少
- 但模板系统现在更接近一个可完整闭环的子项目

## 8. 建议下一位 agent 的开工顺序

1. 先阅读：
   - `docs/superpowers/specs/2026-04-14-foundation-checkpoint.md`
   - `docs/superpowers/specs/2026-04-15-team-template-system-design.zh-CN.md`
   - `WIN_MEMORY/work-log/current.md`

2. 再跑：
   - `npm test`
   - `npm run lint`
   - `npm run test:e2e`
   - `npm run test:e2e:electron`

3. 确认当前是绿的后，再开始下一轮功能开发

4. 每轮自动化测试前，先关掉残留的 Electron / 浏览器测试窗口和相关进程

## 9. 一句话总结

当前 `Win Together` 已经从“能打开的原型”推进到：

**有可用桌面壳、有模板驱动团队、有浏览器与 Electron 双测试链、有继续扩展 AI 团队产品能力的稳定 Alpha 底座。**
