const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

export class GameUi {
  constructor(session, i18n, audio = null) {
    this.session = session;
    this.i18n = i18n;
    this.audio = audio;
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
      <div class="language-grid"></div>`, { status: 'SELECT LANGUAGE', className: 'language-shell' });
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
    const complaint = shell.querySelector('.start-complaint');
    shell.append(complaint);
    return complaint;
  }

  setComplaint(element, text) {
    if (!element) return;
    element.classList.remove('pop');
    void element.offsetWidth;
    element.textContent = text;
    element.classList.add('pop');
    this.audio?.sfx('dialogue');
  }

  showGuide({ onStart, onBack }) {
    const shell = this.kioskShell(`
      <div class="screen-heading"><span>02</span><h1>${escapeHtml(this.i18n.t('guide'))}</h1></div>
      <div class="guide-panel"><div class="control-diagram"><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><span>MOVE / JUMP</span></div><div class="control-diagram"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd><span>WEAPON</span></div><div class="control-diagram wide"><kbd>SPACE</kbd><span>HOLD TO DESTROY</span></div></div>
      <div class="guide-actions"></div>`, { status: 'INFORMATION', className: 'guide-shell' });
    const actions = shell.querySelector('.guide-actions');
    actions.append(this.button(this.i18n.t('back'), onBack, 'secondary-button'), this.button(this.i18n.t('start'), onStart, 'start-button'));
  }

  showCredits({ onBack }) {
    const shell = this.kioskShell(`
      <div class="screen-heading"><span>03</span><h1>${escapeHtml(this.i18n.t('credits'))}</h1></div>
      <div class="credit-receipt"><p><b>ORIGINAL GAME</b><br>JHyunB / Lee-WonJun</p><p><b>CHARACTER</b><br>KALANN</p><p><b>ENGINE</b><br>PHASER 4.1</p><small>THANK YOU FOR USING<br>OUR EXTREMELY CONVENIENT SERVICE</small></div>
      <div class="guide-actions single"></div>`, { status: 'CREDITS / RECEIPT', className: 'credits-shell' });
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
    bubble.textContent = text; bubble.classList.add('pop');this.audio?.sfx('dialogue');
    return bubble;
  }

  positionIntroBubble(bubble, { x, y }) {
    if (!bubble || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const margin=8,tailHeight=22,width=bubble.offsetWidth,height=bubble.offsetHeight;
    const center=Math.max(margin+width/2,Math.min(innerWidth-margin-width/2,x));
    const top=Math.max(margin+height,Math.min(innerHeight-margin-tailHeight,y-tailHeight));
    const tailX=Math.max(24,Math.min(width-24,x-(center-width/2)));
    bubble.style.left=`${center}px`;bubble.style.top=`${top}px`;bubble.style.setProperty('--bubble-tail-x',`${tailX}px`);
    bubble.dataset.anchorX=String(x);bubble.dataset.anchorY=String(y);
  }

  showResult({ previewUrl, playtest = null, onRetry, onEndless, onShare }) {
    const shell = this.kioskShell(`
      <div class="result-layout"><figure class="result-share-card"><img alt="IHFK result share card"></figure><div class="result-actions"></div></div>`, { status: 'TRANSACTION COMPLETE', className: 'result-shell' });
    const preview=shell.querySelector('.result-share-card img');preview.src=previewUrl;preview.dataset.width='1080';preview.dataset.height='640';
    const actions = shell.querySelector('.result-actions');
    const share = this.button(this.i18n.t('share'), async () => {
      share.disabled = true; share.textContent = '...';
      const outcome = await onShare();
      share.textContent = outcome === 'error' ? 'ERROR' : this.i18n.t('share'); share.disabled = false;
    }, 'share-button');
    if(playtest){
      const nextAction=playtest.count<3?onRetry:()=>{this.session.resetPlaytest();onRetry();};const nextLabel=playtest.count<3?`NEXT RUN ${playtest.count+1}/3`:'NEW 3-RUN SET';
      actions.append(this.button(nextLabel,nextAction,'secondary-button'),this.button('QA REPORT',()=>this.showPlaytestDialog(playtest),'start-button'),share);
      this.showPlaytestDialog(playtest);
    }else actions.append(this.button(this.i18n.t('retry'), onRetry, 'secondary-button'), this.button(this.i18n.t('endless'), onEndless, 'start-button'), share);
  }

  showPlaytestDialog(summary) {
    this.root.querySelector('.playtest-report')?.remove();
    const report={timestamp:new Date().toISOString(),userAgent:navigator.userAgent,viewport:`${innerWidth}x${innerHeight}`,locale:this.session.locale,runsMs:summary.runs,averageMs:summary.averageMs,targetMs:[150000,210000],complete:summary.complete,passed:summary.passed};
    const dialog=document.createElement('section');dialog.className='playtest-report';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Human playtest timing report');
    const heading=document.createElement('strong');heading.textContent='HUMAN TIMING QA';const state=document.createElement('p');state.className=`playtest-state ${summary.complete?(summary.passed?'pass':'fail'):'collecting'}`;state.textContent=summary.complete?(summary.passed?'TARGET PASS':'OUTSIDE TARGET'):`COLLECTING ${summary.count}/3`;
    const runs=document.createElement('ol');for(let index=0;index<3;index++){const item=document.createElement('li');item.textContent=summary.runs[index]==null?`RUN ${index+1}  --:--.--`:`RUN ${index+1}  ${this.formatTime(summary.runs[index])}`;runs.append(item);}
    const average=document.createElement('div');average.className='playtest-average';average.innerHTML=`<span>AVERAGE</span><b>${summary.count?this.formatTime(summary.averageMs):'--:--.--'}</b><small>TARGET 02:30.00–03:30.00</small>`;
    const output=document.createElement('pre');output.tabIndex=0;output.textContent=JSON.stringify(report,null,2);const actions=document.createElement('div');actions.className='playtest-report-actions';const copy=this.button('COPY REPORT',async()=>{try{await navigator.clipboard.writeText(output.textContent);copy.textContent='COPIED';}catch{copy.textContent='SELECT TEXT';output.focus();}},'start-button');const close=this.button('CLOSE',()=>dialog.remove(),'secondary-button');actions.append(copy,close);dialog.append(heading,state,runs,average,output,actions);this.root.querySelector('.kiosk-screen')?.append(dialog);
  }

  formatTime(ms) { const min=Math.floor(ms/60000),sec=Math.floor(ms/1000)%60,cs=Math.floor(ms/10)%100;return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(cs).padStart(2,'0')}`; }
}
