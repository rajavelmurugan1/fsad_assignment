// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  const goButton = document.getElementById('go-button');
  let selectedLanguage = 'hi';

  // Retrieve the user data from local storage
  const langCollection = JSON.parse(localStorage.getItem('langCollection'));

  // Populate the dropdown picklist with the list of languages
  const languageSelect = document.getElementById('language-select');

  langCollection.forEach(language => {
    console.log('lang selections: '+language.Language);
    const option = document.createElement('option');
    option.value = language.Language_Code;
    option.textContent = language.Language;
    languageSelect.appendChild(option);
  });

  languageSelect.addEventListener('change', () => {
    // Get the selected language option
    selectedLanguage = languageSelect.value;
    console.log('selected langugage is: '+selectedLanguage);

    // Store the selected language in a cookie or local storage
    localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
  });

  goButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'next-page.html';
  });
});