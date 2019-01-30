const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function renderTime(date) {
  var now = new Date(date);
  var dates = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();

  return dates;
}
//防止短时间内重复点击
function buttonClicked(self) {
  self.setData({
    buttonClicked: false

  })
  setTimeout(function() {
    self.setData({
      buttonClicked: true
    })

  }, 2000)
  return buttonClicked;
}



//扩展的方法需要在Module里去声明
module.exports = {
  formatTime: formatTime,
  renderTime: renderTime,
  buttonClicked: buttonClicked,
}