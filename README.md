# 🎵 Songloft 正在播放

Songloft 正在播放是一款面向 [Songloft](https://github.com/songloft-org/songloft) 的沉浸式 3D 专辑卡片播放扩展。它用 3D 卡片的方式显示正在播放的歌曲与歌单，背景与底部律动颜色跟随当前封面的主题色，并自动适配 Songloft 的深色、浅色主题以及 PC、移动端视图。

> 🤖 本插件由 AI 生成。欢迎通过 GitHub Issues 反馈使用中遇到的问题与改进建议。

## 🔗 关于 Songloft

[Songloft](https://github.com/songloft-org/songloft) 是本插件所依赖的音乐服务项目。本插件基于 Songloft 提供的插件能力开发，是独立维护的扩展项目，并非 Songloft 主程序的内置组件。

- 上游项目：[songloft-org/songloft](https://github.com/songloft-org/songloft)
- 最低兼容版本：Songloft v2.10.0，且需要包含 Player API 更新
- 播放器始终是播放状态的唯一数据源，扩展不维护独立的播放队列或播放状态
- 依赖 `getState`、`onStateChange`、`play`、`togglePlay`、`prev`、`next` 与 `setPlayMode`
- 支持现代 Chromium WebView、桌面端鼠标与移动端触摸操作

## ✨ 功能亮点

### 3D 专辑卡片

- 将播放队列呈现为带封面、厚度和翻转动画的 3D 专辑卡片。
- 常规模式最多按需加载 30 张卡片，随机模式最多按需加载 50 张，避免长队列一次性创建全部 3D 资源。

### 播放控制

- 支持顺序播放、列表循环和随机播放三种空间布局。
- 左右拖动卡片切歌；随机模式同样支持拖动切换上一首或下一首。
- 点击当前卡片暂停或继续，暂停时卡片翻转并显示暂停符号。
- 右上角提供上一首、播放模式、收藏和下一首实体控制组。
- 收藏状态显示红心，并与 Songloft 内置收藏歌单同步。

### 主题与适配

- 背景和底部律动颜色跟随当前封面的主题色。
- 自动适配 Songloft 深色、浅色主题以及 PC、移动端视图。

## 📦 安装

1. 下载 [songloft-now-playing-1.0.0.jsplugin.zip](release/songloft-now-playing-1.0.0.jsplugin.zip)。
2. 打开 Songloft 插件管理页面。
3. 上传安装包并启用“正在播放”。

不要解压安装包，也不要上传源码 ZIP。

## 🛠️ 本地构建

项目不需要安装额外 npm 依赖，但构建环境需要 Node.js、`zip` 和 `unzip`。

```bash
npm run build
npm run validate
```

构建后的版本化插件安装包位于 `dist/` 目录，发布时会复制到 `release/` 目录随仓库发布。

开发调试：

```bash
npm run build
```

## 📄 许可证

本项目采用 [MIT](LICENSE) 开源许可证。Songloft 本身的授权与使用条款请以上游项目为准。
