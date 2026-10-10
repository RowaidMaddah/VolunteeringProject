// ==========================================
// 1. FASTAPI BACKEND API INTEGRATION
// ==========================================
async function sendCommand(userInput) {
  try {
    const response = await fetch('https://ideal-space-succotash-r466w4g9x479f5vv6-8000.app.github.dev/api/terminal', {
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
// 2. GUIDED TUTORIAL STATE MACHINE
// ==========================================
const tutorialSteps = [
  {
    step: 1,
    title: "1. Network Reconnaissance",
    desc: "Type <code>scan</code> to discover active network services on the target machine.",
    expectedCmd: "scan",
    hint: "Commands are lowercase. Type: scan"
  },
  {
    step: 2,
    title: "2. Probe Target Portal",
    desc: "Port 8080 is open! Inspect the target server headers using <code>curl http://target:8080</code>.",
    expectedCmd: "curl http://target:8080",
    hint: "Type: curl http://target:8080"
  },
  {
    step: 3,
    title: "3. Perform SQL Injection",
    desc: "Test authentication bypass using the payload: <code>sqli ' or '1'='1</code>.",
    expectedCmd: "sqli ' or '1'='1",
    hint: "Type: sqli ' or '1'='1"
  },
  {
    step: 4,
    title: "4. Exfiltrate Database",
    desc: "Authentication bypassed! Run <code>dump users</code> to extract credentials.",
    expectedCmd: "dump users",
    hint: "Type: dump users"
  }
];

let currentStepIndex = 0;
let isTutorialMode = true;

function renderStep(index) {
  const popup = document.getElementById('tutorial-popup');
  if (!popup) return;

  if (index >= tutorialSteps.length) {
    document.getElementById('step-badge').textContent = "Complete!";
    document.getElementById('step-title').textContent = "🎉 Lab Completed!";
    document.getElementById('step-desc').innerHTML = "You successfully exploited the target system and exfiltrated sensitive data.";
    document.getElementById('step-hint').textContent = "Switch to Free Sandbox mode anytime!";
    return;
  }

  const stepData = tutorialSteps[index];
  document.getElementById('step-badge').textContent = `Step ${stepData.step} of ${tutorialSteps.length}`;
  document.getElementById('step-title').textContent = stepData.title;
  document.getElementById('step-desc').innerHTML = stepData.desc;
  document.getElementById('step-hint').textContent = `💡 Hint: ${stepData.hint}`;
}

function checkTutorialProgress(userCommand) {
  if (!isTutorialMode || currentStepIndex >= tutorialSteps.length) return;

  const currentStep = tutorialSteps[currentStepIndex];
  if (userCommand.trim().toLowerCase() === currentStep.expectedCmd.toLowerCase()) {
    currentStepIndex++;
    renderStep(currentStepIndex);
  }
}

// ==========================================
// 3. DOM INTERACTION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const closeBtn = document.getElementById('close-terminal-btn');
  const terminalWindow = document.getElementById('terminal-window');
  const terminalIcon = document.getElementById('terminal-icon-btn');
  
  const btnTutorial = document.getElementById('btn-tutorial-mode');
  const btnSandbox = document.getElementById('btn-sandbox-mode');
  const tutorialPopup = document.getElementById('tutorial-popup');
  const closePopupBtn = document.getElementById('close-popup');

  // Mode Switcher Controls
  if (btnTutorial && btnSandbox) {
    btnTutorial.addEventListener('click', () => {
      isTutorialMode = true;
      btnTutorial.classList.add('active');
      btnSandbox.classList.remove('active');
      if (tutorialPopup) tutorialPopup.style.display = 'block';
      renderStep(currentStepIndex);
    });

    btnSandbox.addEventListener('click', () => {
      isTutorialMode = false;
      btnSandbox.classList.add('active');
      btnTutorial.classList.remove('active');
      if (tutorialPopup) tutorialPopup.style.display = 'none';
    });
  }

  if (closePopupBtn && tutorialPopup) {
    closePopupBtn.addEventListener('click', () => {
      tutorialPopup.style.display = 'none';
    });
  }

  // Handle Command Submission (Enter Key)
  if (terminalInput) {
    terminalInput.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (!command) return;

        // 1. Render user line in terminal
        const userCmdLine = document.createElement('p');
        const promptSpan = document.createElement('span');
        promptSpan.className = 'prompt';
        promptSpan.textContent = 'guest@dera360:~$ ';
        userCmdLine.appendChild(promptSpan);
        userCmdLine.appendChild(document.createTextNode(command));
        terminalOutput.appendChild(userCmdLine);

        // 2. Clear input & scroll
        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        // 3. Check & update tutorial step state
        checkTutorialProgress(command);

        // 4. Handle client-side 'clear'
        if (command.toLowerCase() === 'clear') {
          terminalOutput.innerHTML = '';
          return;
        }

        // 5. Send command to FastAPI backend & print response
        const result = await sendCommand(command);

        const responseLine = document.createElement('p');
        responseLine.className = 'res';
        responseLine.textContent = result;
        terminalOutput.appendChild(responseLine);

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

  // Re-open Terminal Window
  if (terminalIcon && terminalWindow) {
    terminalIcon.addEventListener('dblclick', () => {
      terminalWindow.style.display = 'flex';
      if (terminalInput) terminalInput.focus();
    });
  }

  // Initial Step Render
  renderStep(0);
});

// ==========================================
// 4. GOOGLE TRANSLATE WIDGET INITIALIZATION
// ==========================================
window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,ar,es,fr,de,zh-CN',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');

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
