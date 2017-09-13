//app.js
const AV = require('./utils/av-weapp-min.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    let logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    AV.init({ 
      appId: '', //配置自己的leancloud
      appKey: '', //配置自己的leancloud
    });
    wx.getSystemInfo({ 
      success: function (res) { 
        wx.setStorageSync('systemInfo', {windowWidth:res.windowWidth,windowHeight:res.windowHeight});
      }
    })
  },
  getUserInfo:function(){
    var that = this;
    var sucess = arguments[0] ? arguments[0] : function(){};//登录成功的回调
    var fail = arguments[1] ? arguments[1] : function(){};//登录失败的回调
    var title = arguments[2] ? arguments[2] : '授权登录失败，部分功能将不能使用，是否重新登录？';//当用户取消授权登录时，弹出的确认框文案

    if(that.globalData.userInfo){
      typeof sucess == "function" && sucess(that.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (r) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo;
              typeof sucess == "function" && sucess(that.globalData.userInfo)
              wx.setStorageSync('userInfo', res.userInfo);
              that.auth(r)
            },
            fail:function(res){
              wx.showModal({
                title: '提示',
                content: title,
                showCancel: true,
                cancelText: "否",
                confirmText: "是",
                success: function(res) {
                  if (res.confirm) {
                    if (wx.openSetting) {
                      wx.openSetting({
                        success: (res) => {
                          if (res.authSetting["scope.userInfo"]) { //如果用户重新同意了授权登录
                            console.log(res)
                            wx.getUserInfo({
                              success: function (res) {
                                //console.log(res)
                                that.globalData.userInfo = res.userInfo;
                                typeof sucess == "function" && sucess(that.globalData.userInfo)
                                wx.setStorageSync('userInfo', res.userInfo);
                                that.auth(r)
                              }
                            })
                          } else { //用户还是拒绝
                            fail()
                          }
                        },
                        fail: function() { //调用失败，授权登录不成功
                          fail()
                        }
                      })
                    } else {
                      fail()
                    }
                  }
                },
                fail:function(){
                  fail()
                }
              })
            }
          })
          
        }
      });
    }
    
  },
  auth:function(r){
      let that = this;
      let d = that.globalData.authorizationCode;
      let l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + r.code + '&grant_type=authorization_code';
      wx.request({
        url: l,
        data: {},
        method: 'GET',
        // header: {}, // 设置请求的 header    
        success: function(res) {
          let obj = {};
          obj.openid = res.data.openid;
          obj.expires_in = Date.now() + res.data.expires_in;
          //console.log(res);  
          wx.setStorageSync('user', obj); //存储openid    
        }
      });
  }, 
  globalData:{
    userInfo:null,
    authorizationCode:{  
        appid:'',//配置自己的小程序id
        secret:''//配置自己的
    }
  }
})



