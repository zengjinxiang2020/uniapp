# 使用说明

## 安装步骤
- 先从私服上clone下来项目
- 下载uni的开发者工具 https://www.dcloud.io/hbuilderx.html
- 登录微信开发者工具打开 菜单 > 设置 > 安全设置  勾选服务端口为开启
- 命令行进入项目所在的目录，点击 hbuilderx > 菜单 > 运行 > 运行到小程序模拟器 > 微信开发者工具
- uni会自动打开微信开发者工具并且打开uni的项目

## 注意事项
- manifest.json 中可以配置uni项目的一些信息
- 打开manifest.json可配置小程序的 appid
- 由于需要兼容app，公共样式由 main.js 迁移到了 App.vue，公共样式请在App.vue中进行编辑
- 由于需要兼容app，尺寸单位由之前的rem改为rpx，由于修改样式工作量太大并且容易出错，已将.css更改为.less并在其中以之前rem的单位*100，获得新的rpx单位
- 如需修改样式问题，请编辑.less的文件，请勿编辑.css的文件

## 声明
- 此阶段的uni项目app端只是可以运行界面，还无法进行正常的登录以及分享和支付操作
- 小程序端暂时90%的功能及界面正常，相关代码后面兼容app时会做一些调整
- 运行app项目ios需要安装xcode，安卓需要装安卓的sdk以及安卓模拟器，建议安卓安装genymotion  https://www.genymotion.com/  登录时可选择私人使用，勾选后无需付费


