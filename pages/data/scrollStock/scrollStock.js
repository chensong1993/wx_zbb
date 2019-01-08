//index.js
//获取应用实例
Page({
  data: {
   page:"2",
    data:"",
    stockTitle: [{ id: 0, name: "当前价" }, { id: 1, name: "涨跌幅" }, { id: 2, name: "成交额" }, { id: 3, name: "成交量" }, { id: 4, name: "涨跌额" }, { id: 5, name: "营收(年)" }, { id: 6, name: "净利润(年)" }, { id: 7, name: "流通股本" }, { id: 8, name: "流通市值" }, { id: 9, name: "总股本" }, { id: 10, name: "总市值" }, { id: 11, name: "市盈率" }, { id: 12, name: "每股收益" }, { id: 13, name: "最高价" }, { id: 14, name: "最低价" }, { id: 15, name: "均价" }, { id: 16, name: "振幅" }]
  },

  onLoad: function(e) {
    var that = this;
    var url = "http://api.chinaipo.com/markets/v1/";
    wx.showNavigationBarLoading();

    //创新层
    wx.request({
      url: url + 'tchart/',
      method: 'GET',
      data: {
        baseIndex:"innovate",
        sortBy:"chng_pct",
        order:"des" ,
        page:"1"
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          innovate: res.data.results
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
  
   
  },
  onReachBottom:function(){
   
  },
  onRankingListData:function(page){
   
  },
})