// ==========================================
// 1. FASTAPI BACKEND API INTEGRATION
// ==========================================
async function sendCommand(userInput) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/terminal', {
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

// ==========================================
// 2. TERMINAL DOM INTERACTION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const closeBtn = document.getElementById('close-terminal-btn');
  const terminalWindow = document.getElementById('terminal-window');
  const terminalIcon = document.getElementById('terminal-icon-btn');

  // Handle Command Submission (Enter Key)
  if (terminalInput) {
    terminalInput.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (!command) return;

        // Display user input in terminal output
        const userCmdLine = document.createElement('p');
        userCmdLine.innerHTML = `<span class="prompt">guest@dera360:~$</span> ${command}`;
        terminalOutput.appendChild(userCmdLine);

        // Clear input field immediately
        terminalInput.value = '';

        // Handle client-side 'clear' command locally
        if (command.toLowerCase() === 'clear') {
          terminalOutput.innerHTML = '';
          return;
        }

        // Send command to Python FastAPI backend
        const result = await sendCommand(command);

        // Display Python backend response
        const responseLine = document.createElement('p');
        responseLine.className = 'res';
        responseLine.textContent = result;
        terminalOutput.appendChild(responseLine);

        // Auto-scroll terminal to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }

  // Close Terminal Window (Red Dot)
  if (closeBtn && terminalWindow) {
    closeBtn.addEventListener('click', () => {
      terminalWindow.style.display = 'none';
    });
  }

  // Re-open Terminal Window (Double Click Desktop Icon)
  if (terminalIcon && terminalWindow) {
    terminalIcon.addEventListener('dblclick', () => {
      terminalWindow.style.display = 'flex';
    });
  }
});

// ==========================================
// 3. GOOGLE TRANSLATE WIDGET INITIALIZATION
// ==========================================
window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,ar,es,fr,de,zh-CN',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  // Insert custom Globe Icon inside widget button
  setTimeout(function() {
    const gadgetBtn = document.querySelector('.goog-te-gadget-simple');
    if (gadgetBtn && !document.querySelector('.cyber-globe-icon')) {
      const globeIcon = document.createElement('span');
      globeIcon.className = 'cyber-globe-icon';
      globeIcon.innerHTML = '🌐';
      gadgetBtn.prepend(globeIcon);
    }
  }, 1000);
};
