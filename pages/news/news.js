Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    page: 1,
    morePage:1,
    winWidth: 0,
    /* 页面配置*/
    winHeight: 0,
    currentTab: 0,
    index: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    autoplay: true,
    Hei: "", //这是swiper要动态设置的高度属性

  },
  //banner
  imgH: function(e) {
    var that = this;
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　 //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"　
    this.setData({
      Hei: swiperH　　　　　　　　 //设置高度
    })
  },
  BannerIndex: function(e) {
    var that = this;
    var bannerList = that.data.bannersList;
    var bannerIndexs = e.detail.current;
    that.data.current = e.detail.current;
    if (bannerIndexs == null) {
      bannerIndexs == 0
    }
    this.setData({
      bannerList: that.data.bannersList,
      bannerIndexs: e.detail.current,
      bannerTitle: bannerList[bannerIndexs].title

    })

  },
  //轮播图详情页面
  bannerDetail: function(e) {
    var that = this;
    var bannerList = that.data.bannersList;
    var index = that.data.current;
    console.log(index);
    if (index == null) {
      var url = bannerList[0].destUrl;
    } else {
      var url = bannerList[index].destUrl;
    }

    wx.navigateTo({
      url: '../webview/webview?bannerDetail=' + url,
    })
  },
  // 滚动切换标签样式 
  switchTab: function (e) {
    var that = this; //很重要 
    var datas = e.target.dataset.id;
    this.data.page = 1;
    var source=e.detail.source;
    if(source){
      this.setData({
        currentTab: e.detail.current
      });
    }
    var newsId = datas[e.detail.current].id;
    this.data.newsId = newsId;
    switch (newsId) {
      case 15:
        var urls = 'http://api.chinaipo.com/zh-hans/api/columns/';
        break;
      case 16:
        var urls = 'http://api.chinaipo.com/zh-hans/api/topics/';
        break;
      default:
        var urls = 'http://api.chinaipo.com/zh-hans/api/articles/';
        break;
    }

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: urls,
      method: 'GET',
      data: {
        categoryId: newsId,
        page: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();

      },
      success(res) {
        that.setData({ //很重要 
          newsList: res.data.results,
          LoadMores: 1
        })

        that.data.newsList = res.data.results;
      }

    })

    this.checkCor();

  },
  // 点击标题切换当前页时改变样式 
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    this.data.page = 1;
    if (this.data.currentTab === cur) {
      return false;
    } else {
      var that = this //很重要 
      var newsId = e.target.dataset.id;
      this.data.newsId = newsId;
      console.log(newsId);
      switch (newsId) {
        case 15:
          var urls = 'http://api.chinaipo.com/zh-hans/api/columns/';
          break;
        case 16:
          var urls = 'http://api.chinaipo.com/zh-hans/api/topics/';
          break;
        default:
          var urls = 'http://api.chinaipo.com/zh-hans/api/articles/';
          break;
      }
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: urls,
        method: 'GET',
        data: {
          categoryId: newsId,
          page: '1'
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          wx.hideLoading();
        },
        success(res) {
          that.setData({ //很重要 
            newsList: res.data.results,
            LoadMores: 1
          })
          console.log(res.data.results)
        }
      })
      
      this.setData({
        currentTab: cur
      })
      
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。 
  checkCor: function() {
    if (this.data.currentTab > 5) {
      this.setData({
        scrollLeft: 500
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  //跳转详情页
  newsDetails: function(e) {
    var that = this
    //拿到点击的index下标
    var index = e.target.dataset.index
    //将对象转为string
    var newsList = that.data.newsList;

    var newsId = newsList[index].originalId;
    console.log(index);
    wx.navigateTo({
      url: 'newsDetails/newsDetails?originalId=' + newsId,
    })

  },
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(e) {
    var cout;
    var arrays = {
      id: 0,
      name: '推荐'
    };
    this.setData({
      oneTab: '0'
    });
    var that = this //很重要 
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/banners/',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        that.setData({ //很重要 
          bannerList: res.data.results,
        })
        that.data.bannersList = res.data.results;
        console.log(res.data.results)
      }
    })
    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/articles/',
      method: 'GET',
      data: {
        categoryId: '0',
        page: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        that.setData({ //很重要 
          newsList: res.data.results,
        })
        that.data.newsList = res.data.results;
        console.log(res.data.results)
      }
    })
    //  高度自适应 
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 80;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });

    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/category/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        cout = res.data.results;
        cout.unshift(arrays);
        console.log(cout)
        that.setData({
          category: cout
        })

        // console.log(cout) 
      }
    })

  },

 
  /** 
   * 加载更多 
   */
  bindDownLoad: function(index) {
    var that = this;
    if (that.data.newsId == null) {
      var currentTab = 0;
    } else {
      var currentTab = that.data.newsId;
    }
    console.log(currentTab);
    var news = that.data.newsList;
    var resArr = [];

    switch (currentTab) {
      case 15:
        var urls = 'http://api.chinaipo.com/zh-hans/api/columns/';
        break;
      case 16:
        var urls = 'http://api.chinaipo.com/zh-hans/api/topics/';
        break;
      default:
        var urls = 'http://api.chinaipo.com/zh-hans/api/articles/';
        break;
    }
    if(index==2){
      that.setData({
        LoadMores: 1
      })
    }
    wx.hideLoading();
    wx.request({
      url: urls,
      method: 'GET',
      data: {
        categoryId: currentTab,
        page: index
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {


      },
      success(res) {
        that.setData({ //很重要 
          resArr: res.data.results,
        })
        if (res.data.results != null) {
          var cont = news.concat(res.data.results);
          that.setData({
            newsList: cont,
            LoadMores: 1
          })
        } else {
          that.setData({
            LoadMores: -1
          })
        }

      }

    })

  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function() {

  },
  scrollBottom: function() {
    this.setData({
      AddList:1
    })
   
     this.bindDownLoad(++this.data.page);
    
    console.log(this.data.page);
  },
  /** 
   * 用户点击右上角分享 
   */
  onShareAppMessage: function() {

  },
 /** 
   * 生命周期函数--监听页面初次渲染完成 
   */
  onReady: function () {

  },

  /** 
   * 生命周期函数--监听页面显示 
   */
  onShow: function () {

  },

  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function () {

  },

  /** 
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function () {

  },

  /** 
   * 页面相关事件处理函数--监听用户下拉动作 
   */
  onPullDownRefresh: function () {

  },

})