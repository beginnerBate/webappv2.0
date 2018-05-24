var trans = {
	listData:[],
	sounds: '',
	timer:"",
	transScroll:"",
	listData01:[],
	init:function () {
		//  1.设置标题
		document.getElementById('title').innerText = '输液监测'
		//  2.获取数据
		this.listData = []
		var that = this
		this.loadData().then(function(res){
			that.loadTimerData()
		})
		// 3.监听
		Observer.regist('transDel',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// 关闭 体温刷新
			// that.desorty()
			transAlert.init(e.args.infusionMonitorId)
		})
		// 4.
		Observer.regist('tranShow',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// 关闭 体温刷新
			// that.desorty()
			transShow.init(e.args.item)
		})
		// 5.sounds
		this.sounds = getItem('sounds',true)
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
				// 加载之前
		loading.style.display = 'block'
		loading.innerHTML ='<i class="fa fa-spinner fa-spin fa-2x"></i>'
		erroring.style.display = 'none'
		var that = this
		var ajaxA,ajaxB
			that.getstartTime().then(function(data){
				
				var mydate ={alarmValue1:10,startTime: data,orderBy:'surplus',status:0}
				var url = myUrl + 'infusionMonitors' 
				url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
				Axios.get(url).then(function(res){
					var data = res.data
					if (data.code ==200) {
						that.listData = data.data
						that._getSpeech(that.listData)
						changeFlag = true
						Observer.fire('play',{sounds:that.sounds})
					}else {
						that.listData = []
						that._getSpeech(that.listData)
					}
					ajaxA = Promise.resolve(true)
				}).catch(function(){
					ajaxA = Promise.resolve(true)
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
					loading.style.display = 'none'
					loading.innerHTML =''
					erroring.style.display = 'none'	
				}
				ajaxB = Promise.resolve(true)
			}).catch(function(err){
				if (router.curEle == 1) {
					erroring.style.display = 'flex'
					loading.style.display = 'none'
					loading.innerHTML =''
					ajaxB = Promise.resolve(true)
				}	else{
					loading.style.display = 'none'
					loading.innerHTML =''
					erroring.style.display = 'none'
				}
			})
		})
		return Promise.all([ajaxA,ajaxB]).then(function(res){
			return Promise.resolve(true)
		})
	},
	loadTimerData:function(){
		// 清除定时器
		clearInterval(this.timer)
		var that = this
		var ajaxA,ajaxB
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
						that.listData = data.data
						that._getSpeech(that.listData)
						changeFlag = true
						Observer.fire('play',{sounds:that.sounds})
					}
				}else {
					that.listData = []
					that._getSpeech(that.listData)
				}
				ajaxA = Promise.resolve(true)
			}).catch(function(){
				ajaxA = Promise.resolve(true)
			})
		})
		//  20mL data 获取
		//  10ml and 20mL and> 20mL 	
		// 加载之前
		this.getstartTime().then(function(data){
			var mydate = {startTime:data,status:0}
			var url = myUrl + 'infusionMonitors' 
			url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydate)
			Axios.get(url).then(function(res){
				var data = res.data
				if (data.code ==200) {
					// 如果数据没有变化 不渲染html
					if (!cmp(that.listData01,data.data)) {
						that.renderHtml(data.data)
						that.listData01 = data.data
					}
				}
				erroring.style.display = 'none'
				ajaxB = Promise.resolve(true)
			}).catch(function(){
				if (router.curEle == 1) {
					erroring.style.display = 'flex'
					ajaxB = Promise.resolve(true)
				}	else{
					loading.style.display = 'none'
					loading.innerHTML =''
					erroring.style.display = 'none'
				}
			})
		})
		Promise.all([ajaxA,ajaxB]).then(function(res){
			that.timer = setInterval(function(){
				that.loadTimerData()
			},TIMES)
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
		html +=	  '<div><p>'+list[i].bedNumber+'床</p></div>'+
		        '<div>'+
						'<p>容量: '+list[i].volum+'<i>mL</i></p>'+
						'<p>剩量: '+list[i].surplus+'<i>mL</i></p>'+
						'<p>滴速: '+list[i].dotRate+' <i> 滴/分</i></p>'+
						'<p>状态: '+formatStatus(list[i].runStatus)+' <i></i></p>'
		if (list[i].surplus <= 10) {
			html += "<span class='close transclose'  onclick='showMsgTrans("+list[i].infusionMonitorId+")'>关闭</span>"
		}
		html +='</div></div></li>'
				}
				var transWrapper = document.getElementById('transwrapper')
				var transList = document.getElementById('transList')
				transList.style.minHeight = transWrapper.offsetHeight +1 +'px';
				transList.innerHTML = html
				//  设置 content的height = transwrapper+1px
				if (!this.transScroll) {
					this.transScroll = new BScroll(transWrapper,{
						useTransition:false,  // 防止iphone微信滑动卡顿
						click:true
					})
				}else {
					this.transScroll.refresh()
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
function showMsgTrans(infusionMonitorId){ 
	event.cancelBubble = true;
  event.stopPropagation();
	// console.log(infusionMonitorId)
	Observer.fire('transDel',{'infusionMonitorId':infusionMonitorId})
}
var transAlert = {
	infusionMonitorId:"",
	init: function(infusionMonitorId) {
		// 初始化数据
		this.infusionMonitorId = infusionMonitorId
		var pageCon = document.getElementById('sure')
		pageCon.innerHTML = '<div>'+
													'<div>'+
														'<section class="alarm-alert">'+
															'<p>确定解除警报状态吗？</p>'+
															'<div class="btn-wrapper">'+
																'<span onclick="transcancle()">取消</span>'+
																'<span  onclick="delTrans('+infusionMonitorId+')">确定</span>'+
															'</div>'+
														'</section>'+
													'</div>'+
												'</div>'
												pageCon.style.display="block"										
	},
	clearBox: function() {
		document.getElementById('sure').innerHTML = ''
		document.getElementById('sure').style.display = 'none'
  }
}
function delTrans (infusionMonitorId) {
	Axios.patch(myUrl+'infusionMonitors/'+infusionMonitorId+'/status/-1')
	.then(function(res){
		var data = res.data
		if(data.code==200) {
			// 隐藏box
			transAlert.clearBox()
			// 刷页面
			trans.loadData()
		}
	})
}
function transcancle() {
	transAlert.clearBox()
}
// 页面详情
function showTrans(item){
	Observer.fire('tranShow',{'item':item})
}
var transShow = {
	item:{},
	childPage:"",
	init: function(item) {
		  // 获取item
			this.item = item
			this.childPage = document.getElementById('commonBox')
			//  2.初始化页面结构
			this.childPage.innerHTML = '<div>'+
										'<div class="child-top">'+
										'<span onclick="transBack()" class="back fa fa-angle-left"><span>'+item.bedNumber+'床</span></span>'+
										'<h1>输液数据详情</h1>'+
									  '</div> ' +
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
			// 3. 显示页面 
			this.childPage.style.right = 0;
	},
	backPage: function() {
    this.childPage.style.right = '-100%'
    this,this.childPage.innerHTML = ''
  }
}
function transBack () {
	transShow.backPage()
}
function formatStatus(status) {
	if (status == 0) {
		return '运行'
	}else {
		return '阻断'
	}
}
