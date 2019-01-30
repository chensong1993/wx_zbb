var wxParse = require("../../../wxParse/wxParse.js");
var util = require("../../../utils/util.js");
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    buttonClicked: true,
    size: 30,
    hidden: true
  },

  onLoad: function(options) {
    var that = this;
    var index = 0;
    var content;
    var scene = decodeURIComponent(options.scene);
    var originalId = options.originalId;
    var titlepic = options.titlepic;
    that.data.titlepic = titlepic;
    var title = options.title;
    that.data.originalId = options.originalId
    console.log(scene);
    if (options.originalId == undefined) {
      originalId = scene;
    }
    // wx.showLoading({
    //   title: '加载中',

    // })
    wx.showNavigationBarLoading();
    that.setData({
        content: -1,
      }),
      wx.request({
        url: 'http://api.chinaipo.com/zh-hans/api/article/',
        data: {
          "originalId": originalId,
          "page": 1
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          // wx.hideLoading();
        },
        success(res) {
          wx.hideNavigationBarLoading();
          that.setData({ //很重要 
            newsDetails: res.data.results[index],
            newsDate: res.data.results[index].publishing_date,
            content: 1,
            newsContent: res.data.results[0].content.content
          })

          content = "<div style=\"margin:0rpx; line-height:50rpx; font-size:30rpx; color:black; word-break:normal\">" + res.data.results[0].content.content + "</div>";

          wxParse.wxParse('article', 'html', content, that);
          //console.log(content)
        }
      })
    //详情二维码
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=18_fr4dLHEOLbB3uMImTdfDW4GnQV11GHyoRHkETZFQAdpfIQrnDXDp8tlDPRgITAYB8UPRRSjWWAQ5VcMhP14erPn5I9Yr13rYMWKE4fOuykxKp-qyyo766GYWP1WcDH3bUeKkBRYb67LprVmxPPMjAJATTQ',

      header: {
        'content-type': 'application/json; charset=UTF-8' // 默认值 
      },
      data: {
        scene: scene,
        page: "pages/news/newsDetails/newsDetails"
      },
      method: "POST",
      responseType: 'arraybuffer', //设置响应类型
      success(res) {
        console.log(res)
        let base64　 = wx.arrayBufferToBase64(res.data); //对数据进行转换操作

        that.setData({
          base64: "data:image/png;base64," + base64
        })
        console.log(base64)
      },
      fail(e) {
        console.log(e)
      }

    })
    console.log(titlepic);
    let promise1 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: titlepic,
        success: function(res) {
          console.log(13213)
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: titlepic,
        success: function(res) {
          console.log(13213)
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, promise2
    ]).then(res => {
      console.log(res)
      const ctx = wx.createCanvasContext('shareImg')

      //主要就是计算好各个图文的位置

      ctx.drawImage(res[1].path, 0, 0, 545, 320)
      console.log(res[0].path);
      ctx.setTextAlign('center')
      ctx.setFillStyle('black')
      ctx.setFontSize(32)
      ctx.setStrokeStyle("rgb(224, 224, 224)")
      var line = 0;
      var chr = title.split(""); //这个方法是将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < 460) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);

      //如果数组长度大于2 则截取前两个
      if (row.length > 2) {
        var rowCut = row.slice(0, 2);
        var rowPart = rowCut[1];
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (ctx.measureText(test).width < 460) {
            test += rowPart[a];
          } else {
            break;
          }
        }
        // empty.push(test);
        // var group = empty[0]//这里只显示两行，超出的用...表示
        // rowCut.splice(1, 1, group);
        // row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        //  ctx.fillText(title, 200, 370, 545, 200)
        ctx.fillText(row[b], 270, 370 + b * 40, 545, 350);
        line = b;
      }
      //设置线条粗细
      ctx.setLineWidth(1);
      //设置直线的起点
      ctx.lineTo(30, 400 + line * 40)
      //设置直线的终点
      ctx.lineTo(545, 400 + line * 40)
      //二维码位置
      ctx.drawImage("../../../img/zbb_two.jpg", 30, 490 + line * 40, 80, 80)
      ctx.font = "normal none 24px normal "
      ctx.fillText("长按识别小程序", 220, 520 + line * 40, 315, 20);
      ctx.fillText("进入资本邦阅读全文", 245, 565 + line * 40, 315, 20);
      ctx.stroke()
      ctx.draw()
    })
  },
  /**
   * 生成分享图
   */
  share: function() {
    if (this.data.titlepic != undefined) {
      var that = this
      wx.showLoading({
        title: '努力生成中...'
      })
      var height = 585 + that.data.line * 40
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 545,
        height: 636,
        destWidth: 545,
        destHeight: 636,
        canvasId: 'shareImg',
        success: function(res) {
          console.log(res.tempFilePath);
          that.setData({
            prurl: res.tempFilePath,
            hidden: false
          })
          wx.hideLoading()

        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '生成失败',
      })
    }
  },
  //关闭生成的图片
  onCloseImg: function() {
    this.setData({
      hidden: true
    })
  },
  /**
   * 保存到相册
   */
  save: function() {
    if (this.data.titlepic != undefined) {
      var that = this
      //生产环境时 记得这里要加入获取相册授权的代码
      wx.saveImageToPhotosAlbum({
        filePath: that.data.prurl,
        success(res) {
          wx.showToast({
            title: '保存到相册',
          })
          that.setData({
            hidden: true
          })
          // wx.showModal({
          //   content: '图片已保存到相册，赶紧晒一下吧~',
          //   showCancel: false,
          //   confirmText: '好哒',
          //   confirmColor: '#72B9C3',
          //   success: function (res) {
          //     if (res.confirm) {
          //       console.log('用户点击确定');
          //       that.setData({
          //         hidden: true
          //       })
          //     }
          //   }
          // })
        }
      })
    }

  },

  //跳转详情页
  newsDetails: function(e) {
    var that = this
    if (that.data.buttonClicked) {
      //拿到点击的index下标
      var index = e.target.dataset.index
      //将对象转为string
      var newsList = that.data.newsDetails.otherLinks;

      var newsId = newsList[index].originalId;
      console.log(index);

      wx.navigateTo({
        url: 'newsDetails?originalId=' + newsId,
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
  onPullDownRefresh: function() {
    var that = this;
    var originalId = that.data.originalId
    var index = 0;
    // wx.showLoading({
    //   title: '加载中',

    // })
    wx.showNavigationBarLoading();
    that.setData({
        content: -1,
      }),
      wx.request({
        url: 'http://api.chinaipo.com/zh-hans/api/article/',
        data: {
          "originalId": originalId,
          "page": 1
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        complete() {
          //  wx.hideLoading();
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        },
        success(res) {
          that.setData({ //很重要 
            newsDetails: res.data.results[index],
            newsDate: res.data.results[index].publishing_date,
            content: 1,

          })


          var content = "<div style=\"margin:0rpx; line-height:50rpx;  font-size:30rpx; color:black; word-break:normal\">" + res.data.results[0].content.content + "</div>";

          wxParse.wxParse('article', 'html', content, that);
          console.log(content)

        }
      })


  },
  /**
   * 详情tag点击事件
   */
  detailTag: function(e) {
    var that = this;
    var tag = e.target.dataset.tag;
    console.log(tag)
    if (that.data.buttonClicked) {
      wx.navigateTo({
        url: '../detailTag/detailTag?detailTag=' + tag,
      })
    }
    util.buttonClicked(this);
  },
  wxParseTagATap: function(e) {
    if (this.data.buttonClicked) {
      var href = e.currentTarget.dataset.src;
      console.log(href);
      var originalId = href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.html'));
      var stockCode = href.substring(href.lastIndexOf('/') + 1);

      console.log(originalId);
      if (href.indexOf("html") > -1) {
        wx.navigateTo({
          url: '../newsDetails/newsDetails?originalId=' + originalId,
        })
      }

      if (href.indexOf("stock") > -1) {
        wx.navigateTo({
          url: '../../data/stockDetails/stockDetails?stockCode=' + stockCode,
        })
      }
    }
    util.buttonClicked(this);
  },

  /** 
   * 用户点击右上角分享 
   */
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: 'xx小程序',
      path: 'pages/index/index',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
})