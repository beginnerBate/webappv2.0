var changeFlag = false
var alarm = {
	alarmList: document.getElementById('alarmList'),
	soundBtn: '',
	listData:[],
	Txt:'',
	timer:'',
	init: function () {
		// 打开声音开关 
		this.soundBtn = document.getElementById('sounds')
		this.soundBtn.style.display = 'block'
		var that = this
		this.loadData()
		this.timer = setInterval(function(){
		    that.loadData()
		},TIMES)
		// 监听
		Observer.regist('alarmDel',function(e){
			var commonBox = document.getElementById('commonBox')
			commonBox.style.display = 'block'
			alarmAlert.init(e.args.infusionAlarmId)
		})
	},
	loadData: function () {
		var that = this
		axios.get(myUrl+'newestInfusionAlarms?status=0',{
			headers:{
				inpatientAreaCode:'001'
			}
		}).then(function(res){
			var data = res.data
			if (data.code ==200 ) {
				if (cmp(that.listData,data.data)) {
					// 数据没有变化
					changeFlag = false
				}else {
					Observer.fire('play')
					changeFlag = true
				}
				that.listData = data.data
				that.renderHtml(that.listData)
			}
		})
	},
	renderHtml:function(list) {
	    var html = ''
		for (var i =0;i<list.length;i++) {
			html += '<li><div class="m-temp-item pos">'+
				        '<span class="close" onclick="showMsg('+list[i].infusionAlarmId+')">×</span>'+
				        '<p class="bed-num">床号：'+list[i].bedNumber+'</p>'+
				        '<p class="temp-txt">'+
				          '<span class="alarm-icon">'+
				              '<i class="main"></i>'+
				              '<i class="bottom"></i>'+
				          '</span>'+
				        '</p>'+
				        '<p class="temp-time">'+formatDate(list[i].bedNumber,'hh:mm:ss')+'</p>'+
				    '</div></li>'
		}
		this.alarmList.innerHTML =  html
		var wrapper = document.getElementById('alarm')
		var alarmScroll =  new BScroll(wrapper,{
			 mouseWheel: {
			 speed: 20,
			 invert: false,
			 easeTime: 300
			},
			click:true
		})
		this._getSpeech(list)
	},
	_getSpeech:function(item) {
	      var mytxt=''
	      item.forEach(function(item){
	        mytxt += item.bedNumber+'床, 输液结束,请护士拔针！'
	      })
	      this.Txt = mytxt
	      speekCon = mytxt
	},
	desorty: function () {
		//清除 定时器
		clearInterval(this.timer)
		endAudio ()
		changeFlag = false
		speekCon = ''
	}
}
function showMsg (infusionAlarmId) {
	Observer.fire('alarmDel',{'infusionAlarmId':infusionAlarmId})
}

// alarmAlert
var alarmAlert = {
	infusionAlarmId:"",
	init: function (infusionAlarmId) {
		// 初始化数据
		this.infusionAlarmId = infusionAlarmId
		//  初始化页面结构
		var pageCon = document.getElementById('pageCon')
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
						              '<span  onclick="delAlarm('+infusionAlarmId+')">确定</span>'+
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
function closeTip () {
	alarmAlert.clearBox()
	alarm.init()
}
function delAlarm (infusionAlarmId) {
	Axios.patch(myUrl+'infusionAlarms/'+infusionAlarmId+'/status/-1')
	.then(function(res){
		var data = res.data
		if(data.code==200) {
			// 隐藏box
			alarmAlert.clearBox()
			// 刷页面
			alarm.loadData()
		}
	})
}
var changeFlagTimer
// 打开声音
function openAudio() {
	// this.alarmList.innerHTML = speekCon
	document.getElementById('soundsIcon').className = 'fa fa-volume-up'
	document.getElementById('soundsIcon').innerHTML = ''
	document.getElementById('volumeUp').classList.add('active')
	document.getElementById('volumeOff').classList.remove('active')
	speakPlaying = true
	speaking = true
	android.speakInit()
	android.speak(speekCon)
	speaking = false
	changeFlagTimer = setInterval(function(){
		if (changeFlag) {
			clearInterval(changeFlagTimer)
		}else {
			Observer.fire('play')
		}
	},20000)
}
function endAudio () {
	document.getElementById('soundsIcon').className = 'fa fa-volume-off'
	document.getElementById('soundsIcon').innerHTML = '<i>×</i>'
	document.getElementById('volumeOff').classList.add('active')
	document.getElementById('volumeUp').classList.remove('active')
	speakPlaying = false
	speaking = false
	android.stopSpeak()
	clearInterval(changeFlagTimer)
}
Observer.regist('play',function(){
	if (speaking) {
		return
	}
	if(!speakPlaying) {
		return
	}
	android.speakInit()
	android.speak(speekCon)
})