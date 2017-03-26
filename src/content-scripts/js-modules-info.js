const message = require('./../messaging');

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

// Send them to the panel.
message.sendMessageToPanel('js.modules.info', {
    scripts: scripts
});
