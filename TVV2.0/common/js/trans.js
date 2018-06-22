var trans = {
	listData:[],
	listData01:[],
	listData02:[],
	soundBtn: '',
	timer:"",
	timer1:'',
	timer2:'',
	transScroll:"",
	transScroll10:"",
	transScroll20:"",
	init:function () {
		// 取消cancel
		if (typeof cancel == "function"){
			cancel()
		}
		if (typeof cancel10 == "function"){
			cancel10()
		}
		if (typeof cancel20 == "function"){
			cancel20()
		}
		// 页面初始化
		this.initPage()
		this.listData = []
		this.listData01 = []
		this.listData02 = []
		// 打开声音开关 
		this.soundBtn = document.getElementById('sounds')
		this.soundBtn.style.display = 'block'
		speekCon = ''
		//  获取数据
		var that = this
		// all输液报警
		this.getData()

		// 10毫升的数据报警
		this.getData10()

		// 20ml到10ml的输液报警
		this.getData20()

		// 监听
		Observer.regist('transDel',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// that.desorty()
			transAlert.init(e.args.item)
		})
		Observer.regist('tranShow',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// 关闭 体温刷新
			transShow.init(e.args.item)
		})
	},
	initPage:function () {
		var pageHtml = '<div class="page-row">'+
										'<div class="page-left">'+
											'<div id="transwrapper" class="trans-wrapper">'+
												'<ul id="transList" class="item-list">'+
												'</ul>'+
											'</div>'+
										'</div>'+
										'<div class="page-right">'+
											'<div class="m-trans-alarm-warning">'+
												'<h1>20mL 报警</h1>'+
												'<div class="m-trans-alarm-wrapper" id="trans20">'+
													'<ul id="transList20">'+
													'</ul>'+
												'</div>'+
											'</div>'+
											'<div class="m-trans-alarm-danger">'+
												'<h1>10mL 报警</h1>'+
												'<div class="m-trans-alarm-wrapper" id="trans10">'+
													'<ul id="transList10">'+
													'</ul>'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</div>'
		document.getElementById('hPage').innerHTML = pageHtml
		erroring.style.display = 'none'
	},
	getstartTime: function(){
		var mydate = new Date(systemTime.startTime)
		var date = new Date(mydate.setMinutes(mydate.getMinutes() - 10))
		var startTime10 = formatDate(date, 'yyyy-MM-d hh:mm:ss')
		return Promise.resolve(startTime10)
	},
	getData: function() {
		// 1. 清除定时器
		clearInterval(this.timer)
		if (typeof cancel === "function") {
			cancel()
		}
		var that = this;
	  return	this.getstartTime().then(function(data){
			var url = myUrl + 'app/newestInfusionMonitors' 
		  return Axios.get(url,{
				cancelToken: new CancelToken(function executor(c) {
					// executor 函数接收一个 cancel 函数作为参数
					cancel = c;
				})
			}).then(function(res){	
				var data = res.data
				if (data.code ==200) {
					if(!cmp(that.listData02,data.data)){
						that.renderHtml(data.data)
						that.listData02 = data.data
					}
				}else {
					that.listData02 = []
					that.renderHtml([])
				}
				erroring.style.display = 'none'
				that.timer = setInterval(function(){
					if (router.currentUrl == "/trans"){
						that.getData()
					}else {
						that.desorty()
					}
			},TIMES)
				return Promise.resolve(true)
			}).catch(function(){
				// 清除定时器
				clearInterval(that.timer)
				if (typeof cancel == "function") {
					 cancel()
				}
				if (router.currentUrl == "/trans") {
					erroring.style.display = 'flex'
					that.listData02 = []
					that.renderHtml(that.listData02)
					// 定时器
					that.timer = setInterval(function(){
						if (router.currentUrl == "/trans"){
							that.getData()
						}else {
							that.desorty()
						}
				},TIMES)
					return Promise.resolve(true)
				}	else{
					erroring.style.display = 'none'
					clearInterval(that.timer)
					return false
				}
			})
		})
	},
	renderHtml: function (list) {
				var html = ''
				for (var i = 0; i<list.length;i++) {
					var value = JSON.stringify(list[i])
					html += '<li>'
					if (list[i].surplus <= 20 && list[i].surplus>10){
						html += "<div class='m-trans-item warning' onclick='showTrans("+value+")'>"
					}else if (list[i].surplus <= 10){
						html += "<div class='pos m-trans-item danger' onclick='showTrans("+value+")'>"
					}else {
						html += "<div class='m-trans-item' onclick='showTrans("+value+")'>"
					}
		html +=	  '<p>床号: '+list[i].bedNumber+'</p>'+
						'<p>容量: '+list[i].volum+'<i>mL</i></p>'+
						'<p>剩量: '+list[i].surplus+'<i>mL</i></p>'+
						'<p>滴速: '+list[i].dotRate+' <i> 滴/分</i></p>'+
						'<p>状态: '+formatStatus(list[i].runStatus)+' <i> </i></p>'
		// if (list[i].surplus <= 10) {
		// 	html += "<span class='close transclose'  onclick='showMsgTrans("+value+")'>×</span>"
		// }
		html +='</div></li>'
				}
				var transList = document.getElementById('transList')
				transList.innerHTML = html
				var transWrapper = document.getElementById('transwrapper')
				if (!this.transScroll){
					this.transScroll = new BScroll(transWrapper,{click:true})
				}else{
					this.transScroll.refresh()
				}
				
	},
	getData10: function () {
		// 1. 清除定时器
		clearInterval(this.timer1)
		if(typeof cancel10 == "function") {
			cancel10()
		}
		// 2.获取10ml的数据
		var that = this
		return this.getstartTime().then(function(data){
			// var mydate ={orderBy:'surplus',status:0}
			var url = myUrl + 'app/newestInfusionMonitors10' 
			// url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
			Axios.get(url,{
				cancelToken: new CancelToken(function executor(c) {
					// executor 函数接收一个 cancel 函数作为参数
					cancel10 = c;
				})
			}).then(function(res){
				var data = res.data
				if (data.code ==200) {
					if(cmp(that.list, data.data)){
						changeFlag = false
					}else{
						changeFlag = true
						Observer.fire('play')
						that.listData = data.data
						that.renderHtml10(data.data)
					}

				}else {
					that.listData = []
					that.renderHtml10(that.listData)
				}
				that.timer1 = setInterval(function(){
					if (router.currentUrl == "/trans"){
						that.getData10()
					}else {
						that.desorty()
					}
			},TIMES)

			}).catch(function(){
				// 1.清除定时器
				clearInterval(that.timer1)
				// 2.取消请求
				if(typeof cancel10 =="function") {
					cancel10()
				}
				// 3.根据路由渲染页面
				if (router.currentUrl == "/trans") {
					that.listData = []
					that.renderHtml10(that.listData)

					// 定时器
					that.timer1 = setInterval(function(){
						if (router.currentUrl == "/trans"){
							that.getData10()
						}else {
							that.desorty()
						}
				},TIMES)
				}	else{
					clearInterval(that.timer1)
					return false
				}
			})
		})
	},
	renderHtml10: function (list) {
			var html =''
			for(var i=0; i<list.length;i++) {
				html += '<li>'+
				'<span>床号：'+list[i].bedNumber+'</span>'+
				'<span>剩量：'+list[i].surplus+'mL</span>'+
				'<span>状态：'+formatStatus(list[i].runStatus)+'</span>'+
			'</li>'	
			}
			var transList = document.getElementById('transList10')
			transList.innerHTML = html
			var transWrapper10 = document.getElementById('trans10')
			if (!this.transScroll10){
				this.transScroll10 = new BScroll(transWrapper10)
			}else{
				this.transScroll10.refresh()
			}
			this._getSpeech(list)
	},
	getData20: function () {
		// 1. 清除定时器
		clearInterval(this.timer2)
		// 2. 取消请求
		if (typeof cancel20 === 'fucntion'){
			cancel20()
		}
		// 3.获取10ml的数据
		var that = this
	  return this.getstartTime().then(function(data){
			// var mydate ={alarmValue1:10,alarmValue2:20,startTime: data,orderBy:'surplus',status:0}
			var url = myUrl + 'app/newestInfusionMonitors20' 
			// url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
			Axios.get(url,{
				cancelToken: new CancelToken(function executor(c) {
					// executor 函数接收一个 cancel 函数作为参数
					cancel20 = c;
				})
			}).then(function(res){
				var data = res.data
				if (data.code ==200) {
					if (!cmp(that.listData01, data.data)) {
						// dom渲染 如果数据变化
						that.renderHtml20(data.data)
						that.listData01 = data.data
					}
				}else {
					that.listData01 = []
					that.renderHtml20(that.listData01)
				}
				// 定时器
				that.timer2 = setInterval(function(){
					if (router.currentUrl == "/trans"){
						that.getData20()
					}else {
						that.desorty()
					}
			},TIMES)
				return Promise.resolve(true)
			}).catch(function(){
				clearInterval(that.timer2)
				if (typeof cancel20 == "function") {
					cancel20()
				}
				if (router.currentUrl == "/trans") {
					that.listData01 = []
					that.renderHtml20(that.listData01)
					// 定时器
					that.timer2 = setInterval(function(){
						if (router.currentUrl == "/trans"){
							that.getData20()
						}else {
							that.desorty()
						}
				},TIMES)
					return Promise.resolve(true)
				}	else{
					clearInterval(that.timer2)
					return false
				}
			})
		})
	},
	renderHtml20: function (list) {
			var html =''
			for(var i=0; i<list.length;i++) {
				html += '<li>'+
				'<span>床号：'+list[i].bedNumber+'</span>'+
				'<span>剩量：'+list[i].surplus+'mL</span>'+
				'<span>状态：'+formatStatus(list[i].runStatus)+'</span>'+
			'</li>'	
			}
			var transList = document.getElementById('transList20')
			transList.innerHTML = html
			var transWrapper20 = document.getElementById('trans20')
			if (!this.transScroll20){
				this.transScroll20 = new  BScroll(transWrapper20)
			}else{
				this.transScroll20.refresh()
			}
	},
	_getSpeech:function(item) {
		var mytxt=''
		if(item.length==0){
			mytxt=''
		}else {
			item.forEach(function(item){
				if (item.runStatus==0) {
					mytxt += item.bedNumber+'床, 还剩'+item.surplus+'毫升,请护士注意！'
				}else {
					mytxt += item.bedNumber+'床, 已阻断,请护士注意！'
				}
				
			})
			this.Txt = mytxt
		}
		speekCon = mytxt
	},
	desorty: function () {
		//清除 定时器
		clearInterval(this.timer)
		clearInterval(this.timer1)
		clearInterval(this.timer2)
		endAudio ()
		changeFlag = false
		speekCon = ''
		erroring.style.display = 'none'
		if(typeof cancel =="function") {
			cancel()
		}
		if(typeof cancel10 =="function") {
			cancel10()
		}
		if(typeof cancel20 =="function") {
			cancel20()
		}
	}
}
function showMsgTrans(value){ 
	event.cancelBubble = true;
  event.stopPropagation();
	Observer.fire('transDel',{'item':value})
}
var transAlert = {
	infusionMonitorId:"",
	init: function(item) {
		// 初始化数据
		this.infusionMonitorId = item.infusionMonitorId

		var pageCon = document.getElementById('pageCon')
		var value = JSON.stringify(item)
		pageCon.innerHTML = '<div>'+
													'<header>'+
														'<h1>提示</h1>'+
														'<div>'+
															'<span onclick="closeTip()">×</span>'+
														'</div>'+
													'</header>'+
													'<div>'+
														'<section class="alarm-alert">'+
															'<p>确定解除警报状态吗？</p>'+
															'<div class="btn-wrapper">'+
																'<span onclick="closeTip()">取消</span>'+
																"<span  onclick='delTrans("+value+")'>确定</span>"+
															'</div>'+
														'</section>'+
													'</div>'+
												'</div>'
	},
	clearBox: function() {
		document.getElementById('pageCon').innerHTML = ''
		document.getElementById('commonBox').style.display = 'none'
		trans.init()
  }
}
function delTrans (item) {
	Axios.patch(myUrl+'infusionMonitors/'+item.infusionMonitorId+'/status/-1')
	.then(function(res){
		var data = res.data
		if(data.code==200) {
			// 隐藏box
			transAlert.clearBox()
		}
	})
}

// 输液监测历史记录
function showTrans(item){
	Observer.fire('tranShow',{'item':item})
}
// 定义一个输液监测历史记录对象 transShow
var transShow = {
	devicePositionId:'',
	bedNumber:"",
	page:1,
	rows:10,
	pageCount:'',
	transList:[],
	init: function(item) {
		// 获取位置id
		this.devicePositionId = item.devicePositionId
		this.bedNumber = item.bedNumber

		// 初始化页面
		this.initPage(this.bedNumber)

		// 获取数据
    this.getData()
	},
	initPage:function (bedNumber) {
		//  初始化页面结构
		var pageCon = document.getElementById('pageCon')
		pageCon.innerHTML = '<div>'+
													'<header>'+
														'<h1>输液监测历史记录 (床号:'+bedNumber+')</h1>'+
														'<div>'+
															'<span onclick="closeTip()">×</span>'+
														'</div>'+
													'</header>'+
													'<div class="temp-record-warpper">'+
													  '<div class="trans-detial" id="transDetial"></div>'+
														'<div class="temp-record-content">'+
															'<section>'+
																'<table>'+
																'<thead>'+
																	'<tr>'+
																		'<td>序号</td>'+
																		'<td>病人名称</td>'+
																		'<td>液滴速度(滴/分钟)</td>'+
																		'<td>滴数</td>'+
																		'<td>开始时间</td>'+
																		'<td>结束时间</td>'+
																		'<td>状态</td>'+
																		'<td>操作</td>'+
																	'</tr>'+
																'</thead>'+
																'<tbody id="transRecordList">'+
																'</tbody>'+
															'</table>'+
																'<footer>'+
																'<span class="pre-page" id="prePage">上一页</span>'+
																'<i id="curPage"></i>'+
																'<span class="next-page" id="nextPage">下一页</span>'+
																'</footer>'+
															'</section>'+
														'</div>'+
													'</div>'+
												'</div>'	
	},
	getData: function () {
		var that = this
		// 参数
		var mydata = {
			page: that.page,
			rows: that.rows
		}
		var url = myUrl + 'app/devicePositions/'+that.devicePositionId+'/infusionMonitors';
		url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydata);
		Axios.get(url).then(function(res){
			var data = res.data
			if (data.code == '200') {
				// 分页设置
				that.page = data.curPage
				that.pageCount = data.pageCount
				that.renderHtml(data.data)
			}
		})
	},
	renderHtml: function (list) {
		// 初始化footer
					// 初始化footer
					var prePage = document.getElementById('prePage')
					var nextPage = document.getElementById('nextPage')
					var curPage = document.getElementById('curPage')
					// 根据 pageCount 和 page 来显示
					if (this.page == 1) {
						prePage.classList.add('disabled')
					}else {
						prePage.classList.remove('disabled')
					}
					if (this.page >= this.pageCount) {
						nextPage.classList.add('disabled')
					}else {
						nextPage.classList.remove('disabled')
					}
					curPage.innerHTML = '<i class="currentpage">'+this.page+'</i>/ '+this.pageCount+''
		
					var that = this
					nextPage.onclick = function () {
						if (that.page>=that.pageCount) {
							return;
						}
						that.page = that.page + 1
						that.getData()
					}			
					prePage.onclick = function () {
						if (that.page<=1) {
							return;
						}
						that.page = that.page -1 
						that.getData()
					}
		// 渲染表格
		var html= ''
		for (var i = 0; i<list.length; i++) {
			var eq = i;
			html +='<tr>'+
							'<td>'+((that.page-1)*that.rows+i+1)+'</td>'+
							'<td>'+list[i].patientName+'</td>'+
							'<td>'+list[i].dotRate+'</td>'+
							'<td>'+list[i].dotCnt+'</td>'+
							'<td>'+formatDate(list[i].startTime,'yy-MM-dd hh:mm:ss')+'</td>';
							if (!list[i].endTime) {
								html += '<td>未结束</td>'
							}else {
								html+='<td>'+formatDate(list[i].endTime,'yy-MM-dd hh:mm:ss')+'</td>'
							}						
					html+='<td>'+StatusColor1(list[i].status)+'</td>';
							if (list[i].status == 0) {
								html += '<td class="action">'+
								"<span class='pause' onclick='transSuspend("+list[i].infusionMonitorId+")'>暂停</span>"+
								"<span class='stop' onclick='transStop("+list[i].infusionMonitorId+")'>结束</span>"+
								" <span class='details' onclick='transdetails("+eq+","+list[i].infusionMonitorId+")'>详情</span></td>"
							} else if (list[i].status == 1) {
								html += "<td class='action'>"+
								"<span class='details' onclick='transdetails("+eq+","+list[i].infusionMonitorId+")'>详情</span></td>"
							}else {
								html += "<td class='action'><span class='start' onclick='transStart("+list[i].infusionMonitorId+")'>继续</span></span> "+
								"<span class='stop' onclick='transStop("+list[i].infusionMonitorId+")'>结束</span>"
								+"<span class='details' onclick='transdetails("+eq+","+list[i].infusionMonitorId+")'>详情</span></td>"
							}
						html+='</tr>'
		document.getElementById('transRecordList').innerHTML = html 
		}
	},
	clearBox: function() {
		document.getElementById('pageCon').innerHTML = ''
		document.getElementById('commonBox').style.display = 'none'
  }
}
function closeTip () {
	transShow.clearBox()
}
// 1.输液详情页面
function transdetails(eq,id) {
	console.log(eq,id)
	var trEle = document.getElementById('transRecordList').getElementsByTagName('tr')[eq]
	var trAll = document.getElementById('transRecordList').getElementsByTagName('tr');
	[].slice.call(trAll).forEach(function(val){
		val.classList.remove('bgd4')
	})
	// 设置背景色
	trEle.classList.add('bgd4')
	// 获取详情页面节点元素
	var detialPage = document.getElementById('transDetial')
	detialPage.style.width = trEle.clientWidth + 'px';
	// 获取数据
	var url = myUrl + 'app/infusionMonitors/'+id;
	Axios.get(url).then(function(res){
		var data = res.data
		if (data.code == '200') {
			var html = '<div>'+
								'<div>输液记录编号'+data.data.infusionMonitorId+'详情页面 <span id="detialsColse">关闭</span></div>'+
								'<p>病区名称: '+data.data.inpatientAreaName+'</p>'+
								'<p>房间号: '+data.data.wardNumber+'</p>'+
								'<p>床号: '+data.data.bedNumber+'</p>'+
								'<p>姓名: '+data.data.patientName+'</p>'+
								'<p>设备名称: '+data.data.deviceName+'</p>'+
								'<p>液瓶容量(毫升): '+data.data.volum+'</p>'+
								'<p>液滴速度(滴/分钟): '+data.data.dotRate+'</p>'+
								'<p>液滴速度报警值(滴/分钟): '+data.data.dotRateAlarmValue+'</p>'+	                         
								'<p>输液计时(秒): '+data.data.timer+'</p>'+
								'<p>滴数: '+data.data.dotCnt+'</p>'+	                         
								'<p>运行状态: '+StatusColor(data.data.runStatus)+'</p>'+
								'<p>状态: '+StatusColor1(data.data.status)+'</p>'+
								'<p>开始时间: '+formatDate(data.data.startTime,'yy-MM-dd hh:mm:ss')+'</p>'
									if (!data.data.endTime) {
										html += '<p>结束时间: 未结束</p>'
									}else {
										html+='<p>结束时间: '+formatDate(data.data.endTime,'yy-MM-dd hh:mm:ss')+'</p>'
									}	
						  '</div>'	;
			// 页面渲染
			detialPage.innerHTML = html
			//  关闭详情页面
			console.log(document.getElementById('detialsColse'))
			document.getElementById('detialsColse').onclick = function () {
				// 1. 设置detialPage.innerHtML = null
				detialPage.innerHTML = ''
				// 2. 移除bgd4类名
				trEle.classList.remove('bgd4')
			}

		}
	})
}

// 2.输液继续
function transStart(infusionMonitorId) {
	// 输液继续请求
	var url = myUrl + 'app/infusionMonitors/'+infusionMonitorId+'/continue';
	axios.patch(url).then(function(res){
		if (res.data.code == '200') {
			// 刷新表格
			transShow.getData()
		}
	})
}

// 3.输液暂停
function transSuspend(infusionMonitorId) {
	// 输液暂停请求,请求成功--刷新数据,请求失败,没有操作。
	var url = myUrl + 'app/infusionMonitors/'+infusionMonitorId+'/suspend'
	axios.patch(url).then(function(res){
		if (res.data.code == '200') {
			// 刷新表格
			transShow.getData()
		}
	})
}
// 4.输液结束
function transStop(infusionMonitorId) {
	// 输液结束请求
	var url = myUrl + 'app/infusionMonitors/'+infusionMonitorId+'/end';
	axios.patch(url).then(function(res){
		if (res.data.code == '200') {
			// 刷新表格
			transShow.getData()
		}
	})
}

function formatStatus(status) {
	if (status == 0) {
		return '运行'
	}else {
		return '阻断'
	}
}
function StatusColor(status) {
	if (status == 0) {
		return '<span style="color:green">运行</span>'
	}else {
		return '<span style="color:#f56c6c">阻断</span>'
	}
}
function StatusColor1(status) {
	if (status == 0) {
		return '<span style="color:green">监测中</span>'
	}else if(status == 1){
		return '<span style="color:#888">已完成</span>'
	}else {
		return '<span style="color:orange">已暂停</span>'
	}
}
