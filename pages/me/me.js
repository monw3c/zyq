//index.js
//获取应用实例
const util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
const app = getApp()
Page({
  data: {
    userInfo: {},
    imagewidth:wx.getStorageSync('systemInfo').windowWidth,
    userId:""
  },
  //事件处理函数
  favClicked: function(e) {
    //console.log(e.currentTarget.dataset.id)
    var that = this,user = wx.getStorageSync('userInfo');
    //console.log(user)
    if(!user){  
          app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
            userInfo:userInfo
          })
          //that.update()
          //that.favClicked()
        },function(){
            
              //that.update()
        },'须授权登录才能操作，是否重新授权登录？')
    } else {
        wx.navigateTo({
          url: '../fav/fav'
        })
    }
    
  },
  aboutClicked: function(e) {
    //console.log(e.currentTarget.dataset.id)
    // var that = this,user = wx.getStorageSync('userInfo');
    // console.log(user)
    // if(!user){  
    //       app.getUserInfo(function(userInfo){
    //       //更新数据
    //       that.setData({
    //         userInfo:userInfo
    //       })
    //       //that.update()
    //       //that.favClicked()
    //     },function(){
            
    //           //that.update()
    //     },'须授权登录才能操作，是否重新授权登录？')
    // } else {
    //     wx.navigateTo({
    //       url: '../fav/fav'
    //     })
    // }
    wx.navigateTo({
          url: '../about/about'
    })
    
  },
  onShow: function() {
      var that = this,user = wx.getStorageSync('userInfo');
      if(!user){ 
          app.getUserInfo(function(userInfo){
            //更新数据
            that.setData({
              userInfo:userInfo
            })
            //that.update()
            
          },function(){
              
                //that.update()
          },'须授权登录才能操作，是否重新授权登录？')
      }
      
  },
  onLoad: function () {
    //console.log('onLoad')
    var that = this
  	//调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      
      
    },function(){
     
    },'须授权登录才能操作，是否重新授权登录？')
  }
})
