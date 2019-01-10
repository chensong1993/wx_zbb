var util = require("../../../utils/util.js");
Page({
  data: {
    page: "1",
    data: {},
    i: "1",
    order: "des",
    stockTitle: [{
      id: 0,
      name: "当前价",
      sortBy: "latest_price"
    }, {
      id: 1,
      sortBy: "chng_pct",
      name: "涨跌幅"
    }, {
      id: 2,
      sortBy: "latest_turnover",
      name: "成交额"
    }, {
      id: 3,
      sortBy: "latest_volume",
      name: "成交量"
    }, {
      id: 4,
      sortBy: "chng",
      name: "涨跌额"
    }, {
      id: 5,
      sortBy: "total_income",
      name: "营收(年)"
    }, {
      id: 6,
      sortBy: "net_profit",
      name: "净利润(年)"
    }, {
      id: 7,
      sortBy: "shares_flow",
      name: "流通股本"
    }, {
      id: 8,
      sortBy: "values_flow",
      name: "流通市值"
    }, {
      id: 9,
      sortBy: "total_volume",
      name: "总股本"
    }, {
      id: 10,
      sortBy: "total_value",
      name: "总市值"
    }, {
      id: 11,
      sortBy: "pe_ratio",
      name: "市盈率"
    }, {
      id: 12,
      sortBy: "profit_each_share",
      name: "每股收益"
    }, {
      id: 13,
      sortBy: "highest_price",
      name: "最高价"
    }, {
      id: 14,
      sortBy: "lowest_price",
      name: "最低价"
    }, {
      id: 15,
      sortBy: "avg_price",
      name: "均价"
    }, {
      id: 16,
      sortBy: "swg",
      name: "振幅"
    }],
    buttonClicked: true,
  },

  onLoad: function(e) {
    var that = this;
    var index;
    var baseIndex = "";
    var stockCode = "";
    var data;
    var title = "";
    var url = "http://api.chinaipo.com/markets/v1/";
    var baseIndex = e.baseIndex;
    var sortBy = e.sortBy;
    that.data.baseIndex = baseIndex;
    that.data.sortBy = sortBy;
    if (stockCode == undefined) {
      stockCode = that.data.stockCode;
    } else {
      stockCode = e.stockCode;
      that.data.stockType = e.stockType;
      that.data.stockCode = e.stockCode;
    }

    if (e.index == undefined) {
      index = that.data.index;
    } else {
      index = e.index;
      that.data.index = e.index;
    }
    console.log(e.name)
    that.setData({
      currentTab: 1,
    })

    wx.showNavigationBarLoading();
    console.log(index);
    switch (index) {
      case "0":
        title = "创新层"
        that.setData({
          data: {
            "baseIndex": "innovate",
            "sortBy": "chng_pct",
            "order": "des",
            "page": "1"
          }
        })
        break;
      case "1":
        title = "转板公司"
        that.setData({
          data: {
            "baseIndex": "transfer",
            "sortBy": "chng_pct",
            "order": "des",
            "page": "1"
          }
        })
        break;
      case "2":

        break;
      case "3":
        title = e.name;
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": "chng_pct",
            "order": "des",
            "industry": stockCode,
            "page": "1"
          }
        })
        break;
      case "4":
        title = "主办券商"
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": "chng_pct",
            "order": "des",
            "investor": stockCode,
            "page": "1"
          }
        })
        break;
      case "5":
        title = "做市商"
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": "chng_pct",
            "order": "des",
            "dealer": stockCode,
            "page": "1"
          }
        })
        break;
      case "6":
        title = "律师事务所"
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": "chng_pct",
            "order": "des",
            "lawyer": stockCode,
            "page": "1"
          }
        })
        break;
      case "7":
        title = "会计事务所"
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": "chng_pct",
            "order": "des",
            "accountant": stockCode,
            "page": "1"
          }
        })
        break;
      case "8":
        title = e.name;
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": "chng_pct",
            "order": "des",
            "area": stockCode,
            "page": "1"
          }
        })
        break;
      case "9":
        title = e.name;
        that.setData({
          data: {
            "baseIndex": baseIndex,
            "sortBy": sortBy,
            "page": "1"
          }
        })

        break;
    }
    wx.setNavigationBarTitle({
      title: title,
    })

    wx.request({
      url: url + 'tchart/',
      method: 'GET',
      data: that.data.data,
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          innovate: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();

      },
      fail() {

        wx.hideNavigationBarLoading();

      }

    })

  },
  //股票详情
  onStockDetail: function(e) {
    var that = this;
    if (that.data.buttonClicked) {
      var item = e.target.dataset.index;
      console.log(item + "'''''''''''''''''''");
      var stockCode = that.data.innovate[item].stock_code;
      wx.navigateTo({
        url: '../stockDetails/stockDetails?stockCode=' + stockCode,
      })
    }
    util.buttonClicked(this);
  },

  //标题的点击事件
  onStockTitle: function(e) {
    var that = this;
      var baseIndex;
      var index = that.data.index;
      var item = e.target.dataset.index;
      var stockCode = that.data.stockCode;
      var sortBy = that.data.stockTitle[item].sortBy;
      var url = "http://api.chinaipo.com/markets/v1/";
      that.data.sortBy = sortBy;
      ++that.data.i;
      var order;
      if (that.data.i % 2 == 0) {
        order = "asc";
        that.data.order = "asc";
      } else {
        order = "des";
        that.data.order = "des";
      }
      that.setData({
        order: order
      })
      that.setData({
        page: "1",
        currentTab: item
      })

      wx.showNavigationBarLoading();
      switch (index) {
        case "0":
          that.setData({
            data: {
              "baseIndex": "innovate",
              "sortBy": sortBy,
              "order": order,
              "page": "1"
            }
          })
          break;
        case "1":
          that.setData({
            data: {
              "baseIndex": "transfer",
              "sortBy": sortBy,
              "order": order,
              "page": "1"
            }
          })
          break;
        case "2":

          break;
        case "3":
          that.setData({
            data: {
              "baseIndex": "all",
              "sortBy": sortBy,
              "order": order,
              "industry": stockCode,
              "page": "1"
            }
          })
          break;
        case "4":
          that.setData({
            data: {
              "baseIndex": "all",
              "sortBy": sortBy,
              "order": order,
              "investor": stockCode,
              "page": "1"
            }
          })
          break;
        case "5":
          that.setData({
            data: {
              "baseIndex": "all",
              "sortBy": sortBy,
              "order": order,
              "dealer": stockCode,
              "page": "1"
            }
          })
          break;
        case "6":
          that.setData({
            data: {
              "baseIndex": "all",
              "sortBy": sortBy,
              "order": order,
              "lawyer": stockCode,
              "page": "1"
            }
          })
          break;
        case "7":
          that.setData({
            data: {
              "baseIndex": "all",
              "sortBy": sortBy,
              "order": order,
              "accountant": stockCode,
              "page": "1"
            }
          })
          break;
        case "8":
          that.setData({
            data: {
              "baseIndex": "all",
              "sortBy": sortBy,
              "order": order,
              "area": stockCode,
              "page": "1"
            }
          })
          break;
        case "9":
          that.setData({
            data: {
              "baseIndex": that.data.baseIndex,
              "sortBy": that.data.sortBy,
              "order": order,
              "page": "1"
            }
          })
          break;
      }
      wx.showLoading({
        title: '正在加载 . . .',
      })
      wx.request({
        url: url + 'tchart/',
        method: 'GET',
        data: that.data.data,
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          wx.hideLoading();
        },
        success(res) {
          if (res.data.results != undefined) {
            that.setData({
              innovate: res.data.results
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
  onPullDownRefresh: function(e) {
    wx.stopPullDownRefresh();

  },

  onReachBottom: function() {
    var sortBy;
    if (this.data.sortBy == undefined) {
      sortBy = "chng_pct";
    } else {
      sortBy = this.data.sortBy
    }
    this.onRankingListData(++this.data.page, sortBy);
  },
  onRankingListData: function(page, sortBy) {
    var that = this;
    var baseIndex = "";
    var url = "http://api.chinaipo.com/markets/v1/";
    var index = that.data.index;
    var stockCode = that.data.stockCode;
    var order = "des";
    if (that.data.order == undefined) {
      order = "des";
    } else {
      order = that.data.order;
    }
    wx.showNavigationBarLoading();
    switch (index) {
      case "0":
        that.setData({
          data: {
            "baseIndex": "innovate",
            "sortBy": sortBy,
            "order": order,
            "page": page
          }
        })
        break;
      case "1":
        that.setData({
          data: {
            "baseIndex": "transfer",
            "sortBy": sortBy,
            "order": order,
            "page": page
          }
        })
        break;
      case "2":

        break;
      case "3":
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": sortBy,
            "order": order,
            "industry": stockCode,
            "page": page
          }
        })
        break;
      case "4":
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": sortBy,
            "order": order,
            "investor": stockCode,
            "page": page
          }
        })
        break;
      case "5":
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": sortBy,
            "order": order,
            "dealer": stockCode,
            "page": page
          }
        })
        break;
      case "6":
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": sortBy,
            "order": order,
            "lawyer": stockCode,
            "page": page
          }
        })
        break;
      case "7":
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": sortBy,
            "order": order,
            "accountant": stockCode,
            "page": page
          }
        })
        break;
      case "8":
        that.setData({
          data: {
            "baseIndex": "all",
            "sortBy": sortBy,
            "order": order,
            "area": stockCode,
            "page": page
          }
        })
        break;
      case "9":
        that.setData({
          data: {
            "baseIndex": that.data.baseIndex,
            "sortBy": that.data.sortBy,
            "order": order,
            "page": page
          }
        })
        break;
    }
    wx.showLoading({
      title: '正在加载 . . .',
    })
    wx.request({
      url: url + 'tchart/',
      method: 'GET',
      data: that.data.data,
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        if (res.data.results != undefined) {
          var data = that.data.innovate;
          var data1 = data.concat(res.data.results);
          that.setData({
            innovate: data1
          })
        } else {
          wx.showToast({
            title: '已加载全部',
            icon: "none"
          })
        }
        console.log(data1);
        wx.hideNavigationBarLoading();
      },
      fail() {

        wx.hideNavigationBarLoading();

      }
    })
  },

})