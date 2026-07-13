const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

export class GameUi {
  constructor(session, i18n) {
    this.session = session;
    this.i18n = i18n;
    this.root = document.querySelector('#ui-layer');
  }

  clear(mode = '') {
    this.root.replaceChildren();
    this.root.className = mode;
  }

  kioskShell(content, { status = 'SYSTEM READY', className = '' } = {}) {
    this.clear(`menu-ui ${className}`.trim());
    const shell = document.createElement('section');
    shell.className = 'kiosk-shell';
    shell.innerHTML = `
      <div class="kiosk-brand-strip"><span class="status-lamp red"></span><strong>I HATE F**KING KIOSK</strong><span class="status-lamp amber"></span></div>
      <div class="kiosk-bezel">
        <div class="kiosk-status"><span class="status-lamp green"></span><span>${escapeHtml(status)}</span><span class="status-code">TERMINAL 404</span></div>
        <div class="kiosk-screen">${content}</div>
      </div>
      <div class="kiosk-hardware"><span class="card-reader"></span><span class="receipt-slot"></span><span class="speaker-grill"></span></div>`;
    this.root.append(shell);
    return shell;
  }

  button(label, action, className = '') {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = `kiosk-button ${className}`.trim();
    element.textContent = label;
    element.addEventListener('click', action);
    return element;
  }

  showLanguage(localeNames, onSelect) {
    const shell = this.kioskShell(`
      <div class="screen-heading"><span>01</span><h1>${escapeHtml(this.i18n.t('languageTitle'))}</h1></div>
      <p class="screen-subtitle">TOUCH A LANGUAGE / 언어를 선택하세요</p>
      <div class="language-grid"></div>`, { status: 'SELECT LANGUAGE' });
    const grid = shell.querySelector('.language-grid');
    Object.entries(localeNames).forEach(([locale, name], index) => {
      const control = this.button(name, () => onSelect(locale), 'language-button');
      control.dataset.index = String(index + 1).padStart(2, '0');
      grid.append(control);
    });
  }

  showTitle({ onLanguage, onGuide, onCredits }) {
    const shell = this.kioskShell(`
      <div class="title-lockup"><span class="tiny-label">SELF SERVICE ANGER TERMINAL</span><h1>I HATE<br><em>F**KING</em> KIOSK</h1><div class="title-rule"></div></div>
      <div class="service-list"></div>
      <div class="start-complaint" role="status"></div>`, { status: 'CHOOSE A SERVICE', className: 'title-shell' });
    const list = shell.querySelector('.service-list');
    list.append(
      this.button(this.i18n.t('language'), onLanguage, 'service-button'),
      this.button(this.i18n.t('guide'), onGuide, 'service-button featured-service'),
      this.button(this.i18n.t('credits'), onCredits, 'service-button')
    );
    return shell.querySelector('.start-complaint');
  }

  setComplaint(element, text) {
    if (!element) return;
    element.classList.remove('pop');
    void element.offsetWidth;
    element.textContent = text;
    element.classList.add('pop');
  }

  showGuide({ onStart, onBack }) {
    const shell = this.kioskShell(`
      <div class="screen-heading"><span>02</span><h1>${escapeHtml(this.i18n.t('guide'))}</h1></div>
      <div class="guide-panel"><div class="control-diagram"><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><span>MOVE / JUMP</span></div><div class="control-diagram"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd><span>WEAPON</span></div><div class="control-diagram wide"><kbd>SPACE</kbd><span>HOLD TO DESTROY</span></div></div>
      <div class="guide-actions"></div>`, { status: 'INFORMATION' });
    const actions = shell.querySelector('.guide-actions');
    actions.append(this.button(this.i18n.t('back'), onBack, 'secondary-button'), this.button(this.i18n.t('start'), onStart, 'start-button'));
  }

  showCredits({ onBack }) {
    const shell = this.kioskShell(`
      <div class="screen-heading"><span>03</span><h1>${escapeHtml(this.i18n.t('credits'))}</h1></div>
      <div class="credit-receipt"><p><b>ORIGINAL GAME</b><br>JHyunB / Lee-WonJun</p><p><b>CHARACTER</b><br>KALANN</p><p><b>ENGINE</b><br>PHASER 4.1</p><small>THANK YOU FOR USING<br>OUR EXTREMELY CONVENIENT SERVICE</small></div>
      <div class="guide-actions single"></div>`, { status: 'CREDITS / RECEIPT' });
    shell.querySelector('.guide-actions').append(this.button(this.i18n.t('back'), onBack, 'secondary-button'));
  }

  showIntroBubble(text) {
    let bubble = this.root.querySelector('.cutscene-bubble');
    if (!bubble) {
      this.clear('cutscene-ui');
      bubble = document.createElement('div');
      bubble.className = 'cutscene-bubble';
      this.root.append(bubble);
    }
    bubble.classList.remove('pop'); void bubble.offsetWidth;
    bubble.textContent = text; bubble.classList.add('pop');
  }

  showResult({ time, destroyed, onRetry, onEndless, onShare }) {
    const shell = this.kioskShell(`
      <div class="screen-heading result-heading"><span>OK</span><h1>${escapeHtml(this.i18n.t('complete'))}</h1></div>
      <div class="result-receipt"><div><span>${escapeHtml(this.i18n.t('time'))}</span><strong>${escapeHtml(time)}</strong></div><div><span>${escapeHtml(this.i18n.t('destroyed'))}</span><strong>${destroyed}</strong></div><p>ERROR CODE: FACTORY-000<br>PRODUCTION TERMINATED</p></div>
      <div class="result-actions"></div>`, { status: 'TRANSACTION COMPLETE', className: 'result-shell' });
    const actions = shell.querySelector('.result-actions');
    const share = this.button(this.i18n.t('share'), async () => {
      share.disabled = true; share.textContent = '...';
      const outcome = await onShare();
      share.textContent = outcome === 'error' ? 'ERROR' : this.i18n.t('share'); share.disabled = false;
    }, 'share-button');
    actions.append(this.button(this.i18n.t('retry'), onRetry, 'secondary-button'), this.button(this.i18n.t('endless'), onEndless, 'start-button'), share);
  }
}
