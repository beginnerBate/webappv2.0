var myset = {
  childPage:'',
  init: function() {
    // 设置标题
    document.getElementById('title').innerText = '系统设置'
    // 获取子页面
    this.childPage = document.getElementById('commonBox')
    // IP初始化
    this.setIP()
  },
  setIP: function() {
    var setIPBtn = document.getElementById('ipset')
    var that = this
    setIPBtn.onclick = function() {
      console.log('修改IP')
      //  1.获取IP
      var IP = getItem('ip',true)
      //  2.初始化IPset页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改IP</h1>"+
                                 "</div>"+
                                 "<div class='box-content' id='pageCon'>"+
                                 '<div class="form-row">'+
                                   '<input type="text" id="ip" value="'+IP+'" />'+
                                 '</div>'+
                                 '<div class="form-row">'+
                                 '<input type="button" id="setIp" class="btn" value="确定修改" onclick="subIP()" />'+
                               '</div>'+
                                 "</div>"
      //  3.显示页面
      that.childPage.style.right = 0;
    }
  }
}

function IPcancle() {
  // 取消修改
  myset.childPage.style.right = '-100%'
  myset.childPage.innerHTML = ''
}
function subIP () {
  var ipTxt = document.getElementById('ip').value
  // var portTxt = document.getElementById('port').value
  var ip = document.getElementById('ip')
  // var port = document.getElementById('port')
  var tip = document.getElementById('alert')
  var errTip = document.getElementById('error') 
  if (!ipTxt){
    tip.style.display = "flex"
    tip.innerHTML = '请输入端口地址'
    ip.focus()
    return
  }		
  // if (!portTxt){
  //   errTip.style.display = 'block'
  //   errTip.innerHTML = '<i class="fa fa-exclamation-triangle"></i> 请输入端口地址'
  //   port.focus()
  //   return
  // }
  //合法性 有待完善
  
  //存储 IP地址
  flag = config.setServer(ipTxt,portTxt)
  setItem('flag',true)
  if (flag) {
    // 显示 tip
    tip.style.display = 'flex'
    errTip.style.display = 'none'
    errTip.innerHTML = ''
    setTimeout(function(){
      document.getElementById('box').style.display = 'none'
      tip.style.display = 'none'
    },500)
    home.init()
  }
}

