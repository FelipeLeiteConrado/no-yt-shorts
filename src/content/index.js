function removeShorts() {
  document.querySelectorAll('ytd-reel-shelf-renderer').forEach(el => el.remove());

  document.querySelectorAll('ytd-rich-section-renderer').forEach(section => {
    if (section.innerText.toLowerCase().includes('shorts')) {
      section.remove();
    }
  });

  document.querySelectorAll('a[href="/shorts/"]').forEach(el => el.remove());
  document.querySelectorAll('a[title="Shorts"]').forEach(el => el.remove());
}

function run() {
  chrome.storage.sync.get(['enabled'], (result) => {
    const enabled = result.enabled ?? true;

    if (enabled) {
      removeShorts();
    }
  });
}

setInterval(run, 1000);

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'setEnabled') {
    // When turning the extension off, refresh so the page renders full content again.
    if (message.enabled) {
      removeShorts();
    } else {
      window.location.reload();
    }
    return;
  }

  if (message?.type === 'reload') {
    window.location.reload();
  }
});