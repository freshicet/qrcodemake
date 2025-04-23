// background.js
// Clear stored Base ID on every (re)load of the service worker
chrome.storage.local.remove('baseid', () => {
	console.log('Base ID cleared on extension load');
});
