const message = require('./../messaging');

const scripts = [];

const scriptElements = document.getElementsByTagName("script");
for (let i = 0; i < scriptElements.length; i++) {
    const scriptElement = scriptElements[i];
    const scriptUrl = scriptElement.getAttribute('src');
    if (scriptUrl && scriptUrl !== '') {
        scripts.push(scriptUrl);
    }
}

message.sendMessageToPanel('js.modules.info', {
    scripts: scripts
});
