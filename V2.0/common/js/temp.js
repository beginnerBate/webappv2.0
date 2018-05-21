
var temp = {
	tempList: document.getElementById('tempList'),
	timer:"",
	init: function () {
		document.getElementById('sounds').style.display = 'none'
		this.getData()
		var that = this
		this.timer = setInterval(function(){
				that.getData()
				// console.log('timer',200)
		},TIMES)
		Observer.regist('tempRecord',function(e){
			// console.log("打开"+e.args.bedNumber+"床的详细信息")
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			// 关闭 体温刷新
			that.desorty()
			tempRecord.init(e.args.bedNumber)
		})
	},
	getData:function() {
		var that = this
		//获取体温数据
		axios.get(myUrl+'newestTemperatures',{
			headers:{
				inpatientAreaCode:'001'
			}
		})
		.then(function(res){
			var data = res.data
			if (data.code == 200) {
				that.list = data.data
				// dom 渲染
				that.dataRender(that.list)			
			}
		})
	},
	dataRender: function (list) {
		var html = ''
		for (var i =0;i<list.length;i++) {
			html += '<li onclick="tempReacrd(\''+list[i].bedNumber+'\')" value="'+list[i].bedNumber+'">'+
              '<div class="m-temp-item">'+
                '<p class="bed-num">床号：'+list[i].bedNumber+'</p>'
            if (list[i].temperatureValue>=37.5) {
                html += '<p class="temp-txt above">'+list[i].temperatureValue+'℃</p>'
            }else{
            	html += '<p class="temp-txt">'+list[i].temperatureValue+'℃</p>'
            }
            html +='<p class="temp-time">'+formatDate(list[i].recordTime,'hh:mm:ss')+'</p>'+
              '</div>'+
            '</li>'
		}
		
		this.tempList.innerHTML =  html
		var wrapper = document.getElementById('temp')
		var tempScroll =  new BScroll(wrapper,{
			 mouseWheel: {
			 speed: 20,
			 invert: false,
			 easeTime: 300
			},
			click:true
		})
	},
	desorty: function () {
		//清除 定时器
		clearInterval(this.timer)
	}
}
// 发布一个打开详情的事件
function tempReacrd(bedNumber) {
	Observer.fire('tempRecord',{'bedNumber':bedNumber})
}

// 定义一个 tempRecord对象
var tempRecord = {
	bedNumber:'',
	page:1,
	rows:10,
	pageCount:'',
  lastPage:'',
	tempList:[],
	tempchart:[],
	firstLoad:1,
	init:function(id) {
		//  初始化数据
		this.bedNumber = id
		//  初始化页面结构
		var pageCon = document.getElementById('pageCon')
		pageCon.innerHTML = '<div id="tempRecord" class="temp-record">'+
								'<header>'+
									'<h1>体温历史数据 (床号:'+id+')</h1>'+
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
											'<div id="main" style="width: 100%;height:100%;"></div>'+
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
			    rows: that.rows,
			    bedNumber: that.bedNumber
				}
		var url = myUrl+'temperatures'
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
	          bedNumber: that.bedNumber
            }
					//temp-record-chart
					var url = myUrl+'temperatures'
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
    	//  chart渲染
    	// 基于准备好的dom，初始化echarts实例
	    var myChart = echarts.init(document.getElementById('main'));
	
		// 指定图表的配置项和数据
		myChart.setOption({
			xAxis: {
		        data: []
		    },
		    yAxis: {
		    	name:'体温 (℃)'
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
			// console.log(dataX,dataS)
	    myChart.setOption({
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
	temp.init()
}
