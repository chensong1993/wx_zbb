//index.js
//获取应用实例
Page({
  data: {
   page:"1"
  },

  onLoad: function(e) {
    var that = this;
    var url = "http://api.chinaipo.com/markets/v1/";
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '正在加载 . . .',
    })
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
        wx.hideLoading();
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
    wx.setNavigationBarTitle({
      title: "行业统计",
    })
  },
  onHangyeIndex:function(e){
    var that=this;
    var item = e.target.dataset.index;
    var code = that.data.industry[item].indu_code_2;
    var name = that.data.industry[item].indu_name_2;
    console.log(code);
    wx.navigateTo({
      url: '../scrollStock/scrollStock?stockCode=' + code+"&index="+"3"+"&name="+name,
    })
  },
  onReachBottom:function(){
    var that = this;
    var url = "http://api.chinaipo.com/markets/v1/";
    wx.showNavigationBarLoading();
    ++that.data.page;
    wx.showLoading({
      title: '正在加载 . . .',
    })
    //行业统计
    wx.request({
      url: url + 'statistics' + '/industry/',
      method: 'GET',
      data: {
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        if(res.data.results!=undefined){
        var data = that.data.industry;
        var data1 = data.concat(res.data.results);
        if (that.data.industry)
        that.setData({
          industry: data1
        })
        } else {
          wx.showToast({
            title: '已加载全部',
            icon: "none"
          })
        }
        console.log(data1);
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