var util = require("../../../utils/util.js");
Page({
  data: {
    page: "2",
    data: "",
    buttonClicked: true,
    LoadMores: -1
  },

  onLoad: function(e) {
    var that = this;
    var index;
    var url = "http://api.chinaipo.com/markets/v1/statistics/";
    if (e.index == undefined) {
      index = that.data.index;
    } else {
      index = e.index;
      that.data.index = e.index;
    }
  that.setData({
    page:1
  })
    var nacigationTitle;
    wx.showNavigationBarLoading();
    switch (that.data.index) {
      case "4":
        url = url + "investor/";
        nacigationTitle = "主办券商";
        break;
      case "5":
        url = url + "dealer/";
        nacigationTitle = "做市商";
        break;
      case "6":
        url = url + "lawyer/";
        nacigationTitle = "律师事务所";
        break;
      case "7":
        url = url + "accountant/";
        nacigationTitle = "会计事务所";
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
          typeData: res.data.results,
          LoadMores: -1
        })
        // console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();
        that.setData({
          LoadMores: -1
        })
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
        var rankingData = that.data.typeData;
        var rankingData1 = rankingData.concat(res.data.results);
        that.setData({
          typeData: rankingData1,
          LoadMores: -1
        })
        console.log(rankingData1);
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
      fail() {
        that.setData({
          LoadMores: -1
        })
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();

      }
    })
  },
  onRankingIndex: function(e) {
    var that = this;
    if (that.data.buttonClicked) {
      var index = that.data.index;
      //列表的下标
      var item = e.target.dataset.index;
      var code = that.data.typeData[item].org_code;
      wx.navigateTo({
        url: '../scrollStock/scrollStock?stockCode=' + code + "&index=" + index,
      })
    }
    util.buttonClicked(this);
  },
  onPullDownRefresh: function() {
    this.onLoad(this);

  },
  onReachBottom: function() {
    ++this.data.page
    var that = this;
    var url = "http://api.chinaipo.com/markets/v1/statistics/";
    var addMore;
    this.setData({
      LoadMores: 1
    })
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
      index: that.data.index,
      LoadMores: 1
    })

    //排行榜
    wx.request({
      url: url,
      method: 'GET',
      data: {
        page: this.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
      },
      success(res) {
        if (res.data.results != undefined) {
          var rankingData = that.data.typeData;
          var rankingData1 = rankingData.concat(res.data.results);
          that.setData({
            typeData: rankingData1,
            LoadMores: -1
          })
        } else {
          that.setData({
            LoadMores: 2
          })

        }
        console.log(rankingData1);
        wx.hideNavigationBarLoading();
      },
      fail() {
        that.setData({
          LoadMores: 2
        })
        wx.hideNavigationBarLoading();
      }
    })
  },
  // onRankingListData: function(page) {
  //   var that = this;
  //   var url = "http://api.chinaipo.com/markets/v1/statistics/";
  //   var addMore;
  //   //var index = e.index;
  //   // console.log(index + "===============");
  //   wx.showNavigationBarLoading();
  //   switch (that.data.index) {
  //     case "4":
  //       url = url + "investor/";
  //       break;
  //     case "5":
  //       url = url + "dealer/";
  //       break;
  //     case "6":
  //       url = url + "lawyer/";
  //       break;
  //     case "7":
  //       url = url + "accountant/";
  //       break;
  //   }

  //   that.setData({
  //     index: that.data.index,
  //     LoadMores: 1
  //   })
  
  //   //排行榜
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     data: {
  //       page: page
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值 
  //     },
  //     complete() {
  //     },
  //     success(res) {
  //       if (res.data.results != undefined) {
  //         var rankingData = that.data.typeData;
  //         var rankingData1 = rankingData.concat(res.data.results);
  //         that.setData({
  //           typeData: rankingData1,
  //           LoadMores: -1
  //         })

  //       } else {
  //         that.setData({
  //           LoadMores: 2
  //         })
         
  //       }
  //       console.log(rankingData1);
  //       wx.hideNavigationBarLoading();
  //     },
  //     fail() {
  //       that.setData({
  //         LoadMores: 2
  //       })
  //       wx.hideNavigationBarLoading();
  //     }
  //   })
  // },
})