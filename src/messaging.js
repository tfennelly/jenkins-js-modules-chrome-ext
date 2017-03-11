var portMessagelisteners = [];
var port;

function connectPort() {
  if (port) {
    // already connected.
    return;
  }

  //Create a port with background page for continous message communication
  port = chrome.extension.connect({
    name: "Panel Communication"
  });

// Listen to messages from the background page
  port.onMessage.addListener(function (message) {
    if (!message._$eventId) {
      throw new Error('Invalid message object from content script. Must define an "eventId".');
    }
    portMessagelisteners.forEach(function (listenerConfig) {
      if (listenerConfig.eventId === message._$eventId) {
        listenerConfig.listener(message);
      }
    })
  });
}

exports.onMessageFromInspectedPage = function (eventId, listener) {
  connectPort();
  portMessagelisteners.push({
    eventId: eventId,
    listener: listener
  });
};

// This sends an object to the background page
// where it can be relayed to the inspected page
exports.sendMessageToInspectedPage = function(message, responseCallback) {
  connectPort();
  message.tabId = chrome.devtools.inspectedWindow.tabId;
  chrome.extension.sendMessage(message, responseCallback);
};

exports.executeScriptOnInspectedPage = function (script, responseCallback) {
  var message = {
    action: "script",
    content: script
  };
  exports.sendMessageToInspectedPage(message, responseCallback);
};

exports.injectScriptOnInspectedPage = function (script) {
    chrome.devtools.inspectedWindow.eval(script, function(result, isException) {});
};

exports.sendMessageToPanel = function (eventId, message) {
  message._$eventId = eventId;
  chrome.extension.sendMessage(message);
}
