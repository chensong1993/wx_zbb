
var util = require("../../../utils/util.js");
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    buttonClicked: true,

  },

  onLoad: function (options) {
    var that = this;
    var originalId = options.originalId;
    // var core_ideas = options.core_ideas;
    // var title=options.title;
    // var source=options.source;
    that.setData({
      core_ideas : options.core_ideas,
      title:options.title,
      source:options.source,
    })
    wx.showLoading({
      title: '加载中',
    })
   
      wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles/',
        data: {
          "topic": originalId
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          wx.hideLoading();
        },
        success(res) {
          that.setData({ //很重要 
            tagList: res.data.results
          })
          that.data.newsDetails = res.data.results;
        }
      })

  },
  //跳转详情页
  newsDetails: function (e) {
    var that = this
    if (that.data.buttonClicked) {
      //拿到点击的index下标
      var index = e.target.dataset.index
      //将对象转为string
      var newsList = that.data.newsDetails;

      var newsId = newsList[index].originalId;
      console.log(newsId);

      wx.navigateTo({
        url: '../newsDetails/newsDetails?originalId=' + newsId,
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
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  
})