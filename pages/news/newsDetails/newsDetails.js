var Wxparse = require("../../../wxParse/wxParse.js");
var util=require("../../../utils/util.js");
Page({

  /** 
   * 页面的初始数据 
   */
  data: {

  },

  onLoad: function(options) {
    var that = this;
    var originalId = options.originalId
    this.setData({

    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/article/',
      data: {
        "originalId": originalId
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        that.setData({ //很重要 
          newsDetails: res.data.results[0],
          newsDate:util.renderTime(res.data.results[0].publishing_date)
        })

        console.log();
        var content = "<div style=\"margin:0rpx; line-height:50rpx;  font-size:30rpx; color:black; word-break:normal\">" + res.data.results[0].content.content + "</div>";

        Wxparse.wxParse('article', 'html', content, that);
        console.log(content)

      }
    })

  }

})