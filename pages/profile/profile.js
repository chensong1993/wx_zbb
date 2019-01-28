var util = require("../../utils/util.js");
//获取应用实例
const app = getApp()
Page({

  data: {
    userInfo: '',
    loading: 1,
    id: 1
  },
  onLoad: function() {
    var that = this;
    //数据库初始化
    wx.cloud.init()

    console.log(app.globalData.openid);
    const db = wx.cloud.database();
    db.collection('user_info').where({
        _openid: app.globalData.openid
      })
      .get({
        success(res) {
          if (res.data[0]._openid == app.globalData.openid) {
            app.globalData.loading = -1;
            that.setData({
              userInfo: res.data[0].userInfo,
              loading: app.globalData.loading
            })
          }
          console.log(1111111111000)
        },
        fail: console.error
      })

  
  },
  onIcon(e){
    var that=this;
    that.setData({
      bigImg:1
    })
  },
  onIconNone:function(){
    var that = this;
    that.setData({
      bigImg: -1
    })
  },
  onGotUserInfo(e) {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.loading = -1;
              that.setData({
                loading: -1,
                userInfo: res.userInfo
              })
              const db = wx.cloud.database();
              db.collection('user_info').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  _id: app.globalData.openid,
                  openid: app.globalData.openid,
                  userInfo: that.data.userInfo
                },
                fail() {
                  app.globalData.loading = 1
                  that.setData({
                    loading: 1
                  })
                }
              })
            }
          })

        }
      }
    })
  },
  logOut: function() {
    var that = this;
    const db = wx.cloud.database();
    db.collection('user_info').doc(app.globalData.openid).remove({
      success(res) {
        app.globalData.loading = 1;
        that.setData({
          loading: app.globalData.loading,
        })
        console.log("-----")
      }
    })
    console.log("123456798")
  },
  onShow: function() {
    var that = this;
    //数据库初始化
    wx.cloud.init()
    const db = wx.cloud.database();
    db.collection('user_info').where({
        _openid: app.globalData.openid
      })
      .get({
        success(res) {
          if (res.data[0]._openid == app.globalData.openid) {
            app.globalData.loading = -1;
            that.setData({
              userInfo: res.data[0].userInfo,
              loading: app.globalData.loading
            })
          }
        },
        fail: console.error
      })

    db.collection('star').where({
        _openid: app.globalData.openid
      })
      .get({
        success(res) {
          that.setData({
            staockStarList: res.data
          })
          console.log(res.data);
        },
        fail: console.error
      })
    console.log(22222222222222)
  },
  //公司详情
  onStockDetail: function(e) {
    var that = this;
    if (that.data.buttonClicked) {
      var index = e.target.dataset.index;
      var stockCode = e.target.dataset.code;
      var stockName = e.target.dataset.name;
      console.log(stockCode)
      wx.navigateTo({
        url: '../data/stockDetails/stockDetails?stockCode=' + stockCode + "&stockName=" + stockName,
      })
    }
    //防止重复点击
    util.buttonClicked(this);
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
})