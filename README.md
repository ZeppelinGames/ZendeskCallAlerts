# ZendeskCallAlerts
 A Chrome extension that play's an alert through a secondary audio ouput as calls on Zendesk are received

### Update 'Alert Noise'  
Either replace `./ring.mp3` with an audio file named the same or edit `background.js` `playAudio()` function signature deafults.
```js
function playAudio(source = 'ring.mp3', volume = 1) {
```