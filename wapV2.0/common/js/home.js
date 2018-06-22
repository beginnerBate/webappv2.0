// home.js
// 导航和页面加载模块
var flag = false
	//  设置ip和端口
var loading = document.getElementById('sloading')
var erroring = document.getElementById('erroring')
var homeConfig = function(){
	this.contentPage = document.getElementById('boxCon');
	this.order = 1
};
homeConfig.prototype = {
	first: function () {
		// 设置服务器
		var setIp = document.getElementById('setIp')
		var that = this;
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
				errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入病区编码'
				code.focus()
				return
			}
			//提交 IP地址 端口号 病区编码 
			flag = config.setServer(ipTxt, portTxt, codeTxt)
			
			// 第二步
			Observer.fire('second')
			// if (flag) {
			// 	// 显示 tip
			// 	tip.style.display = 'block'
			// 	errTip.style.display = 'none'
			// 	errTip.innerHTML = ''
			// 	setTimeout(function(){
			// 		document.getElementById('box').style.display = 'none'
			// 		tip.style.display = 'none'
			// 	},500)
			// 	home.init()	
			// }
		}
	},
	second: function () {
		// 设置采集端端口
		// 1. 页面初始化
		this.contentPage.innerHTML = '<div class="box-header">'+
																		'<i class="fa fa-cog"></i><span> 2. 采集端主机设置</span>'+
																	'</div>'+
																	'<div class="form-wrapper">'+
																		'<span id="tip"><i class="fa  fa-check-circle"></i> 设置成功</span>'+
																		'<span id="error"></span>'+																		
																		'<div class="form-row">'+
																			'<label class="ls5">IP:</label>'+
																			'<input type="text" id="ip" value="" />'+
																		'</div>'+
																		'<div class="form-row ">'+
																			'<label>端口:</label><input type="text" id="port" />'+
																		'</div>'+
																		'<div class="form-row">'+
																			'<input type="button" id="setIp" class="btn" value="下一步"/>'+
																		'</div>'+
																	'</div>'
				var setIp = document.getElementById('setIp')
				var that = this;
				setIp.onclick = function () {
				var ipTxt = document.getElementById('ip').value
				var portTxt = document.getElementById('port').value
				var ip = document.getElementById('ip')
				var port = document.getElementById('port')
				var tip = document.getElementById('tip')
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
				//提交 IP地址 端口号 病区编码 
				flag = config.setDaServer(ipTxt, portTxt)
				setItem('flag',true)
				// 第三步
				Observer.fire('third')		
			}														
	},
	third: function() {
		// 设置输液报警值
				// 1. 页面初始化
				this.contentPage.innerHTML = '<div class="box-header">'+
																				'<i class="fa fa-cog"></i><span> ③. 滴速报警值（滴/分钟）</span>'+
																			'</div>'+
																			'<div class="form-wrapper">'+
																				'<span id="tip"><i class="fa  fa-check-circle"></i> 设置成功</span>'+
																				'<span id="error"></span>'+																		
																				'<div class="form-row">'+
																					'<label class="ls5">IP:</label>'+
																					'<input type="text" id="dotRateAlarmValue" value="" />'+
																				'</div>'+
																				'<div class="form-row">'+
																					'<input type="button" id="setIp" class="btn" value="完成"/>'+
																				'</div>'+
																			'</div>'
				var setIp = document.getElementById('setIp')
				var that = this;
				setIp.onclick = function () {
						var dotRateAlarmValue = document.getElementById('dotRateAlarmValue').value
						var dotRateAlarm = document.getElementById('dotRateAlarmValue')
						var tip = document.getElementById('tip')
						var errTip = document.getElementById('error') 
						if (!dotRateAlarmValue){
						errTip.style.display = 'block'
						errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入滴速报警值'
						dotRateAlarm.focus()
						return
						}		
						//提交 IP地址 端口号 病区编码 
						flag = config.setDotRateAlarmValue(dotRateAlarmValue)
						// 完成设置
						Observer.fire('finish')	
								// 显示 tip
						tip.style.display = 'block'
						errTip.style.display = 'none'
						errTip.innerHTML = ''
						setTimeout(function(){
							document.body.removeChild(document.getElementById('box'))
							tip.style.display = 'none'
						},500)	
				}	
	}
}
// homeConfig 测试
var test = new homeConfig()
// 第一步
test.first()

// 第二步
Observer.regist('second',function(e){
	test.second()
})

// 第三步
Observer.regist('third',function(e){
	test.third()
})

// 完成设置 初始化路由 路由监听页面
var router = new Router()
Observer.regist('finish',function(e){
	setItem('flag',true)
		// 页面初始化
		router.init()
})

// 首页模块
var home = {
	init: function () {
		// 如果flag == true 服务器已经设置 隐藏服务器设置页面 初始化页面
		var page = getItem('flag',true)   		
		if (page) {
			// 设置IP地址
			myUrl = getItem('url',true)
			// 设置Axios
			Axios = axios.create({
				headers:{
					inpatientAreaCode: getItem('inpatientAreaCode',true)
				}
			})
			// 设置滴速报警值
			dotRateAlarmValue = getItem("dotRateAlarmValue",true)
			// 移除box
		}else{
			document.getElementById('box').style.display ='block'
		}
	},
	initPage: function () {
		var pageHtml = '<section class="top-header" id="topHeader">'+
											'<h1 id="title"></h1>'+
										'</section>'+
										'<section class="header wap">'+
											'<div class="nav-wrapper">'+
												'<ul class="nav">'+
													'<li class="active">'+
														'<a href="#/temp">'+
															'<span class="fa img fa-thermometer-half"></span>'+
															'<span class="txt">体温监测</span>'+
														'</a>'+
													'</li>'+
													'<li>'+
														'<a href="#/trans">'+
															'<span class="fa img fa-microchip"></span>'+
															'<span class="txt">输液监测</span>'+
														'</a>'+
													'</li>'+
													'<li>'+
														'<a href="#/set">'+
															'<span class="fa img fa-cog"></span>'+
															'<span class="txt">系统设置</span>'+
														'</a>'+
													'</li>'+
												'</ul>'+
											'</div>'+
										'</section>'+
										'<section class="page">'+
											'<div class="h-page" id="hPage">'+
											'</div>'+
										'</section>';
			document.getElementById('pageView').innerHTML = pageHtml;
	}
}
    
//  系统时间模块
var systemTime = {
	myTimer:"",
	startTime:"",
	init: function (){
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
				})
		},1000)
			return Promise.resolve(data)
		}).catch(function(){
        that.loadData()
		})
	}
}

//路由模块
// 初始化导航 curEle toEle
var btn = document.querySelectorAll('.nav>li')

// 首页默认体温页面
router.route("/", function() {
	console.log('-----home------');
	// 页面初始化
	home.init();
	// 导航设置
	[].slice.call(btn).forEach(function(btnEle){
		btnEle.classList.remove('active')
	})
	btn[0].classList.add('active')
})
// 首页默认体温页面
router.route("/temp", function() {
	console.log('-----temp------');
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
router.route("/set", function() {
	 console.log('-----set----');
		// 导航设置
		[].slice.call(btn).forEach(function(btnEle){
			btnEle.classList.remove('active')
		})
		btn[2].classList.add('active')
	 myset.init()
	//  temp.desorty()
})