<h1 align="center">ESP-iMonitorAssay
</h1>

<div align="center">

实时数据库 ESP-isys7.0-iMonitorAssay

</div>

## 项目目录

```
- app             //桌面应用产物
- config            //配置
- dist              //WEB应用产物
- electron          //桌面应用脚本
- mock              //mock数据脚本
- public            //WEB应用静态资源
- resources         //桌面应用静态资源
- src               //应用主体
  - assets            //资源文件
  - components        //通用组件
  - e2e               //测试脚本
  - layout            //图层布局组件
  - locales           //国际化键值
  - model             //数据状态管理
  - pages             //页面文件
  - services          //网络请求文件
  - utils             //公共方法库
  - ^global.*         //全局样式及脚本
  - ^typings.d.ts     //类型声明
- ^main.js          桌面应用主进程脚本（需要分离脚本到electron目录下）
```

## 项目部署

1. 安装 nodejs
2. 部署前端项目并运行
   1. npm install tyarn
   2. tyarn
   3. npm start
3. 运行桌面应用程序
   1. 开发模式 npm run edev
   2. 生产环境
      1. npm run pack-win:prod
      2. 运行 build 目录下的 exe 应用程序
