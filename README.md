# 正在播放 · Now Playing

[![Version](https://img.shields.io/badge/version-1.0.0-45a6a6)](https://github.com/charce526/songloft-now-playing)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

沉浸式3D专辑卡片播放扩展，用来3D卡片的方式显示正在播放的歌曲和歌单。

这是一个基于 Songloft JS Plugin SDK、Three.js 和 #285 Player API 构建的 Songloft 扩展。播放器始终是播放状态的唯一数据源，扩展不会维护独立的播放队列或播放状态。

## 功能

- 将播放队列呈现为带封面、厚度和翻转动画的 3D 专辑卡片。
- 支持顺序播放、列表循环和随机播放三种空间布局。
- 左右拖动卡片切歌；随机模式同样支持拖动切换上一首或下一首。
- 点击当前卡片暂停或继续，暂停时卡片翻转并显示暂停符号。
- 右上角提供上一首、播放模式、收藏和下一首实体控制组。
- 收藏状态显示红心，并与 Songloft 内置收藏歌单同步。
- 背景和底部律动颜色跟随当前封面的主题色。
- 自动适配 Songloft 深色、浅色主题以及 PC、移动端视图。
- 常规模式最多按需加载 30 张卡片，随机模式最多按需加载 50 张，避免长队列一次性创建全部 3D 资源。

## 安装

1. 下载 [songloft-now-playing-1.0.0.jsplugin.zip](dist/songloft-now-playing-1.0.0.jsplugin.zip)。
2. 打开 Songloft 插件管理页面。
3. 上传该 `.jsplugin.zip` 文件。
4. 从插件入口打开“正在播放”。

不要解压安装包，也不要上传源码 ZIP。

## 使用

- 拖动卡片：切换歌曲。
- 点击中央卡片：暂停或继续播放。
- 点击右上角 `‹` / `›`：上一首或下一首。
- 点击右上角播放模式控件：依次切换顺序、列表循环和随机播放。
- 点击右上角心形控件：收藏或取消收藏当前歌曲。

## 兼容性

- 需要包含 [Songloft #285](https://github.com/songloft-org/songloft/issues/285) Player API 更新的 Songloft 版本。
- 依赖 `getState`、`onStateChange`、`play`、`togglePlay`、`prev`、`next` 和 `setPlayMode`。
- 支持现代 Chromium WebView、桌面端鼠标和移动端触摸操作。

## 本地构建

项目不需要安装额外 npm 依赖，但构建环境需要 Node.js、`zip` 和 `unzip`。

```bash
npm run build
npm run validate
```

构建后会生成：

- `dist/songloft-now-playing-1.0.0.jsplugin.zip`：带版本号的正式安装包。
- `dist/songloft-now-playing.jsplugin.zip`：便于本地更新测试的无版本别名，不提交到仓库。

## 项目结构

```text
plugin.json             插件清单
src/main.js             Songloft 插件入口
static/app.js           Player 桥接、Three.js 场景与交互
static/index.html       插件页面
static/*.css            主题、可读性和底部律动样式
static/icon.svg         插件图标
static/vendor/          Three.js 本地依赖
scripts/build.mjs       构建脚本
scripts/validate.mjs    发布包验证脚本
```

## 1.0.0

- 正式统一项目标识为 `songloft-now-playing`。
- 正式中文名为“正在播放”，英文名为“Now Playing”。
- 完成深色/浅色、PC/移动端和长播放队列适配。
- 完成三种播放模式、卡片暂停翻转、收藏和主题色律动。
- 构建产物正式命名为 `songloft-now-playing-1.0.0.jsplugin.zip`。

## License

[MIT](LICENSE) © 2026 charce526
