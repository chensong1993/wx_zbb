var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    page: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    type:"all",
    nameIndex:"0",
    buttonClicked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e, type) {
    var that = this;
    var stockCode = e.stockCode;
    var types = "all";
    var url = "http://api.chinaipo.com/markets/v1/";
   
    wx.setNavigationBarTitle({
      title: '行情中心',
    })
    if (type == undefined) {
      types = "all"
    } else {
      types = type;
    }
    console.log(types);
    wx.request({
      url: url + 'index/',
      method: 'GET',
      data: {
        name: "三板成指"
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {

        that.setData({
          marketCZ: res.data.results
        })

        console.log(res.data.results);
      }
    })
    wx.request({
      url: url + 'index/',
      method: 'GET',
      data: {
        name: "三板做市"
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
       
      },
      success(res) {

        that.setData({
          marketZS: res.data.results
        })

        console.log(res.data.results);
      }
    })

    //涨跌幅排行
    wx.request({
      url: url + 'tchart/',
      method: 'GET',
      data: {
        baseIndex: types,
        sortBy: "chng_pct",
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
            priceByChange: res.data.results
          })
        } else {
          wx.showToast({
            title: '已加载全部',
            icon: "none"
          })
        }
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
      fail() {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();

      }
    })

    //成交额
    wx.request({
      url: url + 'tchart/',
      method: 'GET',
      data: {
        baseIndex: types,
        sortBy: "latest_volume",
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
            priceByVolume: res.data.results
          })
        } else {
          wx.showToast({
            title: '已加载全部',
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

    //成交量
    wx.request({
      url: url + 'tchart/',
      method: 'GET',
      data: {
        baseIndex: types,
        sortBy: "latest_turnover",
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
            priceByAmount: res.data.results
          })
        } else {
          wx.showToast({
            title: '已加载全部',
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
  },
  onRankingT: function(e) {
    var that = this;
    if (that.data.buttonClicked) {
    var index = e.target.dataset.index;
    that.data.nameIndex = index;
    that.setData({
      currentTab: index
    })
    var type = "all";
    switch (index) {
      case "0":
        type = "all";
        break;
      case "1":
        type = "innovate";
        break;
      case "2":
        type = "base";
        break;
      case "3":
        type = "project";
        break;
      case "4":
        type = "contract";
        break;
      case "5":
        type = "transfer";
        break;
    }
    that.data.type=type;
    that.onLoad(that, type);
    console.log(type);
    }
    //防止重复点击
    util.buttonClicked(this);
  },
  onStockList: function(e) {
    var that = this;
    if (that.data.buttonClicked) {
    var index = e.target.dataset.index;
    var stockDetail;
    var type = that.data.type;
    var sortBy;
    var name;
    var nameIndex = that.data.nameIndex;
    switch(nameIndex){
      case "0":
      name="全部-排行"
      break;
      case "1":
        name = "创新-排行"
        break;
      case "2":
        name = "基础-排行"
        break;
      case "3":
        name = "做市-排行"
        break;
      case "4":
        name = "协议-排行"
        break;
      case "5":
        name = "转板-排行"
        break;
    }
    switch (index) {
      case "0":
        sortBy ="chng_pct";
        break;
      case "1":
        sortBy = "latest_volume";
        break;
      case "2":
        sortBy = "latest_turnover";
        break;
    }
    
    wx.navigateTo({
      url: '../data/scrollStock/scrollStock?baseIndex=' + type + "&sortBy=" + sortBy+"&index="+"9"+"&name="+name
    })
    }
    //防止重复点击
    util.buttonClicked(this);
  },
  //公司详情
  onStockDetail: function(e) {
    var that = this;
    if(that.data.buttonClicked){
    var index = e.target.dataset.index;
    var type = e.target.dataset.type;
    var stockCode;
    switch (type) {
      case "0":
        stockCode = that.data.priceByChange[index].stock_code;
        break;
      case "1":
        stockCode = that.data.priceByVolume[index].stock_code;
        break;
      case "2":
        stockCode = that.data.priceByAmount[index].stock_code;
        break;
    }
    console.log(stockCode)
    wx.navigateTo({
      url: '../data/stockDetails/stockDetails?stockCode=' + stockCode,
    })
    }
    //防止重复点击
    util.buttonClicked(this);
  },
  onShow: function () {


  },

  onPageScroll: function (e) {

    var that = this;

    var query = wx.createSelectorQuery()//创建节点查询器 query
   
    query.select('#affix').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求

    query.exec(function (res) {
     
      if ( res[0].top<=0 ) {
        that.setData({
          menuFixed: -1
        })
      } else {
        that.setData({
          menuFixed: 1
        })
      }
      console.log(e.scrollTop);
    });
   
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
    this.onLoad(this, this.data.type);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})