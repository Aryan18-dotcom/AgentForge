(function () {
  const scriptTag = document.currentScript || document.querySelector('script[data-agent-id]');
  if (!scriptTag) return console.error("[AgentForge Error] Core injector script node missing.");

  const agentId = scriptTag.getAttribute('data-agent-id');
  const alignX = scriptTag.getAttribute('data-align-x') || 'right';
  const alignY = scriptTag.getAttribute('data-align-y') || 'bottom';
  const offsetX = scriptTag.getAttribute('data-offset-x') || '24px';
  const offsetY = scriptTag.getAttribute('data-offset-y') || '24px';

  if (!agentId) return console.error("[AgentForge Error] Explicit data-agent-id token missing.");
  if (document.getElementById(`agentforge-wrapper-${agentId}`)) return;

  const baseApiUrl = "__VITE_BASE_URL__".startsWith("__")
    ? "http://localhost:5000/api"
    : "__VITE_BASE_URL__";

  const widgetCssUrl = "__WIDGET_VITE_CSS_URL__".startsWith("__")
    ? "http://localhost:5173/AgentConfigs/widget-core.css"
    : "__WIDGET_VITE_CSS_URL__";

  let activeSessionTrackId = localStorage.getItem(`forge_session_${agentId}`) || null;

  fetch(`${baseApiUrl}/agents/public/details/${agentId}`)
    .then(async (response) => {
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const errorDetail = data?.message || data?.error || `HTTP error ${response.status}`;
        throw new Error(errorDetail);
      }
      return data;
    })
    .then(data => {
      if (!data || !data.success) throw new Error(data?.message || "Handshake schema invalid.");
      setupNativeWidget(data.agent);
    })
    .catch(err => console.error("[AgentForge Initialization Failure]:", err.message || err));

  function setupNativeWidget(agent) {
    if (!agent || !agent.isActive) return console.error(`[AgentForge Error]: [Agent-${agentId}] Inactive or invalid agent.`);
    const brand = agent.uiBranding || {};

    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `${widgetCssUrl}`;
    document.head.appendChild(styleLink);

    const wrapper = document.createElement('div');
    wrapper.id = `agentforge-wrapper-${agentId}`;
    wrapper.className = `forge-widget-root forge-align-x-${alignX} forge-align-y-${alignY} forge-entrance-${brand.entranceAnimation || 'slide-up'} forge-speed-${brand.entranceSpeed || 'normal'}`;

    wrapper.style.setProperty('--forge-offset-x', offsetX);
    wrapper.style.setProperty('--forge-offset-y', offsetY);
    wrapper.style.setProperty('--forge-primary', brand.primaryColor || '#7c3aed');
    wrapper.style.setProperty('--forge-secondary', brand.secondaryColor || '#4cd7f6');
    wrapper.style.setProperty('--forge-surface', brand.surfaceColor || '#111827');
    wrapper.style.setProperty('--forge-radius', `${brand.borderRadius || 16}px`);
    wrapper.style.setProperty('--forge-transition-speed', `${brand.chatTransitionSpeed || 0.4}s`);
    wrapper.style.setProperty('--forge-hover-speed', `${brand.hoverSpeed || 0.3}s`);

    let logoMarkup = '';
    if (brand.logoSource === 'custom' && brand.customLogoUrl) {
      logoMarkup = `<img src="${brand.customLogoUrl}" alt="Core" class="forge-logo-img" style="border-radius: ${brand.borderRadius / 2}px;" />`;
    } else {
      const glyphs = { sparkle: '✧', bot: '🤖', terminal: '⌨' };
      logoMarkup = `<span class="forge-glyph-inner">${glyphs[brand.selectedGlyph] || '✧'}</span>`;
    }

    const isPill = brand.launcherType === 'combined' && brand.hoverAnimation !== 'expand-text';

    wrapper.innerHTML = `
      <button id="forge-launcher-${agentId}" class="forge-launcher-btn forge-hover-${brand.hoverAnimation || 'expand-text'} ${isPill ? 'forge-pill-active' : ''}" style="background-color: ${brand.primaryColor || '#7c3aed'} !important;">
        <div class="forge-icon-frame">${logoMarkup}</div>
        <span class="forge-launcher-text">${brand.launcherText || 'Chat'}</span>
      </button>

      <div id="forge-console-${agentId}" class="forge-chat-panel forge-anim-open-${brand.chatOpenAnimation || 'pop-in'} forge-anim-close-${brand.chatCloseAnimation || 'scale-out'} forge-hidden">
        <div class="forge-header" style="background: linear-gradient(to right, ${brand.primaryColor}25, ${brand.secondaryColor}25);">
          <div class="forge-header-identity">
            <div class="forge-header-avatar" style="background-color: ${brand.primaryColor}10; border-color: ${brand.primaryColor}20;">${logoMarkup}</div>
            <div class="forge-header-meta">
              <h5>${agent.agentName}</h5>
              <p><span class="forge-pulse-dot" style="background-color: ${brand.secondaryColor || '#4cd7f6'};"></span> operational node</p>
            </div>
          </div>
          <button id="forge-close-${agentId}" class="forge-close-btn">&times;</button>
        </div>
        <div class="forge-thread-body" id="forge-thread-${agentId}">
          <div class="forge-system-card">
            <h6 style="color: ${brand.primaryColor}bb;">Neural Workspace Configured</h6>
            <p>"I am ${agent.agentName} here to assist you!"</p>
          </div>
        </div>
        <form id="forge-form-${agentId}" class="forge-footer">
          <input type="text" id="forge-input-${agentId}" placeholder="Type message parameters..." autocomplete="off" required />
          <button type="submit" class="forge-send-btn" style="background-color: ${brand.primaryColor || '#7c3aed'} !important;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(wrapper);

    const launcherBtn = document.getElementById(`forge-launcher-${agentId}`);
    const chatConsole = document.getElementById(`forge-console-${agentId}`);
    const closeBtn = document.getElementById(`forge-close-${agentId}`);
    const entryForm = document.getElementById(`forge-form-${agentId}`);
    const messageInput = document.getElementById(`forge-input-${agentId}`);
    const threadBody = document.getElementById(`forge-thread-${agentId}`);

    launcherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      launcherBtn.classList.add('forge-hidden');
      chatConsole.classList.remove('forge-hidden');
      chatConsole.classList.remove('forge-closing');
      chatConsole.classList.add('forge-opening');
    });

    function closeChatArea() {
      if (chatConsole.classList.contains('forge-hidden')) return;
      chatConsole.classList.remove('forge-opening');
      chatConsole.classList.add('forge-closing');
      setTimeout(() => {
        chatConsole.classList.add('forge-hidden');
        launcherBtn.classList.remove('forge-hidden');
      }, (brand.chatTransitionSpeed * 1000) || 400);
    }

    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeChatArea(); });
    document.addEventListener('click', (e) => { if (!chatConsole.contains(e.target) && !launcherBtn.contains(e.target)) closeChatArea(); });

    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = messageInput.value.trim();
      if (!val) return;

      appendMessage('user', val);
      messageInput.value = '';

      const loader = appendTypingIndicator();

      fetch(`${baseApiUrl}/agent/chat/public/${agentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionTrackId,
          message: val,
          clientUserIdentity: window.AgentForgeIdentity || {}
        })
      })
        .then(async (res) => {
          const resData = await res.json().catch(() => null);
          if (!res.ok) {
            const serverMsg = resData?.message || resData?.error || `Server returned ${res.status}: ${res.statusText}`;
            throw new Error(serverMsg);
          }
          return resData;
        })
        .then(resData => {
          loader.remove();
          if (resData && resData.success) {
            appendMessage('bot', resData.reply);
            activeSessionTrackId = resData.sessionId;
            localStorage.setItem(`forge_session_${agentId}`, resData.sessionId);
          } else {
            const errorMsg = resData?.message || resData?.error || "Unknown operational error";
            appendMessage('bot', `[Operational Exception]: ${errorMsg}`);
          }
        })
        .catch(error => {
          loader.remove();
          console.error("System completions link broke down:", error);
          appendMessage('bot', `[Operational Exception]: ${error.message || "Handshake broke down. Failed to map completions array streams."}`);
        });
    });

    /**
     * 🌟 ADVANCED HIGH-FIDELITY INDUSTRIAL PREVIEW ENGINE
     * Parses markdown formatting parameters, lists, breaks, and cleans dangling asterisks safely.
     */
    function parseMarkdownToHtml(rawString) {
      if (!rawString) return '';

      return String(rawString)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/gs, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^\s*[-*•]\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/\n\n+/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.+)$/s, '<p>$1</p>');
    }

    function appendMessage(sender, text) {
      const msgRow = document.createElement('div');
      msgRow.className = `forge-msg-row forge-msg-${sender}`;

      const inlineStyle = sender === 'user'
        ? `background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.primaryColor}dd); border-radius: ${brand.borderRadius}px; border-bottom-right-radius: 4px; color: #ffffff; padding: 10px 14px; max-width: 85%; word-break: break-word; line-height: 1.5; font-size: 13px; font-family: system-ui, -apple-system, sans-serif;`
        : `border-radius: ${brand.borderRadius}px; border-bottom-left-radius: 4px; background-color: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06); color: #e4e4e7; padding: 10px 14px; max-width: 85%; word-break: break-word; line-height: 1.5; font-size: 13px; font-family: system-ui, -apple-system, sans-serif;`;

      const bubble = document.createElement('div');
      bubble.className = 'forge-bubble';
      bubble.setAttribute('style', inlineStyle);

      if (sender === 'bot') {
        bubble.innerHTML = parseMarkdownToHtml(text);
      } else {
        bubble.textContent = text;
      }

      msgRow.appendChild(bubble);
      threadBody.appendChild(msgRow);
      threadBody.scrollTop = threadBody.scrollHeight;
    }

    function appendTypingIndicator() {
      const loadRow = document.createElement('div');
      loadRow.className = 'forge-msg-row forge-msg-bot forge-pulse-row';
      loadRow.innerHTML = `<div class="forge-bubble forge-loader-dots" style="border-radius: ${brand.borderRadius}px; border-bottom-left-radius: 4px;"><span></span><span></span><span></span></div>`;
      threadBody.appendChild(loadRow);
      threadBody.scrollTop = threadBody.scrollHeight;
      return loadRow;
    }

    setTimeout(() => { wrapper.classList.add('forge-entered'); }, (brand.entranceDelayDuration * 1000) || 500);
  }
})();