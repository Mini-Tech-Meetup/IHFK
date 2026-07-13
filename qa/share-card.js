import { GameSession } from '../src/services/GameSession.js';
import { I18n } from '../src/services/I18n.js';
import { LOCALE_NAMES } from '../src/data/locales.js';
import { ShareCardService } from '../src/services/ShareCardService.js';

const load = source => new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=source;});
const [character,factory,wreck,kiosk]=await Promise.all([
  load('../assets/character/Strong Guy Attacks/Strong_Guy_Attacks_Without_The_Repeated_Frames.png'),
  load('../assets/background/factory.png'),
  load('../assets/factory/frames-v2/05.png'),
  load('../assets/kiosk/frames-v2/05.png')
]);
const sources={'strong-attack':character,'bg-factory':factory,'factory-v2-4':wreck,'kiosk-v2-4':kiosk};
const textures={get:key=>({getSourceImage:()=>sources[key]})};
const session=new GameSession();session.elapsedMs=187430;session.destroyedTotal=127;
const i18n=new I18n(session);const select=document.querySelector('#locale');const target=document.querySelector('#card');
for(const [key,name] of Object.entries(LOCALE_NAMES)){const option=document.createElement('option');option.value=key;option.textContent=`${key} — ${name}`;select.append(option);}
function render(){session.locale=select.value;const card=new ShareCardService(session,i18n,textures).createCanvas();target.getContext('2d').drawImage(card,0,0);document.documentElement.lang=session.locale;}
select.value=new URLSearchParams(location.search).get('locale')||'en';select.addEventListener('change',render);render();
