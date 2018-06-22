var tempReacrd = function(){return false}		
// 发布一个打开详情的事件
var temp = {
	tempList: '',
	timer:"",
	tempScroll:"",
	list:[],
	myChart:'',
	init: function () {
			if (typeof cancel == "function"){
				cancel()
			}
			document.getElementById('sounds').style.display = 'none'
			// 初始化页面
			this.initPage()
			this.tempList = document.getElementById('tempList')
			this.list = []
			var that = this
			this.getData()
			tempReacrd =  function(bedNumber,devicePositionId) {
				var commonBox = document.getElementById('commonBox')
				commonBox.style.display = 'block'
				// 关闭 体温刷新
				that.desorty()
				tempRecord.init(bedNumber,devicePositionId)
			}
	},
	initPage: function () {
		var pageHtml = '<div class="page-wrapper" id="temp">'+
											'<div class="content">'+
												'<ul class="item-list" id="tempList">'+
												'</ul>'+
											'</div>'+
									 '</div>'
		document.getElementById('hPage').innerHTML = pageHtml	
		erroring.style.display = 'none'						 
	},
	getData:function() {
		// 1. 清除定时器
		clearInterval(this.timer)
		if (typeof cancel === 'fucntion'){
			cancel()
		}
		var that = this
		//获取体温数据
		return Axios.get(myUrl+'app/newestTemperatures',{
			cancelToken: new CancelToken(function executor(c) {
				// executor 函数接收一个 cancel 函数作为参数
				cancel = c;
			})
		})
		.then(function(res){
			var data = res.data
			if (data.code == '200') {
				// 判断数据是否相等然后渲染DOM				
				if (!cmp(that.list,data.data)){
					that.dataRender(data.data)
					that.list = data.data
				}
			}else{
				that.list = []
				that.dataRender(that.list)
			}
			erroring.style.display = 'none'
			// 定时器
			that.timer = setInterval(function(){
				if (router.currentUrl == "/temp" || router.currentUrl == "/"){
					that.getData()
				}else {
					that.desorty()
				}				
		},TIMES)
		  return Promise.resolve(true)
		}).catch(function(err){
			clearInterval(that.timer)
			if (typeof cancel == "function") {
				cancel()
			}
			if (router.currentUrl == "/temp" || router.currentUrl == "/") {
				erroring.style.display = 'flex'
				that.list = []
				that.dataRender(that.list)
				
				// 定时器
				that.timer = setInterval(function(){
					if (router.currentUrl == "/temp" || router.currentUrl == "/"){
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
	},
	dataRender: function (list) {
		var html = ''
		for (var i =0;i<list.length;i++) {
			html += '<li onclick="tempReacrd(\''+list[i].bedNumber+'\', \''+list[i].devicePositionId+'\')">'
            if (list[i].temperatureValue>=37.5) {
                html +='<div class="m-temp-item danger">'+
											'<p class="bed-num">床号：'+list[i].bedNumber+'</p>'+
											'<p class="temp-txt">'+list[i].temperatureValue+'℃</p>'
            }else{
							html +='<div class="m-temp-item">'+
							'<p class="bed-num">床号：'+list[i].bedNumber+'</p>'+
							'<p class="temp-txt">'+list[i].temperatureValue+'℃</p>'
            }
            html +='<p class="temp-time">'+transDate(list[i].recordTime)+'</p>'+
              '</div>'+
            '</li>'
		}		
		this.tempList.innerHTML =  html
		var wrapper = document.getElementById('temp')
		if (!this.tempScroll){
			  this.tempScroll =  new BScroll(wrapper,{
				mouseWheel: {
				speed: 20,
				invert: false,
				easeTime: 300
			 },
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
		erroring.style.display = 'none'
		if (typeof cancel === 'function'){
			cancel()
		}
	}
}

// 定义一个 tempRecord对象
var tempRecord = {
	bedNumber:'',
	devicePositionId:"",
	page:1,
	rows:10,
	pageCount:'',
  lastPage:'',
	tempList:[],
	tempchart:[],
	firstLoad:1,
	init:function(bedNumber,devicePositionId) {
		//  初始化数据
		this.bedNumber = bedNumber
		this.devicePositionId = devicePositionId
		//  初始化页面结构
		var pageCon = document.getElementById('pageCon')
		pageCon.innerHTML = '<div id="tempRecord" class="temp-record">'+
								'<header>'+
									'<h1>体温历史数据 (床号:'+bedNumber+')</h1>'+
									'<div>'+
						        '<span  onclick="closeMessage()">×</span>'+
						      '</div>'+
								'</header>'+
								'<div class="temp-record-conent">'+
									'<section class="temp-record-left">'+
										'<ul class="temp-list" id="tempRecordList">'+
											'<li class="temp-list-title">'+
											  '<span>温度  (℃)</span>'+
											  '<span class="temp-list-time">记录时间</span>'+
											'</li>'+
										'</ul>'+
										'<footer>'+
											'<span class="pre-page" id="prePage">上一页</span>'+
											'<i id="curPage"></i>'+
											'<span class="next-page" id="nextPage">下一页</span>'+
										'</footer>'+
									'</section>'+
									'<section class="temp-record-right">'+
										'<div id="chart" style="width: 100%;height:100%;">'+
											'<div id="main"></div>'+
										'</div>'+
									'</section>'+
								'</div>'+
							'</div>'

		  this.loadData()
	},
	loadData:function(){
		var that = this
		//  根据床号获取体温数据
		//  参数
		var mydata = {
			    page: that.page,
			    rows: that.rows
				}
		var url = myUrl+'app/devicePositions/'+that.devicePositionId+'/temperatures'
		url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydata)
		axios.get(url,{
			headers:{
				inpatientAreaCode:'001'
			},
		})
	    .then(function(res){
			var data = res.data
            if (data.code=='200') {         
	          // 分页处理
	          that.tempList = []
	          that.page = data.curPage
	          that.pageCount = data.pageCount
	          var array = []
	          for (var i=0; i<data.data.length; i++) {
	            that.tempList.push({temp: data.data[i].temperatureValue,time:formatDate(data.data[i].recordTime,'MM-dd hh:mm:ss')})
	          }
	         return Promise.resolve((data.pageCount-(data.curPage-1)))            
	        }else {
	          that.tempList = []
	        }
		})
	    .then(function(res){
	        that.lastPage = res
	        var mydata = {
	          page: that.lastPage,
	          rows: that.rows,
            }
					//temp-record-chart
					var url = myUrl+'app/devicePositions/'+that.devicePositionId+'/temperatures'
					url += (url.indexOf('?') < 0 ? '?' : '&') + param(mydata)
	        axios.get(url,{
						headers:{
							inpatientAreaCode:'001'
						},
					}).then(function(res){
	        	var data = res.data
		          if (data.code == '200') {
		            // 分页处理
		            that.tempchart = []
		            for (var i=data.data.length-1; i>=0; i--) {
		              that.tempchart.push({"temp": data.data[i].temperatureValue,"time": formatDate(data.data[i].recordTime,'hh:mm:ss')})
								} 
								// console.log(that.tempchart)
								that.renderHtml(that.tempList,that.tempchart)
		            return Promise.resolve(true)
		          }else {
		            that.tempchart = []
		          }
	        })
	   }).then(function(res){
			
	   	
	   })
    },
    renderHtml:function(list, chart){
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
				that.loadData()
			}			
			prePage.onclick = function () {
				if (that.page<=1) {
					return;
				}
				that.page = that.page -1 
				that.loadData()
			}
    	//  list渲染
    	var html = '<li class="temp-list-title">'+
					  '<span>温度  (℃)</span>'+
					  '<span class="temp-list-time">记录时间</span>'+
					'</li>'
    	for (var i =0; i<list.length;i++) {
    	    html += '<li>'+
						'<span>'+list[i].temp+'</span>'+
						'<span class="temp-list-time">'+list[i].time+'</span>'+
					'</li>'
    	}
    	document.getElementById('tempRecordList').innerHTML = html
			//  列表大小设置
		  //  chart渲染 大小设置
			//  基于准备好的dom，初始化echarts实例
      document.getElementById('main').style.minHeight = '500px'
      document.getElementById('main').style.minWidth = '800px'
			this.myChart = echarts.init(document.getElementById('main'));
			// this.myChart.showLoading()
		// 指定图表的配置项和数据
		this.myChart.setOption({
			xAxis: {
		        data: []
		    },
		    yAxis: {
					name:'体温 (℃)',
					min:32
		    },
		    series: [{
		        name: '体温',
		        type: 'line',
		        data: [],
		        label:{
		        	show:true,
		        	formatter: '{c}℃'
		        }
		    }]
		})
	    // 遍历chart
	    var dataX = [],dataS = []
	    chart.forEach(function(item,index){
	    	dataX.push(item.time)
	    	dataS.push(item.temp)
			})
			
			// this.myChart.hideLoading()
			// console.log(dataX,dataS)
			this.myChart.setOption({
	    	    xAxis: {
                        data: dataX
                        },
                series: [{
                    // 根据名字对应到相应的系列
                    name: '体温',
                    data: dataS
                }]
	    })		
		},
    clearBox: function(){
      document.getElementById('pageCon').innerHTML = ''
      document.getElementById('commonBox').style.display = 'none'
    }
 }
function closeMessage () {
	tempRecord.clearBox()
}
