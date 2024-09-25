document.addEventListener('DOMContentLoaded', function() {
  const baseUrlField = document.getElementById('baseUrl');
  const projectOptionsField = document.getElementById('projectOptions');
  const maxRecentLinksField = document.getElementById('maxRecentLinks');
  const saveButton = document.getElementById('save');

  // Load settings
  chrome.storage.sync.get(['baseUrl', 'projectOptions', 'maxRecentLinks'], function(data) {
    baseUrlField.value = data.baseUrl || 'https://braiins.atlassian.net/browse/';
    projectOptionsField.value = (data.projectOptions || ['TOOL', 'FMP', 'BOS']).join(', ');
    maxRecentLinksField.value = data.maxRecentLinks || 5;
  });

  // Save settings
  saveButton.addEventListener('click', function() {
    const baseUrl = baseUrlField.value;
    const projectOptions = projectOptionsField.value.split(',').map(option => option.trim());
    const maxRecentLinks = parseInt(maxRecentLinksField.value, 10);

    chrome.storage.sync.set({
      baseUrl: baseUrl,
      projectOptions: projectOptions,
      maxRecentLinks: maxRecentLinks
    }, function() {
      alert('Settings saved');
    });
  });
});
