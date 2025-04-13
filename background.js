const callCheckDelay = 1000;
const callRingDelay = 5000;
let hasCall = false;

window.onload = () => {
    console.log("Zendesk call alerts loaded...");

    setInterval(() => {
        if (hasCall === false) {
            const acceptCallButtons = document.querySelectorAll('button[data-test-id="qa-call-console-accept"]');
            if (acceptCallButtons.length > 0) {
                playAudio();

                hasCall = true;
                setTimeout(() => {
                    hasCall = false;
                }, callRingDelay);
            }
        }
    }, callCheckDelay);
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Call alert' // details for using the API
    });
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'playAudio') {
        playAudio();
    }

    if (msg.msg == 'setData') {
        localStorage.setItem("zen-alerts-data", JSON.stringify(msg.data));
    }

    if (msg === 'getDevice') {
        const rawData = localStorage.getItem("zen-alerts-data") ?? '{ "enabled": false, "sinkId": "deafult" }';
        const data = JSON.parse(rawData);
        
        chrome.runtime.sendMessage({
            msg: 'updateDevice',
            data: {
                "enabled": data.enabled,
                "sinkId": data.sinkId,
            }
        });
    }
});

// Play sound with access to DOM APIs
function playAudio(source = 'ring.mp3', volume = 1) {
    const rawData = localStorage.getItem('zen-alerts-data');
    const data = JSON.parse(rawData);

    if (data.enabled) {
        const audio = new Audio(chrome.runtime.getURL(source));
        audio.volume = volume;
        if (data.sinkId) {
            audio.setSinkId(data.sinkId);
        }
        audio.play();
    }
}