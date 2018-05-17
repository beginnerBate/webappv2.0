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
	// 初始化导航 curEle toEle
	var btn = document.querySelectorAll('.nav>li')
	var page = document.querySelectorAll('.page>.h-page')
	var router = {curEle:0,toEle:''}
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
			router.toEle=index
			console.log(router)
			// 注册事件 页面切换
			Observer.fire('pageLoad', router)
			// 注册事件 页面销毁
			Observer.fire('pageClear', router)
		}
    })
    var home = {
    	init: function () {
    		// 如果flag == true 服务器已经设置 隐藏服务器设置页面 初始化页面
    		var page = getItem('flag',true)   		
    		if (page) {
    			// 获取IP地址
    			myUrl = getItem('url',true)
    			document.getElementById('box').style.display = "none"
    			temp.init()
    		}else{
    			document.getElementById('box').style.display ='block'
    		}
    	}
    }
    //  初始化页面
    home.init()
    // 订阅事件pageLoad 切换页面加载 
    Observer.regist('pageLoad',function(e){
    	var index = e.args.toEle
    	switch (index) {
    		case 0:
    		temp.init()
    		break;    		
    		case 1:
    		alarm.init()
    		break;    		
    		case 2:
    		trans.init()
    		break;    		
    		case 3:
    		drawBoard.init()
    		break;
    	}
    })
    
    // 订阅事件 pageclear 页面销毁 定时器清除 语音清除事件
	Observer.regist('pageClear',function(e){
		var index = e.args.curEle
    	switch (index) {
    		case 0:
    		temp.desorty()
    		break;    		
    		case 1:
    		alarm.desorty()
    		break;    		
    		case 2:
    		trans.init()
    		break;    		
    		case 3:
    		console.log('temp.init()')
    		break;
    	}
    	router.curEle = e.args.toEle
	})
}
