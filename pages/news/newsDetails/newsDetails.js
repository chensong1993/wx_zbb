var Wxparse = require("../../../wxParse/wxParse.js");
var util = require("../../../utils/util.js");
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    buttonClicked: true,

  },

  onLoad: function(options) {
    var that = this;
    var index = 0;
    var originalId = options.originalId
    that.data.originalId = options.originalId
    wx.showLoading({
      title: '加载中',

    })
    this.setData({
        content: -1,
      }),
      wx.request({
        url: 'http://api.chinaipo.com/zh-hans/api/article/',
        data: {
          "originalId": originalId,
          "page": 1
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          wx.hideLoading();
        },
        success(res) {
          that.setData({ //很重要 
            newsDetails: res.data.results[index],
            newsDate: res.data.results[index].publishing_date,
            content: 1,

          })

          console.log();
          var content = "<div style=\"margin:0rpx; line-height:50rpx;  font-size:30rpx; color:black; word-break:normal\">" + res.data.results[0].content.content + "</div>";

          Wxparse.wxParse('article', 'html', content, that);
          console.log(content)

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
      var newsList = that.data.newsDetails.otherLinks;

      var newsId = newsList[index].originalId;
      console.log(index);

      wx.navigateTo({
        url: 'newsDetails?originalId=' + newsId,
      })
    }
    //防止重复点击
    util.buttonClicked(this);
    // that.setData({
    //   buttonClicked: false
    // })
    // setTimeout(function(){
    //   that.setData({
    //     buttonClicked:true
    //   })
    // },1000)


  },
  onPullDownRefresh: function() {
    var that = this;
    var originalId = that.data.originalId
    var index = 0;
    wx.showLoading({
      title: '加载中',

    })
    this.setData({
        content: -1,
      }),
      wx.request({
        url: 'http://api.chinaipo.com/zh-hans/api/article/',
        data: {
          "originalId": originalId,
          "page": 1
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        },
        success(res) {
          that.setData({ //很重要 
            newsDetails: res.data.results[index],
            newsDate: res.data.results[index].publishing_date,
            content: 1,

          })

          console.log();
          var content = "<div style=\"margin:0rpx; line-height:50rpx;  font-size:30rpx; color:black; word-break:normal\">" + res.data.results[0].content.content + "</div>";

          Wxparse.wxParse('article', 'html', content, that);
          console.log(content)

        }
      })


  },
  /**
   * 详情tag点击事件
   */
  detailTag: function(e) {
    var that = this;
    var tag = e.target.dataset.tag;
    console.log(tag)
    if (that.data.buttonClicked) {
    wx.navigateTo({
      url: '../detailTag/detailTag?detailTag=' + tag,
    })
    }
    util.buttonClicked(this);
  },
  wxParseTagATap: function(e) {
    if (this.data.buttonClicked) {
    var href = e.currentTarget.dataset.src;
    console.log(href);
    var originalId = href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.html'));

    console.log(originalId);
    if (href.indexOf("html") > -1) {
      wx.navigateTo({
        url: '../newsDetails/newsDetails?originalId=' + originalId,
      })
    }

    }
    util.buttonClicked(this);
  },
  /** 
  * 用户点击右上角分享 
  */
  onShareAppMessage: function () {

  },
})