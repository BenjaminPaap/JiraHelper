function onNavigate(details) {
    updateSettings(function(config) {
        Object.keys(config.urls).forEach(function(url) {
            if (details.url.indexOf(url) != -1) {
                chrome.tabs.executeScript(details.tabId, {file: "assets/js/jquery-2.1.3.min.js"}, function() {
                    chrome.tabs.executeScript(details.tabId, {file: "assets/js/issues.js"}, function() {
                        chrome.tabs.sendMessage(details.tabId, {details: config.urls[url]});
                    });
                });
            }
        });
    });
}

function updateSettings(callback) {
    chrome.storage.sync.get(['config'], function(config) {
        if (callback) {
            callback(config.config);
        }
    });
}

chrome.webNavigation.onDOMContentLoaded.addListener(onNavigate);
chrome.webNavigation.onReferenceFragmentUpdated.addListener(onNavigate);
