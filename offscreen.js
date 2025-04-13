// Listen for messages from the extension
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'fetchData') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const tabId = tabs[0].id;

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        return new Promise((resolve) => {
                            navigator.mediaDevices.enumerateDevices().then((devices) => {
                                const outputs = devices.filter(({ kind }) => kind === 'audiooutput');
                                resolve(JSON.stringify(outputs));
                            });
                        });
                    }
                }, (injectionResults) => {
                    if (chrome.runtime.lastError) {
                        sendResponse({ data: '{}' });
                    } else {
                        const [injectionResult] = injectionResults;
                        if (injectionResult) {
                            sendResponse({ data: injectionResult.result });
                        } else {
                            sendResponse({ data: '{}' });
                        }
                    }
                });
            }
        });
    }
    return true;
}
);