// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

chrome.extension.onConnect.addListener(function (port) {

  var extensionListener = function (message, sender, sendResponse) {

    if(message.tabId && message.content) {

      if(message.action === 'script') {
        chrome.tabs.executeScript(message.tabId, {file: message.content});
      } else {
        chrome.tabs.sendMessage(message.tabId, message, sendResponse);
      }
    } else {
      port.postMessage(message);
    }
  };

  // Listens to messages sent from the panel
  chrome.extension.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function(port) {
    chrome.extension.onMessage.removeListener(extensionListener);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  return true;
});