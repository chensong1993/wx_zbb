
var util=require("../../../utils/util.js");
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    buttonClicked: true,
    page:1
  },

  onLoad: function(options) {
    var that = this;
    var tag = options.detailTag;
    that.data.detailTag = options.detailTag;
    wx.showLoading();
    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles/',
      method: 'GET',
      data: {
        tag: tag,
        page: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete(res) {
        wx.hideLoading();
     
      },
      success(res) {
        that.setData({ //很重要 
          tagList: res.data.results,
        })
        // that.data.tagList = res.data.results;
        // console.log(res.data.results)

      },
      fail() {
        wx.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        })

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
      var newsList = that.data.tagList;
      console.log(newsList)
      var newsId = newsList[index].originalId;
      console.log(newsId);

      wx.navigateTo({
        url: '../newsDetails/newsDetails?originalId=' + newsId,
      })
    }
    //防止重复点击
    util.buttonClicked(this);
  },
 onPullDownRefresh:function(){
   var that = this;
   var tag = that.data.detailTag;
   that.setData({
     page:1,
   
   })
   wx.showLoading();
   wx.request({
     url: 'http://api.chinaipo.com/zh-hans/api/articles/',
     method: 'GET',
     data: {
       tag: tag,
       page: '1'
     },
     header: {
       'content-type': 'application/json' // 默认值 
     },
     complete(res) {
       wx.hideLoading();
       wx.stopPullDownRefresh()
     },
     success(res) {
       that.setData({ //很重要 
         tagList: res.data.results,
       })
       // that.data.tagList = res.data.results;
       // console.log(res.data.results)

     },
     fail() {
       wx.stopPullDownRefresh()
       wx.showToast({
         title: '加载失败',
         duration: 2000,
         icon: 'none'
       })

     }

   })
 },
  onReachBottom:function(){
   var that = this;
   var tag = that.data.detailTag
    
   var news = that.data.tagList;
   var resArr = [];
   that.setData({
     more: 1
   })
   wx.request({
     url: 'http://api.chinaipo.com/zh-hans/api/articles/',
     method: 'GET',
     data: {
       tag: tag,
       page: ++that.data.page
     },
     header: {
       'content-type': 'application/json' // 默认值 
     },
     complete(res) {
       wx.hideLoading();

     },
     success(res) {
       if (res.data.results.length!=0){
       var tagList=news.concat(res.data.results);
       that.setData({ //很重要 
         tagList: tagList,
         more:-1
       })
       console.log(tagList);
       }else{
         that.setData({ //很重要 
           more: -1
         })
         wx.showToast({
           title: '已加载全部',
           duration: 2000,
           icon: 'none'
         }) 
       }
     },
     fail() {
       that.setData({ //很重要 
         more: -1
       })
       wx.showToast({
         title: '加载失败',
         duration: 2000,
         icon: 'none'
       })

     }

   })
   console.log(this.data.page);
 },
})