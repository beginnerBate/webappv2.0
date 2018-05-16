
var temp = {
	tempList: document.getElementById('tempList'),
	timer:"",
	init: function () {
		this.getData()
		var that = this
		this.timer = setInterval(function(){
				that.getData()
				console.log('timer',200)
		},TIMES)
	},
	getData:function() {
		var that = this
		//获取体温数据
		axios.get(myUrl+'newestTemperatures.json')
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
			html += '<li>'+
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
			}
		})
	},
	desorty: function () {
		//清除 定时器
		clearInterval(this.timer)
	}
}
