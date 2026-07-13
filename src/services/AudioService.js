export class AudioService {
  constructor() { this.context = null; this.muted = false; this.musicTimer = null; this.musicWanted = false; this.step = 0; }
  async unlock() {
    this.context ||= new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') await this.context.resume();
    if (this.musicWanted && !this.muted) this.beginMusicLoop();
  }
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.clearMusicTimer();
    else if (this.musicWanted) this.beginMusicLoop();
    return this.muted;
  }
  tone(freq, duration=.06, type='square', volume=.035, slide=0) {
    if (!this.context || this.muted) return;
    const now = this.context.currentTime; const osc = this.context.createOscillator(); const gain = this.context.createGain();
    osc.type=type; osc.frequency.setValueAtTime(freq,now); if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),now+duration);
    gain.gain.setValueAtTime(volume,now); gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(gain).connect(this.context.destination); osc.start(now); osc.stop(now+duration);
  }
  sfx(name) {
    const pitch = .9 + Math.random()*.2;
    if (name==='hit') { this.tone(68*pitch,.09,'sine',.08,-34); this.tone(108*pitch,.055,'square',.04,-68); }
    if (name==='dialogue') { this.tone(245*pitch,.04,'square',.026,55); this.tone(122*pitch,.06,'triangle',.018,-24); }
    if (name==='break') { this.tone(70,.14,'sawtooth',.07,-35); this.tone(210,.08,'square',.04,-150); }
    if (name==='pickup') this.tone(660,.09,'square',.045,330);
    if (name==='shotgun') this.tone(55,.18,'sawtooth',.12,-20);
    if (name==='saw') this.tone(125*pitch,.045,'sawtooth',.025,30);
    if (name==='land') this.tone(48*pitch,.09,'square',.045,-12);
    if (name==='weaponBreak') { this.tone(175,.08,'square',.05,-90); this.tone(70,.12,'sawtooth',.035,-25); }
    if (name==='factory') { this.tone(45,.7,'sawtooth',.16,-14); this.tone(90,.5,'square',.1,-45); }
  }
  startMusic() {
    this.musicWanted = true;
    this.beginMusicLoop();
  }
  beginMusicLoop() {
    if (!this.context || this.muted || this.musicTimer) return;
    const roots=[82,82,98,98,110,110,123,110];
    const lead=[330,392,440,392,494,440,392,294];
    this.musicTimer=setInterval(()=>{
      const i=this.step++%8,root=roots[i];
      this.tone(root,.12,'square',.032);
      this.tone(root*2,.09,'sawtooth',.016);
      this.tone(root*3,.075,'square',.011);
      if(i%2===0)this.tone(lead[i],.085,'square',.021,i===6?-55:18);
      if(i===0||i===4)this.tone(58,.055,'sine',.075,-24);
      if(i===2||i===6)this.tone(185,.045,'sawtooth',.038,-120);
      if(i%2===1)this.tone(1350,.018,'square',.012,-500);
    },115);
  }
  clearMusicTimer() { if (this.musicTimer) clearInterval(this.musicTimer); this.musicTimer=null; }
  stopMusic() { this.musicWanted=false; this.clearMusicTimer(); this.step=0; }
}
