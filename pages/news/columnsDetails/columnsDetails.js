
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
    var author = options.author;
  
    that.setData({
      author: options.author,
      destUrl: options.destUrl,
      description: options.description,
    })
    wx.showLoading({
      title: '加载中',
    })
   
      wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles/',
        data: {
          "author": author
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
      var title = newsList[index].title;
      var titlepic = null;
      if (newsList[index].logo_image == null) {
        titlepic = "../../../img/ic_icon.png";
      } else {
        titlepic = newsList[index].logo_image;
      }
      console.log(newsId);

      wx.navigateTo({
        url: '../newsDetails/newsDetails?originalId=' + newsId + '&titlepic=' + titlepic + '&title=' + title,
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