# React Webpack 模板

这是一个使用 Webpack 构建的 React 项目模板，可以帮助您快速开始 React 应用开发。

## 功能特点

- React 18
- Webpack 5 配置
- Babel 配置
- 开发服务器热重载
- CSS 加载支持
- 资源文件处理

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

这将启动开发服务器，并在浏览器中打开应用。

### 生产构建

```bash
npm run build
```

这将在 `dist` 目录中生成生产就绪的文件。

## 项目结构

```
react-webpack-template/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Content.js
│   │   └── Footer.js
│   ├── styles/
│   │   └── index.css
│   ├── App.js
│   └── index.js
├── .babelrc
├── package.json
├── webpack.config.js
└── README.md
```