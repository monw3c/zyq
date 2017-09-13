//index.js
//获取应用实例
const util = require('../../utils/util.js');
const AV = require('../../utils/av-weapp-min.js');
//var apis = require('../../utils/apis.js');
const app = getApp();
Page({
  data: {
    imagewidth:wx.getStorageSync('systemInfo').windowWidth,
    itemheight:'200',
    showLoading:true,
    modalHidden: true,
    modalMsg:"",
    searchValue:"",
    items : [],
    show:false,
    page:0,
    pageSize:10,
    flag:false, //标识
    noDataHidden:true,
    bgfff:false
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
  // showLoading:function(){
  //     this.setData({
  //         showLoading:true
  //     })
  // },
  // cancelLoading:function(){
  //     this.setData({
  //         showLoading:false
  //     })
  // },
  focusSearch : function(){
      
  },
  searchChangeinput : function(e){
      let val = e.detail.value;
      this.setData({
         searchValue : val,
         page:0
      })
      //console.log(this.data.searchValue)
  },
  searchSubmit : function(){
     let val = this.data.searchValue;
     if(val){
      const that = this,
            user = wx.getStorageSync('user');
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
          items:[]
      })

      if(!AV){
          util.request({
            url:'http://localhost:3000/',
            data:{keyword:val,userId : user.openid},
            methods:'POST',
            success:function(res){
                console.log(res.data)
                if(res.data.success == false ){
                  that.setData({
                    modalHidden: true,
                    modalMsg:res.data.msg
                  })
                } else {
                  that.setData({
                    searchResult:res.data.data
                  })
                }
            },
            fail: function(){},
            complete: function(){}
          })
      } else {
      
        that.fetchLists(val)
        setTimeout(function(){
              wx.hideLoading()
        },500)
        
      }
      
     } else {
        this.setData({
           show:false
        })
     }
  },
  fetchLists: function(val){
        let query = new AV.Query('List'),that = this;
        query.contains('content', val)
        query.skip(that.data.pageSize*that.data.page);
        query.limit(that.data.pageSize);
        query.descending('createdAt');
        query.find().then(function (lists) {
          console.log(lists.length) 
            if(lists.length == 0 ){
                that.setData({
                  modalHidden: true,
                  modalMsg:'暂无数据'
                })
                if(that.data.items.length==0){
                    that.setData({
                        noDataHidden:false,
                        bgfff:true
                    })
                }
               //console.log(that.data.items) 
            } else {
                let incPage = that.data.page+1
                that.setData({
                  items:that.data.items.concat(lists),
                  page:incPage,
                  noDataHidden:true
                })
                //console.log(that.data.items)
            }
            
        }).catch(function(error) {
            // console.log(JSON.stringify(error));
            // console.log(that.data.items)
        })
  },
  onReachBottom: function () { // 加载更多
     let that = this
     that.fetchLists(that.data.searchValue)
     //console.log(that.data.searchValue)
  },
  onLoad: function () {
    //console.log('onLoad')
    let that = this
  	//调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      that.update()
    })
    
  }
})
