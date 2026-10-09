

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
    includedLanguages: 'en,ar,es,fr,de,zh-CN', // Includes Arabic (ar)
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};


