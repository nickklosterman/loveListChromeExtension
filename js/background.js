chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when we are on a VS dev page ...
        conditions: [

          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: '.victoriassecret.com', schemes: ['https'] }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: "dev-", hostSuffix: '.lbidts.com', schemes: ['https'] }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: "test-", hostSuffix: '.lbidts.com', schemes: ['https'] }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: "vsdpint.", hostSuffix: '.lbidts.com', schemes: ['https'] }
          })
/*
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '.lbidts.com' }
          })*/
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

