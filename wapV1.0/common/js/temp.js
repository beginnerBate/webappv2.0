var tempReacrd = function(){return false}		
// 发布一个打开详情的事件

var temp = {
	tempList: document.getElementById('tempList'),
	timer:"",
	tempScroll:"",
	listData:[],
	init: function () {
		//  1.设置标题
		document.getElementById('title').innerText = '体温监测'
		var that = this
		this.getData().then(function(res){
			that.timer = setInterval(function(){
				that.getTimerData()
		},TIMES)
		})
	
		tempReacrd =  function(bedNumber) {
			tempRecord.init(bedNumber)
		}
	},
	getData:function() {
		var that = this
		//获取体温数据
		// 加载之前
		loading.style.display = 'block'
		loading.innerHTML ='<i class="fa fa-spinner fa-spin fa-2x"></i>'
		erroring.style.display = 'none'
		return Axios.get(myUrl+'newestTemperatures')
		// return Axios.get('https://www.easy-mock.com/mock/5aee8d0da4c2e060a82fb809/webservice/newestTemperatures')
		.then(function(res){
			var data = res.data
			if (data.code == 200) {
				that.listData = data.data
				// dom 渲染
				that.dataRender(that.listData)
				loading.style.display = 'none'
				loading.innerHTML =''
				erroring.style.display = 'none'			
			}
			return Promise.resolve(true)
		}).catch(function(err){
			loading.style.display = 'none'
			loading.innerHTML =''
			if (router.toEle == 0) {
				erroring.style.display = 'flex'
				that.listData =[]
				that.dataRender(that.listData)
				return Promise.resolve(true)
			}else{
				erroring.style.display = 'none'
				clearInterval(that.timer)
				return false			
			}		
		})
	},
	getTimerData:function() {
		// 清除定时器
		clearInterval(this.timer)
		var that = this
		//获取体温数据
		Axios.get(myUrl+'newestTemperatures')
			//  Axios.get('https://www.easy-mock.com/mock/5aee8d0da4c2e060a82fb809/webservice/newestTemperatures')
		.then(function(res){
			var data = res.data
			if (data.code == 200) {
				// 如果数据没有变化 不会渲染页面
				if (!cmp(that.listData,data.data)) {
						// 数据有变化
						that.listData = data.data
						// dom 渲染
						that.dataRender(that.listData)
				}
				erroring.style.display = 'none'
        // 定时器
				that.timer = setInterval(function(){
					  that.getTimerData()
			  },TIMES)		
			}
		}).catch(function(){
			if (router.toEle === 0) {
				erroring.style.display = 'flex'
				that.listData =[]
				that.dataRender(that.listData)
				that.getTimerData()
				// return Promise.resolve(true)
			}	else{
				erroring.style.display = 'none'
				clearInterval(that.timer)
				// return false
			}
		})
	},
	dataRender: function (list) {
		var html = ''
		for (var i =0;i<list.length;i++) {
			html += '<li onclick="tempReacrd(\''+list[i].bedNumber+'\')" value="'+list[i].bedNumber+'">'
            if (list[i].temperatureValue>=37.5) {
                html +='<div class="m-temp-item danger">'+
								'<p class="bed-num">'+list[i].bedNumber+'床</p>'+
								'<p class="temp-txt">'+list[i].temperatureValue+'℃</p>'
            }else{
            	html +='<div class="m-temp-item">'+
							'<p class="bed-num">'+list[i].bedNumber+'床</p>'+
							'<p class="temp-txt">'+list[i].temperatureValue+'℃</p>'
            }
						html +='<p class="temp-time">'+formatDate(list[i].recordTime,'hh:mm:ss')+'</p>'+
						'<p><span class="fa fa-angle-right go-next"></span></p>'
              '</div>'+
            '</li>'
		}
		this.tempList.innerHTML =  html
		var wrapper = document.getElementById('temp')
		this.tempList.style.minHeight = wrapper.offsetHeight +1 +'px';
		if (!this.tempScroll){
			this.tempScroll = new BScroll(wrapper,{
				useTransition:false,  // 防止iphone微信滑动卡顿
				click:true
			})
		}else{
			this.tempScroll.refresh()
		}

	},
	desorty: function () {
		//清除 定时器
		clearInterval(this.timer)
		tempReacrd =function(){return false}
		loading.style.display = 'none'
		loading.innerHTML =''
		erroring.style.display = 'none'			
	}
}


// 定义一个 tempRecord对象
var tempRecord = {
	bedNumber:'',
	page:1,
	rows:10,
	pageCount:'',
	tempList:[],
	firstLoad:1,
	pageChild:"",
	orderScroll:"",
	init:function(id) {
		temp.desorty()
		//  初始化数据
		this.bedNumber = id
		//  初始化页面结构
		this.pageChild = document.getElementById('commonBox')
		this.pageChild.innerHTML = '<div id="tempRecord" class="temp-record">'+
											'<div class="child-top">'+
														'<span id="back" class="back fa fa-angle-left" onclick="backtemp()"><span>'+id+'床</span></span>'+
														'<h1>体温历史记录</h1>'+
													'</div>'+
								'<div class="temp-record-conent" id="wrapperList">'+
									'<section class="temp-record-left" id="contentList">'+
										'<div id="top-tip" class="top-tip">'+
										'<span class="refreshTxt" id="refreshTxt"></span>'+
										'</div>'+
										'<ul class="temp-list" id="tempRecordList">'+
										'</ul>'+
										'<div id="bottom-tip" class="bottom-tip">'+
										'<span id="nomore">上拉加载数据</span>'+
										'</div>'+
									'</section>'+
								'</div>'+
							'</div>'
		//  动画加载
		this.pageChild.style.right = '0';
		
		var that = this
		that.loadData()
	
	},
	loadData:function(){
		// var loading = document.getElementById('sloading')
		loading.style.display = 'block'
		loading.innerHTML ='<i class="fa fa-spinner fa-spin fa-2x"></i>'
		var that = this
		//  根据床号获取体温数据
		//  参数
		var mydata = {
			    page: that.page,
			    rows: that.rows,
			    bedNumber: that.bedNumber
				}
		var url = myUrl+'temperatures'
		url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydata)
		// 请求数据
		Axios.get(url).then(function(res){
			var data = res.data
            if (data.code=='200') {         
						// 分页处理	
						console.log('dd')          
	          that.page = data.curPage
						that.pageCount = data.pageCount
						if (that.page == 1){
							that.tempList = []
							document.getElementById('refreshTxt').innerHTML = '松开刷新数据'
					 }
	          var array = []
	          for (var i=0; i<data.data.length; i++) {
	            that.tempList.push({temp: data.data[i].temperatureValue,time:formatDate(data.data[i].recordTime,'MM-dd hh:mm:ss')})
	          }        
	        }else {
	          that.tempList = []
					}
				that.renderHtml(that.tempList)				
				loading.style.display = 'none'
				loading.innerHTML =''	
				erroring.style.display = 'none'
		}).catch(function(err){
			loading.style.display = 'none'
			loading.innerHTML =''	
			erroring.style.display = 'flex'
		})
    },
    renderHtml:function(list){
			var that = this
    	//  list渲染
    	var html = ''
    	for (var i =0; i<list.length;i++) {
    	    html += '<li>'+
						'<span>温度:'+list[i].temp+'</span>'+
						'<span class="temp-list-time">时间:'+list[i].time+'</span>'+
					'</li>'
    	}
			document.getElementById('tempRecordList').innerHTML = html
			var wrapperList =document.getElementById('wrapperList')
			var contentList = document.getElementById('contentList')
			contentList.style.minHeight = wrapperList.offsetHeight +1 +"px";
			this.orderScroll = new BScroll(wrapperList,{
        probeType:3,
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        pullUpLoad:{
          threshold:-80
        },
        mouseWheel: {    // pc端同样能滑动
          speed: 20,
          invert: false
        },
        useTransition:false,  // 防止iphone微信滑动卡顿
      })
      // 上拉加载数据
      this.orderScroll.on('pullingUp',function(){
        // 防止一次上拉触发两次事件,不要在ajax的请求数据完成事件中调用下面的finish方法,否则有可能一次上拉触发两次上拉事件
        that.orderScroll.finishPullUp()
				// 加载数据
				if (that.page< that.pageCount){
					document.getElementById('nomore').innerHTML ='上拉加载数据'
					that.page = that.page + 1
					that.loadData()
				}else {
					document.getElementById('nomore').innerHTML ='没有更多数据'
				}
        
        // this.getIncomeDetail(this.nextPage)
      })
      // 下拉刷新数据
      this.orderScroll.on('pullingDown',function(){
        that.page = 1
        that.loadData()
        that.orderScroll.finishPullDown()        
      })		
			
		},
    clearBox: function(){
      this.pageChild.innerHTML = ''
			this.pageChild.style.right = '-100%'
			loading.style.display = 'none'
			loading.innerHTML =''
			erroring.style.display = 'none'
			temp.init()
    }
 }
function backtemp () {
	tempRecord.clearBox()
	// temp.init()
}

