var trans = {
	listData:{},
	init:function () {
       var transList = document.getElementById('transList')
       var transList10 = document.getElementById('transList10')
       var transList20 = document.getElementById('transList20')
       // transList
       var html = ''
       var html20 = ''
       var html10 = ''
       for (var i = 0; i<60;i++) {
       	html += '<li>'
       	if (i == 20 ){
       		html += '<div class="m-trans-item warning" click="showTrans()">'
       	}else if (i == 10){
       		html += '<div class="pos m-trans-item danger" click="showTrans()">'
       	}else {
       		html += '<div class="m-trans-item" click="showTrans()">'
       	}
		html +=	  '<p>床号: 09</p>'+
			      '<p>容量: 22 <i>mL</i></p>'+
			      '<p>剩量: 66 <i>mL</i></p>'+
			      '<p>滴速: 55  <i> 滴/分</i></p>'
		if (i == 10) {
			html += '<span class="close"  click="showMsg(item.infusionMonitorId)">x</span>'
		}
		html +='</div></li>'
		//transList10
		html10 += '<li>'+
		              '<span>床号：03</span>'+
		              '<span>剩量：9mL</span>'+
		            '</li>'		
		//transList20
		html20 += '<li>'+
		              '<span>床号：06</span>'+
		              '<span>剩量：18mL</span>'+
		            '</li>'
       }
       transList.innerHTML = html
       transList10.innerHTML = html10
       transList20.innerHTML = html20
       var transWrapper = document.getElementById('transwrapper')
       var transWrapper10 = document.getElementById('trans10')
       var transWrapper20 = document.getElementById('trans20')
       var transScroll = new BScroll(transWrapper,{click:true})
       var transScroll10 = new BScroll(transWrapper10)
       var transScroll20 = new BScroll(transWrapper20)
       //transList 20
	},
	loadData: function () {
		//  10mL data 获取
//		var data = {alarmValue1:10,alarmValue2:20,startTime: data,orderBy:'surplus',status:0}
		var url = myUrl + 'infusionMonitors' + param(data)
		//  20mL data 获取
		//  10ml and 20mL and> 20mL 	
	}
}
