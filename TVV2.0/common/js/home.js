// home.js
// 导航和页面加载模块
var flag = getItem('flag',true)
window.onload = function () {
	//  设置ip和端口
	var setIp = document.getElementById('setIp')
	setIp.onclick = function () {
		var ipTxt = document.getElementById('ip').value
		var portTxt = document.getElementById('port').value
		var ip = document.getElementById('ip')
		var port = document.getElementById('port')
		var tip = document.getElementById('tip')
		var code = document.getElementById('inpatientAreaCode')
		var codeTxt = document.getElementById('inpatientAreaCode').value
		var errTip = document.getElementById('error') 
		if (!ipTxt){
			errTip.style.display = 'block'
			errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入IP地址'
			ip.focus()
			return
		}		
		if (!portTxt){
			errTip.style.display = 'block'
			errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入端口地址'
			port.focus()
			return
		}
		if (!codeTxt){
			errTip.style.display = 'block'
			errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入病区编号'
			code.focus()
			return
		}
		//存储 IP地址
		flag = config.setServer(ipTxt,portTxt,codeTxt)
		setItem('flag',true)
		if (flag) {
			// 显示 tip
			tip.style.display = 'block'
			errTip.style.display = 'none'
			errTip.innerHTML = ''
			setTimeout(function(){
				document.getElementById('box').style.display = 'none'
				tip.style.display = 'none'
			},500)
			home.init()
		}
	}
}

var home = {
	init: function () {
		// 如果flag == true 服务器已经设置 隐藏服务器设置页面 初始化页面
		var page = getItem('flag',true)   	
		if (page) {
			// 获取IP地址
			myUrl = getItem('url',true)
			Axios = axios.create({
				headers:{
					inpatientAreaCode: getItem('inpatientAreaCode',true)
				}
			})
			document.getElementById('box').style.display = "none"
			document.getElementById('pageHeader').style.display = 'flex'
			// 系统时间初始化
			systemTime.init()
			// IP修改初始化
			updataIp.init()
			return Promise.resolve('finish')
		}else{
			document.getElementById('box').style.display ='block'
			return Promise.reject("unfinish")
		}
	}
}
// updataIp
var updataIp = {
	ele:"",
	box:"",
	init:function(){
		//  设置元素
		this.ele = document.getElementById('updataIp')
		this.box = document.getElementById('boxSet')
		
		var that = this
		this.ele.onclick = function() {
			// 清空HTML
		    // 获取IP和PORT
		    var IP = getItem('ip',true)
				var PORT = getItem('port',true)
				var CODE = getItem('inpatientAreaCode',true)
			//  显示box 
			that.renderpage(IP,PORT,CODE)
		}
	},
	renderpage: function(IP,PORT,CODE){
		var html = '<div class="box-header">'+
  			'<i class="fa fa-cog"></i><span> 服务器修改</span>'+
  		'</div>'+
  		'<div class="form-wrapper">'+
  			'<span id="tip1"><i class="fa  fa-check-circle"></i> 修改成功</span>'+
  			'<span id="error1"></span>'+ 			
				'<div class="form-row">'+
					'<label class="ls5">IP：</label>'+
					'<input type="text" id="ip1" value="'+IP+'" />'+
				'</div>'+
				'<div class="form-row ">'+
					'<label>端口：</label><input type="text" id="port1" value="'+PORT+'" />'+
				'</div>'+
				'<div class="form-row ">'+
					'<label>病区编号：</label><input type="text" id="inpatientAreaCode1" value="'+CODE+'" />'+
				'</div>'+
				'<div class="form-row">'+
					'<input type="button"  class="btn" value="确定修改" onclick="subIP()" />'+
					'<input type="button"  class="btn btn-info" value="取消修改" onclick="cancle()" />'+
				'</div>'+
	  		'</div>'+
	  	'</div>'
	  	document.getElementById('boxCon').innerHTML = html
	  	this.box.style.display = 'block'
	}
}

//  取消修改IP 和 PORT
function cancle () {
	updataIp.box.style.display = 'none'
}
        
//  确定修改IP和PORT
function subIP () {

	    var ipTxt = document.getElementById('ip1').value
			var portTxt = document.getElementById('port1').value
			var ip = document.getElementById('ip1')
			var port = document.getElementById('port1')
			var tip = document.getElementById('tip1')
			var code = document.getElementById('inpatientAreaCode1')
			var codeTxt = document.getElementById('inpatientAreaCode1').value
			var errTip = document.getElementById('error1') 
			if (!ipTxt){
				errTip.style.display = 'block'
				errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入IP地址'
				ip.focus()
				return
			}		
			if (!portTxt){
				errTip.style.display = 'block'
				errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入端口地址'
				port.focus()
				return
			}
			if (!codeTxt){
				errTip.style.display = 'block'
				errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入病区编号'
				code.focus()
				return
			}
			//存储 IP地址
			flag = config.setServer(ipTxt,portTxt,codeTxt)
			setItem('flag',true)
			if (flag) {
				// 显示 tip
				tip.style.display = 'block'
				errTip.style.display = 'none'
				errTip.innerHTML = ''
				updataIp.box.style.display = 'none'
				tip.style.display = 'none'
				if (router.currentUrl == "/temp" || router.currentUrl =="/") {
					temp.init()
				}else if (router.currentUrl == "/trans"){
					trans.init()
				}
			}
}
	
//  系统时间模块
var systemTime = {
	sysTime:"",
	myTimer:"",
	startTime:"",
	init: function (){
		this.sysTime = document.getElementById('sysTime')
		this.loadData()
	},
	loadData: function () {
		clearInterval(this.myTimer)
		var that = this
		var url = myUrl + 'common/sysDateTime'
		return axios.get(url).then(function(res){
			var data = res.data
			that.startTime = data.sysDateTime
			that.myTimer = setInterval(function(){
        that.loadData().then(function (data) {
					that.sysTime.innerHTML = data.sysDateTime
				})
		},1000)
		return Promise.resolve(data)
		}).catch(function(){
			clearInterval(that.myTimer)
			that.myTimer = setInterval(function(){
        that.loadData().then(function (data) {
					that.sysTime.innerHTML = data.sysDateTime
				})
		},1000)
		})
	}
}
// 初始化导航 curEle toEle
var btn = document.querySelectorAll('.nav>li')
// 路由监听页面
var router = new Router()
router.init()
// 首页默认体温页面
router.route("/", function() {
	console.log('-----index------');
	// 导航设置
  [].slice.call(btn).forEach(function(btnEle){
		btnEle.classList.remove('active')
	})
	btn[0].classList.add('active')
	// 页面初始化
	home.init().then(function(res){
		temp.init()
	})	
})
// 首页默认体温页面
router.route("/temp", function() {
	console.log('-----temp------');
	// IP检查
	home.init();
	// 导航设置
  [].slice.call(btn).forEach(function(btnEle){
		btnEle.classList.remove('active')
	})
	btn[0].classList.add('active')
	// 页面初始化
	temp.init()
	trans.desorty()
})
// 输液报警
router.route("/trans", function() {
	 console.log('-----trans------');
	//  IP检查
	home.init();
		// 导航设置
		[].slice.call(btn).forEach(function(btnEle){
			btnEle.classList.remove('active')
		})
		btn[1].classList.add('active')
		// 页面初始化	 
	 trans.init()
	 temp.desorty()
})
// 电子白板页面
router.route("/aborad", function() {
	 console.log('-----aborad----');
	//  IP检查
	  home.init();
		// 导航设置
		[].slice.call(btn).forEach(function(btnEle){
			btnEle.classList.remove('active')
		})
		btn[2].classList.add('active')
	 drawBoard.init()
	 temp.desorty()
})