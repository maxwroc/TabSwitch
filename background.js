
chrome.commands.onCommand.addListener(keyboardCommand);
chrome.tabs.onActivated.addListener(tabActivated);


let browserWindows = {};

function keyboardCommand(cmd) {
    if (cmd != "PreviousTab") {
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, tabsResult => {

        if (tabsResult.length != 1 || !browserWindows[tabsResult[0].windowId]) {
            return;
        }

        const tab = tabsResult[0];

        const previousTabs = browserWindows[tab.windowId];
        if (previousTabs.length < 2) {
            return;
        }

        // newest on the beginning
        const prevTabId = previousTabs[1];

        chrome.tabs.update(prevTabId, { active: true });
    });
}


function tabActivated(activeInfo) {
    const windowId = activeInfo.windowId;
    const tabs = browserWindows[windowId] = browserWindows[windowId] || [];
    tabs.unshift(activeInfo.tabId);
    tabs.length = 3;
}
