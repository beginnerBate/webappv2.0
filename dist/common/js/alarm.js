var alarm = {
	alarmList: document.getElementById('alarmList'),
	init: function () {
		var html = ''
		for (var i =0;i<100;i++) {
			html += '<li><div class="m-temp-item pos">'+
				        '<span class="close" click="showMsg(item.infusionAlarmId)">x</span>'+
				        '<p class="bed-num">床号：01</p>'+
				        '<p class="temp-txt">'+
				          '<span class="alarm-icon">'+
				              '<i class="main"></i>'+
				              '<i class="bottom"></i>'+
//				              '<i class="myanimate"></i>'+
				          '</span>'+
				        '</p>'+
				        '<p class="temp-time">12:22:88</p>'+
				    '</div></li>'
		}
//		 android.speak('01 床，输液结束 请注意！')
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
	},
}
