// popup.js

// Elements
const includeBaseCheckbox = document.getElementById('includeBase');
const baseInput = document.getElementById('baseid');
const clientInput = document.getElementById('clientid');
const fnameInput = document.getElementById('fname');
const lnameInput = document.getElementById('lname');
const qrCanvas = document.getElementById('qrcode');

// 1. On popup open, restore Base ID if it was saved
chrome.storage.local.get('baseid', ({ baseid }) => {
	if (baseid) {
		includeBaseCheckbox.checked = true;
		baseInput.disabled = false;
		baseInput.value = baseid;
	} else {
		includeBaseCheckbox.checked = false;
		baseInput.disabled = true;
	}
});

// 2. Toggle enable/disable of Base ID input
includeBaseCheckbox.addEventListener('change', () => {
	baseInput.disabled = !includeBaseCheckbox.checked;
	baseInput.required = includeBaseCheckbox.checked;
	if (!includeBaseCheckbox.checked) {
		// also clear stored Base ID immediately when toggled off
		chrome.storage.local.remove('baseid');
		baseInput.value = '';
	}
});

// 3. On form submit: build URL, save Base ID if used, draw the QR
document.getElementById('urlForm').addEventListener('submit', (e) => {
	e.preventDefault();

	let url = 'https://bob.com';
	let sep = '?';

	if (includeBaseCheckbox.checked) {
		const baseid = baseInput.value.trim();
		url += `${sep}baseid=${encodeURIComponent(baseid)}`;
		sep = '&';
		// persist this Base ID until extension reload
		chrome.storage.local.set({ baseid });
	}

	const clientid = clientInput.value.trim();
	const fname = fnameInput.value.trim();
	const lname = lnameInput.value.trim();

	url +=
		`${sep}clientid=${encodeURIComponent(clientid)}` +
		`&fname=${encodeURIComponent(fname)}` +
		`&lname=${encodeURIComponent(lname)}`;

	new QRious({
		element: qrCanvas,
		value: url,
		size: 200,
	});
});
