## TVV2.0版本
## wapV2.0版本
---

## 软件优化
1. 信息查询

* 增加输液信息查询
* 可以查询到每次的输液总量、剩量、滴速等，中途换药可以准确知道剩量,再输此瓶时可以准确用数字键设置总量

2. 滴速报警阀值

* 软件可以设置滴速过慢、过快报警阀值、
* 输液滴速超过设定阀值时，对应的图标闪动提示和语音报警

3. 院内统计功能

* 提供查看以病区、病人、日期、单次输液、和单次测量体温为统计单位的输液报表和体温测量报表，报表推送护士长、科室长、院长等

4. 输液袋内药液剩余10ml 或者下完药触发阻断，终端提示音持续响到两到三次即可

5. 输液监控器电压过低时，软件相应床位发出电量不足提示

6. 医疗护理以及智能监测系统与his对接后，病人更换床位后，也能查看到该病人在之前床位的输液信息以及体温信息

# 接口对接优化

## 1.1.1获取最新体温数据

请求示例：http://10.0.0.100:8080/mcim-webservice/app/newestTemperatures

## 1.1.2获取单个床位体温记录
接口地址：http://ip:端口/版本号/app/devicePositions/{devicePositionId}/temperatures
请求示例：http://10.0.0.100:8080/mcim-webservice/app/devicePositions/1/temperatures?page=1&rows=30


## 1.2.1输液开始
接口地址：http://ip:端口/版本号/app/devices/{deviceCode}/infusionMonitorStart
请求示例：http://10.0.0.100:8080/mcim-webservice/app/devices/200041/infusionMonitorStart

## 1.2.2输液结束
接口地址：http://ip:端口/版本号/app/infusionMonitors/{infusionMonitorId}/end
请求示例：http://10.0.0.100:8080/mcim-webservice/app/infusionMonitors/108/end

## 1.2.3输液暂停
接口地址：http://ip:端口/版本号/app/infusionMonitors/{infusionMonitorId}/suspend
提交方式：HTTP PATCH
请求示例：http://10.0.0.100:8080/mcim-webservice/app/infusionMonitors/108/suspend

## 1.2.7获取最新的输液监测记录
接口地址：http://ip:端口/版本/app/newestInfusionMonitors
请求示例：http://10.0.0.100:8080/mcim-webservice/app/newestInfusionMonitors

## 1.2.8获取最新的输液监测记录（低于10mL）
接口地址：http://ip:端口/版本号/app/newestInfusionMonitors10
请求示例：http://10.0.0.100:8080/mcim-webservice/app/newestInfusionMonitors10

## 1.2.5获取单个床位输液记录
接口地址：http://ip:端口/版本号/app/devicePositions/{devicePositionId}/infusionMonitors
请求示例：http://10.0.0.100:8080/mcim-webservice/app/devicePositions/4/infusionMonitors?page=1&rows=30

## 1.2.6获取单瓶输液详细数据
接口地址：http://ip:端口/版本号/app/infusionMonitors/{infusionMonitorId}
请求示例：http://10.0.0.100:8080/mcim-webservice/app/infusionMonitors/108


# 页面修改
## 在设置中添加病区编码, 并保存到本地可修改。