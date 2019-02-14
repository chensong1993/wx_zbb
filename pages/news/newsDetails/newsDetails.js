var wxParse = require("../../../wxParse/wxParse.js");
var util = require("../../../utils/util.js");
//获取应用实例
const app = getApp()
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
   // var title = options.title;
    that.data.originalId = options.originalId
    that.data.titlepic = titlepic;
   // that.data.title = title;
    console.log(scene);
    if (options.originalId == undefined) {
      originalId = scene;
    }
    console.log(titlepic);
    // wx.showLoading({
    //   title: '加载中',

    // })
    wx.getSystemInfo({
      success: function(res) {
        if (res.model == "iPhone X" || res.model == "iPhone XR" || res.model == "iPhone XS" || res.model == "iPhone XS Max") {
          that.setData({
            bottomHeight: 130
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
          var date = util.renderTime(res.data.results[index].publishing_date.replace(/-/g, '/'));
          //that.data.title = res.data.results[index].title;
          console.log(date);
          that.setData({ //很重要 
            newsDetails: res.data.results[index],
            newsDate: date,
            content: 1,
            newsContent: res.data.results[0].content.content,
            abstract: res.data.results[index].lead_in,
            title: res.data.results[index].title
          })

          content = "<div style=\"margin:0rpx; line-height:58rpx; font-size:36rpx; color:black;\">" + res.data.results[0].content.content + "</div>";
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
            that.data.avatarUrl = res.data[0].userInfo.avatarUrl;
            that.data.nickName = res.data[0].userInfo.nickName;
            
          }
          console.log(1111111111000)
        },
        fail: console.error
      })

  },

  /**
   * 生成分享图
   */
  onGotUserInfo: function(e) {
    var that = this;
    var avatarUrl;
    var nickName;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          //   wx.getUserInfo({
          //   success: res => {
          app.globalData.loading = -1;
         
          const db = wx.cloud.database();
          db.collection('user_info').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              _id: app.globalData.openid,
              openid: app.globalData.openid,
              userInfo: e.detail.userInfo
            },
            fail() {
              app.globalData.loading = 1
            }
          })
          //  }
          //  })

        }
      }
    })
    if (e.detail.userInfo.avatarUrl == undefined) {
      nickName = that.data.nickName;
      avatarUrl = that.data.avatarUrl;
    } else {
      nickName = e.detail.userInfo.nickName;
      avatarUrl = e.detail.userInfo.avatarUrl;
    }
    console.log(avatarUrl);
  
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
      let promise3 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: avatarUrl,
          success: function (res) {
            console.log(res.path)
            resolve(res);
            console.log("ok78")
          }
        })
      });
      Promise.all([
        promise1, promise2, promise3
      ]).then(res => {
        console.log(res)
        const ctx = wx.createCanvasContext('shareImg')

        if (res[1].path == "img/ic_icon.png") {
          ctx.drawImage("../../../" + res[1].path, 0, 0, 645, 320)

        } else {
          ctx.drawImage(res[1].path, 0, 0, 645, 320)

        }
        console.log(res[2].path);
       
        let grd = ctx.createLinearGradient(0, 320, 645, 800)
        grd.addColorStop(0, 'white')
        grd.addColorStop(1, 'white')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 320, 645,800)

        ctx.font = "normal normal 38rpx sans-serif "
        ctx.setFillStyle('black')
        var text = that.data.title; //这是要绘制的文本
        var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
        console.log(chr.length);
        var temp = " ";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < 565) {
            temp += chr[a];

          } else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = " ";
            console.log(row);
          }
        }
        console.log(ctx.measureText(text).width);
        row.push(temp);
        console.log(row);
        //如果数组长度大于2 则截取前两个
        if (row.length > 2) {
          var rowCut = row.slice(0, 2);
          var rowPart = rowCut[1];
          var test = "";
          var empty = [];
          console.log(row.length);
          for (var a = 0; a < rowPart.length; a++) {
            if (ctx.measureText(test).width < 565) {
              test += rowPart[a];
            } else {
              break;
            }
          }
          empty.push(test);
          var group = empty[0] + "..." //这里只显示两行，超出的用...表示
          rowCut.splice(1, 1, group);
          row = rowCut;
        }


        for (var b = 0; b < row.length; b++) {
          if (row.length < 2) {
            ctx.font = "normal normal 42rpx  sans-serif"
            ctx.setFillStyle('black')
            ctx.fillText(row[b], 30, 420 + b * 50, 575);
            ctx.setLineWidth(1);
            ctx.lineTo(40, 475);
            ctx.lineTo(600, 475);
          } else {
            ctx.font = "normal normal 38rpx sans-serif "
            ctx.setFillStyle('black')
            ctx.fillText(row[b], 30, 395 + b * 50, 575);
            ctx.setLineWidth(1);
            ctx.lineTo(40, 475);
            ctx.lineTo(600, 475);
          }

        }
        ctx.setFillStyle("gainsboro");

        var text1 = that.data.abstract; //这是要绘制的文本
        var chr1 = text1.split(""); //这个方法是将一个字符串分割成字符串数组
        var temp1 = "";
        var row1 = [];
        for (var a = 0; a < chr1.length; a++) {
          if (ctx.measureText(temp1).width < 715) {
            temp1 += chr1[a];
          } else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row1.push(temp1);
            temp1 = "";
          }
        }
        row1.push(temp1);

        //如果数组长度大于2 则截取前两个
        if (row1.length > 2) {
          var rowCut = row1.slice(0, 2);
          var rowPart = rowCut[1];
          var test = "";
          var empty = [];
          for (var a = 0; a < rowPart.length; a++) {
            if (ctx.measureText(test).width < 715) {
              test += rowPart[a];
            } else {
              break;
            }
          }
          empty.push(test);
          var group = empty[0] + "..." //这里只显示两行，超出的用...表示
          rowCut.splice(1, 1, group);
          row1 = rowCut;
        }

        for (var b = 0; b < row1.length; b++) {
          ctx.font = "normal normal 30rpx sans-serif "
          ctx.setFillStyle("#666");
          ctx.fillText(row1[b], 40, 540 + b * 50, 565);

        }
       

        //二维码位置
        ctx.drawImage("../../../img/zbb_two.jpg", 30, 625, 140, 140)
        ctx.font = "normal normal 26rpx sans-serif "
        ctx.fillText("长按识别小程序,", 175, 755, 250);
        ctx.fillText("进入", 365, 755, 60);
        ctx.font = "normal normal 26rpx sans-serif "
        ctx.setFillStyle('#4675f9')
        ctx.fillText("资本邦", 420, 755, 100);
        ctx.font = "normal normal 26rpx sans-serif "
        ctx.setFillStyle("#666");
        ctx.fillText("阅读全文", 505, 755, 200);
        ctx.font = "normal blod 30rpx sans-serif "
        ctx.setFillStyle("black");
        ctx.fillText(nickName, 245, 675, 200);
        ctx.font = "normal normal 26rpx sans-serif "
        ctx.setFillStyle("#666");
        ctx.fillText("正在阅读本文章", 395, 675, 400);
        ctx.stroke();
         //头像
        ctx.save();
        ctx.beginPath(); //开始绘制
        //先画个圆
        ctx.arc(205, 670, 30, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(res[2].path, 175, 640, 60, 60);
        ctx.restore();
        ctx.draw(false, function() {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 645,
            height: 800,
            destWidth: 645,
            destHeight: 800,
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
        })
      })

    }, 2000)
  },
  //cnavas文字换行
  //处理文字多出省略号显示
  dealWords: function(options) {
    options.ctx.setFontSize(options.fontSize); //设置字体大小
    var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth); //实际总共能分多少行
    var count = allRow >= options.maxLine ? options.maxLine : allRow; //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数

    var endPos = 0; //当前字符串的截断点
    for (var j = 0; j < count; j++) {
      var nowStr = options.word.slice(endPos); //当前剩余的字符串
      var rowWid = 0; //每一行当前宽度    
      if (options.ctx.measureText(nowStr).width > options.maxWidth) { //如果当前的字符串宽度大于最大宽度，然后开始截取
        for (var m = 0; m < nowStr.length; m++) {
          rowWid += options.ctx.measureText(nowStr[m]).width; //当前字符串总宽度
          if (rowWid > options.maxWidth) {
            if (j === options.maxLine - 1) { //如果是最后一行
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 40); //(j+1)*18这是每一行的高度        
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 40);
            }
            endPos += m; //下次截断点
            break;
          }
        }
      } else { //如果当前的字符串宽度小于最大宽度就直接输出
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
        },
        fail() {
          wx.showToast({
            icon: "none",
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
        console.log("../../../img/ic_icon.png")
      } else {
        titlepic = newsList[index].featured_image;
        console.log("png")
      }

    
      console.log(index);

      wx.navigateTo({
        url: 'newsDetails?originalId=' + newsId + '&titlepic=' + titlepic ,
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
     
     
      if (href.indexOf("html") > -1) {
        wx.navigateTo({
          url: 'newsDetails?originalId=' + originalId + '&titlepic=' + '../../../img/ic_icon.png' ,
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
    // if (ops.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(ops.target)
    // }
    // return {
    //   title: 'xx小程序',
    //   path: 'pages/index/index',
    //   success: function(res) {
    //     // 转发成功
    //     console.log("转发成功:" + JSON.stringify(res));
    //   },
    //   fail: function(res) {
    //     // 转发失败
    //     console.log("转发失败:" + JSON.stringify(res));
    //   }
    // }
  }
})