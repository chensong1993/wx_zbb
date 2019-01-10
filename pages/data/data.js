var util = require("../../utils/util.js");

Page({
  data: {
    dataCategory: [{
      name: "创新层",
      icon: "../../img/ic_chuang.png"
    }, {
      name: "转板公司",
      icon: "../../img/ic_zhuanban.png"
    }, {
      name: "新股挂牌",
      icon: "../../img/ic_xingu.png"
    }, {
      name: "行业统计",
      icon: "../../img/ic_tongji.png"
    }, {
      name: "主办券商",
      icon: "../../img/ic_zhuban.png"
    }, {
      name: "做市商",
      icon: "../../img/ic_zuoshi.png"
    }, {
      name: "律师事务所",
      icon: "../../img/ic_lvshi.png"
    }, {
      name: "会计事务所",
      icon: "../../img/ic_kuaiji.png"
    }],
    buttonClicked: true,
  },

  onLoad: function(e) {
    var that = this;
    var url = "http://api.chinaipo.com/markets/v1/";
    wx.showNavigationBarLoading();
   
    //会计排行
    wx.request({
      url: url + 'statistics' + '/accountant/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          accountant: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {

        wx.hideNavigationBarLoading();

      }
    })
      //律师排行
      wx.request({
        url: url + 'statistics' + '/lawyer/',
        method: 'GET',
        data: {

        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {

        },
        success(res) {
          that.setData({
            lawyer: res.data.results
          })
          console.log(res.data.results);
          wx.hideNavigationBarLoading();
        },
        fail() {
          wx.hideNavigationBarLoading();

        }
    })
    //做市排行
    wx.request({
      url: url + 'statistics' + '/dealer/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          dealer: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //主办券商
    wx.request({
      url: url + 'statistics' + '/investor/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          investor: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //行业统计
    wx.request({
      url: url + 'statistics' + '/industry/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          industry: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //公司分布
    wx.request({
      url: url + 'statistics' + '/area/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          area: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
      },
      fail() {
        wx.hideNavigationBarLoading();

      }
    })
    //挂牌公司
    wx.request({
      url: url + 'indexSC/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {

      },
      success(res) {
        that.setData({
          indexSC: res.data.results
        })
        console.log(res.data.results);
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
      fail() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  //行业统计详情
  onHangyeIndex: function (e) {
    var that = this;
    if (that.data.buttonClicked){
    var item = e.target.dataset.index;
    var code = that.data.industry[item].indu_code_2;
    var index;
    console.log(code);
    wx.navigateTo({
      url: 'scrollStock/scrollStock?stockCode=' + code + "&index=" + "3",
    })
    }
    util.buttonClicked(this);
  },
  //排行榜
  onRankingIndex: function (e) {
    var that = this;
    if(that.data.buttonClicked){
    var dataList;
    var index = e.target.dataset.type;
    //列表的下标
    var item = e.target.dataset.index;
    switch(index){
      case "4":
        dataList = that.data.investor;
      break;
      case "5":
        dataList = that.data.dealer;
        break;
      case "6":
        dataList = that.data.lawyer;
        break;
      case "7":
        dataList = that.data.accountant ;
        break;
    }
    var code = dataList[item].org_code;
    console.log(item);
    wx.navigateTo({
      url: 'scrollStock/scrollStock?stockCode=' + code + "&index=" + index,
    })
    }
    util.buttonClicked(this);
  },
  //挂牌公司分布
  distribution:function(e){
    if(this.data.buttonClicked){
    var type = e.target.dataset.type;
    console.log(type)
      wx.navigateTo({
        url: 'companyDistribution/companyDistribution?type='+type,
      })
    }
    util.buttonClicked(this);
    
  },
  //排行
  rankingDetail:function(e){
    if(this.data.buttonClicked){
    var weuiId = e.target.dataset.type;
    console.log(weuiId)
    switch (weuiId) {
      // case 0:
      //   wx.navigateTo({
      //     url: 'scrollStock/scrollStock?index=' + weuiId,
      //   })
      //   break;
      // case 1:
      //   wx.navigateTo({
      //     url: 'scrollStock/scrollStock?index=' + weuiId,
      //   })
      //   break;
      // case 2:
      //   wx.navigateTo({
      //     url: 'scrollStock/scrollStock?index=' + weuiId,
      //   })
      //   break;
      case "3":
        wx.navigateTo({
          url: 'industryDetail/industryDetail',
        })
        break
      case "4":
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break
      case "5":
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break
      case "6":
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break
      case "7":
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break
    }
    }
    util.buttonClicked(this);
  },
  //顶部类型跳转
  onDataCategory:function(e){
    if(this.data.buttonClicked){
    var weuiId = e.target.dataset.index;
    console.log(weuiId)
    switch(weuiId){
      case 0:
        wx.navigateTo({
          url: 'scrollStock/scrollStock?index='+weuiId,
        })
        break;
      case 1:
        wx.navigateTo({
          url: 'scrollStock/scrollStock?index=' + weuiId,
        })
        break;
      case 2:
        wx.showToast({
          title: '暂无数据',
          icon:"none"
        })
        break;
      case 3:
      wx.navigateTo({
        url: 'industryDetail/industryDetail',
      })
      break;
      case 4:
        wx.navigateTo({
          url: 'rankingList/rankingList?index='+weuiId,
        })
        break;
      case 5:
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break;
      case 6:
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break;
      case 7:
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break;
    }
    }
    util.buttonClicked(this);
  },
  onPullDownRefresh:function(){
    this.onLoad();
  }

})