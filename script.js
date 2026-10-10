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

    if (!response.ok) {
      return `Server Error: HTTP ${response.status}`;
    }

    const data = await response.json();
    return data.output; 
  } catch (error) {
    console.error("Backend connection error:", error);
    return 'Error: Cannot connect to FastAPI backend server.';
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
    hint: "Type: scan"
  },
  {
    step: 2,
    title: "2. Probe Target Portal",
    desc: "Port 8080 is open! Inspect headers using <code>curl http://target:8080</code>.",
    expectedCmd: "curl http://target:8080",
    hint: "Type: curl http://target:8080"
  },
  {
    step: 3,
    title: "3. Perform SQL Injection",
    desc: "Bypass authentication using: <code>sqli ' or '1'='1</code>.",
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

  // Update Back/Next Arrow Button States
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index >= tutorialSteps.length - 1;

  // Highlight active task in sidebar
  for (let i = 1; i <= 4; i++) {
    const taskLi = document.getElementById(`task-${i}`);
    if (taskLi) {
      if (i === index + 1) {
        taskLi.classList.add('active-task');
      } else {
        taskLi.classList.remove('active-task');
      }
    }
  }

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
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');

  const guidedInstructions = document.getElementById('guided-instructions');
  const sandboxInstructions = document.getElementById('sandbox-instructions');

  // Mode Switcher Controls
  if (btnTutorial && btnSandbox) {
    btnTutorial.addEventListener('click', () => {
      isTutorialMode = true;
      btnTutorial.classList.add('active');
      btnSandbox.classList.remove('active');
      if (tutorialPopup) tutorialPopup.style.display = 'block';
      if (guidedInstructions) guidedInstructions.style.display = 'block';
      if (sandboxInstructions) sandboxInstructions.style.display = 'none';
      renderStep(currentStepIndex);
    });

    btnSandbox.addEventListener('click', () => {
      isTutorialMode = false;
      btnSandbox.classList.add('active');
      btnTutorial.classList.remove('active');
      if (tutorialPopup) tutorialPopup.style.display = 'none';
      if (guidedInstructions) guidedInstructions.style.display = 'none';
      if (sandboxInstructions) sandboxInstructions.style.display = 'block';
    });
  }

  if (closePopupBtn && tutorialPopup) {
    closePopupBtn.addEventListener('click', () => {
      tutorialPopup.style.display = 'none';
    });
  }

  // Manual Arrow Navigation Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        renderStep(currentStepIndex);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStepIndex < tutorialSteps.length - 1) {
        currentStepIndex++;
        renderStep(currentStepIndex);
      }
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

        // 3. Handle client-side 'clear'
        if (command.toLowerCase() === 'clear') {
          terminalOutput.innerHTML = `
            <p>Welcome to Dera 360 Cyber Sandbox [v1.0.0]</p>
            <p>Type 'help' to display available commands.</p>
          `;
          return;
        }

        // 4. Send command to FastAPI backend
        const result = await sendCommand(command);

        const responseLine = document.createElement('p');
        responseLine.className = 'res';
        responseLine.textContent = result;
        terminalOutput.appendChild(responseLine);

        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        // 5. Validate Step Completion ONLY IF in Guided Lab mode and server succeeded
        if (isTutorialMode && currentStepIndex < tutorialSteps.length) {
          const serverSuccess = !result.startsWith("Error:") && !result.includes("command not found");
          
          if (serverSuccess) {
            const currentStep = tutorialSteps[currentStepIndex];
            const cleanCmd = command.toLowerCase();
            let matched = false;

            if (currentStep.step === 1 && cleanCmd === "scan") matched = true;
            if (currentStep.step === 2 && cleanCmd.includes("curl")) matched = true;
            if (currentStep.step === 3 && (cleanCmd.includes("sqli") || cleanCmd.includes("1"))) matched = true;
            if (currentStep.step === 4 && cleanCmd.includes("dump")) matched = true;

            if (matched) {
              currentStepIndex++;
              renderStep(currentStepIndex);
            }
          }
        }
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
  try {
    if (typeof google !== 'undefined' && google.translate) {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar,es,fr,de,zh-CN',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    }
  } catch (e) {
    console.log("Google Translate init deferred:", e);
  }
};
