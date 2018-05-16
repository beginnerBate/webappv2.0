/*
 全局变量配置
 1. 初始化全局变量
 2. 设置全局变量
 3. 修改全局变量
 4. 删除全局变量 
 -----------------------------
 存在localstorage里面
 * */
var BASEURL = 'https://www.easy-mock.com/mock/5aee8d0da4c2e060a82fb809/webservice/'
var TIMES = 2000
// 初始化 
initData([
	{name:'port', value:''},
	{name:'ip', value:''}
])
// 
var config = {
	data:{
		port:'', //端口号
		ip:'',  // ip地址
		name:'webservice/'
	},
	setUrl: function () {
		this.data.port = getItem('port',true)
		this.data.ip = getItem('ip',true)
		var url = "http://" + undefined.data.ip + ":" + undefined.data.port + "/webservice/"
		setItem('url',url)
		console.log(url)
	},
	setServer:function (ipTxt,portTxt) {
		setItem('ip',ipTxt)
		setItem('port',portTxt)
		this.setUrl()
		return true
	}
}
function setItem (name, value) {
  localStorage.setItem(name, value)
}

function getItem (name, type) {
  var res = localStorage.getItem(name)
  if (res !== null) {
    if (!type) { // 为布尔值
      res = JSON.parse(res)
    }
  }
  return res
}

function initData (init) {
  for (var i = 0; i < init.length; i++) {
    if (localStorage.getItem(init[i].name) === null) {
      setItem(init[i].name, init[i].value)
    }
  }
}
function formatDate(date, fmt) {
    date = new Date(date)
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            var str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
};
function getJiFenDetailInfo(url) {
      return axios.get(url).then(function(res){
        return Promise.resolve(res);
      },function(err){
        return Promise.reject(err);
      });
}