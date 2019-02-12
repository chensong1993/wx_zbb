var util = require("../../../utils/util.js");

//获取应用实例
Page({

  data: {
    err: 1,
    page: 1,
    clearNone: -1,
    buttonClicked: true,
    LoadMores: -1
  },
  //判断输入框是否为空
  inputEmpty: function(e) {
    var that = this;
    if (e.detail.value.length == 0) {
      that.setData({
        tagList: '',
        marketList: '',
        clearNone: -1,
        LoadMores: -1,
        stockSingle: '',
        stockLists: '',
      })
    } else {
      that.setData({
        clearNone: 1,
        LoadMores: -1,
      })
    }

  },
  clearAll: function() {
    this.setData({
      searchinput: '',
      tagList: '',
      marketList: '',
      stockLists: '',
      clearNone: -1,
      focus: false,
      LoadMores: -1,
      stockSingle: '',
      err:1
    })
    console.log('123');
  },
  searchContent: function(e) {
    var that = this;
    that.data.search = e.detail.value;
    // var searchContent = e.detail.value;
    that.setData({
      page: 1
    })
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles',
      method: 'GET',
      data: {
        'search': that.data.search,
        'page': that.data.page,
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();

      },
      success(res) {
        if (that.data.search.length > 0) {
          if (res.data.results.length>0) {
            that.setData({
              err: 1,
              tagList: res.data.results,
              LoadMores: -1
            })
            that.data.newsList = res.data.results;
          } else {
            that.setData({
              tagList: '',
              err: -1
            })
          }
        } else {
          that.setData({
            LoadMores: -1,
            tagList: '',
          })
        }
      },
      fail() {
        console.log(3);
        wx.showToast({
          icon: 'none',
          title: '暂无结果',
        })

      }
    })
    //行情
    wx.request({
      url: 'http://api.chinaipo.com/markets/v1/tchart/',
      method: 'GET',
      data: {
        'name': that.data.search,
        'page': "1",
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();

      },
      success(res) {
        if (that.data.search.length > 0) {
          if (res.data.results.length>0) {
            that.setData({
              marketList: res.data.results,
              stockSingle: "",
              err1: 1
            })
          }else{
            that.setData({
              stockSingle: '',
              err1: -1
            })
          }
        }
        console.log(res.data.results)
      },
      fail() {

      }
    })
    //行情
    wx.request({
      url: 'http://api.chinaipo.com/markets/v1/tchart/',
      method: 'GET',
      data: {
        'code': that.data.search,
        'page': "1",
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();

      },
      success(res) {
        if (res.data.results.length>0) {
          if (that.data.search.length == 6) {
            that.setData({
              stockSingle: res.data.results,
              stockLists: '',
              marketList: ''
            })
          } else {
            that.setData({
              stockLists: res.data.results,
              stockSingle: '',
              marketList: ''
            })
          }

        }

        console.log(res.data.results)
      }
    })
  },
  //跳转详情页
  newsDetails: function(e) {
    var that = this
    if (that.data.buttonClicked) {
      //拿到点击的index下标
      var index = e.target.dataset.index
      //将对象转为string
      var newsList = that.data.newsList;

      var originalId = newsList[index].originalId;
      var title = newsList[index].title;
      var titlepic = null;
      if (newsList[index].titlepic == null) {
        titlepic = "../../../img/ic_icon.png";
      } else {
        titlepic = newsList[index].titlepic;
      }
      console.log(index);

      wx.navigateTo({
        url: '../newsDetails/newsDetails?originalId=' + originalId + '&titlepic=' + titlepic + '&title=' + title,
      })
    }

    //防止重复点击
    util.buttonClicked(that);
  },
  stockSingle:function(e){
    var that = this
    if (that.data.buttonClicked) {
      //拿到点击的index下标
      var stockName = e.target.dataset.name;
      //将对象转为string
      var stockCode = e.target.dataset.code;
      console.log(stockCode);

      wx.navigateTo({
        url: '../../data/stockDetails/stockDetails?stockCode=' + stockCode + "&stockName=" + stockName,
      })
    }

    //防止重复点击
    util.buttonClicked(that);
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    var that = this;
    var news = that.data.newsList;
    var searchContent = that.data.search;
    that.setData({
      more: 1,
      LoadMores: 1,
    })

    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles',
      method: 'GET',
      data: {
        'search': searchContent,
        'page': ++that.data.page,
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {},
      success(res) {
        var newsMore = res.data.results;
        console.log(newsMore);
        if (newsMore != undefined) {
          for (var i = 0; i < newsMore.length; i++) {
            news.push(newsMore[i])
          }
          that.setData({
            LoadMores: -1,
            tagList: news,
          })
          that.data.newsList = news;
          console.log(news);
        } else {
          that.setData({
            LoadMores: 2,
            more: -1
          })
        }
      },
      fail() {
        that.setData({
          LoadMores: 2,
          more: -1
        })


      }
    })
  },
  cancle: function(e) {
    wx.navigateBack();
  },
})