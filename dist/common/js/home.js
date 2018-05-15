// home.js
// 导航和页面加载模块

window.onload = function () {
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
    
    //  初始化页面
    temp.init()
	alarm.init()
	trans.init()
}
