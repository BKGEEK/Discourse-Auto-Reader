# Discourse 自动阅读帖子 V1

一个用于 **Discourse类论坛** 的 Tampermonkey 用户脚本，自动模拟真实用户行为来阅读帖子，从而增加已读帖子数量和阅读时长，减少人工点击操作，并降低被系统判定为异常的风险。

## ✨ 功能特点

- **自动寻找未读帖子**  
  支持首页懒加载，自动滚动加载更多帖子并检测未读状态。
- **模拟真实用户行为**  
  随机延迟、鼠标移动、平滑滚动，降低被识别为脚本的风险。
- **自动阅读并返回首页**  
  进入帖子后自动滚动到底部，停留一段时间后返回首页继续循环。
- **状态记忆**  
  使用 `GM_setValue` / `GM_getValue` 存储已读帖子列表和启用状态。
- **一键开关**  
  页面右下角悬浮按钮，可随时启用/关闭自动阅读。

## 📦 安装方法

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展。
2. 点击安装脚本（将本脚本代码粘贴到 Tampermonkey 新建脚本中保存）。
3. 这个脚本是基于 Nodeloc 编写的，使用其他 Discourse 类论坛可能需要微调。
4. 打开 [Discourse类论坛]列如(https://www.nodeloc.com/) 即可使用。

## 🛠 使用说明

- **启用/关闭**  
  点击右下角按钮切换状态：
  - 🟢 自动阅读启用中
  - ⚪ 自动阅读已关闭
- **运行逻辑**  
  - 在首页：自动滚动加载 → 找到未读帖子 → 延迟后进入
  - 在帖子页：滚动到底部 → 停留 → 返回首页
- **已读记录**  
  已读帖子会被记录，避免重复访问。

## ⚠️ 注意事项

- 本脚本仅供个人学习与研究使用，请勿用于违反网站规则的行为。
- 过于频繁的访问可能会触发网站的防刷机制，请合理设置延迟。
- 如果网站结构或样式更新，脚本可能需要调整选择器。

## 📜 元数据

```javascript
// @name         Discourse 自动阅读帖子 V1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Discourse 自动阅读帖子，模拟真实用户行为（防止出BUG）
// @author       GPT-5 Mike Leone
// @match        https://www.nodeloc.com/
// @match        https://www.nodeloc.com/t/topic/*
// @grant        GM_setValue
// @grant        GM_getValue
