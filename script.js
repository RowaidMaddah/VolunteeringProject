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
// 2. GUIDED TUTORIAL STATE MACHINE (INTEGRATED)
// ==========================================
const tutorialSteps = [
  {
    step: 1,
    title: "1. Network Reconnaissance",
    desc: "Type <code>scan</code> in the terminal to discover active network services on the target machine.",
    expectedCmd: "scan",
    hint: "Type: scan"
  },
  {
    step: 2,
    title: "2. Inspect Bank Portal",
    desc: "Port 8080 is open! Double-click <b>Mozilla Firefox</b> and switch to the <b>Apex Trust Bank</b> tab.",
    expectedCmd: "browser_check",
    hint: "Open Firefox and click the Apex Trust Bank tab"
  },
  {
    step: 3,
    title: "3. Perform SQL Injection",
    desc: "Bypass the bank's authentication by running: <code>sqli ' or '1'='1</code> in the terminal.",
    expectedCmd: "sqli ' or '1'='1",
    hint: "Type: sqli ' or '1'='1"
  },
  {
    step: 4,
    title: "4. Verify SOC Telemetry",
    desc: "Attack successful! Switch to the <b>SOC Threat Log</b> tab in Firefox to view your recorded telemetry logs.",
    expectedCmd: "soc_check",
    hint: "Click the SOC Threat Log tab in Firefox"
  }
];

let currentStepIndex = 0;
let isTutorialMode = true;

function renderStep(index) {
  const popup = document.getElementById('tutorial-popup');
  if (!popup) return;

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

  // Highlight or un-highlight ONLY the Firefox icon image on Step 2
  const browserIconImg = document.querySelector('#browser-icon-btn .icon-img');
  if (browserIconImg) {
    if (index === 1) { // Step 2 (0-indexed)
      browserIconImg.classList.add('tutorial-highlight');
    } else {
      browserIconImg.classList.remove('tutorial-highlight');
    }
  }

  if (index >= tutorialSteps.length) {
    document.getElementById('step-badge').textContent = "Complete!";
    document.getElementById('step-title').textContent = "🎉 Lab Completed!";
    document.getElementById('step-desc').innerHTML = "You successfully mapped the target, bypassed authentication on the bank app, and analyzed the defense logs!";
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

  // ==========================================
  // WALLPAPER BACKGROUND STATE MANAGER
  // ==========================================
  const terminalWindow = document.getElementById('terminal-window');
  const firefoxWindow = document.getElementById('firefox-window');
  const desktopWallpaper = document.getElementById('desktop-wallpaper');

  function updateWallpaperState() {
    if (!desktopWallpaper || !terminalWindow || !firefoxWindow) return;
    const terminalOpen = terminalWindow.style.display !== 'none';
    const browserOpen = firefoxWindow.style.display !== 'none';
    
    // Show wallpaper ONLY when both windows are closed/hidden
    desktopWallpaper.style.display = (!terminalOpen && !browserOpen) ? 'flex' : 'none';
  }

  // Run on startup
  updateWallpaperState();

  // ==========================================
  // FIREFOX BROWSER SIMULATION (MULTI-TAB ENGINE)
  // ==========================================
  const browserIcon = document.getElementById('browser-icon-btn');
  const closeFirefoxBtn = document.getElementById('close-firefox-btn');
  const browserUrlInput = document.getElementById('browser-url-input');
  const browserViewport = document.getElementById('browser-viewport-content');
  const browserGoBtn = document.getElementById('browser-go-btn');
  const browserBackBtn = document.getElementById('browser-back-btn');
  const browserForwardBtn = document.getElementById('browser-forward-btn');
  const browserReloadBtn = document.getElementById('browser-reload-btn');
  const browserTabBar = document.getElementById('browser-tab-bar');

  // Mock Websites Dictionary
  const mockWebsites = {
    "http://target:8080": `
      <div class="mock-page">
        <h2>🏦 Apex Trust Bank - Customer Portal</h2>
        <p>Welcome to our secure online banking login interface. Please sign in to access your accounts.</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; max-width: 320px; border: 1px solid #cbd5e1;">
          <label style="font-size: 12px; color: #475569;">Username:</label>
          <input type="text" value="admin" style="width:100%; padding:6px; margin:4px 0 12px 0; background:#ffffff; border:1px solid #cbd5e1; color:#1e293b; border-radius:4px;">
          <label style="font-size: 12px; color: #475569;">Password:</label>
          <input type="password" value="secret123" style="width:100%; padding:6px; margin:4px 0 16px 0; background:#ffffff; border:1px solid #cbd5e1; color:#1e293b; border-radius:4px;">
          <button style="width:100%; background:#0284c7; color:#fff; border:none; padding:8px; border-radius:4px; font-weight:bold; cursor:pointer;">Secure Login</button>
        </div>
        <p style="margin-top: 12px; font-size: 11px; color: #d97706;">⚠️ Notice: Backend auth vulnerability detected on endpoint /api/login.</p>
      </div>
    `,
    "http://soc.internal": `
      <div class="mock-page">
        <h2>🛡️ SOC Threat Intelligence & Activity Log</h2>
        <p>Real-time telemetry tracking malicious IPs, brute-force attempts, and perimeter blocks.</p>
        <table class="mock-table">
          <tr><th>Timestamp</th><th>Source IP</th><th>Threat Vector</th><th>Action Taken</th></tr>
          <tr><td>14:22:01</td><td>192.168.45.12</td><td>SQL Injection (Auth Bypass)</td><td><span class="badge-blocked">BLOCKED</span></td></tr>
          <tr><td>14:20:15</td><td>45.33.22.10</td><td>Port Scan (Nmap SYN)</td><td><span class="badge-blocked">DROPPED</span></td></tr>
          <tr><td>13:55:09</td><td>10.0.0.15</td><td>Standard User Session</td><td><span class="badge-active">ALLOWED</span></td></tr>
        </table>
      </div>
    `,
    "http://phish-alert.local": `
      <div class="mock-page">
        <h2>⚠️ Corporate IT Alert: Password Expiry Notice</h2>
        <p style="color: #dc2626; font-weight: bold;">Your enterprise network credentials expire in 2 hours!</p>
        <p>To prevent account lockout, please verify your corporate credentials immediately.</p>
        <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid #fca5a5; padding: 16px; border-radius: 8px; max-width: 320px;">
          <label style="font-size: 12px; color: #475569;">Corporate Email:</label>
          <input type="text" placeholder="user@company.com" style="width:100%; padding:6px; margin:4px 0 12px 0; background:#ffffff; border:1px solid #cbd5e1; color:#1e293b; border-radius:4px;">
          <label style="font-size: 12px; color: #475569;">Current Password:</label>
          <input type="password" placeholder="••••••••" style="width:100%; padding:6px; margin:4px 0 16px 0; background:#ffffff; border:1px solid #cbd5e1; color:#1e293b; border-radius:4px;">
          <button style="width:100%; background:#dc2626; color:#fff; border:none; padding:8px; border-radius:4px; font-weight:bold; cursor:pointer;">Verify Account</button>
        </div>
      </div>
    `
  };

  let browserTabs = [
    { id: 1, url: "http://target:8080", title: "Apex Trust Bank", history: ["http://target:8080"], historyIndex: 0 },
    { id: 2, url: "http://soc.internal", title: "SOC Threat Log", history: ["http://soc.internal"], historyIndex: 0 },
    { id: 3, url: "http://phish-alert.local", title: "IT Alert Portal", history: ["http://phish-alert.local"], historyIndex: 0 }
  ];
  let activeTabId = 1;

  function renderTabs() {
    if (!browserTabBar) return;
    browserTabBar.innerHTML = '';

    browserTabs.forEach(tab => {
      const tabEl = document.createElement('div');
      tabEl.className = `browser-tab ${tab.id === activeTabId ? 'active-tab' : ''}`;
      tabEl.innerHTML = `<span>🌐 ${tab.title}</span>`;
      tabEl.addEventListener('click', () => switchTab(tab.id));
      browserTabBar.appendChild(tabEl);
    });
  }

  function switchTab(tabId) {
    const tab = browserTabs.find(t => t.id === tabId);
    if (!tab) return;

    activeTabId = tabId;
    renderTabs();
    renderPageContent(tab.title, tab.url);

    // Auto-advance Step 2 when user clicks the Bank tab
    if (isTutorialMode && currentStepIndex === 1 && tabId === 1) {
      currentStepIndex++;
      renderStep(currentStepIndex);
    }

    // Auto-advance Step 4 when user clicks the SOC tab
    if (isTutorialMode && currentStepIndex === 3 && tabId === 2) {
      currentStepIndex++;
      renderStep(currentStepIndex);
    }
  }

  function renderPageContent(titleUrl, actualUrl) {
    if (browserUrlInput) browserUrlInput.value = actualUrl;
    const cleanUrl = actualUrl.trim().toLowerCase();

    if (mockWebsites[cleanUrl]) {
      browserViewport.innerHTML = mockWebsites[cleanUrl];
    } else {
      browserViewport.innerHTML = `
        <div class="mock-page" style="text-align: center; padding-top: 40px;">
          <h1 style="font-size: 48px; color: #dc2626; margin-bottom: 8px;">404</h1>
          <h2 style="color: #1e293b;">Website Not Found</h2>
          <p>The requested URL <code>${actualUrl}</code> could not be reached on this virtual network.</p>
        </div>
      `;
    }
    updateNavButtonsState();
  }

  function navigateActiveTab(url) {
    const tab = browserTabs.find(t => t.id === activeTabId);
    if (!tab) return;

    tab.history = tab.history.slice(0, tab.historyIndex + 1);
    tab.history.push(url);
    tab.historyIndex = tab.history.length - 1;
    tab.url = url;

    if (url.includes("target")) tab.title = "Apex Trust Bank";
    else if (url.includes("soc")) tab.title = "SOC Threat Log";
    else if (url.includes("phish")) tab.title = "IT Alert Portal";
    else tab.title = url.replace("http://", "").substring(0, 15);

    renderTabs();
    renderPageContent(tab.title, url);
  }

  function updateNavButtonsState() {
    const tab = browserTabs.find(t => t.id === activeTabId);
    if (!tab) return;
    if (browserBackBtn) browserBackBtn.disabled = tab.historyIndex <= 0;
    if (browserForwardBtn) browserForwardBtn.disabled = tab.historyIndex >= tab.history.length - 1;
  }

  if (browserBackBtn) {
    browserBackBtn.addEventListener('click', () => {
      const tab = browserTabs.find(t => t.id === activeTabId);
      if (tab && tab.historyIndex > 0) {
        tab.historyIndex--;
        tab.url = tab.history[tab.historyIndex];
        renderTabs();
        renderPageContent(tab.title, tab.url);
      }
    });
  }

  if (browserForwardBtn) {
    browserForwardBtn.addEventListener('click', () => {
      const tab = browserTabs.find(t => t.id === activeTabId);
      if (tab && tab.historyIndex < tab.history.length - 1) {
        tab.historyIndex++;
        tab.url = tab.history[tab.historyIndex];
        renderTabs();
        renderPageContent(tab.title, tab.url);
      }
    });
  }

  if (browserReloadBtn) {
    browserReloadBtn.addEventListener('click', () => {
      const tab = browserTabs.find(t => t.id === activeTabId);
      if (tab) {
        renderPageContent(tab.title, tab.url);
      }
    });
  }

  if (browserIcon && firefoxWindow) {
    browserIcon.addEventListener('dblclick', () => {
      firefoxWindow.style.display = 'flex';
      renderTabs();
      switchTab(activeTabId);
      updateWallpaperState();
    });
  }

  if (closeFirefoxBtn && firefoxWindow) {
    closeFirefoxBtn.addEventListener('click', () => {
      firefoxWindow.style.display = 'none';
      updateWallpaperState();
    });
  }

  if (browserGoBtn && browserUrlInput) {
    browserGoBtn.addEventListener('click', () => {
      navigateActiveTab(browserUrlInput.value);
    });

    browserUrlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        navigateActiveTab(browserUrlInput.value);
      }
    });
  }

  // ==========================================
  // TERMINAL & TUTORIAL STATE CONTROLLERS
  // ==========================================
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const closeBtn = document.getElementById('close-terminal-btn');
  const terminalIcon = document.getElementById('terminal-icon-btn');
  
  const btnTutorial = document.getElementById('btn-tutorial-mode');
  const btnSandbox = document.getElementById('btn-sandbox-mode');
  const tutorialPopup = document.getElementById('tutorial-popup');
  const closePopupBtn = document.getElementById('close-popup');
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');

  const guidedInstructions = document.getElementById('guided-instructions');
  const sandboxInstructions = document.getElementById('sandbox-instructions');

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

  if (terminalInput) {
    terminalInput.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        const command = terminalInput.value.trim();
        if (!command) return;

        const userCmdLine = document.createElement('p');
        const promptSpan = document.createElement('span');
        promptSpan.className = 'prompt';
        promptSpan.textContent = 'guest@dera360:~$ ';
        userCmdLine.appendChild(promptSpan);
        userCmdLine.appendChild(document.createTextNode(command));
        terminalOutput.appendChild(userCmdLine);

        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        if (command.toLowerCase() === 'clear') {
          terminalOutput.innerHTML = `
            <p>Welcome to Dera 360 Cyber Sandbox [v1.0.0]</p>
            <p>Type 'help' to display available commands.</p>
          `;
          return;
        }

        const result = await sendCommand(command);

        const responseLine = document.createElement('p');
        responseLine.className = 'res';
        responseLine.textContent = result;
        terminalOutput.appendChild(responseLine);

        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        if (isTutorialMode && currentStepIndex < tutorialSteps.length) {
          const serverSuccess = !result.startsWith("Error:") && !result.includes("command not found");
          
          if (serverSuccess) {
            const currentStep = tutorialSteps[currentStepIndex];
            const cleanCmd = command.toLowerCase();
            let matched = false;

            if (currentStep.step === 1 && cleanCmd === "scan") matched = true;
            if (currentStep.step === 3 && (cleanCmd.includes("sqli") || cleanCmd.includes("1"))) matched = true;

            if (matched) {
              currentStepIndex++;
              renderStep(currentStepIndex);
            }
          }
        }
      }
    });
  }

  if (closeBtn && terminalWindow) {
    closeBtn.addEventListener('click', () => {
      terminalWindow.style.display = 'none';
      updateWallpaperState();
    });
  }

  if (terminalIcon && terminalWindow) {
    terminalIcon.addEventListener('dblclick', () => {
      terminalWindow.style.display = 'flex';
      if (terminalInput) terminalInput.focus();
      updateWallpaperState();
    });
  }

  // ==========================================
  // 5. CONTACT FORM SUBMISSION HANDLER
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('user-email');
      const messageInput = document.getElementById('user-message');
      const submitBtn = document.getElementById('submit-btn');

      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!email || !message) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const response = await fetch('https://ideal-space-succotash-r466w4g9x479f5vv6-8000.app.github.dev/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, message })
        });

        const data = await response.json();

        if (response.ok) {
          alert('✅ Message sent successfully! Thank you for reaching out.');
          contactForm.reset();
        } else {
          alert(`❌ Error: ${data.detail || 'Could not send message.'}`);
        }
      } catch (error) {
        console.error("Contact form error:", error);
        alert('❌ Error: Could not connect to the mail server.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  renderStep(0);
});

// ==========================================
// 6. GOOGLE TRANSLATE WIDGET INITIALIZATION
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
