document.getElementById('exportChat').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send a message to the content script and check if it responds.
    chrome.tabs.sendMessage(tab.id, { action: 'ping' }, async (response) => {
        console.log('Ping response:', response);
        if (chrome.runtime.lastError || !response || response.status !== 'pong') {
            // If the content script is not loaded, inject it.
            await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
        }

        // Send the exportChat message.
        chrome.tabs.sendMessage(tab.id, { action: 'exportChat' }, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log('exportChat message sent');
            }
        });

    });
});
