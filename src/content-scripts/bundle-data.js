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

// Gather all the bundle tracking events from the sessionStorage.
var bundleTrackingEvents = [];
for (var i = 0; i < sessionStorage.length; i++) {
    var key = sessionStorage.key(i);
    if (key.indexOf('jenkins-cd/js-modules/tracking/') === 0) {
        bundleTrackingEvents.push(sessionStorage.getItem(key));
    }
}

jsmodules.getBundleData(scripts, function (bundleInfo) {
    // Send them to the panel.
    message.sendMessageToPanel('bundle-data', {
        bundles: bundleInfo,
        trackingEvents: bundleTrackingEvents
    });
});