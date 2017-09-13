//index.js
//获取应用实例
const util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
const app = getApp()
Page({
  data: {
    
  },
  onLoad: function () {
    
  },
  pay: function(e){

    wx.showModal({
                title: '提示',
                content: '保存到相册，再扫码支付？',
                showCancel: true,
                cancelText: "否",
                confirmText: "是",
                success: function(result) {
                  console.log(result)
                  if(result.confirm){
                      app.getUserInfo(function(userInfo){
                        wx.downloadFile({
                          url: 'http://ac-yvjkjytn.clouddn.com/fcde10daec929b188214.jpg',
                          success: function(r) {
                            console.log(r)
                            wx.saveImageToPhotosAlbum({
                                  filePath:r.tempFilePath,
                                  success(res) {
                                    //console.log(res)
                                    wx.showToast({
                                      title: '感谢您的支持',
                                      icon: 'success',
                                      duration: 2000
                                    })
                                  }
                              })
                          }
                        })
                        

                      },function(){
                      
                      },'须授权才能操作，是否重新授权？')
                  }
                    
                }
    })
    
    
  },
  onShareAppMessage: function (res) {
    console.log(res)
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
