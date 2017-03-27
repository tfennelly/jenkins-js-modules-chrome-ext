import jsmodules from '../jsmodules';
import message from '../messaging';

const scripts = [];

// Gather all the script URLs from the page.
const scriptElements = document.getElementsByTagName("script");
for (let i = 0; i < scriptElements.length; i++) {
    const scriptElement = scriptElements[i];
    const scriptUrl = scriptElement.getAttribute('src');
    if (scriptUrl && scriptUrl !== '') {
        scripts.push(scriptUrl);
    }
}

jsmodules.getBundleData(scripts, function (scriptInfo) {
    // Send them to the panel.
    message.sendMessageToPanel('bundle-data', {
        data: scriptInfo
    });
});