function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();
  
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function imageUtil(e) { 
  var imageSize = {}; 
  var originalWidth = e.detail.width;//图片原始宽 
  var originalHeight = e.detail.height;//图片原始高 
  var originalScale = originalHeight/originalWidth;//图片高宽比 
  //  console.log('originalWidth: ' + originalWidth) 
  //  console.log('originalHeight: ' + originalHeight) 
  //获取屏幕宽高 
  wx.getSystemInfo({ 
    success: function (res) { 
    var windowWidth = res.windowWidth; 
    var windowHeight = res.windowHeight; 
    var windowscale = windowHeight/windowWidth;//屏幕高宽比 
    //  console.log('windowWidth: ' + windowWidth) 
    //  console.log('windowHeight: ' + windowHeight) 
    if(originalScale < windowscale){//图片高宽比小于屏幕高宽比 
      //图片缩放后的宽为屏幕宽 
      imageSize.imageWidth = windowWidth; 
      imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth; 
    }else{//图片高宽比大于屏幕高宽比 
      //图片缩放后的高为屏幕高 
      imageSize.imageHeight = windowHeight; 
      imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight; 
    } 
      
    } 
  }) 
  //  console.log('缩放后的宽: ' + imageSize.imageWidth) 
  //  console.log('缩放后的高: ' + imageSize.imageHeight) 
  //console.log(imageSize)
  return imageSize; 
} 

function request(params){
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  })
  wx.request({
    url: params.url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      params.success && params.success(res)
      wx.hideToast()
    },
    fail: (res) => {
      params.fail && params.fail(res)
      wx.hideToast()
    },
    complete: (res) => {
      params.complete && params.complete(res)
      wx.hideToast()
    }
  })
}

function convertDate(str, hasMS) {
			var hm = "";
			var date = new Date(str);
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = date.getDate() + ' ';
			var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
			var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			hm = hasMS ? h + m : "";
			return Y + M + D + hm; //Y+M+D+h+m+s
}

function uuid() {
	return "zyq-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

module.exports = {
  formatTime: formatTime,
  imageUtil: imageUtil,
  request: request,
  uuid: uuid,
  convertDate: convertDate
}
