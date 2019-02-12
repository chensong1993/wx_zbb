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
    var abstract;
    var scene = decodeURIComponent(options.scene);
    var originalId = options.originalId;
    var titlepic = options.titlepic;
    var title = options.title;
    that.data.originalId = options.originalId
    that.data.titlepic = titlepic;
    that.data.title = title;
    console.log(scene);
    if (options.originalId == undefined) {
      originalId = scene;
    }
    // wx.showLoading({
    //   title: '加载中',

    // })
    wx.getSystemInfo({
      success: function(res) {
        if (res.model=="iPhone X"){
          that.setData({
            bottomHeight:130
          })
        }
        that.setData({
          brand: res.brand
        })
        console.log(res.model);
      },
    })
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
            newsContent: res.data.results[0].content.content,
            abstract : res.data.results[index].lead_in
          })

          content = "<div style=\"margin:0rpx; line-height:58rpx; font-size:34rpx; color:black;\">" + res.data.results[0].content.content + "</div>";
         // console.log(content);
          wxParse.wxParse('article', 'html', content, that);
         
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

  },

  /**
   * 生成分享图
   */
  share: function() {
    var that = this
    wx.showLoading({
      title: '正在生成图片中...'
    })

    setTimeout(function() {
      let promise1 = new Promise(function(resolve, reject) {
        wx.getImageInfo({
          src: that.data.titlepic,
          success: function(res) {
            console.log(res.path)
            resolve(res);
            console.log("ok13")
          }
        })
      });
      let promise2 = new Promise(function(resolve, reject) {
        wx.getImageInfo({
          src: that.data.titlepic,
          success: function(res) {
            console.log(res.path)
            resolve(res);
            console.log("ok45")
          }
        })
      });
      Promise.all([
        promise1, promise2
      ]).then(res => {
        console.log(res)
        const ctx = wx.createCanvasContext('shareImg')

        if (res[1].path == "img/ic_icon.png") {
          ctx.drawImage("../../../" + res[1].path, 0, 0, 545, 320)

        } else {
          ctx.drawImage(res[1].path, 0, 0, 545, 320)

        }
        let grd = ctx.createLinearGradient(0, 320, 545, 700)
        grd.addColorStop(0, 'white')
        grd.addColorStop(1, 'white')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 320, 545, 700)
       
          ctx.font = "normal none 32rpx normal "
          ctx.setFillStyle('black')
          that.dealWords({
            ctx: ctx,//画布上下文
            fontSize: 32,//字体大小
            word: that.data.title,//需要处理的文字
            maxWidth: 495,//一行文字最大宽度
            x: 30,//文字在x轴要显示的位置
            y: 350,//文字在y轴要显示的位置
            maxLine: 1//文字最多显示的行数
          })
          ctx.font = "normal none 26rpx normal "
          ctx.setFillStyle('black')
          that.dealWords({
            ctx: ctx,//画布上下文
            fontSize: 26,//字体大小
            word: that.data.abstract,//需要处理的文字
            maxWidth: 495,//一行文字最大宽度
            x: 30,//文字在x轴要显示的位置
            y: 470,//文字在y轴要显示的位置
            maxLine: 2//文字最多显示的行数
          })
        
       
        //ctx.drawImage("../../../img/ic_icon.png", 0, 0, 545, 320)
        console.log(res[1].path + "-----------");
        ctx.setTextAlign('center')
        ctx.setFillStyle('black')
        ctx.setStrokeStyle("rgb(224, 224, 224)")
        // //设置线条粗细
        // ctx.setLineWidth(1);
        // //设置直线的起点
        // ctx.lineTo(30, 505)
        // //设置直线的终点
        // ctx.lineTo(515, 505)
        //二维码位置
        ctx.drawImage("../../../img/zbb_two.jpg", 30, 585, 80, 80)
        ctx.font = "normal none 24rpx normal "
        ctx.fillText("长按识别小程序", 212, 611, 315, 20);
        ctx.fillText("进入", 155, 656, 315, 20);
        ctx.font = "normal none 24rpx normal "
        ctx.setFillStyle('#4675f9')
        ctx.fillText("资本邦", 215, 656, 315, 20);
        ctx.font = "normal none 24rpx normal "
        ctx.setFillStyle('black')
        ctx.fillText("阅读全文", 300, 656, 315, 20);
        ctx.stroke()
        ctx.draw(false,function(){
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 545,
            height: 700,
            destWidth: 545,
            destHeight: 700,
            canvasId: 'shareImg',
            success: function (res) {
              console.log(res.tempFilePath);
              that.setData({
                prurl: res.tempFilePath,
                hidden: false
              })
              wx.hideLoading()

            },
            fail: function (res) {
              console.log(res)
            }
          })
        })
      })
    
    }, 2000)
  },
  //cnavas文字换行
  //处理文字多出省略号显示
  dealWords: function (options) {
    options.ctx.setFontSize(options.fontSize);//设置字体大小
    var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);//实际总共能分多少行
    var count = allRow >= options.maxLine ? options.maxLine : allRow;//实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数

    var endPos = 0;//当前字符串的截断点
    for (var j = 0; j < count; j++) {
      var nowStr = options.word.slice(endPos);//当前剩余的字符串
      var rowWid = 0;//每一行当前宽度    
      if (options.ctx.measureText(nowStr).width > options.maxWidth) {//如果当前的字符串宽度大于最大宽度，然后开始截取
        for (var m = 0; m < nowStr.length; m++) {
          rowWid += options.ctx.measureText(nowStr[m]).width;//当前字符串总宽度
          if (rowWid > options.maxWidth) {
            if (j === options.maxLine - 1) { //如果是最后一行
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 40);    //(j+1)*18这是每一行的高度        
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 40);
            }
            endPos += m;//下次截断点
            break;
          }
        }
      } else {//如果当前的字符串宽度小于最大宽度就直接输出
        options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 40);
      }
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
            title: '已保存到相册',
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
        },fail(){
          wx.showToast({
            icon:"none",
            title: '保存失败',
          })
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
      var titlepic = null;
      if (newsList[index].featured_image == null) {
        titlepic = "../../../img/ic_icon.png";
      } else {
        titlepic = newsList[index].featured_image;
      }

      var title = newsList[index].title;
      console.log(index);

      wx.navigateTo({
        url: 'newsDetails?originalId=' + newsId + '&titlepic=' + titlepic + '&title=' + title,
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
  }
})