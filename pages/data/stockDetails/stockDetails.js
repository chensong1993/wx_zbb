// pages/commonStyle/commonStyle.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: true,
    currentTab: 0,
    page: "2",
    buttonClicked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this;
    var stockCode = e.stockCode;
    that.data.stockCode = stockCode;
    var stockName = e.stockName;
    if (stockName!=undefined){
      wx.setNavigationBarTitle({
        title: stockName + "(" + stockCode + ")",
      })
    }
   
    console.log(stockName);
    var url = "http://api.chinaipo.com/markets/v1/";
    wx.showLoading({
      title: '正在加载 . . .',
    })
    wx.request({
      url: url + 'tchart/',
      method: 'GET',
      data: {
        code: stockCode
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        if (res.data.results != undefined) {
          that.setData({
            stockDetail: res.data.results
          })
        } else {
          wx.showToast({
            title: '加载错误',
            icon: "none"
          })
        }
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {

        wx.hideNavigationBarLoading();

      }
    })
    //资讯
    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles/',
      method: 'GET',
      data: {
        search: stockCode,
        page: "1"
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        if (res.data.results != undefined) {
          that.setData({
            stockNewsList: res.data.results
          })
        }
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //资料 公司概括
    wx.request({
      url: url + 'profile/',
      method: 'GET',
      data: {
        code: stockCode
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {

        that.setData({
          gaikuo: res.data.results
        })

        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //资料 管理层
    wx.request({
      url: url + 'management/',
      method: 'GET',
      data: {
        code: stockCode
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {

        that.setData({
          zixun: res.data.results
        })

        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //股东人数
    wx.request({
      url: url + 'structures/',
      method: 'GET',
      data: {
        code: stockCode
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {

        that.setData({
          holder: res.data.results
        })

        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //十大股东
    wx.request({
      url: url + 'holders/',
      method: 'GET',
      data: {
        code: stockCode
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {

        that.setData({
          gudong: res.data.results
        })

        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
  },
  newsDetails:function(e){
    if(this.data.buttonClicked){
    var that=this;
    var originalId = e.target.dataset.index;
    wx.navigateTo({
      url: '../../news/newsDetails/newsDetails?originalId=' + originalId,
    })
    }
    util.buttonClicked(this);
  },
  onOpenApp: function(e) {
    wx.navigateTo({
      url: '../../webview/webview'
    })
  },
  onRankingT: function(e) {
    var that = this;
    var index = e.target.dataset.index;
    that.data.nameIndex = index;
    that.setData({
      currentTab: index
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
   
    var that = this;
    //资讯
    if (that.data.currentTab == 0) { 
    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles/',
      method: 'GET',
      data: {
        search: that.data.stockCode,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        var data = that.data.stockNewsList;
        if (res.data.results != undefined) {
          var data1 = data.concat(res.data.results);
          that.setData({
              stockNewsList: data1
            })
            ++that.data.page;
        }
        console.log(data1);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})