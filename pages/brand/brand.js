//logs.js
Page({

  data:{
   
    setInter: '',
    n:1
  },
  onShow: function () {
    var that=this;
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
    that.data.setInter =setInterval(function () {
      // animation.translateY(-60).step()
      console.log(that.data.n);
      console.log("rotate==" + that.data.n)
      that.animation.rotate(180 * (that.data.n++)).step()
      that.setData({
        animation: that.animation.export()
      })
    }, 1000)
    
  },
 onHide:function(){
   var that=this;
   clearInterval(that.data.setInter)
 },
})