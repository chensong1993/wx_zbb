//logs.js

Page({

  data:{
  //  canIUse: wx.canIUse('button.open-type.getUserInfo')
    userInfo:''
  },
  onLoad:function(){
    var that=this;
    var userInfos;
    wx.getUserInfo({
      success(res) {
         userInfos = res.userInfo
        console.log(res.userInfo.openId)
        console.log(res.userInfo.encryptedData)
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
    // //更改顶部标题
    // wx.setNavigationBarTitle({
    //   title: '个人中心'
    // })
    
  },

  onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  },
})