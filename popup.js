document.addEventListener('DOMContentLoaded', function () {
    const enabledInput = document.getElementById('enabledInput');
    const audioDeviceInput = document.getElementById('audioDeviceInput');
    const testAudioButton = document.getElementById('testAudioButton');

    audioDeviceInput.innerHTML = '';
    chrome.runtime.sendMessage('fetchData', (outputs) => {
        if (outputs && outputs.data) {
            const devices = JSON.parse(outputs.data);
            if (devices && devices.length > 0) {
                devices.forEach((device) => {
                    console.log(device);
                    CreateOption(device.deviceId, device.label || 'Unnamed Device');
                });

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs && tabs.length > 0) {
                        const tabId = tabs[0].id;
                        chrome.tabs.sendMessage(tabId, 'getDevice');
                    }
                });
            }
        } else {
            console.log("no data");
            CreateOption("default", "Default");
        }
    });

    audioDeviceInput.onchange = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const tabId = tabs[0].id;
                const setDev = {
                    msg: 'setData',
                    data: {
                        sinkId: audioDeviceInput.value ?? 'default',
                        enabled: enabledInput.checked ?? false
                    }
                };
                chrome.tabs.sendMessage(tabId, setDev);
            }
        });
    }

    testAudioButton.onclick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const tabId = tabs[0].id;
                chrome.tabs.sendMessage(tabId, 'playAudio');
            }
        });
    }

    enabledInput.onchange = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const tabId = tabs[0].id;
                const setDev = {
                    msg: 'setData',
                    data: {
                        sinkId: audioDeviceInput.value ?? 'default',
                        enabled: enabledInput.checked ?? false
                    }
                };
                chrome.tabs.sendMessage(tabId, setDev);
            }
        });
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.msg === 'updateDevice') {
        const optionValues = [...audioDeviceInput.options].map(o => o.value);
        if (optionValues.includes(msg.data.sinkId)) {
            audioDeviceInput.value = msg.data.sinkId;
        }
        enabledInput.checked = msg.data.enabled;
    }
});

function CreateOption(value, innerText) {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = innerText;
    audioDeviceInput.append(option);
}