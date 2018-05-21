var trans = {
	listData:{},
	soundBtn: '',
	timer:"",
	init:function () {
			
		// 打开声音开关 
		this.soundBtn = document.getElementById('sounds')
		this.soundBtn.style.display = 'block'
		speekCon = ''
		//  获取数据
		this.loadData()

		var that = this
		this.timer = setInterval(function(){
			that.loadData()
	  },TIMES)
		// 监听
		Observer.regist('transDel',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// 关闭 体温刷新
			that.desorty()
			transAlert.init(e.args.item)
		})
		Observer.regist('tranShow',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// 关闭 体温刷新
			// that.desorty()
			transShow.init(e.args.item)
		})
	},
	getstartTime: function(){
		var mydate = new Date(systemTime.startTime)
		var date = new Date(mydate.setMinutes(mydate.getMinutes() - 10))
		var startTime10 = formatDate(date, 'yyyy-MM-d hh:mm:ss')
		// console.log(startTime10)
		// return Promise.resolve(startTime10)
		return Promise.resolve('2018-4-10 12:00:00')
	},
	loadData: function () {
		var that = this
		//  10mL data 获取
//		var data = {alarmValue1:10,alarmValue2:20,startTime: data,orderBy:'surplus',status:0}
			this.getstartTime().then(function(data){
				var mydate ={alarmValue1:10,alarmValue2:20,startTime: data,orderBy:'surplus',status:0}
				var url = myUrl + 'infusionMonitors' 
				url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
				Axios.get(url).then(function(res){
					var data = res.data
					if (data.code ==200) {
						that.renderHtml20(data.data)
					}
				})
			})
			this.getstartTime().then(function(data){
				var mydate ={alarmValue1:10,startTime: data,orderBy:'surplus',status:0}
				var url = myUrl + 'infusionMonitors' 
				url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
				Axios.get(url).then(function(res){
					var data = res.data
					if (data.code ==200) {
						if (cmp(that.listData,data.data)) {
							// 数据没有变化
							changeFlag = false
						}else {
							Observer.fire('play')
							changeFlag = true
						}
						that.listData = data.data
						that.renderHtml10(data.data)
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
				var data = res.data
				if (data.code ==200) {
					that.renderHtml(data.data)
				}
			})
		})
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
						'<p>滴速: '+list[i].dotRate+' <i> 滴/分</i></p>'
		if (list[i].surplus <= 10) {
			html += "<span class='close transclose'  onclick='showMsgTrans("+value+")'>×</span>"
		}
		html +='</div></li>'
				}
				var transList = document.getElementById('transList')
				transList.innerHTML = html
				var transWrapper = document.getElementById('transwrapper')
				var transScroll = new BScroll(transWrapper,{click:true})
	},
	renderHtml10: function (list) {
			var html =''
			for(var i=0; i<list.length;i++) {
				html += '<li>'+
				'<span>床号：'+list[i].bedNumber+'</span>'+
				'<span>剩量：'+list[i].surplus+'mL</span>'+
			'</li>'	
			}
			var transList = document.getElementById('transList10')
			transList.innerHTML = html
			var transWrapper10 = document.getElementById('trans10')
			var transScroll10 = new BScroll(transWrapper10)
			this._getSpeech(list)
	},
	renderHtml20: function (list) {
			var html =''
			for(var i=0; i<list.length;i++) {
				html += '<li>'+
				'<span>床号：'+list[i].bedNumber+'</span>'+
				'<span>剩量：'+list[i].surplus+'mL</span>'+
			'</li>'	
			}
			var transList = document.getElementById('transList20')
			transList.innerHTML = html
			var transWrapper20 = document.getElementById('trans20')
			var transScroll20 = new BScroll(transWrapper20)
	},
	_getSpeech:function(item) {
		var mytxt=''
		item.forEach(function(item){
			mytxt += item.bedNumber+'床, 还剩'+item.surplus+'毫升,请护士注意！'
		})
		this.Txt = mytxt
		speekCon = mytxt
	},
	desorty: function () {
		//清除 定时器
		clearInterval(this.timer)
		// endAudio ()
		changeFlag = false
		// speekCon = ''
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
  }
}
function delTrans (item) {
	Axios.patch(myUrl+'infusionMonitors/'+item.infusionMonitorId+'/status/-1')
	.then(function(res){
		var data = res.data
		if(data.code==200) {
			speekCon = item.bedNumber+'床, 输液结束，已阻断！'
			changeFlag = true
			openAudio()
			// 隐藏box
			transAlert.clearBox()
			// 刷页面
			trans.init()
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
													'<span>'+formatStatus(item.status)+'</span>'+
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
function formatStatus(status) {
	if (status == 0) {
		return '运行'
	}else {
		return '阻断'
	}
}
