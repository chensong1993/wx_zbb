//index.js
//获取应用实例
Page({
  data: {
    areaIndex:[0,1,2,3,4,5],
    page:2
  },

  onLoad: function(e) {
    console.log(e.type);
    var that=this;
    var url = "http://api.chinaipo.com/markets/v1/";
    var type="";
    if (e.type==undefined){
      type = that.data.type;
    }else{
      type = e.type;
      that.data.type = e.type;
    }
    var title="挂牌公司";
    switch (type){
      case "1":
        //公司分布
        wx.request({
          url: url + 'statistics' + '/area/',
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
              area: res.data.results,
              type:1
            })
            console.log(res.data.results);
            wx.hideNavigationBarLoading();
          },
          fail() {
            wx.hideNavigationBarLoading();

          }
        })
        //公司分布
        wx.request({
          url: url + 'statistics' + '/area/',
          method: 'GET',
          data: {
              page:2
          },
          header: {
            'content-type': 'application/json' // 默认值 
          },
          complete() {

          },
          success(res) {
            var area = that.data.area;
            var area1 = area.concat(res.data.results);
            that.setData({
              area: area1,
              type: 1
            })
            console.log(res.data.results);
            wx.hideNavigationBarLoading();
          },
          fail() {
            wx.hideNavigationBarLoading();

          }
        })
        title="地区分布";
      break;
      case "2":

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
              area: res.data.results,
              type:2
            })
            console.log(res.data.results);
            wx.hideNavigationBarLoading();
          },
          fail() {
            wx.hideNavigationBarLoading();

          }
        })
        //行业统计
        wx.request({
          url: url + 'statistics' + '/industry/',
          method: 'GET',
          data: {
              page:"2"
          },
          header: {
            'content-type': 'application/json' // 默认值 
          },
          complete() {

          },
          success(res) {
            var area = that.data.area;
            var area1 = area.concat(res.data.results);
            that.setData({
              area: area1,
              type: 2
            })
            console.log(res.data.results);
            wx.hideNavigationBarLoading();
          },
          fail() {
            wx.hideNavigationBarLoading();

          }
        })
        title = "行业分布";
      break; 
    }
    wx.setNavigationBarTitle({
      title: title,
    })
  },
  onPullDownRefresh(){
    this.onLoad(this);
  },
  onReachBottom:function(){
    var that=this;
    ++that.data.page
    wx.showNavigationBarLoading();
    console.log(that.data.page)
    console.log(that.data.type)
    var url = "http://api.chinaipo.com/markets/v1/";
    switch (that.data.type) {
      case 1:
        //公司分布
        wx.request({
          url: url + 'statistics' + '/area/',
          method: 'GET',
          data: {
            page: that.data.page
          },
          header: {
            'content-type': 'application/json' // 默认值 
          },
          complete() {

          },
          success(res) {
            if (res.data.results!=undefined){
            var area = that.data.area;
            var area1 = area.concat(res.data.results);
            that.setData({
              area: area1,
              type: 1
            })
            }
            console.log(res.data.results);
            wx.hideNavigationBarLoading();
          },
          fail() {
            wx.hideNavigationBarLoading();

          }
        })
        console.log(1)
        break;
      case 2:
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

          },
          success(res) {
            if (res.data.results != undefined) {
            var area = that.data.area;
            var area1 = area.concat(res.data.results);
            that.setData({
              area: area1,
              type: 2
            })
            }
            console.log(res.data.results);
            wx.hideNavigationBarLoading();
          },
          fail() {
            wx.hideNavigationBarLoading();

          }
        })
        console.log(2)
        break;
    }
  },
})