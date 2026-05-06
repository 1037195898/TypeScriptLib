# TypeScriptLib - LayaBox游戏开发框架

## 项目概述

TypeScriptLib是一个基于LayaAir引擎的专业游戏开发框架，包含两个核心子项目：TSCore（核心框架）和GameLib（游戏业务库）。该框架提供了完整的游戏开发解决方案，涵盖从基础工具库到高级游戏业务逻辑的全方位支持。

## 核心特性

### 🎮 完整的游戏开发生态
- **TSCore**: 提供底层核心框架和工具库
- **GameLib**: 封装游戏业务逻辑和常用组件
- **统一入口**: 通过npm包统一管理和使用

### 🔧 技术优势
- 基于TypeScript开发，提供完整的类型安全支持
- 深度集成LayaAir游戏引擎
- 内置FairyGUI界面系统支持
- 支持Spine骨骼动画
- 提供完善的资源管理和加载机制

### 📱 平台适配
- 支持移动端和PC端多平台部署
- 自动屏幕适配和分辨率处理
- 刘海屏等特殊设备兼容

## 项目结构

```
TypeScriptLib/
├── TSCore/           # 核心框架库
├── GameLib/          # 游戏业务库
├── libs/             # 第三方依赖库
├── template/         # 模板和工具文件
├── webp/             # 图片格式转换工具
├── assets/           # 配置资源文件
└── dist/             # 编译输出目录
```

## 快速开始

### 安装方式

```bash
# 通过npm安装
npm install game-lib

# 或者通过yarn安装
yarn add game-lib
```

### 基础使用

```typescript
import { App } from 'game-lib';

// 初始化应用
App.run({
    onRun: async () => {
        console.log('应用启动');
    },
    onEngine: async () => {
        console.log('引擎初始化完成');
    },
    onEnd: () => {
        console.log('初始化完成');
    }
});
```

## 子项目介绍

### TSCore - 核心框架
提供基础的框架支撑，包括：
- 应用生命周期管理
- 事件系统和消息机制
- 资源加载和管理
- 配置系统
- 工具函数库

### GameLib - 游戏业务库
封装游戏相关业务逻辑，包括：
- 游戏场景管理
- 游戏数据模型
- UI组件系统
- 网络通信
- 游戏特效系统

## 文档目录

- [📘 项目总览文档](./Documentation.md) - 完整的项目介绍和技术文档
- [📁 TSCore文档](./TSCore-docs/) - 核心框架详细文档
- [📁 GameLib文档](./GameLib-docs/) - 游戏业务库详细文档
- [📁 共享资源](./Shared-Resources/) - 通用API和集成指南

## 开发环境要求

- Node.js >= 14.0.0
- TypeScript >= 4.0.0
- LayaAir Engine >= 2.0.0
- FairyGUI >= 5.0.0

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 支持

如有问题，请联系项目维护团队或查看相关文档。