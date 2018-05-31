var changeFlag = false
var changeFlagTimer
// 打开声音
function openAudio() {
	// this.alarmList.innerHTML = speekCon
	document.getElementById('soundsIcon').className = 'fa fa-volume-up'
	document.getElementById('soundsIcon').innerHTML = ''
	document.getElementById('volumeUp').classList.add('active')
	document.getElementById('volumeOff').classList.remove('active')
	speakPlaying = true
	speaking = true
	android.speakInit()
	android.speak(speekCon)
	speaking = false
	changeFlagTimer = setInterval(function(){
		if (changeFlag) {
			clearInterval(changeFlagTimer)
		}else {
			Observer.fire('play')
		}
	},20000)
}
function endAudio () {
	document.getElementById('soundsIcon').className = 'fa fa-volume-off'
	document.getElementById('soundsIcon').innerHTML = '<i>×</i>'
	document.getElementById('volumeOff').classList.add('active')
	document.getElementById('volumeUp').classList.remove('active')
	speakPlaying = false
	speaking = false
	android.stopSpeak()
	clearInterval(changeFlagTimer)
}
Observer.regist('play',function(){
	if(!speakPlaying) {
		return
	}
	android.speakInit()
	android.speak(speekCon)
})