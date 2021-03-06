# 智能医疗护理平台V2.0
> chrome 内核35.0 + android5.1
> 新增智能语音播放功能

> 感受一下css2.0 的流布局

> 感受一下自己的单页面开发

> 移动端平板

> sme-router 前端路由

> 数据模拟接口列表
```javascript
{
  "port":"https://www.easy-mock.com/mock/5aee8d0da4c2e060a82fb809/webservice/"
}
1. 体温数据获取
2. 警报数据获取
3. 输液监测数据获取
```
#开发笔记记录

#### 1. nodeList 转数组之后遍历  Array.prototype.slice.call(anchors) 少用for 循环 注意闭包问题

#### 2. 媒体查询小于800px 的布局 @media screen and (max-width: 800px) 

#### 3. ip-set 模块设置 设置IP 并且存在本地 IP 可以修改
1. ipset 样式设置 利用  vertical-align: middle;
2. 需要图标字体 引入图标字体 font-awesome
#### 4. 观察者模式初探

#### 5. 电子白板 
```javascript
onmousedown ==> ontouchstart
onmousemove ==> ontouchmove
onmouseup ==>  ontouchend
ev.clientX ==> ev.changedTouches[0].clientX
ev.clientY ==> ev.changedTouches[0].clientY
docuemnt ==> document.getEleById('eboard')
```

#### 6. 温度详情页面

1. 列表分页模块
> 点击 item 弹出详细页面
> 接口信息
1. echart模块
> 异步数据加载 
#### 7. 输液报警模块
1. 语音播报 
2. 关闭语音播报
#### 8. 输液监测模块
#### 9. 服务器设置
#### 10. 页面细节优化 路由刷新

### 服务器数据对接
1. 系统时间对接
```javascript
// 接口: 
        http://192.168.0.100:8888/webservice/common/sysDateTime
// 结果: 
        {
          "sysDateTime": "2018-05-18 09:21:59"
        }
```
2. 体温数据查询
```javascript
<!-- 接口 -->
http://192.168.0.100:8888/webservice/newestTemperatures
  headers:{
    inpatientAreaCode:'001'
  }
<!-- 结果 -->
{
    "code": "200",
    "data": [
        {
            "wardNumber": "101",
            "recordTime": 1526357400000,
            "bedNumber": "01",
            "temperatureValue": 22
        }
    ]
}
<!-- 详情接口  -->
```
3. 输液报警
```javascript
http://192.168.0.100:8888/webservice/infusionAlarms?status=0

```
4. 输液监控 三个接口
```javascript
1. infusionMonitors
```