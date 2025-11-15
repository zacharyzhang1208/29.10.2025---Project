# 普惠农业前端项目（React + Webpack）

本项目为普惠农业场景的前端应用，包含智能问答、价格预测、政策建议三大功能模块，并针对 GitHub Pages 做了路由兼容与部署优化。整体以绿色为主题色，强调清晰、友好与可读性。

## 技术栈与工具

- 前端框架：React 18（函数式组件 + Hooks）
- 路由：`react-router-dom`
- 构建：Webpack 5（`html-webpack-plugin`、`babel-loader`、`style-loader`、`css-loader`）
- 语言：现代 JavaScript（Babel 编译，自动 JSX 运行时）
- 部署：`gh-pages` 推送到 GitHub Pages

## 运行与构建

### 环境要求
- 推荐 Node.js 18+，npm 9+

### 本地开发
```bash
npm install
npm start
```
启动本地开发服务器（默认端口 `3000`，自动打开浏览器，支持 history 路由）。

### 生产构建
```bash
npm run build
```
生成产物位于 `dist/`，用于部署。

### 部署到 GitHub Pages
```bash
npm run deploy
```
依赖 `package.json` 的 `homepage` 字段与 `gh-pages`。当前配置指向：`package.json:6`。

## 路由与部署兼容

- 为兼容 GitHub Pages 的二级路径，路由 `basename` 动态计算：`src/utils/routerBase.js:1-9`
- 应用初始化时在 `App` 引入 `basename`：`src/App.js:12-15`
- Webpack `devServer.historyApiFallback: true` 保证开发环境前端路由正常：`webpack.config.js:33-52`

## 功能模块

### 智能问答（QnA）
- 输入问题并生成模拟回答（多段内容级联淡入）：`src/components/QnA.js:94-109`
- 提问历史与一键回填：`src/components/QnA.js:65-71`
- 提问建议 Chips（基于历史 + 固定建议）：`src/components/QnA.js:8-20, 88-92`
- 语音提问演示入口（状态提示与自动填充）：`src/components/QnA.js:7, 34-52, 86-92`
- 历史 UI 优化（绿系交互样式）：`src/styles/index.css:215-236`

### 价格预测（PricePrediction）
- 筛选栏（产品类型/地区/预测时间）与表格、趋势图、地区对比图：`src/components/PricePrediction.js`
- 表格列宽固定，避免选择后重算导致列宽抖动：
  - `colgroup` 明确列宽比例：`src/components/PricePrediction.js:134-139`
  - 固定布局与省略处理：`src/styles/index.css:362-364`
- 随机模拟数据生成（示意）：`src/components/PricePrediction.js:16-52, 29-53`

### 政策建议（PolicyAdvice）
- 左侧类别筛选 + 右侧筛选栏（日期预设/作物/类型/关键词）：`src/components/PolicyAdvice.js:70-107`
- 为您推荐（基于种植历史 + 当前筛选的即时过滤）：`src/components/PolicyAdvice.js:36-42, 121-133`
- 最新政策列表（按日期倒序假数据）：`src/components/PolicyAdvice.js:44-48, 143-160`
- 详情对话框（居中弹窗，三段纵向排列：政策要点/全文/解读）：`src/components/PolicyAdvice.js:162-196`
- GitHub Pages 路由兼容同上。

## 视觉与主题

- 主题色：绿色（主色 `#4CAF50`，悬浮 `#45a049`，强调 `#2e7d32`，浅绿边框 `#b7e3c6`，浅绿背景 `rgba(76,175,80,0.08)`）
- 交互统一：按钮、标签、焦点光环、建议 Chips、历史列表、卡片悬浮阴影等已统一绿系视觉。
- 智能问答动画：标题渐变流动、建议 Chips 入场、脉冲状态提示（语音演示）。
- 政策详情：要点板块使用黄色背景强调（更易扫读）：`src/styles/index.css:543-545`

## 项目结构（简化）

```
src/
├─ components/
│  ├─ Header.js
│  ├─ Footer.js
│  ├─ Content.js
│  ├─ QnA.js
│  ├─ PricePrediction.js
│  └─ PolicyAdvice.js
├─ styles/
│  └─ index.css
├─ utils/
│  └─ routerBase.js
├─ App.js
└─ index.js
```

## 开发约定

- 使用函数式组件与 Hooks，避免类组件。
- 路由路径统一由 `App` 管理；GitHub Pages 必须通过 `getBasename` 动态设置基路径。
- 样式集中在 `src/styles/index.css`，遵循已有命名与结构。
- 不引入未在 `package.json` 中声明的库。

## 常见问题（FAQ）

- 部署后在 GitHub Pages 无法跳转到子路由？
  - 确认 `homepage` 字段与仓库路径一致：`package.json:6`
  - 路由 `basename` 已动态处理：`src/utils/routerBase.js:1-9`
  - 构建时 `publicPath` 在生产为 `./`：`webpack.config.js:9-14`

- 价格预测表格列宽在选择产品后变化？
  - 原因：浏览器在自动布局下根据内容重算列宽。
  - 解决：`table-layout: fixed` + `colgroup` 明确列宽，并对单元格启用 `ellipsis`：`src/components/PricePrediction.js:134-139`, `src/styles/index.css:362-364`。

## 部署与预览

- 开发：`npm start`
- 构建：`npm run build`
- 部署：`npm run deploy`

如需进一步接入真实后端或语音识别服务，可在现有演示入口上替换为接口调用，同时保留现有 UI 与交互结构。

## 架构概览

- 应用入口：`src/index.js` 挂载根组件 `App`
- 路由容器：`src/App.js`，按页面组件划分路由视图
- 页面组件：`src/components/*` 下的功能页面（QnA、PricePrediction、PolicyAdvice）
- 样式：`src/styles/index.css` 单文件集中管理，遵循 BEM-ish 的扁平类名
- 路由基路径：`src/utils/routerBase.js:1-9`，在 GitHub Pages 下自动处理 `basename`

## 数据与交互流

- 智能问答
  - 输入问题 → 生成模拟回答段落（占位逻辑）→ 写入历史 → 可点击历史/建议回填
  - 提问建议融合历史与固定建议：`src/components/QnA.js:8-20`
  - 语音演示：点击麦克风按钮 → 显示“识别中/处理中” → 自动填充示例并触发回答：`src/components/QnA.js:24-52, 86-92`

- 价格预测
  - 选择品类/地区/时间 → 生成模拟价格数据与涨跌幅 → 表格与图示刷新
  - 列宽固定，避免内容波动导致布局抖动：`src/components/PricePrediction.js:134-139`, `src/styles/index.css:362-364`

- 政策建议
  - 左侧类别切换 + 顶部筛选（日期预设、作物、类型、关键词）
  - 推荐基于 FARMER_HISTORY 与筛选联动：`src/components/PolicyAdvice.js:36-42, 121-133`
  - 最新政策取日期倒序前 6 条：`src/components/PolicyAdvice.js:44-48, 143-160`
  - 详情对话框三段纵向展示：`src/components/PolicyAdvice.js:170-196`

## UI/UX 规范

- 主题色统一：按钮、标签、焦点、悬浮阴影采用绿系，强调一致的视觉语言：`src/styles/index.css:480-499, 487-490, 541, 573-574`
- 可读性优先：卡片与列表留白、字号层级、分割线使用轻量灰（避免视觉噪点）
- 反馈明确：按钮悬浮/按下态、卡片悬浮阴影、输入焦点光环
- 建议与历史：建议 Chips 有分步入场动效；历史项带图标与轻微悬浮反馈：`src/styles/index.css:243-256, 215-236`

## 可访问性（a11y）

- 键盘操作：政策侧边分类支持键盘 Enter/Space 切换：`src/components/PolicyAdvice.js:102-107`
- 语义化：对话框带 `role="dialog"` 与 `aria-modal`；图标按钮提供 `aria-label`/`title`：`src/components/PolicyAdvice.js:164`, `src/components/QnA.js:86-87`
- 可见焦点：输入与按钮保持可见焦点态（绿光环）

## 性能优化

- 计算缓存：`useMemo` 缓存推荐与最新列表的计算：`src/components/PolicyAdvice.js:36-42, 44-48`
- 表格固定布局：减少重排开销与列宽抖动：`src/styles/index.css:362-364`
- 资源加载：Webpack 生产构建启用压缩与指纹（按默认配置）

## 测试与质量保障（建议）

- 建议加入以下工具：
  - 单元测试：Jest + React Testing Library
  - 代码质量：ESLint（React/JSX 规则）、Prettier
  - 类型检查：TypeScript 或 JSDoc + VSCode 检查
- 脚本建议：
  - `npm run lint` → ESLint 检查
  - `npm run test` → Jest 测试
  - `npm run typecheck` → TS 类型检查
（当前未集成以上工具，待后续按需接入）

## 部署细节与注意事项

- `homepage` 必须指向你的 GitHub Pages 路径（包含仓库名）：`package.json:6`
- 构建输出 `publicPath` 为 `./`，保证相对路径资源可在二级路径访问：`webpack.config.js:9-14`
- 开发环境路由回退：`devServer.historyApiFallback: true`：`webpack.config.js:33-52`
- 动态 `basename` 处理 GitHub Pages 仓库级路径：`src/utils/routerBase.js:1-9`

## 安全与隐私

- 不在代码库中硬编码密钥或令牌
- 若接入后端接口，使用环境变量注入（构建时）并避免日志打印敏感信息
- 对话框与输入仅为前端演示，不采集真实语音或个人数据（语音演示为模拟）

## 国际化与本地化（建议）

- 目前界面为中文文案
- 若需要多语言支持，可引入轻量 i18n 方案（如 `i18next`），并将文案抽取为资源文件
- 路由、日期与数值格式需注意本地化一致性

## 主题与样式（建议）

- 建议将绿主题色抽取为 CSS 变量：
  - `--color-primary: #4CAF50`
  - `--color-primary-hover: #45a049`
  - `--color-primary-strong: #2e7d32`
  - `--color-primary-border: #b7e3c6`
  - `--color-primary-bg: rgba(76,175,80,0.08)`
- 在 `index.css` 中统一引用，后续可快速切换主题

## 集成与扩展（建议）

- 语音识别：浏览器 Web Speech API 或服务端 ASR（如科大讯飞、阿里云）
- 数据来源：价格/政策信息接入真实 API，并在组件内加入加载、错误与重试机制
- 分析与埋点：页面访问与交互路径统计，用于迭代优化（如 GA4/自建埋点）

## Roadmap（演进计划）

- v1.1
  - 接入价格数据的真实 API，完善图表展示
  - 政策详情支持原文拉取与下载保存
  - QnA 增加“答案来源/置信度”占位与组件结构
- v1.2
  - 引入 CSS 变量主题与暗色模式
  - 集成 ESLint/Jest 等质量工具与 CI
  - 语音识别真实接入与权限提示

## 故障排查

- 页面在 GitHub Pages 打开后不能跳转路由？
  - 检查 `homepage` 是否指向 `https://<用户名>.github.io/<仓库名>`：`package.json:6`
  - 确保 `basename` 已正确解析：`src/utils/routerBase.js:1-9`
  - 浏览器控制台有 404？确认 `publicPath` 为 `./`：`webpack.config.js:9-14`

- 价格表格列宽抖动？
  - 使用 `table-layout: fixed` + `colgroup` 明确列宽并对单元格启用省略：`src/components/PricePrediction.js:134-139`, `src/styles/index.css:362-364`

- 政策详情弹窗样式错乱？
  - 检查 `modal` 类名是否被其他全局样式覆盖；确保 `z-index` 足够（当前 1000）