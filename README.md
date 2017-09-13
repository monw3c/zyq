# 中医圈
一个关于中医知识文章小程序，后台已移植到leancloud，爬虫数据和后台不方便开放<del>(后台基于Koa2和mongoose，爬虫抓取数据保存于mongodb)</del>


# 如何启动
<del>1. ./mongod 和 mongo 启动连接数据库，打开robomongo客户端</del>  
<del>2. npm start启动koa2</del>  
1. 打开app.js配置id
2. 打开小程序开发中工具调试  


# TODO
- [x] 文章列表
- [x] 详情页
- [x] 爬虫数据
- [x] 文章搜索
- [x] 后台接口
- [x] 阅读历史
- [x] 关于我们
- [x] 评论
- [ ] 个人收藏
- [ ] 小程序Https服务部署 可以参考 http://www.ifanr.com/minapp/779677 也可以用阿里云或第三方云的免费https
- [ ] 第二期新功能


# 一些不知是不是bug的问题
1. 调用onPullDownRefresh时候，界面不要出现遮罩层（wx.showLoading之类），不然会抖动（不知是否是触发到层的关系）
2. 体验上舒服，可以延迟一下回弹
```js
setTimeout(function(){
    wx.stopPullDownRefresh()
},1000)
```
3. 小程序对个人申请的小程序审核还是比较严格，涉及个人小程序未允许内容：文娱-资讯，是没法上线的...


# 界面截图
<img src="https://github.com/monw3c/zyq/blob/master/pic/4.pic.jpg" width="200"> <img src="https://github.com/monw3c/zyq/blob/master/pic/5.pic.jpg" width="200"> <img src="https://github.com/monw3c/zyq/blob/master/pic/6.pic.jpg" width="200"> <img src="https://github.com/monw3c/zyq/blob/master/pic/8.pic.jpg" width="200"> <img src="https://github.com/monw3c/zyq/blob/master/pic/7.pic.jpg" width="200">

# 您的鼓励是我持续开源的动力：）
<img src="https://github.com/monw3c/angularjs_pingan/blob/master/images/3.pic.jpg" width="300">
