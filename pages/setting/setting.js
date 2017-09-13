//index.js
//获取应用实例
const util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
const app = getApp()
Page({
  data: {
    userInfo: {},
    tabs: ["我的收藏", "阅读历史"],
    activeIndex: 0,
    sliderOffset: 0,
    favdata:[], //收藏数据列表
    historydata:[], //历史数据列表
    flag:true,
    windowWidth:wx.getStorageSync('systemInfo').windowWidth,
    windowHeight:wx.getStorageSync('systemInfo').windowHeight,
    userId:""
  },
  bindChange: function (e) {
        var that = this;
        console.log(e.detail)
        var curIndex = e.detail.current;
        that.setData({
            sliderOffset: curIndex * that.mTabWidth,
            activeIndex: curIndex
        });
        that.fetchTabData(curIndex)
  },
  tabClick: function (e) {
        var that = this;
        var cIndex = e.currentTarget.id;
        that.setData({
            sliderOffset: cIndex * that.mTabWidth,
            activeIndex: cIndex
        });
  },
  //事件处理函数
  onArticleClicked: function(e) {
    //console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id='+id
    })
  },
  onLoad: function () {
    //console.log('onLoad')
    var that = this
  	//调用应用实例的方法获取全局数据
    wx.getSystemInfo({
            success: function (res) {
                that.mTabWidth = res.windowWidth / that.data.tabs.length;
            }
    });
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userId:wx.getStorageSync('user').openid,
        userInfo:userInfo
      })
      that.update()
    })
    that.fetchTabData('0')
  },
  fetchData:function(t){  //生成数据
      const that = this;
      wx.showLoading({
        title: '加载中',
      })

    if(t=="1"){//历史纪录
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
          let query = new AV.Query('History');
          query.descending('updatedAt').equalTo('userid', that.data.userId).find().then(function (lists) {
            
            // for (var i = 0; i < lists.length; i++) {
            //         var list = lists[i];
            //         console.log(list.id);
            // }
            //console.log(lists.length)
            if(lists.length == 0 ){
                    that.setData({
                      // modalHidden: true,
                      // modalMsg:'暂无数据',
                      flag:false
                    })
            } else {
                    that.setData({
                      historydata:lists,
                      flag:true
                    })
                    //console.log(that.data.show)
            }
            
          }).catch(function(error) {
                console.log(JSON.stringify(error));
                console.log(that.data.items)
          });
          setTimeout(function(){
              wx.hideLoading()
          },500)
        }
        return;
     } else if(t=="0"){
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
          let query = new AV.Query('Fav');
          query.descending('updatedAt').equalTo('userid', that.data.userId).find().then(function (lists) {
            
            // for (var i = 0; i < lists.length; i++) {
            //         var list = lists[i];
            //         console.log(list.id);
            // }
            //console.log(lists.length)
            if(lists.length == 0 ){
                    that.setData({
                      // modalHidden: true,
                      // modalMsg:'暂无数据',
                      flag:false
                    })
            } else {
                    that.setData({
                      favdata:lists,
                      flag:true
                    })
                    //console.log(that.data.show)
            }
            
          }).catch(function(error) {
                console.log(JSON.stringify(error));
                console.log(that.data.items)
          });
          setTimeout(function(){
              wx.hideLoading()
          },500)
        }
        setTimeout(function(){
              wx.hideLoading()
        },500)
        return;
     }
  },
  fetchTabData:function(i){
    //console.log(Number(i));
    switch(Number(i)) {
      case 0:
        this.fetchData('0')
        break;
      case 1:
        this.fetchData('1')
        break;
      default:
        return;
    }
  }
})
