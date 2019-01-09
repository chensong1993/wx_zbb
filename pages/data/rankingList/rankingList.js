//index.js
//获取应用实例
Page({
  data: {
   page:"2",
    data:""
  },

  onLoad: function(e) {
    var that = this;
    var index;
    var url = "http://api.chinaipo.com/markets/v1/statistics/";
    if (e.index==undefined){
      index = that.data.index;
    }else{
      index = e.index;
      that.data.index = e.index;
    }
    
    var nacigationTitle;
    wx.showNavigationBarLoading();
    switch (that.data.index) {
      case "4":
        url = url + "investor/";
        nacigationTitle="主办券商";
        break;
      case "5":
        url = url + "dealer/";
        nacigationTitle="做市商";
        break;
      case "6":
        url = url + "lawyer/";
        nacigationTitle="律师事务所";
        break;
      case "7":
        url = url + "accountant/";
        nacigationTitle="会计事务所";
        break;
    }
    wx.setNavigationBarTitle({
      title: nacigationTitle,
    })
    that.setData({
      index: that.data.index
    })
    //排行榜
    wx.request({
      url: url,
      method: 'GET',
      data: {
        page: "1"
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        // rankingData += rankingData;

        that.setData({
          typeData: res.data.results
        })
        // console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //排行榜
    wx.request({
      url: url,
      method: 'GET',
      data: {
        page: "2"
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        var  rankingData = that.data.typeData;
        var rankingData1=rankingData.concat(res.data.results);
        that.setData({
          typeData: rankingData1
        })
        console.log(rankingData1);
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
      fail() {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();

      }
    })
  },
  onRankingIndex:function(e){
    var that=this;
    var index = that.data.index;
    //列表的下标
    var item = e.target.dataset.index;
    var code = that.data.typeData[item].org_code;
    wx.navigateTo({
      url: '../scrollStock/scrollStock?stockCode=' + code + "&index=" + index,
    })
  },
  onPullDownRefresh:function(){
    this.onLoad(this);
   
  },
  onReachBottom:function(){
    this.onRankingListData(++this.data.page);
  },
  onRankingListData:function(page){
    var that = this;
    var url = "http://api.chinaipo.com/markets/v1/statistics/";
    var addMore;
    //var index = e.index;
   // console.log(index + "===============");
    wx.showNavigationBarLoading();
    switch (that.data.index) {
      case "4":
        url = url + "investor/";
        break;
      case "5":
        url = url + "dealer/";
        break;
      case "6":
        url = url + "lawyer/";
        break;
      case "7":
        url = url + "accountant/";
        break;
    }

    that.setData({
      index: that.data.index
    })
    wx.showLoading({
      title: '正在加载 . . .',
    })
    //排行榜
    wx.request({
      url: url,
      method: 'GET',
      data: {
        page: page
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) { 
        if (res.data.results != undefined){
          var rankingData = that.data.typeData;
          var rankingData1 = rankingData.concat(res.data.results);
          that.setData({
            typeData: rankingData1
          })
         
        } else {
          wx.showToast({
            title: '已加载全部',
            icon:"none"
          })
        }
        console.log(rankingData1);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();
      }
    })
  },
})