// home.js
// 导航和页面加载模块

window.onload = function () {
	//  设置ip和端口
	var setIp = document.getElementById('setIp')
	var flag = false
	setIp.onclick = function () {
		var ipTxt = document.getElementById('ip').value
		var portTxt = document.getElementById('port').value
		var ip = document.getElementById('ip')
		var port = document.getElementById('port')
		var tip = document.getElementById('tip')
		var errTip = document.getElementById('error') 
		if (!ipTxt){
			errTip.style.display = 'block'
			errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入IP地址'
			ip.focus()
			return
		}		
		if (!portTxt){
			errTip.style.display = 'block'
			errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入端口地址'
			port.focus()
			return
		}
		//合法性 有待完善
		
		//存储 IP地址
		flag = config.setServer(ipTxt,portTxt)
		setItem('flag',true)
		if (flag) {
			// 显示 tip
			tip.style.display = 'block'
			errTip.style.display = 'none'
			errTip.innerHTML = ''
			setTimeout(function(){
				document.getElementById('box').style.display = 'none'
				tip.style.display = 'none'
			},500)
			home.init()
		}
	}
	// 初始化导航
	var btn = document.querySelectorAll('.nav>li')
	var page = document.querySelectorAll('.page>.h-page')
    Array.prototype.slice.call(btn).forEach(function(item,index){
		btn[index].onclick = function () {
			// 为item添加class
			Array.prototype.slice.call(btn).forEach(function(btnEle){
			    btnEle.classList.remove('active')
			  })
			this.classList.add('active')
			// page页面切换
			Array.prototype.slice.call(page).forEach(function(pageEle){
			        pageEle.classList.remove('active')
			     })
			page[index].classList.add('active')					
		}
    })
    var home = {
    	init: function () {
    		// 如果flag == true 服务器已经设置 隐藏服务器设置页面 初始化页面
    		var page = getItem('flag',true)   		
    		if (page) {
    			// 获取IP地址
    			var myUrl = getItem('url',true)
    			document.getElementById('box').style.display = "none"
    			temp.init(myUrl)
    		}else{
    			document.getElementById('box').style.display ='block'
    		}
    	}
    }
    //  初始化页面
    home.init()
//  temp.init()
//	alarm.init()
//	trans.init()
//	document.write(window.navigator.appVersion,JSON.stringify(localStorage))
	
}
