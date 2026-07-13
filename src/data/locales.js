const en = {
  languageTitle: 'SELECT LANGUAGE', language: 'LANGUAGE', guide: 'HOW TO USE', credits: 'CREDITS',
  start: 'GAME START', back: 'BACK', findStart: 'WHERE IS THE F**KING START BUTTON?!',
  guideText: 'ARROWS: MOVE / JUMP\n1-4: SELECT WEAPON\nHOLD SPACE: DESTROY',
  intro1: 'WHERE IS ORDER?', intro2: 'F*CK, IT WENT BACK TO THE START?', intro3: '...', intro4: '...!!',
  targetStore: 'BREAK THE KIOSK', targetStreet: 'BREAK KIOSKS', targetFactory: 'BREAK THE FACTORY',
  time: 'TIME', destroyed: 'DESTROYED', complete: 'FACTORY DESTROYED', retry: 'RETRY', endless: 'KEEP BREAKING', share: 'SHARE',
  extra: 'EXTRA', rotate: 'ROTATE YOUR DEVICE', shareText: 'I destroyed {count} kiosks in {time} in I HATE F**KING KIOSK. #IHFK',
  assetError: 'FAILED TO LOAD ASSETS. REFRESH THE PAGE.'
};

const overrides = {
  ko: { languageTitle:'언어 선택',language:'언어 선택',guide:'이용 안내',credits:'크레딧',start:'게임 시작',back:'뒤로',findStart:'F**KING 게임 시작 버튼 어디 있어?!',guideText:'방향키: 이동 / 점프\n1-4: 무기 선택\nSPACE 홀드: 파괴',intro1:'주문하기 어딨어?',intro2:'시* 처음으로 돌아갔잖아?',targetStore:'키오스크를 부숴라',targetStreet:'키오스크를 부숴라',targetFactory:'공장을 부숴라',time:'시간',destroyed:'파괴',complete:'공장 파괴 완료',retry:'다시 하기',endless:'계속 부수기',share:'공유하기',extra:'추가 파괴',shareText:'I HATE F**KING KIOSK에서 {time} 동안 키오스크 {count}대를 부쉈다. #IHFK' },
  'zh-CN': { languageTitle:'选择语言',language:'语言',guide:'使用说明',credits:'制作人员',start:'开始游戏',back:'返回',findStart:'F**KING 开始按钮在哪里？！',guideText:'方向键：移动/跳跃\n1-4：选择武器\n按住空格：破坏',intro1:'下单在哪？',intro2:'靠*，怎么回到开头了？',targetStore:'砸烂自助机',targetStreet:'砸烂自助机',targetFactory:'摧毁工厂',time:'时间',destroyed:'摧毁',complete:'工厂已摧毁',retry:'再来一次',endless:'继续破坏',share:'分享',extra:'额外摧毁' },
  'zh-TW': { languageTitle:'選擇語言',language:'語言',guide:'使用說明',credits:'製作人員',start:'開始遊戲',back:'返回',findStart:'F**KING 開始按鈕在哪裡？！',guideText:'方向鍵：移動/跳躍\n1-4：選擇武器\n按住空白鍵：破壞',intro1:'下單在哪？',intro2:'靠*，怎麼回到開頭了？',targetStore:'砸爛自助機',targetStreet:'砸爛自助機',targetFactory:'摧毀工廠',time:'時間',destroyed:'摧毀',complete:'工廠已摧毀',retry:'再來一次',endless:'繼續破壞',share:'分享',extra:'額外摧毀' },
  ja: { languageTitle:'言語を選択',language:'言語',guide:'ご利用案内',credits:'クレジット',start:'ゲーム開始',back:'戻る',findStart:'F**KING スタートボタンはどこ？！',guideText:'矢印：移動 / ジャンプ\n1-4：武器選択\nSPACE長押し：破壊',intro1:'注文はどこだ？',intro2:'ク*、最初に戻ったじゃねえか？',targetStore:'キオスクを壊せ',targetStreet:'キオスクを壊せ',targetFactory:'工場を壊せ',time:'タイム',destroyed:'破壊',complete:'工場破壊完了',retry:'もう一度',endless:'壊し続ける',share:'シェア',extra:'追加破壊' },
  fr: { languageTitle:'CHOISIR LA LANGUE',language:'LANGUE',guide:"MODE D'EMPLOI",credits:'CRÉDITS',start:'COMMENCER',back:'RETOUR',findStart:'OÙ EST LE BOUTON F**KING START ?!',guideText:'FLÈCHES : BOUGER / SAUTER\n1-4 : CHOISIR ARME\nESPACE : DÉTRUIRE',intro1:'OÙ EST COMMANDER ?',intro2:'P*TAIN, RETOUR AU DÉBUT ?',targetStore:'CASSE LE KIOSQUE',targetStreet:'CASSE LES KIOSQUES',targetFactory:"DÉTRUIS L'USINE",time:'TEMPS',destroyed:'DÉTRUITS',complete:'USINE DÉTRUITE',retry:'REJOUER',endless:'CONTINUER',share:'PARTAGER',extra:'EN PLUS' },
  de: { languageTitle:'SPRACHE WÄHLEN',language:'SPRACHE',guide:'ANLEITUNG',credits:'CREDITS',start:'SPIEL STARTEN',back:'ZURÜCK',findStart:'WO IST DER F**KING STARTKNOPF?!',guideText:'PFEILE: LAUFEN / SPRINGEN\n1-4: WAFFE\nLEERTASTE HALTEN: ZERSTÖREN',intro1:'WO IST BESTELLEN?',intro2:'SCH*, WIEDER AM ANFANG?',targetStore:'ZERSTÖRE DEN KIOSK',targetStreet:'ZERSTÖRE KIOSKE',targetFactory:'ZERSTÖRE DIE FABRIK',time:'ZEIT',destroyed:'ZERSTÖRT',complete:'FABRIK ZERSTÖRT',retry:'NOCHMAL',endless:'WEITER ZERSTÖREN',share:'TEILEN',extra:'EXTRA' },
  es: { languageTitle:'ELEGIR IDIOMA',language:'IDIOMA',guide:'CÓMO USAR',credits:'CRÉDITOS',start:'INICIAR JUEGO',back:'VOLVER',findStart:'¿DÓNDE ESTÁ EL BOTÓN F**KING START?!',guideText:'FLECHAS: MOVER / SALTAR\n1-4: ARMA\nMANTÉN ESPACIO: DESTRUIR',intro1:'¿DÓNDE SE PIDE?',intro2:'M*ERDA, ¿VOLVIÓ AL INICIO?',targetStore:'ROMPE EL QUIOSCO',targetStreet:'ROMPE LOS QUIOSCOS',targetFactory:'DESTRUYE LA FÁBRICA',time:'TIEMPO',destroyed:'DESTRUIDOS',complete:'FÁBRICA DESTRUIDA',retry:'REINTENTAR',endless:'SEGUIR ROMPIENDO',share:'COMPARTIR',extra:'EXTRA' },
  'pt-BR': { languageTitle:'ESCOLHA O IDIOMA',language:'IDIOMA',guide:'COMO USAR',credits:'CRÉDITOS',start:'INICIAR JOGO',back:'VOLTAR',findStart:'CADÊ O BOTÃO F**KING START?!',guideText:'SETAS: MOVER / PULAR\n1-4: ARMA\nSEGURE ESPAÇO: DESTRUIR',intro1:'CADÊ PEDIR?',intro2:'P*RRA, VOLTOU PRO COMEÇO?',targetStore:'QUEBRE O QUIOSQUE',targetStreet:'QUEBRE OS QUIOSQUES',targetFactory:'DESTRUA A FÁBRICA',time:'TEMPO',destroyed:'DESTRUÍDOS',complete:'FÁBRICA DESTRUÍDA',retry:'DE NOVO',endless:'CONTINUAR QUEBRANDO',share:'COMPARTILHAR',extra:'EXTRA' },
  it: { languageTitle:'SCEGLI LA LINGUA',language:'LINGUA',guide:'COME SI USA',credits:'CREDITI',start:'INIZIA GIOCO',back:'INDIETRO',findStart:"DOV'È IL TASTO F**KING START?!",guideText:'FRECCE: MUOVI / SALTA\n1-4: ARMA\nTIENI SPAZIO: DISTRUGGI',intro1:"DOV'È ORDINA?",intro2:"C*ZZO, È TORNATO ALL'INIZIO?",targetStore:'ROMPI IL CHIOSCO',targetStreet:'ROMPI I CHIOSCHI',targetFactory:'DISTRUGGI LA FABBRICA',time:'TEMPO',destroyed:'DISTRUTTI',complete:'FABBRICA DISTRUTTA',retry:'RIPROVA',endless:'CONTINUA',share:'CONDIVIDI',extra:'EXTRA' }
};

export const LOCALE_NAMES = { ko:'한국어','zh-CN':'简体中文','zh-TW':'繁體中文',ja:'日本語',en:'English',fr:'Français',de:'Deutsch',es:'Español','pt-BR':'Português (Brasil)',it:'Italiano' };
const supplemental = {
  ko:{rotate:'기기를 가로로 돌려 주세요',assetError:'에셋을 불러오지 못했습니다. 새로고침해 주세요.'},
  'zh-CN':{extra:'额外摧毁',rotate:'请横向旋转设备',shareText:'我在 I HATE F**KING KIOSK 中用 {time} 摧毁了 {count} 台自助机。#IHFK',assetError:'资源加载失败，请刷新页面。'},
  'zh-TW':{extra:'額外摧毀',rotate:'請橫向旋轉裝置',shareText:'我在 I HATE F**KING KIOSK 中用 {time} 摧毀了 {count} 台自助機。#IHFK',assetError:'資源載入失敗，請重新整理頁面。'},
  ja:{rotate:'端末を横向きにしてください',shareText:'I HATE F**KING KIOSKで{time}の間にキオスクを{count}台壊した。#IHFK',assetError:'アセットを読み込めませんでした。再読み込みしてください。'},
  fr:{rotate:"TOURNEZ L'APPAREIL",shareText:"J'ai détruit {count} kiosques en {time} dans I HATE F**KING KIOSK. #IHFK",assetError:'ÉCHEC DU CHARGEMENT. ACTUALISEZ LA PAGE.'},
  de:{rotate:'GERÄT QUER DREHEN',shareText:'Ich habe in I HATE F**KING KIOSK {count} Kioske in {time} zerstört. #IHFK',assetError:'ASSETS KONNTEN NICHT GELADEN WERDEN. NEU LADEN.'},
  es:{rotate:'GIRA EL DISPOSITIVO',shareText:'Destruí {count} quioscos en {time} en I HATE F**KING KIOSK. #IHFK',assetError:'NO SE PUDIERON CARGAR LOS RECURSOS. RECARGA.'},
  'pt-BR':{rotate:'GIRE O DISPOSITIVO',shareText:'Destruí {count} quiosques em {time} no I HATE F**KING KIOSK. #IHFK',assetError:'FALHA AO CARREGAR RECURSOS. ATUALIZE A PÁGINA.'},
  it:{rotate:'RUOTA IL DISPOSITIVO',shareText:'Ho distrutto {count} chioschi in {time} in I HATE F**KING KIOSK. #IHFK',assetError:'CARICAMENTO RISORSE FALLITO. RICARICA LA PAGINA.'}
};
export const LOCALES = Object.fromEntries(Object.keys(LOCALE_NAMES).map(key => [key, { ...en, ...(overrides[key] || {}), ...(supplemental[key] || {}) }]));
