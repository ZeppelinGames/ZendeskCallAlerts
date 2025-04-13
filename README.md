# Zendesk Call Alerts
 A Chrome extension that play's an alert through a selected audio output as calls on Zendesk are received.

### Install  
- Download source files (and unzip)
- Open Chrome and navigate to `chrome://extensions`
- Select `Load Unpacked`
- Select root folder of downloaded source

### Update 'Alert Noise'  
Either replace `./ring.mp3` with an audio file named the `ring.mp3` or edit `background.js > playAudio()` function signature deafults.
```js
function playAudio(source = 'ring.mp3', volume = 1) {
```
