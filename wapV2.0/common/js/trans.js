var trans = {
	listData:[],
	sounds: '',
	timer:"",
	timer10:"",
	transScroll:"",
	listData01:[],
	initCounter:1,
	init:function () {
		//  0. 取消请求
		if (typeof cancelAll == 'function') {
			cancelAll()
		}		
		if (typeof cancel10 == 'function') {
			cancel10()
		}
		//  1.设置标题
		document.getElementById('title').innerText = '输液监测'
		//  2. 初始化页面
		this.initPage()
		this.initCounter = 1
		this.listData = []
		this.listData01 = []
		//  3.获取数据
		var that = this
		this.getData();
		this.getData10();
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
	initPage: function () {
		var pageHtml = '<div class="page-row" id="transwrapper">'+
										'<div class="trans-wrapper">'+
											'<ul id="transList" class="item-list">'+
											'</ul>'+
										'</div>'+
									'</div>'
		document.getElementById('hPage').innerHTML = pageHtml;
	},
	getstartTime: function(){
		var mydate = new Date(systemTime.startTime)
		var date = new Date(mydate.setMinutes(mydate.getMinutes() - 10))
		var startTime10 = formatDate(date, 'yyyy-MM-d hh:mm:ss')
		return Promise.resolve(startTime10)
	},
	getData: function () {
		// 1. 清除定时器
		clearInterval(this.timer)
		if (typeof cancelAll === 'function') {
			cancelAll()
		}
		// 2. 判断是否是第一次加载
		if (this.initCounter == 1) {
			loading.style.display = 'block'
			loading.innerHTML = '<i class="fa fa-spinner fa-spin fa-2x"></i>'
		}
        // 3. 获取输液数据
        var that = this
        this.getstartTime().then(function(data){
			var url = myUrl + 'app/newestInfusionMonitors' 
			Axios.get(url,{
			    cancelToken: new CancelToken(function executor(c) {
				// executor 函数接收一个 cancel 函数作为参数
				cancelAll = c;
			})
			}).then(function(res){
				if (that.initCounter == 1) {
					loading.style.display = 'none'
					loading.innerHTML =''	
				}
				that.initCounter++	
				var data = res.data
				if (data.code ==200) {
					//判读数据是否相等之后渲染DOM
					if (!cmp(that.listData01,data.data)){
						that.renderHtml(data.data)
						that.listData01 = data.data	
					}
				}else{
					that.listData01=[]
					that.renderHtml(listData01)
				}
				erroring.style.display = 'none'	
				//定时器
				that.timer = setInterval(function(){
					if (router.currentUrl == '/trans'){
						that.getData()
					}else {
						thta.desorty()
					}
				}, TIMES)
			}).catch(function(err){
				// 0. 第一次加载失败
				if (that.initCounter == 1) {
					loading.style.display = 'none'
					loading.innerHTML =''	
				}
				// 1. 清除定时器
				clearInterval(that.timer)
				if (typeof cancle == 'function') {
					cancel()
				}
				if (router.currentUrl == '/trans') {					
					erroring.style.display = 'flex'					
					that.listData01 = []
					that.renderHtml(that.listData01)
					//定时器
					that.timer = setInterval(function(){
						if (router.currentUrl == '/trans'){
							that.getData()
						}else {
							that.desorty()
						}
					}, TIMES)					
				}else{
					loading.style.display = 'none'
					clearInterval(that.timer)
					return false	
				}
			})
		})
	},
	// 低于10ml的数据 用于输液报警
	getData10:function(){
		// 1. 清除定时器
		clearInterval(this.timer10)
		if (typeof cancel10 === 'function'){
			cancel10()
		}
		// 获取数据
		var that = this
		this.getstartTime().then(function(data){
			var url = myUrl + 'app/newestInfusionMonitors10' 
			Axios.get(url,{
				cancelToken: new CancelToken(function executor(c) {
					// executor 函数接收一个 cancel 函数作为参数
					cancel10 = c;
				})				
			}).then(function(res){
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
				that.timer10 = setInterval(function(){
						if (router.currentUrl == "/trans"){
							that.getData10()
						}else {
							that.desorty()
						}				
				},TIMES)
			}).catch(function(){
				clearInterval(that.timer10)
				if (typeof cancel10 == 'function') {
					cancel10()
				}
				//路由判断
				if (router.currentUrl == '/trans') {
					that.timer10 = setInterval(function(){
						if (router.currentUrl == "/trans"){
							that.getData10()
						}else {
							that.desorty()
						}				
				    },TIMES)				
				}else{
					clearInterval(that.timer10)
					return false	
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
		html +=	  '<div><p>'+list[i].bedNumber+'床</p></div>'+
		        '<div>'+
						'<p>容量: '+list[i].volum+'<i>mL</i></p>'+
						'<p>剩量: '+list[i].surplus+'<i>mL</i></p>'+
						'<p>滴速: '+list[i].dotRate+' <i> 滴/分</i></p>'+
						'<p>状态: '+formatStatus(list[i].runStatus)+' <i></i></p>'
//		if (list[i].surplus <= 10) {
//			html += "<span class='close transclose'  onclick='showMsgTrans("+list[i].infusionMonitorId+")'>关闭</span>"
//		}
		html +='</div></div></li>'
				}
				var transWrapper = document.getElementById('transwrapper')
				var transList = document.getElementById('transList')
				transList.style.minHeight = transWrapper.offsetHeight +1 +'px';
				transList.innerHTML = html
				console.log('fff')
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
		erroring.style.display = 'none';
		typeof cancelAll == 'function' && cancelAll();
		typeof cancel10== 'function' && cancel10();
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
	devicePositionId:'',
	bedNumber:"",
	page:1,
	rows:10,
	childPage:"",
	transScroll:"",
	init: function(item) {
		  // 获取item
			this.item = item
			this.childPage = document.getElementById('commonBox')
			this.devicePositionId = item.devicePositionId
			//  2.初始化页面结构
			this.initPage(item.bedNumber)
			// 加载数据
			this.getData()
	},
	initPage: function (bedNumber){
			this.childPage.innerHTML = '<div>'+
								'<div class="child-top">'+
								'<span onclick="transBack()" class="back fa fa-angle-left"><span>'+bedNumber+'床</span></span>'+
								'<h1>输液历史记录</h1>'+
							  '</div> ' +
								'<div>'+
								'<div class="temp-record-content">'+
								'<section>'+
									'<ul class="trans-list-show" id="transRecordList">'+
									'</ul>'+
								'</section>'+
							'</div>'+
				        '</div>'+
							'</div>'
	// 3. 显示页面 
	this.childPage.style.right = 0;
	},
	getData: function(){
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
		var transRecordList = document.getElementById('transRecordList');
		var html = '';
		for (var i=0;i<list.length;i++) {
			html += "<li onclick='transdetails("+list[i].infusionMonitorId+")'>"+
								"<div>"+
									"<div class='trans-record-list-top'>"+
											"<p>"+list[i].patientName+"</p>"+
											"<p>"+formatDate(list[i].startTime,'MM-dd hh:mm:ss')+"</p>"+
									"</div>"+
									"<p class='trans-record-list-item'><span>液滴速度(滴/分钟): "+list[i].dotRate+" </span> <span>滴数: "+list[i].dotCnt+"</span></p>"+
									"<p class='trans-record-list-label'>"
									if (list[i].status == 2) {
											html += "<span class='status status2'>已暂停</span>"+																									
															"<span class='continue' onclick='transStart("+list[i].infusionMonitorId+")'>继续</span>"+
															"<span class='stop' onclick='transStop("+list[i].infusionMonitorId+")'>结束</span></p>"
									}
									if (list[i].status == 1) {
											html += "<span class='status status1'>已完成</span></p>"																									
									}
									if (list[i].status == 0) {
											html += "<span class='status status0'>监测中</span>"+
											"<span class='suspend' onclick='transSuspend("+list[i].infusionMonitorId+")'>暂停</span>"+
											"<span class='stop' onclick='transStop("+list[i].infusionMonitorId+")'>结束</span></p>"																																													
									}

								html+="</div></li>"
		}
		transRecordList.innerHTML = html
		
	},
	backPage: function() {
    this.childPage.style.right = '-100%'
    this.childPage.innerHTML = ''
  }
}
function transBack () {
	transShow.backPage()
}
// 单瓶输液详细数据
function transdetails (id) {
	this.id = id;
	// 打开页面 viewRouterThree
	this.childPage = document.getElementById('viewRouterThree');
	// 初始化页面结构
	this.childPage.innerHTML = '<div>'+
						'<div class="child-top">'+
						'<span id="backList" class="back fa fa-angle-left"><span>编号'+id+'</span></span>'+
						'<h1>输液详情</h1>'+
					  '</div> ' +
						'<div>'+
						'<div class="temp-record-content">'+
						'<section>'+
							'<ul class="trans-list-show" id="transRecordDetials">'+
							'</ul>'+
						'</section>'+
					'</div>'+
		        '</div>'+
					'</div>'
	// 3. 显示页面 
	this.childPage.style.right = 0;
	
	// 4. 加载页面信息
	var transRecordDetials = document.getElementById('transRecordDetials');
	// 获取数据
	var url = myUrl + 'app/infusionMonitors/'+id;
	Axios.get(url).then(function(res){
		var data = res.data
		if (data.code == '200') {
			var html = '<div class="trans-record-detials">'+
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
			transRecordDetials.innerHTML = html
	    }
    })
	// 5. 返回输液记录列表页面
	var backList = document.getElementById('backList')
	backList.onclick = function () {
	   this.childPage.style.right = '-100%'
       this.childPage.innerHTML = ''
	}.bind(this)
}

// 2.输液继续
function transStart(infusionMonitorId) {
    event.cancelBubble = true;
    event.stopPropagation();
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
    event.cancelBubble = true;
    event.stopPropagation();
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
    event.cancelBubble = true;
    event.stopPropagation();
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
