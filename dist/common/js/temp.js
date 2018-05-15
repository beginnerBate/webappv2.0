var temp = {
	tempList: document.getElementById('tempList'),
	init: function () {
		var html = ''
		for (var i =0;i<100;i++) {
			html += '<li>'+
              '<div class="m-temp-item">'+
                '<p class="bed-num">床号：'+i+'</p>'
            if (i % 12 == 3) {
                html += '<p class="temp-txt above">37.6℃</p>'
            }else{
            	html += '<p class="temp-txt">35.6℃</p>'
            }
            html +='<p class="temp-time">12:06:15</p>'+
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
}
