const PUBLIC_API_BASE_URL = 'https://volunteeringproject-api.onrender.com';



function getApiBaseUrl() {

  const { hostname, origin, protocol } = window.location;

  if (PUBLIC_API_BASE_URL) {

    return PUBLIC_API_BASE_URL.replace(/\/+$/, '');

  }



  const forwardedHost = hostname.replace(

    /-\d+\.app\.github\.dev$/,

    '-8000.app.github.dev'

  );



  if (forwardedHost !== hostname) {

    return `${protocol}//${forwardedHost}`;

  }



  if (hostname === 'localhost' || hostname === '127.0.0.1') {

    return `${protocol}//${hostname}:8000`;

  }



  if (protocol === 'file:') {

    return 'http://127.0.0.1:8000';

  }



  if (hostname.endsWith('.github.io')) {

    throw new Error('The deployed FastAPI URL has not been configured yet.');

  }



  return origin;

}



async function sendCommand(userInput) {

  try {

    const response = await fetch(`${getApiBaseUrl()}/api/terminal`, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({ command: userInput })

    });



    if (!response.ok) {

      throw new Error(`API returned HTTP ${response.status}`);

    }



    const data = await response.json();

    return data.output;

  } catch (error) {

    return `Error: Cannot connect to FastAPI backend (${error.message}).`;

  }

}



//the tutorial thingy

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

    desc: "In the terminal, enter this exact command to run the simulated SQL injection: <code>sqli ' OR '1'='1</code>.",

    expectedCmd: "sqli ' or '1'='1",

    hint: "Enter exactly: sqli ' OR '1'='1"

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



  // Cosmetic effect on the app 

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





document.addEventListener('DOMContentLoaded', () => {





  const terminalWindow = document.getElementById('terminal-window');

  const firefoxWindow = document.getElementById('firefox-window');

  const desktopWallpaper = document.getElementById('desktop-wallpaper');



  function updateWallpaperState() {

    if (!desktopWallpaper || !terminalWindow || !firefoxWindow) return;

    const terminalOpen = terminalWindow.style.display !== 'none';

    const browserOpen = firefoxWindow.style.display !== 'none';

    

    // Show wallpaper ONLY when both windows are closed

    desktopWallpaper.style.display = (!terminalOpen && !browserOpen) ? 'flex' : 'none';

  }





  updateWallpaperState();





  const browserIcon = document.getElementById('browser-icon-btn');

  const closeFirefoxBtn = document.getElementById('close-firefox-btn');

  const browserUrlInput = document.getElementById('browser-url-input');

  const browserViewport = document.getElementById('browser-viewport-content');

  const browserGoBtn = document.getElementById('browser-go-btn');

  const browserBackBtn = document.getElementById('browser-back-btn');

  const browserForwardBtn = document.getElementById('browser-forward-btn');

  const browserReloadBtn = document.getElementById('browser-reload-btn');

  const browserTabBar = document.getElementById('browser-tab-bar');

  let simulatedAdminAccess = false;

  let browserRenderId = 0;



  function getBankPage() {

    if (simulatedAdminAccess) {

      return `

        <div class="mock-page bank-admin-page">

          <div class="bank-admin-heading">

            <div>

              <p class="bank-eyebrow">APEX TRUST BANK · TRAINING ENVIRONMENT</p>

              <h2>Admin dashboard</h2>

            </div>

            <span class="badge-active">ADMIN ACCESS GRANTED</span>

          </div>

          <p>Welcome, admin. This mock account view is unlocked in the local training simulation.</p>

          <div class="bank-account-card">

            <span>Training account</span>

            <strong>•••• 4821</strong>

            <span>Available balance</span>

            <strong>$24,850.00</strong>

          </div>

          <h3>Recent activity</h3>

          <table class="mock-table">

            <tr><th>Date</th><th>Activity</th><th>Status</th></tr>

            <tr><td>Today</td><td>Training account overview</td><td><span class="badge-active">AVAILABLE</span></td></tr>

            <tr><td>Today</td><td>Security event review</td><td><span class="badge-active">AVAILABLE</span></td></tr>

          </table>

          <button class="mock-action-button" id="bank-logout-btn" type="button">Sign out</button>

        </div>

      `;

    }



    return `

      <div class="mock-page">

        <p class="bank-eyebrow">APEX TRUST BANK · TRAINING ENVIRONMENT</p>

        <h2>Customer sign in</h2>

        <p>Sign in to the isolated training portal. No real accounts or services are connected.</p>

        <form class="bank-login-card" id="bank-login-form">

          <label for="bank-username">Username</label>

          <input id="bank-username" name="username" type="text" autocomplete="off" required>

          <label for="bank-password">Password</label>

          <input id="bank-password" name="password" type="password" autocomplete="off">

          <button class="mock-action-button" type="submit">Sign in</button>

          <p id="bank-login-status" class="bank-login-status" role="status" aria-live="polite"></p>

        </form>

        <p class="bank-training-note">Training exercise: try the SQL injection command in the terminal, then refresh this page to see the simulated result.</p>

      </div>

    `;

  }



  function getSocPage() {

    const eventRow = simulatedAdminAccess

      ? `<tr><td>${new Date().toLocaleTimeString()}</td><td>127.0.0.1 · Lab session</td><td>SQL Injection (simulated admin access)</td><td><span class="badge-active">ALLOWED</span></td></tr>`

      : '<tr><td>Waiting</td><td>Lab session</td><td>No activity yet</td><td><span class="badge-blocked">MONITORING</span></td></tr>';



    return `

      <div class="mock-page">

        <p class="bank-eyebrow">DERA 360 · TRAINING ENVIRONMENT</p>

        <h2>🛡️ SOC Threat Intelligence & Activity Log</h2>

        <p>Session activity generated by this browser-based training simulation.</p>

        <table class="mock-table">

          <tr><th>Timestamp</th><th>Source</th><th>Event</th><th>Result</th></tr>

          ${eventRow}

        </table>

      </div>

    `;

  }



  function grantSimulatedAdminAccess() {

    simulatedAdminAccess = true;

    if (activeTabId === 1) {

      const bankTab = browserTabs.find(tab => tab.id === 1);

      if (bankTab) renderPageContent(bankTab.title, bankTab.url);

    }

  }





  const mockWebsites = {

    "http://target:8080": getBankPage,

    "http://soc.internal": getSocPage,

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



  function bindBankPageActions() {

    const loginForm = browserViewport.querySelector('#bank-login-form');

    if (loginForm) {

      loginForm.addEventListener('submit', event => {

        event.preventDefault();

        const username = new FormData(loginForm).get('username').toString().trim().toLowerCase();

        const status = browserViewport.querySelector('#bank-login-status');

        if (username.replace(/\s+/g, ' ') === "' or '1'='1") {

          grantSimulatedAdminAccess();

        } else if (status) {

          status.textContent = 'Sign-in failed. Review the training challenge and try again.';

          status.classList.add('is-error');

        }

      });

    }



    const logoutButton = browserViewport.querySelector('#bank-logout-btn');

    if (logoutButton) {

      logoutButton.addEventListener('click', () => {

        simulatedAdminAccess = false;

        const bankTab = browserTabs.find(tab => tab.id === 1);

        if (bankTab) renderPageContent(bankTab.title, bankTab.url);

      });

    }

  }



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

    const renderId = ++browserRenderId;

    browserViewport.classList.add('is-loading');

    browserViewport.innerHTML = '<div class="browser-load-state" role="status"><span class="browser-spinner"></span>Refreshing the simulated website…</div>';

    updateNavButtonsState();



    setTimeout(() => {

      if (renderId !== browserRenderId) return;

      const page = mockWebsites[cleanUrl];

      browserViewport.innerHTML = page

        ? (typeof page === 'function' ? page() : page)

        : `

          <div class="mock-page" style="text-align: center; padding-top: 40px;">

            <h1 style="font-size: 48px; color: #dc2626; margin-bottom: 8px;">404</h1>

            <h2 style="color: #1e293b;">Website Not Found</h2>

            <p>The requested URL <code>${actualUrl}</code> could not be reached on this virtual network.</p>

          </div>

        `;

      browserViewport.classList.remove('is-loading');

      bindBankPageActions();

    }, 350);

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



        if (

          result.startsWith('[SUCCESS]') &&

          command.toLowerCase().replace(/\s+/g, ' ') === "sqli ' or '1'='1"

        ) {

          grantSimulatedAdminAccess();

        }



        terminalOutput.scrollTop = terminalOutput.scrollHeight;



        if (isTutorialMode && currentStepIndex < tutorialSteps.length) {

          const serverSuccess = !result.startsWith("Error:") && !result.includes("command not found");

          

          if (serverSuccess) {

            const currentStep = tutorialSteps[currentStepIndex];

            const cleanCmd = command.toLowerCase();

            let matched = false;



            if (currentStep.step === 1 && cleanCmd === "scan") matched = true;

            if (currentStep.step === 3 && cleanCmd.replace(/\s+/g, " ") === currentStep.expectedCmd) matched = true;



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



  renderStep(0);

});



//translate button

window.googleTranslateElementInit = function() {

  try {

    if (typeof google !== 'undefined' && google.translate) {

      new google.translate.TranslateElement({

        pageLanguage: 'en',

        includedLanguages: 'en,ar,es,fr,de,zh-CN',

        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,

        autoDisplay: false

      }, 'google_translate_element');

    }

  } catch (e) {

    console.log("Google Translate init deferred:", e);

  }

};
