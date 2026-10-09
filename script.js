

async function sendCommand(userInput) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/terminal', {  //this IP adress is standard protocol, from what I know its called the localhost.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: userInput })
    });

    const data = await response.json();
    return data.output; 
  } catch (error) {
    return 'Error: Cannot connect to FastAPI (Python) backend server.';
  }
}

window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,ar,es,fr,de,zh-CN',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  // Insert a custom Globe Icon inside the button after Google finishes initializing
  setTimeout(function() {
    const gadgetBtn = document.querySelector('.goog-te-gadget-simple');
    if (gadgetBtn && !document.querySelector('.cyber-globe-icon')) {
      const globeIcon = document.createElement('span');
      globeIcon.className = 'cyber-globe-icon';
      globeIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      `;
      gadgetBtn.prepend(globeIcon);
    }
  }, 1000);
};

