var myset = {
  childPage:'',
  setPage:'',
  loading:"",
  setScroll:"",
  init: function() {
    erroring.style.display = 'none'
    // 设置标题
    document.getElementById('title').innerText = '系统设置'
    // 初始化页面
    this.initPage()
    this.setPage = document.getElementById('setPage')
    this.loading = document.getElementById('sloading')
    // 初始化页面
    this.renderHTML()
    // 获取子页面
    this.childPage = document.getElementById('commonBox')
    // IP初始化
    this.setIP()
  },
  initPage: function () {
    var pageHtml = '<div class="page-set" id="setPage"></div>';
    document.getElementById('hPage').innerHTML = pageHtml;
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
      var code = getItem('inpatientAreaCode',true)
      var daIP = getItem('daIP',true)
      var daPort = getItem('daPort',true)
      var dotRateAlarmValue = getItem('dotRateAlarmValue',true)
      // 页面加载
      var that = this
      this.setPage.innerHTML = '<div class="page-set-content">'+
                                  '<p>服务器设置</p>'+
                                  '<ul class="set-list">'+
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
                                    '<li id="codeset">'+
                                      '<div>'+
                                        '<span class="name">病区编号</span>'+
                                        '<span class="name-value">'+code+'</span>'+
                                        '<span class="fa fa-angle-right"></span>'+
                                      '</div>'+
                                    '</li>'+
                                  '</ul>'+
                                  '<p>采集端主机设置</p>'+
                                  '<ul class="set-list">'+
                                   ' <li id="daipset">'+
                                      '<div>'+
                                        '<span class="name">采集端主机IP</span>'+
                                        '<span class="name-value">'+daIP+'</span>'+
                                        '<span class="fa fa-angle-right"></span>'+
                                      '</div>'+
                                    '</li>'+
                                    '<li id="daportset">'+
                                      '<div>'+
                                        '<span class="name">采集端主机端口</span>'+
                                        '<span class="name-value">'+daPort+'</span>'+
                                        '<span class="fa fa-angle-right"></span>'+
                                      '</div>'+
                                    '</li>'+
                                  '</ul>'+
                                  '<p>滴速报警值</p>'+
                                  '<ul class="set-list">'+
                                    '<li id="sdotRateAlarmValue">'+
                                      '<div>'+
                                        '<span class="name">滴速报警值</span>'+
                                        '<span class="name-value">'+dotRateAlarmValue+'</span>'+
                                        '<span class="fa fa-angle-right"></span>'+
                                      '</div>'+
                                    '</li>'+
                                  '</ul>'+                                  
                                  '<p>语音报警设置</p>'+
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
                                  '</ul>'+
                                '</div>'
        setTimeout(function(){
          that.loading.style.display = 'none'
          that.loading.innerHTML ='0'
        },0)
        //设置scroll
        this.setScroll = new BScroll(this.setPage,{
        	click:true
        });
        this.setIP()
        this.setPORT()  
        this.setCode()  
        // 采集端IP和端口设置
        this.setDaip()
        this.setDaport()
        //输液报警值
        this.setdotRateAlarmValue()
        this.setSounds()                      
      
  },
  setIP: function() {
    var setIPBtn = document.getElementById('ipset')
    var that = this
    setIPBtn.onclick = function() {
      //  1.获取IP
      var IP = getItem('ip',true)
      //  2.初始化IPset页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改IP</h1>"+
                                    '<input type="button" id="setIp" class="btn s-btn" value="完成" onclick="subModify(\'IP\')" />'+
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
      //  1.获取IP
      var PORT = getItem('port',true)
      //  2.初始化IPset页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改端口</h1>"+
                                    '<input type="button"  class="btn s-btn" value="完成" onclick="subModify(\'PORT\')" />'+
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
  // 设置病区编号
  setCode: function () {
    var setCodeBtn = document.getElementById('codeset')
    var that = this
    setCodeBtn.onclick = function () {
      // 1. 获取病区编号
      var code = getItem('inpatientAreaCode', true)
      // 2. 初始化codeSet页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改病区编号</h1>"+
                                    '<input type="button"  class="btn s-btn" value="完成" onclick="subModify(\'CODE\')" />'+
                                "</div>"+
                                "<div class='box-content' id='pageCon'>"+
                                  '<div class="form-row ">'+
                                    '<input type="text" class="s-input" id="scode" value="'+code+'" />'+
                                  '</div>'+
                                "</div>"
      // 3. 显示页面
      that.childPage.style.right = 0
    }
  },
  // 设置采集端IP
  setDaip: function () {
    var setCodeBtn = document.getElementById('daipset')
    var that = this
    setCodeBtn.onclick = function () {
      // 1. 获取病区编号
      var code = getItem('daIP', true)
      // 2. 初始化codeSet页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改采集端IP</h1>"+
                                    '<input type="button"  class="btn s-btn" value="完成" onclick="subModify(\'DAIP\')" />'+
                                "</div>"+
                                "<div class='box-content' id='pageCon'>"+
                                  '<div class="form-row ">'+
                                    '<input type="text" class="s-input" id="sdaip" value="'+code+'" />'+
                                  '</div>'+
                                "</div>"
      // 3. 显示页面
      that.childPage.style.right = 0
    }
  },
  // 设置采集端端口
  setDaport: function () {
    var setCodeBtn = document.getElementById('daportset')
    var that = this
    setCodeBtn.onclick = function () {
      // 1. 获取病区编号
      var code = getItem('daPort', true)
      // 2. 初始化codeSet页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改采集端端口</h1>"+
                                    '<input type="button"  class="btn s-btn" value="完成" onclick="subModify(\'DAPORT\')" />'+
                                "</div>"+
                                "<div class='box-content' id='pageCon'>"+
                                  '<div class="form-row ">'+
                                    '<input type="text" class="s-input" id="sdaport" value="'+code+'" />'+
                                  '</div>'+
                                "</div>"
      // 3. 显示页面
      that.childPage.style.right = 0
    }
  },
  setdotRateAlarmValue: function () {
    var setCodeBtn = document.getElementById('sdotRateAlarmValue')
    var that = this
    setCodeBtn.onclick = function () {
      // 1. 获取病区编号
      var code = getItem('dotRateAlarmValue', true)
      // 2. 初始化codeSet页面
      that.childPage.innerHTML = "<div class='child-top'>"+
                                    "<span  class='cancle' onclick='IPcancle()'><span>取消</span></span>"+
                                    "<h1>修改滴速报警值</h1>"+
                                    '<input type="button"  class="btn s-btn" value="完成" onclick="subModify(\'dotRateAlarmValue\')" />'+
                                "</div>"+
                                "<div class='box-content' id='pageCon'>"+
                                  '<div class="form-row ">'+
                                    '<input type="text" class="s-input" id="sdotRateAlarm" value="'+code+'" />'+
                                  '</div>'+
                                "</div>"
      // 3. 显示页面
      that.childPage.style.right = 0
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
function subModify (type) {
  var eleTxt ,ele ;
  var alert = document.getElementById('alert')
  var tip = document.getElementById('stip')

  // ----------------------type:IP 服务器IP----------------------------
  if (type == 'IP') {
    eleTxt = document.getElementById('sip').value
    ele = document.getElementById('sip') 
    if (!eleTxt){
      alert.style.display = "flex"
      alert.innerHTML = '请输入IP地址'
      ele.focus()
      setTimeout(function(){
        alert.innerHTML = ''
        alert.style.display = 'none'
      },1000)
      return
    }	
    //存储 IP地址
    flag = config.setIP(eleTxt)
   }	
  // ----------------------type:PORT 服务器端口----------------------------
  if (type == 'PORT') {
    eleTxt = document.getElementById('sport').value
    ele = document.getElementById('sport') 
    if (!eleTxt){
      alert.style.display = "flex"
      alert.innerHTML = '请输入端口地址'
      ele.focus()
      setTimeout(function(){
        alert.innerHTML = ''
        alert.style.display = 'none'
      },1000)
      return
    }	
    //存储 IP地址
    flag = config.setPORT(eleTxt)
   }	

  // ----------------------type:CODE 服务器端口----------------------------
  if (type == 'CODE') {
    eleTxt = document.getElementById('scode').value
    ele = document.getElementById('scode') 
    if (!eleTxt){
      alert.style.display = "flex"
      alert.innerHTML = '请输入病区编号'
      ele.focus()
      setTimeout(function(){
        alert.innerHTML = ''
        alert.style.display = 'none'
      },1000)
      return
    }	
    //存储 IP地址
    flag = config.setCODE(eleTxt)
   }	

  // ----------------------type:DAIP 服务器端口----------------------------
  if (type == 'DAIP') {
    eleTxt = document.getElementById('sdaip').value
    ele = document.getElementById('sdaip') 
    if (!eleTxt){
      alert.style.display = "flex"
      alert.innerHTML = '请输入采集端IP'
      ele.focus()
      setTimeout(function(){
        alert.innerHTML = ''
        alert.style.display = 'none'
      },1000)
      return
    }	
    //存储 IP地址
    flag = config.setDaIP(eleTxt)
   }

  // ----------------------type:DAPORT 服务器端口----------------------------
  if (type == 'DAPORT') {
    eleTxt = document.getElementById('sdaport').value
    ele = document.getElementById('sdaport') 
    if (!eleTxt){
      alert.style.display = "flex"
      alert.innerHTML = '请输入采集端端口'
      ele.focus()
      setTimeout(function(){
        alert.innerHTML = ''
        alert.style.display = 'none'
      },1000)
      return
    }	
    //存储 IP地址
    flag = config.setDaPORT(eleTxt)
   }	

  // ----------------------type:dotRateAlarmValue 服务器端口----------------------------
  if (type == 'dotRateAlarmValue') {
    eleTxt = document.getElementById('sdotRateAlarm').value
    ele = document.getElementById('sdotRateAlarm') 
    if (!eleTxt){
      alert.style.display = "flex"
      alert.innerHTML = '请输入输液报警值'
      ele.focus()
      setTimeout(function(){
        alert.innerHTML = ''
        alert.style.display = 'none'
      },1000)
      return
    }	
    //存储 IP地址
    flag = config.setDotRateAlarmValue(eleTxt)
   }	

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

