document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const status = document.getElementById('status');
  const refresh = document.getElementById('refresh');
  const toggleLabel = document.querySelector('.toggle-label');

  chrome.storage.sync.get(['enabled'], (result) => {
    const enabled = result.enabled ?? true;
    toggle.checked = enabled;
    updateStatus(enabled);
  });

  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;

    chrome.storage.sync.set({ enabled });
    updateStatus(enabled);

    // Notify content script so the current tab updates immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: 'setEnabled', enabled });
    });
  });

  refresh.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      chrome.tabs.reload(tabs[0].id);
    });
  });

  function updateStatus(enabled) {
    status.textContent = enabled ? 'Shorts blocked' : 'Shorts unblocked';
    // Keep the toggle label constant to avoid confusion.
    toggleLabel.textContent = 'Block Shorts';
  }
});