// pages/commonStyle/commonStyle.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: true,
    currentTab: 0,
    page: "2",
    star: -1,
    login: -1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this;
    var stockCode = e.stockCode;
    //数据库初始化
    wx.cloud.init();
    that.data.stockCode = stockCode;
   
    var stockName = e.stockName;
    if (stockName != undefined) {
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
    //公告
    wx.request({
      url: url + 'announces/',
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
          announces: res.data.results,
        })

        console.log(res.data.results);

      },
      fail() {


      }
    })

  },
  newsDetails: function(e) {
    if (this.data.buttonClicked) {
      var that = this;
      var index = e.target.dataset.index;
      var newsList = that.data.stockNewsList;
      var originalId = newsList[index].originalId;
      var titlepic = null;
      if (newsList[index].titlepic == null) {
        titlepic = "../../../img/ic_icon.png";
      } else {
        titlepic = newsList[index].titlepic;
      }
      var title = newsList[index].title;
      wx.navigateTo({
        url: '../../news/newsDetails/newsDetails?originalId=' + originalId + '&titlepic=' + titlepic + '&title=' + title,
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
      currentTab: index,
      page: "2"
    })

  },
  showPdf: function(e) {
    wx.showLoading({
      title: '正在加载 . . .',
    })
    if (this.data.buttonClicked) {
      var id = e.target.dataset.index;
      console.log(id)
      wx.downloadFile({
        // 示例 url，并非真实存在
        url: this.data.announces[id].access_url,
        success(res) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath,
            success(res) {
              wx.hideLoading();
              clearTimeout(showLoad);
              console.log('打开文档成功')
            }
          })
        },
        fail() {
          wx.showToast({
            icon: "none",
            title: '加载错误',
          })
          wx.hideLoading();
        }
      })
    }

    var showLoad = setTimeout(function() {
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: '加载时间过长',
      })
    }, 4000)
    util.buttonClicked(this);
  },
  //关注
  onStar: function() {
    var that = this;
    const db = wx.cloud.database();
    db.collection('user_info').doc(app.globalData.openid).get({
      success(res) {
        if (res.data != undefined) {
          console.log("jinlai")
          if (that.data.stockDetail != undefined) {
            var id = that.data.stockCode + app.globalData.openid
            console.log(id);
            db.collection('star').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                _id: id,
                stockDetail: that.data.stockDetail,
                star: 1,
                stockCode: that.data.stockCode
              }
            })
            that.setData({
              star: 1,
            })
          }
        } else {
          app.globalData.login = 1;
          console.log(22333)
          that.setData({
            star: -1,
            login: 1,
          })
        }
      },
      fail() {
        app.globalData.login = 1;
        console.log(22333)
        that.setData({
          star: -1,
          login: 1,
        })
      }
    })
    console.log(app.globalData.login);
  },
  onUnfollow: function() {
    var that = this;
    if (that.data.stockDetail != undefined) {
      var id = that.data.stockCode + app.globalData.openid
      console.log(id);
      const db = wx.cloud.database();
      db.collection('star').doc(id).remove({
        success(res) {
          that.setData({
            star: -1
          })
        }
      })

    }
  },
  onGotUserInfo(e) {
    var that = this;
    const db = wx.cloud.database();
    wx.login({
      success: res => {
        if (res.code) {
          var d = app.globalData; //这里存储了appid、secret、token串  
          var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + d.appid + "&secret=" + d.secret + "&js_code=" + res.code + "&grant_type=authorization_code"
          wx.request({
            url: url,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
            header: {}, // 设置请求的 header  

            success: function(res) {
              app.globalData.openid = res.data.openid;
              var id = that.data.stockCode + app.globalData.openid;
              db.collection('star').doc(id)
                .get({
                  success(res) {
                    if (res.data != undefined) {
                      that.setData({
                        star: 1,
                      })
                      console.log(111111111)
                    } else {
                      that.setData({
                        star: -1,
                      })
                      console.log(12211111)
                    }
                  },
                  fail() {
                    console.log(333333)
                    that.setData({
                      star: -1,
                    })
                  }
                })
              console.log(app.globalData.openid);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
         // wx.getUserInfo({
          //  success: res => {
              app.globalData.loading = -1;
              that.setData({
                login: app.globalData.loading,
              })
              db.collection('user_info').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  _id: app.globalData.openid,
                  openid: app.globalData.openid,
                  userInfo: e.detail.userInfo
                },
                fail() {
                  app.globalData.loading = 1;
                  that.setData({
                    login: app.globalData.loading,
                  })
                }
              })
          console.log(e.detail.userInfo);
          //  }
         // })

        }
      }
    })



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onMain: function() {
    this.setData({
      login: -1,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //查询是否被关注
    const db = wx.cloud.database();
    db.collection('user_info').doc(app.globalData.openid).get({
      success(res) {
        if (res.data != undefined) {
          if (app.globalData.openid != null) {
            var id = that.data.stockCode + app.globalData.openid;
            db.collection('star').doc(id)
              .get({
                success(res) {
                  if (res.data != undefined) {
                    that.setData({
                      star: 1,
                    })
                  } else {
                    that.setData({
                      star: -1,
                    })
                  }
                },
                fail() {
                  that.setData({
                    star: -1,
                  })
                }
              })
          } else {
            that.setData({
              star: -1,
            })
          }
        }
      }
    })
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

    if (that.data.currentTab == 3) {
      //公告
      wx.request({
        url: 'http://api.chinaipo.com/markets/v1/announces/',
        method: 'GET',
        data: {
          code: that.data.stockCode,
          page: that.data.page
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          wx.hideLoading();
        },
        success(res) {
          var pdf = that.data.announces;
          if (res.data.results != undefined) {
            var pdf1 = pdf.concat(res.data.results);
            that.setData({
                announces: pdf1
              })
              ++that.data.page;
          }
          console.log(pdf1);
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