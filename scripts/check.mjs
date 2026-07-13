import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { LOCALES } from '../src/data/locales.js';

async function files(dir) {
  const result=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory())result.push(...await files(path));else if(path.endsWith('.js'))result.push(path);
  }
  return result;
}

const sourceFiles=await files('src');
for(const path of sourceFiles){
  const source=await readFile(path,'utf8');if(!source.trim())throw new Error(`${path} is empty`);
  for(const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)){
    const target=resolve(dirname(path),match[1].split('?')[0]);
    await access(target).catch(()=>{throw new Error(`Broken import in ${path}: ${match[1]}`);});
  }
}
const requiredAssets=[
  'assets/background/fastfood.png','assets/background/street.png','assets/background/factory.png',
  'assets/character/Normal Guy Idle/Normal_Guy_Idle_SpriteSheet.png',
  'assets/character/Normal Guy Transforms/Normal_Guy_Transforms_SpriteSheet.png',
  'assets/character/Strong Guy Runs/Strong_Guy_Rung_SpriteSheet.png',
  'assets/character/Strong Guy Idle/Strong_Guy_Idle_SpriteSheet.png',
  'assets/character/Strong Guy Jumps/Strong_Guy_Jumps.png','assets/character/Strong Guy Falls/Strong_Guy_Falls.png',
  'assets/character/Strong Guy Attacks/Strong_Guy_Attacks_Without_The_Repeated_Frames.png',
  ...Array.from({length:5},(_,index)=>`assets/kiosk/frames-v2/0${index+1}.png`),
  ...Array.from({length:5},(_,index)=>`assets/factory/frames-v2/0${index+1}.png`),
  ...['bat','chainsaw','shotgun'].flatMap(weapon=>Array.from({length:6},(_,index)=>`assets/weapons/${weapon}/frames-v2/0${index+1}.png`)),
  ...['bat','chainsaw','shotgun'].map(weapon=>`assets/weapons/pickups/${weapon}.png`),
  ...['fist','bat','chainsaw','shotgun'].map(icon=>`assets/ui/icons/${icon}.png`)
];
for(const asset of requiredAssets)await access(asset).catch(()=>{throw new Error(`Missing asset: ${asset}`);});
const requiredStaticFiles=['index.html','styles.css','qa/device.html','qa/device.css','qa/device.js','qa/share-card.html','qa/share-card.js','docs/MASTER_SPEC.md','docs/evidence/DEVICE_QA_TEMPLATE.md','.github/workflows/qa.yml','scripts/browser_tests.mjs','package-lock.json'];
for(const file of requiredStaticFiles)await access(file).catch(()=>{throw new Error(`Missing static deliverable: ${file}`);});
const keys=Object.keys(LOCALES.en);const missing=[];
for(const [locale,data] of Object.entries(LOCALES))for(const key of keys)if(!(key in data))missing.push(`${locale}:${key}`);
if(missing.length)throw new Error(`Missing translations: ${missing.join(', ')}`);
const specFiles=(await readdir('docs/specs')).filter(name=>name.endsWith('.md'));
const specHeadings=['## 목표','## 사용자 동작','## 기술 설계','## 의존 SPEC','## 제외 범위','## 구현 체크리스트','## 인수 조건','## 테스트','## 증거','## 평가'];
for(const name of specFiles){const document=await readFile(join('docs/specs',name),'utf8');for(const heading of specHeadings)if(!document.includes(heading))throw new Error(`${name} missing ${heading}`);}
console.log(`PASS ${sourceFiles.length} source modules are readable`);
console.log(`PASS all relative imports and ${requiredAssets.length} runtime assets exist`);
console.log(`PASS ${requiredStaticFiles.length} static deliverables exist`);
console.log(`PASS ${Object.keys(LOCALES).length} locales contain ${keys.length} required keys`);
console.log(`PASS ${specFiles.length} SPEC documents use the required headings`);
