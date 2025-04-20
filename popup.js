document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('exportButton').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      chrome.cookies.getAll({ url: currentTab.url }, function(cookies) {
        const cookieArray = cookies.map(cookie => ({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          expires: cookie.expirationDate,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite
        }));

        const cookieJson = JSON.stringify(cookieArray, null, 2);
        const blob = new Blob([cookieJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        chrome.downloads.download({
          url: url,
          filename: 'cookies.json',
          saveAs: true
        });

        URL.revokeObjectURL(url); // Clean up the URL
      });
    });
  });
});
