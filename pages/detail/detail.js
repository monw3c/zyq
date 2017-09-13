//index.js
//获取应用实例
const util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
const WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    item:{},
    imagewidth:wx.getStorageSync('systemInfo').windowWidth,
    itemheight:'200',
    showLoading: true,
    modalHidden: true,
    modalMsg:"",
    itemId:"",
    pageTitle:"",
    pageImg:"",
    isfav:false,
    itemContent:"",
    boxHidden:true,
    focus:false,
    textareaValue:"",
    commentList:[]
  },
  imageLoad: function (e) { 
    var imageSize = util.imageUtil(e) 
    //console.log(imageSize)
    this.setData({ 
      imagewidth: imageSize.imageWidth, 
      imageheight: imageSize.imageHeight 
    }) 
  },
  clickImage: function (e) {
       let that = this,current = that.data.item.attributes.image,urls = [];
       //console.log(current)
       urls.push(current)
       wx.previewImage({
           current: current,
           urls: urls
       })
  },
  closeModal:function(){
      this.setData({
          modalHidden:true
      })
      wx.navigateBack()
  },
  showLoading:function(){
      this.setData({
          showLoading:true
      })
  },
  cancelLoading:function(){
      this.setData({
          showLoading:false
      })
  },
  commentTap: function(){
     const that = this,user = wx.getStorageSync('user'),userInfo = wx.getStorageSync('userInfo');

     if(user){

        this.setData({
          boxHidden:false,
          focus: true
        })

     }  else {

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
     }
      
  },
  boxCancel:function(e){
      this.setData({
          boxHidden:true,
          focus: false,
          textareaValue:""
      })
  },
  boxApply:function(e){
      let val = this.data.textareaValue,commentObj = {};
      const that = this,user = wx.getStorageSync('user'),userInfo = wx.getStorageSync('userInfo');
      
      commentObj = {
        name: userInfo.nickName,
        avater:userInfo.avatarUrl,
        date: util.convertDate(+new Date(),true),
        content:val,
        commentId:util.uuid()
      }
      //console.log(commentObj)
      //当前人的openid，头像，name，val对象存入List的commentList数组      
        if(user){
              let list = AV.Object.createWithoutData('List', that.data.itemId);
              list.add('commentList', commentObj)
              // 保存到云端
              list.save().then(function(result){
                console.log(result)
                //util.convertDate()
                that.data.commentList.unshift(result.attributes.commentList[0])
                console.log(that.data.commentList)
                that.setData({
                    commentList: that.data.commentList,
                    boxHidden: true,
                    focus: false,
                    textareaValue:"",
                    commentLen: that.data.commentList.length
                })
              })              
        } else {
            
        }
  },
  textareainput: function(e){
      let val = e.detail.value;
      this.setData({
         textareaValue : val
      })
  },
  isfav: function(){//点击收藏
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 800
      })
      const that = this
      that.setData({
        isfav:true
      })
      //that.fav(!that.data.isfav)
  },
  nofav: function(){//点击取消
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        duration: 800
      })
      const that = this
      that.setData({
        isfav:false
      })
      //that.fav(!that.data.isfav)
  },
  fav: function(type){//收藏action,'0'是取消'1'收藏
      const that = this,user = wx.getStorageSync('user');
        
        if(user){
                  //加入收藏纪录
                  var Fav = AV.Object.extend('Fav');
                  var fav = new Fav();
                  if(type == false){
                    
                    fav.set('userid', user.openid);
                    fav.set('itemid', that.data.itemId);
                    fav.set('title', item.attributes.title);
                    fav.set('source', item.attributes.source);
                    fav.set('image', item.attributes.image);
                    fav.set('date', item.attributes.date);
                    fav.set('content', item.attributes.content);
                    fav.set('dec', item.attributes.dec);
                    fav.set('views', item.attributes.views);
                    fav.set('isfav', that.data.isfav);
                    fav.save()
                  } else {
                    let fav = AV.Object.createWithoutData('Fav', that.data.itemId);
                    fav.set('isfav', that.data.isfav);
                    fav.save()
                  }
                
        }
       
  },
  onLoad: function(e){
    const that = this
    that.showLoading()
    that.setData({
        itemId:e.id
    })
  },
  onShow: function () {
    //console.log('onLoad')
    const that = this,
          user = wx.getStorageSync('user');
    that.showLoading()
    
    if(!AV){
      util.request({
          url:'http://localhost:3000/'+itemId,
          data:{},
          methods:'',
          success:function(res){
              //console.log(res.data)
              if(res.data.success == false ){
                that.setData({
                  modalHidden: false,
                  modalMsg:res.data.msg
                })
              } else {
                that.setData({
                  items:res.data.data
                })
                res.data.data.forEach(function(e){
                  wx.setNavigationBarTitle({ title: e.title})
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
      query.get(that.data.itemId).then(function (item) {
        
        // for (var i = 0; i < lists.length; i++) {
        //         var list = lists[i];
        //         console.log(list.attributes.title);
        // }
        if(!item){
                that.setData({
                  modalHidden: false,
                  modalMsg:'数据出错请重新尝试'
                })
        } else {
                let fav = AV.Object.createWithoutData('Fav', that.data.itemId);
                that.setData({
                  item:item,
                  itemContent:item.attributes.content,
                  pageTitle:item.attributes.title,
                  pageImg:item.attributes.image,
                  isfav: fav.attributes.isfav,
                  commentList:item.attributes.commentList,
                  commentLen: item.attributes.commentList.length
                })
                //console.log(that.data.item.attributes.content)
                WxParse.wxParse('article', 'html', that.data.itemContent, that);
                wx.setNavigationBarTitle({ title: item.attributes.title})
                
                //更新阅读数views item.attributes.views++
                let list = AV.Object.createWithoutData('List', that.data.itemId);
                list.set('views', item.attributes.views++)
                // 保存到云端
                list.save()

                if(user){
                  //加入历史纪录
                  var His = AV.Object.extend('History');
                  var his = new His();
                  his.set('userid', user.openid);
                  his.set('itemid', that.data.itemId);
                  his.set('title', item.attributes.title);
                  his.set('source', item.attributes.source);
                  his.set('image', item.attributes.image);
                  his.set('date', item.attributes.date);
                  his.set('content', item.attributes.content);
                  his.set('dec', item.attributes.dec);
                  his.set('views', item.attributes.views);
                  his.save()
                }
        }
        
      }).catch(function(error) {
            console.log(JSON.stringify(error));
            //console.log(that.data.items)
      });
      
    }
    
  },
  onShareAppMessage: function (res) {
    //console.log(res)
    return {
      title: this.data.pageTitle,
      path: 'pages/detail/detail?id='+this.data.itemId,
      imageUrl:this.data.pageImg,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})
