//index.js
//获取应用实例
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
    }]
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
  //挂牌公司分布
  distribution:function(e){
    var type = e.target.dataset.type;
    console.log(type)
      wx.navigateTo({
        url: 'companyDistribution/companyDistribution?type='+type,
      })
     
    
  },
  //排行
  rankingDetail:function(e){
    var weuiId = e.target.dataset.type;
    console.log(weuiId)
    switch (weuiId) {
      case "0":
        // wx.navigateTo({
        //   url: 'rangingLiat/rangingLiat',
        // })
        break
      case "1":
        // wx.navigateTo({
        //   url: 'rangingLiat/rangingLiat',
        // })
        break
      case "2":
        break
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
  },
  //顶部类型跳转
  onDataCategory:function(e){
    var weuiId = e.target.dataset.index;
    console.log(weuiId)
    switch(weuiId){
      case 0:
        // wx.navigateTo({
        //   url: 'rangingLiat/rangingLiat',
        // })
      break
      case 1:
        // wx.navigateTo({
        //   url: 'rangingLiat/rangingLiat',
        // })
        break
      case 2:
        break
      case 3:
      wx.navigateTo({
        url: 'industryDetail/industryDetail',
      })
      break
      case 4:
        wx.navigateTo({
          url: 'rankingList/rankingList?index='+weuiId,
        })
        break
      case 5:
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break
      case 6:
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break
      case 7:
        wx.navigateTo({
          url: 'rankingList/rankingList?index=' + weuiId,
        })
        break
    }
  },
  onPullDownRefresh:function(){
    this.onLoad();
  }

})