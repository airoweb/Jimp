document.addEventListener('DOMContentLoaded', function() {
  const projectField = document.getElementById('project');
  const issueIdField = document.getElementById('issueId');
  const openButton = document.getElementById('open');
  const resetButton = document.getElementById('reset');
  const linksContainer = document.getElementById('links');
  const settingsButton = document.getElementById('settings');

  // Focus on Issue ID input field when popup is opened
  issueIdField.focus();

  // Load settings and visited links
  chrome.storage.sync.get(['baseUrl', 'projectOptions', 'recentLinks', 'maxRecentLinks'], function(data) {
    const baseUrl = data.baseUrl || 'https://braiins.atlassian.net/browse/';
    const projectOptions = data.projectOptions || ['FMP', 'TOOL', 'BOS'];
    const recentLinks = data.recentLinks || [];
    const maxRecentLinks = data.maxRecentLinks || 5;

    // Set project dropdown options
    projectField.innerHTML = '';
    projectOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      projectField.appendChild(optionElement);
    });

    // Display recently visited links
    const displayRecentLinks = () => {
      linksContainer.innerHTML = '';
      recentLinks.slice(0, maxRecentLinks).forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = `${baseUrl}${link}`;
        linkElement.target = '_blank';
        linkElement.textContent = link;
        linksContainer.appendChild(linkElement);
      });
    };
    displayRecentLinks();

    const openIssue = () => {
      const project = projectField.value;
      const issueId = issueIdField.value;
      if (issueId) {
        const issueKey = `${project}-${issueId}`;
        const url = `${baseUrl}${issueKey}`;
        chrome.tabs.create({ url });

        // Update recent links
        if (!recentLinks.includes(issueKey)) {
          recentLinks.unshift(issueKey);
          if (recentLinks.length > maxRecentLinks) {
            recentLinks.pop();
          }
          chrome.storage.sync.set({ recentLinks: recentLinks }, displayRecentLinks);
        }
      } else {
        alert('Please enter an Issue ID');
      }
    };

    // Open button click event
    openButton.addEventListener('click', openIssue);

    // Enter key press event
    issueIdField.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        openIssue();
      }
    });

    // Reset button click event
    resetButton.addEventListener('click', function() {
      projectField.value = 'FMP';
      issueIdField.value = '';
      issueIdField.focus(); // Focus back to Issue ID input field after reset
    });

    // Settings button click event
    settingsButton.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
    });
  });
});
