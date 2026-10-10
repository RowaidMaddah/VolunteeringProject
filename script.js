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

        // Construct user command line safely
        const userCmdLine = document.createElement('p');
        const promptSpan = document.createElement('span');
        promptSpan.className = 'prompt';
        promptSpan.textContent = 'guest@dera360:~$ ';
        userCmdLine.appendChild(promptSpan);
        userCmdLine.appendChild(document.createTextNode(command));
        terminalOutput.appendChild(userCmdLine);

        // Clear input field immediately
        terminalInput.value = '';

        // Auto-scroll after user command append
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

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

        // Auto-scroll terminal output container to latest command
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
      if (terminalInput) terminalInput.focus();
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
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
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

// Step Definitions for Guided Tutorial Mode
const tutorialSteps = [
  {
    step: 1,
    title: "Step 1: Network Reconnaissance",
    desc: "Type <code>scan</code> in the terminal to probe active local ports.",
    expectedCmd: "scan",
    hint: "Type 'scan' and hit Enter."
  },
  {
    step: 2,
    title: "Step 2: Probing Target Service",
    desc: "Target found on port 8080! Inspect target headers using <code>curl http://target:8080</code>.",
    expectedCmd: "curl http://target:8080",
    hint: "Copy or type: curl http://target:8080"
  },
  {
    step: 3,
    title: "Step 3: Execute SQL Injection",
    desc: "Bypass authentication using the SQL logic payload: <code>sqli ' OR '1'='1</code>.",
    expectedCmd: "sqli ' OR '1'='1",
    hint: "Type: sqli ' OR '1'='1"
  },
  {
    step: 4,
    title: "Step 4: Exfiltrate Database",
    desc: "Authentication bypassed! Run <code>dump users</code> to extract database contents.",
    expectedCmd: "dump users",
    hint: "Type: dump users"
  }
];

let currentStepIndex = 0;
let isTutorialMode = true;

// Validate Terminal Input against active tutorial step
function checkTutorialProgress(userCommand) {
  if (!isTutorialMode) return;

  const currentStep = tutorialSteps[currentStepIndex];
  if (userCommand.trim().toLowerCase() === currentStep.expectedCmd.toLowerCase()) {
    currentStepIndex++;
    if (currentStepIndex < tutorialSteps.length) {
      renderTutorialStep(currentStepIndex);
    } else {
      showCompletionCard();
    }
  }
}

function renderTutorialStep(index) {
  const stepData = tutorialSteps[index];
  document.getElementById('step-badge').textContent = `Step ${stepData.step} of ${tutorialSteps.length}`;
  document.getElementById('step-title').textContent = stepData.title;
  document.getElementById('step-desc').innerHTML = stepData.desc;
  document.getElementById('step-hint').textContent = `💡 Hint: ${stepData.hint}`;
}
