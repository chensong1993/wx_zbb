var util = require("../../utils/util.js");

Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    page: 1,
    morePage: 1,
    winWidth: 0,
    /* 页面配置*/
    winHeight: 0,
    currentTab: 0,
    index: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    autoplay: true,
    Hei: "", //这是swiper要动态设置的高度属性
    hasMore: false,
    moreOne: 1,
    buttonClicked: true,
    setInter: '123',
    LoadMores: -1,
    isShow:1
    /**
     * 
     */
    // n: 1,
    // ok: false
  },
  //banner
  // imgH: function(e) {
  //   var that = this;
  //   var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
  //   var imgh = e.detail.height;　　　　　　　　　　　　　　　　 //图片高度
  //   var imgw = e.detail.width;
  //   var swiperH = winWid * imgh / imgw + "px"　
  //   this.setData({
  //     Hei: swiperH　　　　　　　　 //设置高度
  //   })
  // },
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

    if (that.data.buttonClicked) {
      var bannerList = that.data.bannersList;
      var index = that.data.current;
      console.log(index);
      if (index == null) {
        var url = bannerList[0].destUrl;
      } else {
        var url = bannerList[index].destUrl;
      }


      var originalId = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.html'));
      console.log(url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.html')));
      wx.navigateTo({
        url: 'newsDetails/newsDetails?originalId=' + originalId,
      })
    }
    //防止重复点击
    util.buttonClicked(this);
  },
  // 滚动切换标签样式 
  switchTab: function(e) {
    
     var that = this; 
    // that.loadIngMore();
    // var datas = e.target.dataset.id;
    //切换列表时让页数初始化
    that.data.page = 1;
    //判断是第一次加载更多
    that.data.moreOne = 1;
    //防止tab自动跳转
    // var source = e.detail.source;
    // if (source) {
    //   this.setData({
    //     currentTab: e.detail.current
    //   });
    // }
    // var newsId = datas[e.detail.current].id;
    // this.data.newsId = newsId;
    //加载动画
   // that.loading();
    var cur = e.detail.current;
    console.log(this.data.windowWidth+"-----------------------------");
    if (this.data.windowWidth > 300 && this.data.windowWidth<376){
      var singleNavWidth = this.data.windowWidth / 5;
    } else if (this.data.windowWidth > 375 && this.data.windowWidth < 600){
      var singleNavWidth = this.data.windowWidth / 6;
    }else{
      var singleNavWidth = this.data.windowWidth / 7;
    }
    var source = e.detail.source;
    if (source) {
      this.setData({
        currentTab: cur,
        scrollLeft: (cur - 2) * singleNavWidth - 5,
        scroll: -1,
      });
    }
    var datas = that.data.category;
    that.data.page = 1;
    var newsId = datas[cur].id;
    that.data.newsId = newsId;
    console.log(that.data.newsId);
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
    wx.showNavigationBarLoading();
    // wx.showLoading({
    //   title: '加载中',
    // })
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

      },
      success(res) {
        if (res.data.results.length < 5) {
          that.setData({
            newsList: res.data.results,
            LoadMores: -1,
            scroll: 1
          })

        } else {
          that.setData({
            newsList: res.data.results,
            LoadMores: 1,
            scroll: 1
          })
        }
       // clearInterval(that.interval);
        that.data.newsList = res.data.results;
      //  wx.hideLoading();
        wx.hideNavigationBarLoading();
      },
      fail() {
      //  wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          scroll: -1
        })
        wx.hideNavigationBarLoading();
      //  clearInterval(that.interval);
      }

    })

    //  this.checkCor();

  },
  // 点击标题切换当前页时改变样式 
  swichNav: function(e) {
    // this.loadIngMore();
    var cur = e.target.dataset.current;
    //切换列表时让页数初始化
    this.data.page = 1;
    //判断是第一次加载更多
    this.data.moreOne = 1;
   
    if (this.data.currentTab === cur) {
      return false;
    } else {
      var that = this //很重要 
      var newsId = e.target.dataset.id;
      this.data.newsId = newsId;
      //加载动画
    //  that.loading();
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
      wx.showNavigationBarLoading();
      // wx.showLoading({
      //   title: '加载中',
      // })
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
          
        },
        success(res) {
          wx.hideNavigationBarLoading();
        //  wx.hideLoading();
          if (res.data.results.length < 5) {
            that.setData({
              newsList: res.data.results,
              LoadMores: -1,
              scroll: 1
            })

          } else {
            that.setData({
              newsList: res.data.results,
              LoadMores: 1,
              scroll: 1
            })
          }
        //  clearInterval(that.interval);
          console.log(res.data.results)
        },
        fail(){
        //  wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon:'none'
          })
          wx.hideNavigationBarLoading();
        //  clearInterval(that.interval);
        }
        
      })

      this.setData({
        currentTab: cur
      })

    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。 
  checkCor: function() {
    if (this.data.currentTab < 6) {
      this.setData({
        scrollLeft: 0
      })
    } else if (this.data.currentTab > 5 && this.data.currentTab < 11) {
      this.setData({
        scrollLeft: 380
      })
    } else if (this.data.currentTab > 11 && this.data.currentTab < 15) {
      this.setData({
        scrollLeft: 760
      })
    } else if (this.data.currentTab > 17) {
      this.setData({
        scrollLeft: 1140
      })
    }


    console.log(this.data.currentTab)
  },

  //跳转详情页
  newsDetails: function(e) {
    var that = this
    if (that.data.buttonClicked) {
      //拿到点击的index下标
      var index = e.target.dataset.index
      //将对象转为string
      var newsList = that.data.newsList;
      var originalId = newsList[index].originalId;
      var topicsId = newsList[index].orig_reference;
      var core_ideas = newsList[index].core_ideas;
      var title = newsList[index].title;
      var source = newsList[index].source;
      var categoer = that.data.newsId;
      var name = newsList[index].name;
      var destUrl = newsList[index].destUrl;
      var description = newsList[index].description
      console.log(index);
      if (categoer == 15) {
        wx.navigateTo({
          url: 'columnsDetails/columnsDetails?author=' + name + '&destUrl=' + destUrl + '&description=' + description,
        })
      } else if (categoer == 16) {
        wx.navigateTo({
          url: 'topicDetails/topicDetails?originalId=' + topicsId + '&core_ideas=' + core_ideas + '&title=' + title + '&source=' + source,
        })
      } else {
        wx.navigateTo({
          url: 'newsDetails/newsDetails?originalId=' + originalId,
        })
      }
      
      // const db = wx.cloud.database();
      // db.collection('newsRead').add({
      //   // data 字段表示需新增的 JSON 数据
      //   data: {
      //     // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      //     description: '已读新闻',
      //     originalId: originalId,

      //   },
      //   success(res) {
      //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      //     console.log(res)
      //   },
      //   fail: console.error
      // })
    }
    //防止重复点击
    util.buttonClicked(this);

  },
 
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(e) {
    var cout;
    var cout2;
   
    var arrays = {
      id: 0,
      name: '推荐'
    };
    this.setData({
      oneTab: '0'
    });
    var that = this //很重要 
    //加载动画
   // that.loading();
    wx.showNavigationBarLoading();
    // wx.showLoading({
    //   title: '加载中',
    // })

    // //数据库初始化
    // wx.cloud.init()
    // const testDB = wx.cloud.database({
    //   env: 'zibenbang'
    // })
  
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

    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/category/',
      method: 'GET',
      data: {
        page: 2
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
      //  wx.hideLoading();
      },
      success(res) {
        if (cout != undefined) {
          cout2 = res.data.results;
          for (var i = 0; i < cout2.length; i++) {
            cout.push(cout2[i])
          }
          console.log(cout)
          that.setData({
            category: cout
          })

        }

      }
    })
    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/banners/',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        // errMsg: "request:fail timeout";
        // wx.hideLoading();

      },
      success(res) {
        that.setData({ //很重要 
          bannerList: res.data.results,
          scroll: 1
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
      complete(res) {
      //  wx.hideLoading();

      },
      success(res) {
        clearInterval(that.interval);
        that.setData({ //很重要 
          newsList: res.data.results,
          scroll:1
        })
        wx.hideNavigationBarLoading()
        that.data.newsList = res.data.results;
        console.log(res.data.results)
       // clearInterval(that.interval);
      },
      fail() {
        wx.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        })
        wx.hideNavigationBarLoading();
       // clearInterval(that.interval);
      }

    })
    // this.complete(this);
    //  高度自适应 
    // wx.getSystemInfo({
    //   success: function(res) {
    //     var clientHeight = res.windowHeight,
    //       clientWidth = res.windowWidth,
    //       rpxR = 750 / clientWidth;
    //     var calc = clientHeight * rpxR - 80;
    //     console.log(calc)
    //     that.setData({
    //       winHeight: calc
    //     });

    //   }
    // });


    wx.getSystemInfo({
      success: (res) => {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR-79 ;
        console.log(calc)
        this.setData({
          pixelRatio: res.pixelRatio,
          // winHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          winHeight: calc
        })

      },
    })
    // //更改顶部标题
    // wx.setNavigationBarTitle({
    //   title: '资本邦'
    // })
  },


  /** 
   * 加载更多 
   */
  bindDownLoad: function(index) {
    var that = this;
    that.data.hasMore = false;
    if (that.data.newsId == null) {
      var currentTab = 0;
    } else {
      var currentTab = that.data.newsId;
    }
    wx.showNavigationBarLoading();
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

    that.setData({
      LoadMores: 1
    })

   // wx.hideLoading();
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
        wx.hideNavigationBarLoading();
        that.setData({ //很重要 
        //  resArr: res.data.results,
        })

        if (res.data.results!= undefined) {
          var cont = news.concat(res.data.results);
          console.log(cont);
          that.setData({
            newsList: cont,
            LoadMores: -1,
          })
          that.data.hasMore = true;
        } else {
          // wx.showToast({
          //   title: '已加载全部',
          //   duration: 2000,
          //   icon: 'none'
          // })
          that.setData({
            LoadMores: 2,

          })
        }


      },
      fail() {
        that.setData({
          LoadMores: -1,

        })
        wx.hideNavigationBarLoading();
      }

    })

  },
  scrollTop: function() {

  },
  scrollBottom: function() {
    var that = this;
    // that.setData({
    //   AddList: 1
    // })
    if (that.data.moreOne == 1) {
      that.bindDownLoad(++that.data.page);

      console.log(that.data.moreOne);
    }
    that.data.moreOne++;
    if (that.data.hasMore) {
      that.bindDownLoad(++that.data.page);
      console.log(that.data.page);
    }


  },
  //首页刷新按钮
  refresh: function(e) {
    var cout;
    var cout2;
    var newsId = 0;
    var arrays = {
      id: 0,
      name: '推荐'
    };

    var that = this //很重要 
    var newsId = that.data.newsId;
    that.setData({
      oneTab: '0',
      ok: true
    });
     // that.loading();
     
    if (newsId == undefined) {
      newsId = 0
    } else {
      newsId = that.data.newsId
    }
    console.log(newsId);
    wx.showLoading({
      title: '加载中',
    })
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
        //console.log(cout)
        // that.setData({
        //   category: cout
        // })

        // console.log(cout) 
      }
    })

    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/category/',
      method: 'GET',
      data: {
        page: 2
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        wx.hideLoading();
      },
      success(res) {
        if (cout != null) {
          cout2 = res.data.results;

          for (var i = 0; i < cout2.length; i++) {
            cout.push(cout2[i])
          }
          console.log(cout)
          that.setData({
            category: cout
          })

        }
      }
    })

    wx.request({
      url: 'http://api.chinaipo.com/zh-hans/api/banners/',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete() {
        // errMsg: "request:fail timeout";
        // wx.hideLoading();

      },
      success(res) {
        that.setData({ //很重要 
          bannerList: res.data.results,
          scroll: 1
        })
        that.data.bannersList = res.data.results;
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
      url: 'http://api.chinaipo.com/zh-hans/api/articles/',
      method: 'GET',
      data: {
        categoryId: newsId,
        page: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值 
      },
      complete(res) {
        wx.hideLoading();

      },
      success(res) {
        clearInterval(that.interval);
        that.setData({ //很重要 
          newsList: res.data.results,
          ok: false,
          scroll: 1
        })

        that.data.newsList = res.data.results;
        console.log(res.data.results)

      },
      fail() {
        wx.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'none'
        })

        console.log('errMsg');
      }

    })


  },

  newsSearch: function() {
    if(this.data.buttonClicked){
    wx.navigateTo({
      url: 'newsSearch/newsSearch',
    })
    }
    util.buttonClicked(this);
  },
  //旋转动画
  loading: function() {
    var that = this;
    that.animation = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',
      success: function (res) {
        console.log("res")
      }
    })
   
    //连续动画需要添加定时器,所传参数每次+1就行
    clearInterval(that.interval)
    that.interval = setInterval(function () {
      that.rotateAni(that.data.n++);
    }, 1000)

  },
  rotateAni: function(n) {
    console.log("rotate==" + n)
    this.animation.rotate(180 * (n)).step()
    this.setData({
      animation: this.animation.export()
    })
  },

  /** 
   * 用户点击右上角分享 
   */
  onShareAppMessage: function() {

  },
  /** 
   * 生命周期函数--监听页面初次渲染完成 
   */
  onReady: function() {

  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function() {

  },
  /** 
   * 生命周期函数--监听页面显示 
   */
  onShow: function() {
    this.setData({
      autoplay: true,
    })
   


  },

  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function() {
    this.setData({
      autoplay: false,
    })

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
    wx.stopPullDownRefresh()
  },

})