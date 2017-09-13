//index.js
//获取应用实例
const util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
//var apis = require('../../utils/apis.js');
const app = getApp();
Page({
  data: {
    items:[
      // { 'title': 'zfeig', 'source': '四川成都', 'date': '2014-10-23', 'image': '/public/images/25c.jpg'} 
    ],
    imagewidth:wx.getStorageSync('systemInfo').windowWidth,
    windowHeight:wx.getStorageSync('systemInfo').windowHeight,
    itemheight:'200',
    //showLoading:true,
    modalHidden: true,
    modalMsg:"",
    searchValue:"",
    page:0,
    pageSize:10,
    flag:false //标识
  },
  //事件处理函数
  godetail: function(e) {
    //console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id='+id
    })
  },
  imageLoad: function (e) { 
    const imageSize = util.imageUtil(e) 
    //console.log(imageSize)
    this.setData({ 
      imagewidth: imageSize.imageWidth, 
      imageheight: imageSize.imageHeight 
    }) 
  },
  focusSearch : function(){
      wx.navigateTo({
        url: '../search/search'
      })
  },
  onLoad: function () {
    
    this.fetchLists('0')
    
  },
  fetchLists: function(t){
    setTimeout(function(){
        wx.stopPullDownRefresh()
    },1000)
    
    let that = this
    if(t=="0"){
        wx.showLoading({
          title: '加载中',
        })
    }
    
    if(!AV){
      util.request({
          url:'http://localhost:3000/',
          data:{},
          methods:'',
          success:function(res){
              console.log(res.data)
              if(res.data.success == false ){
                that.setData({
                  modalHidden: true,
                  modalMsg:res.data.msg
                })
              } else {
                that.setData({
                  items:res.data.data
                })
              }
              //that.cancelLoading()
          },
          fail: function(){},
          complete: function(){}
      })
    } else {
    // 调用leancloud数据存储
      let query = new AV.Query('List');
      query.skip(that.data.pageSize*that.data.page);
      query.limit(that.data.pageSize);
      query.descending('createdAt');
      query.notEqualTo('image','http://ac-yvjkjytn.clouddn.com/f7f8fe18437c44b1cb70.jpg').find().then(function (lists) {
        
        // for (var i = 0; i < lists.length; i++) {
        //         var list = lists[i];
        //         console.log(list.id);
        // }
        if(lists.length == 0 ){
                that.setData({
                  modalHidden: true,
                  modalMsg:'暂无数据'
                })
        } else { 
                let incPage = that.data.page+1
                if(t=='0'){
                  that.setData({
                    items:that.data.items.concat(lists),
                    page:incPage
                  }) 
                } else if(t=='1'&&that.data.page=='0'){
                  that.setData({
                    items:lists,
                    page:incPage
                  })
                }
        }
        wx.hideLoading()
        
      }).catch(function(error) {
            // console.log(JSON.stringify(error));
            // console.log(that.data.items)
      });
    }
  },
  onPullDownRefresh: function () {
    this.setData({
          page:0
    })
    this.fetchLists('1')
  },
  onReachBottom: function () {
     this.fetchLists('0');
  },
  onShareAppMessage: function (res) {
    //console.log(res)
    return {
      title: '中医圈--您的知识圈',
      path: 'pages/index/index',
      imageUrl:'../../images/logo.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})
