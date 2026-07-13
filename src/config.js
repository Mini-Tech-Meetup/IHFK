export const GAME_WIDTH = 1080;
export const GAME_HEIGHT = 640;
export const GROUND_Y = 570;
export const GAME_URL = 'https://mini-tech-meetup.github.io/IHFK/';
const QUERY = new URLSearchParams(location.search);
export const TEST_MODE = QUERY.has('testMode');
export const AUTO_PLAY = QUERY.has('autoplay');
export const PLAYTEST_MODE = QUERY.has('playtest');
export const PREVIEW_WEAPON = ['fist','bat','chainsaw','shotgun'].includes(QUERY.get('previewWeapon')) ? QUERY.get('previewWeapon') : null;
export const PREVIEW_TRANSFORM = QUERY.has('previewTransform');
export const PREVIEW_KIOSK = QUERY.has('previewKiosk');
export const PREVIEW_LANDING = QUERY.has('previewLanding');
export const PREVIEW_FACTORY = QUERY.has('previewFactory');
export const PREVIEW_STRESS = QUERY.has('previewStress');
const REQUESTED_STRESS_CAP = Number.parseInt(QUERY.get('previewStress') || '30',10);
export const PREVIEW_STRESS_CAP = Number.isFinite(REQUESTED_STRESS_CAP) ? Math.max(1,Math.min(30,REQUESTED_STRESS_CAP)) : 30;
export const PREVIEW_STRESS_MODE = PREVIEW_STRESS_CAP <= 15 ? 'campaign' : 'endless';
export const PREVIEW_PICKUP = ['bat','chainsaw','shotgun'].includes(QUERY.get('previewPickup')) ? QUERY.get('previewPickup') : null;
export const FORCE_TOUCH = TEST_MODE && QUERY.has('touchMode');
export const FORCE_SHARE_FALLBACK = QUERY.has('shareFallback');

export const BALANCE = Object.freeze({
  playerSpeed: TEST_MODE ? 700 : 280,
  jumpVelocity: -520,
  gravity: 1100,
  kioskFallGravity: 5200,
  kioskHp: TEST_MODE ? 12 : 100,
  factoryHp: TEST_MODE ? 100 : 5000,
  streetGoal: TEST_MODE ? 2 : 25,
  weaponDropChance: 0.15,
  attack: {
    fist: { cooldown: 100, damage: 12, factoryDamage: 12, range: 78, height: 58, offsetX: 18, offsetY: -60, maxTargets: 1, role: 'unlimited-single' },
    bat: { cooldown: 180, damage: 38, factoryDamage: 25, range: 150, height: 112, offsetX: 12, offsetY: -62, maxTargets: Infinity, role: 'wide-cleave' },
    chainsaw: { cooldown: 50, damage: 12, factoryDamage: 8, range: 108, height: 92, offsetX: 18, offsetY: -60, maxTargets: 1, role: 'rapid-focus' },
    shotgun: { cooldown: 250, damage: 100, factoryDamage: 60, range: 430, height: 210, offsetX: 20, offsetY: -75, maxTargets: 3, role: 'long-burst' }
  },
  grants: { bat: 10, chainsaw: 4000, shotgun: 6 },
  caps: { bat: 20, chainsaw: 8000, shotgun: 12 }
});

export function getWeaponDps(key, target = 'kiosk') {
  const attack = BALANCE.attack[key];
  if (!attack) return 0;
  const damage = target === 'factory' ? attack.factoryDamage : attack.damage;
  return damage * 1000 / attack.cooldown;
}
