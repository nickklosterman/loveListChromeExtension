chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [

          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: "dev-", hostSuffix: '.lbidts.com', schemes: ['https'] }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: "test-", hostSuffix: '.lbidts.com', schemes: ['https'] }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: "vsdpint.", hostSuffix: '.lbidts.com', schemes: ['https'] }
          })
/*,

          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'g' },
          })
*/
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

/*
 * Inject our script into the desired matching pages.
 */
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  chrome.pageAction.show(tab.id);
  chrome.tabs.executeScript(null, {"file": "popup.js"});
});
