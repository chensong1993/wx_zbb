// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// module.exports = {
//   formatTime: formatTime
// }
function renderTime(date) {
var da = new Date(date);
var Year = da.getFullYear(); //ie火狐下都可以
var Month = da.getMonth() + 1;
var Day = da.getDate();
var Hours = da.getHours();
var Minutes = da.getMinutes();
var Seconds = da.getSeconds();
var CurrentDate = "";
CurrentDate += Year + "-";
if (Month >= 10) {
  CurrentDate += Month + "-";
}
else {
  CurrentDate += "0" + Month + "-";
}
if (Day >= 10) {
  CurrentDate += Day;
}
else {
  CurrentDate += "0" + Day;
}
if (Hours < 10) {
  Hours = "0" + Hours;
}
if (Minutes < 10) {
  Minutes = "0" + Minutes;
}
if (Seconds < 10) {
  Seconds = "0" + Seconds;
}
return CurrentDate  ;
}
//扩展的方法需要在Module里去声明
module.exports = {
  renderTime: renderTime
}