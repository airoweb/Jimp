chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    baseUrl: 'https://braiins.atlassian.net/browse/',
    projectOptions: ['TOOL', 'FMP', 'BOS'],
    recentLinks: [],
    maxRecentLinks: 5
  });
});
