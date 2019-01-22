//app.js
App({
  // onLaunch: function() {
  //   var that = this;
  //     wx.login({
  //       success: res => {
  //         if (res.code) {
  //           var d = that.globalData; //这里存储了appid、secret、token串  
  //           var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + d.appid + "&secret=" + d.secret + "&js_code=" + res.code+"&grant_type=authorization_code"
           

  //           wx.request({
  //             url: url,
  //             data: {
  //             },
  //             method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
  //             // header: {}, // 设置请求的 header  
             
  //             success: function(res) {
  //               console.log(url);
  //               // var obj = {};
  //               // obj.openid = res.data.openid;
  //               // obj.expires_in = Date.now() + res.data.expires_in;
  //               console.log(res.data.results);
  //             //  wx.setStorageSync('user', obj); //存储openid  
  //             }
  //           });
  //         } else {
  //           console.log('获取用户登录态失败！' + res.errMsg)
  //         }

  //       }
  //     })
    
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // globalData: {
  //   appid:'wxd60625fd15c65a54',
  //   secret:'09040b3004d6a8a1de743f45c7c31659'
  // }
})