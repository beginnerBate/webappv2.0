var myset = {
  childPage:'',
  setPage:'',
  loading:"",
  init: function() {
    erroring.style.display = 'none'
    // 设置标题
    document.getElementById('title').innerText = '系统设置'
    this.setPage = document.getElementById('setPage')
    this.loading = document.getElementById('sloading')
    // 初始化页面
    this.renderHTML()
    // 获取子页面
    this.childPage = document.getElementById('commonBox')
    // IP初始化
    this.setIP()
  },
  renderHTML: function() {
      // 页面加载set页面
      // 加载之前
      this.loading.style.display = 'block'
      this.loading.innerHTML ='<i class="fa fa-spinner fa-spin fa-2x"></i>'
      // 数据获取
      var IP = getItem('ip',true)
      var port = getItem('port',true)
      var sounds = getItem('sounds',true)
      // 页面加载
      var that = this
      this.setPage.innerHTML = '<div class="page-set-content">'+
                                  '<ul>'+
                                   ' <li id="ipset">'+
                                      '<div>'+
                                        '<span class="name">IP</span>'+
                                        '<span class="name-value">'+IP+'</span>'+
                                        '<span class="fa fa-angle-right"></span>'+
                                      '</div>'+
                                    '</li>'+
                                    '<li id="portset">'+
                                      '<div>'+
                                        '<span class="name">端口</span>'+
                                        '<span class="name-value">'+port+'</span>'+
                                        '<span class="fa fa-angle-right"></span>'+
                                      '</div>'+
                                    '</li>'+
                                  '</ul>'+
                                  '<ul>'+
                                    '<li>'+
                                      '<div>'+
                                        '<span class="name">语音报警</span>'+
                                        '<span class="name-value"></span>'+
                                        '<span class="on-off" id="setSounds">'+
                                          '<span class="on-off-btn" id="soundsBtn"></span>'+
                                        '</span>'+
                                      '</div>'+
                                    '</li>'+
                                  '</ul>'
        setTimeout(function(){
          that.loading.style.display = 'none'
          that.loading.innerHTML ='0'
        },0)
        this.setIP()
        this.setPORT()    
        this.setSounds()                      
      
  },
  setIP: function() {
    var setIPBtn = document.getElementById('ipset')
    var that = this
    setIPBtn.onclick = function() {
//    console.log('修改IP')
      //  1.获取IP
      var IP = getItem('ip',true)
      //  2.初始化IPset页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改IP</h1>"+
                                    '<input type="button" id="setIp" class="btn s-btn" value="完成" onclick="subIP()" />'+
                                 "</div>"+
                                 "<div class='box-content' id='pageCon'>"+
                                 '<div class="form-row ">'+
                                   '<input type="text" class="s-input" id="sip" value="'+IP+'" />'+
                                 '</div>'+
                                 "</div>"
      //  3.显示页面
      that.childPage.style.right = 0;
    }
  },
  setPORT:function(){
    var setPORTBtn = document.getElementById('portset')
    var that = this
    setPORTBtn.onclick = function() {
      console.log('修改端口')
      //  1.获取IP
      var PORT = getItem('port',true)
      //  2.初始化IPset页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改端口</h1>"+
                                    '<input type="button"  class="btn s-btn" value="完成" onclick="subPORT()" />'+
                                 "</div>"+
                                 "<div class='box-content' id='pageCon'>"+
                                 '<div class="form-row ">'+
                                   '<input type="text" class="s-input" id="sport" value="'+PORT+'" />'+
                                 '</div>'+
                                 "</div>"
      //  3.显示页面
      that.childPage.style.right = 0;
    }    
  },
  setSounds: function() {
    // 初始化声音
    var sounds = getItem('sounds',true)
    var setSounds = document.getElementById('setSounds')
    var soundsBtn = document.getElementById('soundsBtn')
    if (sounds == 'on') {
      setSounds.classList.add('on')
    }else {
      setSounds.className ='on-off'
    }

    soundsBtn.onclick = function(){
      // 设置声音
      sounds = getItem('sounds',true)
      if (sounds == 'off') {
        setItem('sounds',"on")
        setSounds.classList.add('on')
      }else {
        setItem('sounds',"off")
        setSounds.className ='on-off'
      }
      console.log()
    }
  },
  backPage: function() {
    this.childPage.style.right = '-100%'
    this,this.childPage.innerHTML = ''
    // 刷新页面
    this.renderHTML()
  }
}

function IPcancle() {
  // 取消修改
  myset.childPage.style.right = '-100%'
  myset.childPage.innerHTML = ''
}
function subIP () {
  var ipTxt = document.getElementById('sip').value
  // var portTxt = document.getElementById('port').value
  var ip = document.getElementById('sip')
  var alert = document.getElementById('alert')
  var tip = document.getElementById('stip')
  if (!ipTxt){
    alert.style.display = "flex"
    alert.innerHTML = '请输入IP地址'
    ip.focus()
    setTimeout(function(){
      alert.innerHTML = ''
      alert.style.display = 'none'
    },1000)
    return
  }		
  //合法性 有待完善
  
  //存储 IP地址
  flag = config.setIP(ipTxt)
  setItem('flag',true)
  if (flag) {
    // 显示 tip
    tip.style.display = 'flex'
    tip.innerHTML = '设置成功'
    setTimeout(function(){
      tip.style.display = 'none'
      tip.innerHTML = ''
      // 1.返回set页面
      myset.backPage()
      // 2.刷新set页面
    },500)
  }
}
function subPORT () {
  var ipTxt = document.getElementById('sport').value
  // var portTxt = document.getElementById('port').value
  var ip = document.getElementById('sport')
  var alert = document.getElementById('alert')
  var tip = document.getElementById('stip')
  if (!ipTxt){
    alert.style.display = "flex"
    alert.innerHTML = '请输入端口地址'
    ip.focus()
    setTimeout(function(){
      alert.innerHTML = ''
      alert.style.display = 'none'
    },1000)
    return
  }		
  //合法性 有待完善
  
  //存储 IP地址
  flag = config.setPORT(ipTxt)
  setItem('flag',true)
  if (flag) {
    // 显示 tip
    tip.style.display = 'flex'
    tip.innerHTML = '设置成功'
    setTimeout(function(){
      tip.style.display = 'none'
      tip.innerHTML = ''
      // 1.返回set页面
      myset.backPage()
      // 2.刷新set页面
    },500)
  }
}

