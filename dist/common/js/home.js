// home.js
// 导航和页面加载模块
window.onload = function () {
  let btn = document.querySelectorAll('.nav>li')
  let page = document.querySelectorAll('.page>.h-page')
  alert('dd')
  btn.forEach(function(item,index) {
   
    item.ontouchend = function () {
      // 为item添加class
      btn.forEach(function(btnEle){
        btnEle.classList.remove('active')
      })
      item.classList.add('active')
      // page页面切换
      page.forEach(function(pageEle){
        pageEle.classList.remove('active')
      })
      page[index].classList.add('active')
    }
  })
}
