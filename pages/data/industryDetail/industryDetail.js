//index.js
//获取应用实例
Page({
  data: {
   
  },

  onLoad: function(e) {
    var that = this;
    var url = "http://api.chinaipo.com/markets/v1/";
    wx.showNavigationBarLoading();
   
    //行业统计
    wx.request({
      url: url + 'statistics' + '/industry/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          industry: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
  },

  onPullDownRefresh:function(){
    this.onLoad();
  }

})