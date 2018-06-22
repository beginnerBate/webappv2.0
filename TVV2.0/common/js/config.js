/*
 全局变量配置
 1. 初始化全局变量
 2. 设置全局变量
 3. 修改全局变量
 4. 删除全局变量 
 -----------------------------
 存在localstorage里面
 * */
var TIMES = 2*1000
var myUrl = ''
var speekCon = ''
var speakPlaying = false
var speaking = false
var inpatientAreaCode =''
var Axios;
// -------------------------------------------- axios全局配置start--------------------------------------------------------
// axios超时配置
axios.defaults.timeout =  10000
// axios头部信息设置
// if (inpatientAreaCode)

// axios取消设置
var CancelToken = axios.CancelToken;
var cancel;
var cancel10,cancel20;
// -------------------------------------------- axios全局配置ends---------------------------------------

// -------------------------------------------- 本地存储start-------------------------------------------
// 初始化 
initData([
	{name:'port', value:''},
	{name:'ip', value:''},
	{name:'inpatientAreaCode',value:''}
])
// 
var config = {
	data:{
		port:'', //端口号
		ip:'',  // ip地址
		name:'mcim-webservice/',
		inpatientAreaCode:''
	},
	setUrl: function () {
		this.data.port = getItem('port',true)
		this.data.ip = getItem('ip',true)
		this.data.inpatientAreaCode = getItem('inpatientAreaCode',true)
		var url = "http://" + this.data.ip + ":" + this.data.port + "/mcim-webservice/"
		myUrl = url
		var that = this;
		Axios = axios.create({
			headers:{
				inpatientAreaCode:that.data.inpatientAreaCode
			}
		})
		setItem('url',url)
	},
	setServer:function (ipTxt,portTxt,codeTxt) {
		setItem('ip',ipTxt)
		setItem('port',portTxt)
		setItem('inpatientAreaCode',codeTxt)
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
// -------------------------------------------- 本地存储ends -------------------------------------------

// -------------------------------------------- 日期格式化start -------------------------------------------
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
function transDate(date) {
	var tt = new Date(date);
	var days = parseInt((new Date().getTime() - date) / 86400000);
	var today = new Date().getDate();
	var year = tt.getFullYear();
	var mouth = tt.getMonth() + 1;
	var day = tt.getDate();
	var time = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
	var min = tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
	var result, offset;
　　　　　　　offset = Math.abs(today - day);
　　　　if (days < 2 && offset<2) {
　　　if (offset === 0) {
			result = "今天 " + time + ":" + min;
		} else if (offset === 1) {
			result = "昨天 " + time + ":" + min;
		} 
	} else {
		result =  mouth + "-" + day + " " + time + ":" + min;
	}
	return result;
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
};
// -------------------------------------------- 日期格式化ends -------------------------------------------
function param(data) {
  var url = ''
  for (var k in data) {
    var value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
//观察者模式 实现页面的加载和刷新
var Observer = (function(){
	var _message = {}
	return {
		//注册信息接口
		regist: function(type, fn) {
			//如果消息不存在则应创建一个该消息类型
			if (typeof _message[type] === 'undefined') {
				_message[type] = [fn]
			}else {
				_message[type].push(fn)
			}
		},
		//发布信息接口
		fire: function(type, args) {
			if (!_message[type]){
				// 如果该消息没有被注册，则返回
				return
			}
			//定义消息信息
			var events = {
				type: type,
				args: args || {}
			},
			 i = 0 ,
			len = _message[type].length
			for (; i < len; i++){
				//依次执行注册的消息对应的动作序列
				_message[type][i].call(this,events)
			}
		},
		//移除信息接口
		remove:function (type,fn){
			if (_message[type] instanceof Array) {
				var i = _message[type].length - 1
				for (; i>=0;i--) {
					_message[type][i] === fn && _message[type].splice(i,1)
					
				}
			}
		}

	}
})();
/**
 * 数组对象装字符串是否相等 字符串比较是否相等cmp
 * @param {*} arrA 
 * @param {*} arrB 
 * @return Boolean
 */
function cmp (arrA, arrB) {
	var str1 = JSON.stringify(arrA)
	var str2 = JSON.stringify(arrB)
	return str1 == str2 ? true : false
}
