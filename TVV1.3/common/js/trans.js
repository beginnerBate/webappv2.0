var trans = {
	listData:[],
	listData01:[],
	listData02:[],
	soundBtn: '',
	timer:"",
	transScroll:"",
	transScroll10:"",
	transScroll20:"",
	init:function () {
		this.listData=[]
		this.listData01=[]
		this.listData02=[]
		router.toEle = 1
		// 打开声音开关 
		this.soundBtn = document.getElementById('sounds')
		this.soundBtn.style.display = 'block'
		speekCon = ''
		//  获取数据
		var that = this
		this.loadData().then(function(res){
			that.timer = setInterval(function(){
				that.loadData()
			},TIMES)
		})
		// 监听
		Observer.regist('transDel',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// 关闭 体温刷新
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
	getstartTime: function(){
		var mydate = new Date(systemTime.startTime)
		var date = new Date(mydate.setMinutes(mydate.getMinutes() - 10))
		var startTime10 = formatDate(date, 'yyyy-MM-d hh:mm:ss')
		// return Promise.resolve(startTime10)
		return Promise.resolve('2018-05-21 14:32:16')
	},
	loadData: function () {
		// 1. 清除定时器
		// clearInterval(this.timer)
		var that = this
		var ajaxA,ajaxB,ajaxC
		//  10mL data 获取
//		var data = {alarmValue1:10,alarmValue2:20,startTime: data,orderBy:'surplus',status:0}
			this.getstartTime().then(function(data){
				var mydate ={alarmValue1:10,alarmValue2:20,startTime: data,orderBy:'surplus',status:0}
				var url = myUrl + 'infusionMonitors' 
				url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
				Axios.get(url).then(function(res){
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
					ajaxA = Promise.resolve(true)
				}).catch(function(){
					if (router.toEle == 1) {
						that.listData01 = []
						that.renderHtml20(that.listData01)
						// clearInterval(that.timer)
						ajaxA = Promise.resolve(true)
					}	else{
						clearInterval(that.timer)
						return false
					}
				})
			})
			this.getstartTime().then(function(data){
				var mydate ={alarmValue1:10,startTime: data,orderBy:'surplus',status:0}
				var url = myUrl + 'infusionMonitors' 
				url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
				Axios.get(url).then(function(res){
					// Axios.get('https://www.easy-mock.com/mock/5aee8d0da4c2e060a82fb809/webservice/infusionMonitors').then(function(res){
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
					ajaxB = Promise.resolve(true)
				}).catch(function(){
					if (router.toEle == 1) {
						that.listData = []
						that.renderHtml10(that.listData)
						ajaxB = Promise.resolve(true)
						// clearInterval(that.timer)
					}	else{
						clearInterval(that.timer)
						return false
					}
				})
			})
		//  20mL data 获取
		//  10ml and 20mL and> 20mL 	
		this.getstartTime().then(function(data){
			var mydate = {startTime:data,status:0}
			var url = myUrl + 'infusionMonitors' 
			url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
			Axios.get(url).then(function(res){	
				// Axios.get('https://www.easy-mock.com/mock/5aee8d0da4c2e060a82fb809/webservice/infusionMonitors').then(function(res){	
				
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
				ajaxC = Promise.resolve(true)
			}).catch(function(){
				if (router.toEle == 1) {
					erroring.style.display = 'flex'
					that.listData02 = []
					that.renderHtml(that.listData02)
					ajaxA = Promise.resolve(true)
					// clearInterval(that.timer)
				}	else{
					erroring.style.display = 'none'
					clearInterval(that.timer)
					return false
				}
			})
		})
//		 return Promise.race([ajaxA,ajaxB,ajaxC]).then(function(){
//		 	return Promise.resolve(true)
//		 })
		return Promise.resolve(true)
	},
	renderHtml: function (list) {
				var html = ''
				for (var i = 0; i<list.length;i++) {
					var value = JSON.stringify(list[i])
					// console.log(value)
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
		if (list[i].surplus <= 10) {
			html += "<span class='close transclose'  onclick='showMsgTrans("+value+")'>×</span>"
		}
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
		endAudio ()
		changeFlag = false
		speekCon = ''
		erroring.style.display = 'none'
	}
}
function showMsgTrans(value){ 
	event.cancelBubble = true;
  event.stopPropagation();
	// console.log(infusionMonitorId)
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
// 页面详情
function showTrans(item){
	Observer.fire('tranShow',{'item':item})
}
var transShow = {
	item:{},
	init: function(item) {
			this.item = item
			//  初始化页面结构
			var pageCon = document.getElementById('pageCon')
			pageCon.innerHTML = '<div>'+
						        '<header>'+
						          '<h1>输液数据详情 (床号:'+item.bedNumber+')</h1>'+
						          '<div>'+
						            '<span onclick="closeTip()">×</span>'+
						          '</div>'+
						        '</header>'+
										'<div>'+
										'<div class="temp-record-content">'+
										'<section>'+
											'<ul class="trans-list-show">'+
											'<li>'+
													'<span>液瓶容量:</span>'+
													'<span>'+item.volum+' mL</span>'+
												'</li>'+
												'<li>'+
													'<span>剩余容量:</span>'+
												'	<span>'+item.surplus+' mL</span>'+
												'</li>'+
												'<li>'+
													'<span>液滴速度:</span>'+
													'<span>'+item.dotRate+' 滴/分</span>'+
												'</li>'+
												'<li>'+
													'<span>当前滴数:</span>'+
													'<span>'+item.dotCnt+' 滴</span>'+
												'</li>'+             
												'<li>'+
													'<span>输液计时:</span>'+
													'<span>'+item.timer+' 秒</span>'+
												'</li>'+             
												'<li>'+
													'<span>状态:</span>'+
													'<span>'+formatStatus(item.runStatus)+'</span>'+
												'</li>'+             
												'<li>'+
													'<span>开始时间:</span>'+
												'	<span>'+formatDate(item.startTime,"yyyy-MM-dd hh:mm:ss")+'</span>'+
												'</li>'+
												'<li>'+
													'<span>结束时间:</span>'+
												'	<span>'+formatDate(item.endTime,"yyyy-MM-dd hh:mm:ss")+'</span>'+
												'</li>'+
											'</ul>'+
										'</section>'+
									'</div>'+
						        '</div>'+
						      '</div>'	
	},
	clearBox: function() {
		document.getElementById('pageCon').innerHTML = ''
		document.getElementById('commonBox').style.display = 'none'
}
}
function closeTip () {
	transShow.clearBox()
	trans.init()
}
function formatStatus(status) {
	if (status == 0) {
		return '运行'
	}else {
		return '阻断'
	}
}
