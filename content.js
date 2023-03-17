function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

async function exportChat() {
    let chatContent = '';

    const myMessages = document.querySelectorAll('.content.text-message-content');
    const botMessages = document.querySelectorAll('.bot-message-selector'); // Replace '.bot-message-selector' with the actual CSS selector for the chatbot message container.

    for (let index = 0; index < myMessages.length; index++) {
        chatContent += `- ${myMessages[index].textContent}\n`;

        // Trigger the hover event on the bot message.
        const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true, cancelable: true });
        botMessages[index].dispatchEvent(mouseEnterEvent);

        // Wait for the "More" button to appear.
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Click the "More" button.
        const moreButton = botMessages[index].querySelector('.more');
        moreButton.click();

        // Wait for the menu to open.
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Click the "Copy" button.
        const copyButton = document.querySelector('.copy-button-selector'); // Replace '.copy-button-selector' with the actual CSS selector for the "Copy" button.
        if (copyButton) {
            copyButton.click();
        } else {
            console.error('Copy button not found.');
            return;
        }

        // Get the copied message from the clipboard.
        const copiedMessage = await navigator.clipboard.readText();

        chatContent += `\t- ${copiedMessage}\n`;
    }

    copyToClipboard(chatContent);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'ping') {
        console.log('Received ping');
        sendResponse({ status: 'pong' });
    } else if (request.action === 'exportChat') {
        console.log('Received exportChat');
        exportChat();
        sendResponse({ status: 'exported' }); // Add this line
    }
});
