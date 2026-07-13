# I HATE F**KING KIOSK — Master Specification

## Goal

Phaser 4.1 기반의 정적 웹 게임으로 IHFK를 전면 리팩터링한다. 한 판은 약 3분이며, 키오스크형 타이틀을 통과한 뒤 패스트푸드점, 길거리, 공장을 거쳐 결과와 무한 파괴 모드로 이어진다.

## Immutable rules

- 1080×640 고정 카메라, 한 화면 단위 맵 3개
- 체력·사망·서버·최고 기록 없음
- 키보드와 모바일 가로 터치 지원
- 1 주먹 / 2 야구방망이 / 3 전기톱 / 4 샷건, Space 홀드 공격
- 길거리 키오스크 50대, 공장 본체 5,000 HP
- 10개 언어: ko, zh-CN, zh-TW, ja, en, fr, de, es, pt-BR, it
- 공식명 `I HATE F**KING KIOSK`는 번역하지 않음
- 현재 판의 시간·파괴 수와 공유 카드만 제공
- 이미지 생성은 파생 편집으로 대체할 수 없는 핵심 원본에만 순차 1장씩 사용하며 병렬 생성하지 않음

## Runtime architecture

- Phaser 4.1.0 fixed HTTPS CDN, WebGL, Arcade Physics
- Scenes: Boot → Language → Title → Intro → FastFood → Street → Factory → Result
- Shared services: GameSession, I18n, InputController, AudioService, ShareCardService
- Legacy implementation remains under `legacy/` as reference only.

## SPEC dashboard

| SPEC | Title | Status | Score | Evidence |
|---|---|---|---:|---|
| [00](specs/SPEC-00-foundation.md) | Phaser 4 foundation | 구현 완료 | 92 | desktop verified; browser/device matrix pending |
| [01](specs/SPEC-01-title-i18n.md) | Title and localization | 구현 완료 | 92 | pt-BR representative and automated fit verified |
| [02](specs/SPEC-02-input-mobile.md) | Input and mobile | 구현 완료 | 86 | forced-touch verified; physical devices pending |
| [03](specs/SPEC-03-player-intro.md) | Player and intro | 구현 완료 | 92 | transform verified; mobile audio unlock pending |
| [04](specs/SPEC-04-combat-weapons.md) | Combat and weapons | 검증 완료 | 94 | [validation](evidence/2026-07-13-polish-validation.md) |
| [05](specs/SPEC-05-fastfood.md) | Fast-food stage | 구현 완료 | 90 | desktop visual verified; mobile play pending |
| [06](specs/SPEC-06-street.md) | Street stage | 구현 완료 | 88 | 1.07 s landing / zero landed velocity |
| [07](specs/SPEC-07-factory-endless.md) | Factory and endless | 구현 완료 | 93 | per-hit feedback and desktop 30-unit stress verified |
| [08](specs/SPEC-08-result-share.md) | HUD, result and share | 구현 완료 | 91 | result, endless and download fallback verified |
| [09](specs/SPEC-09-art-audio.md) | Art and audio | 구현 완료 | 91 | visual verified; physical-device listening pending |
| [10](specs/SPEC-10-qa-deploy.md) | QA and deploy | 구현 완료 | 86 | 29/29 and desktop 30-unit stress; device QA pending |

## Completion gate

- 모든 SPEC이 검증 완료 상태여야 한다.
- 개별 SPEC 85점 이상, 가중 종합 90점 이상이어야 한다.
- P0/P1 결함과 누락 번역 키가 없어야 한다.
- 데스크톱·Android 가로·iOS 수동 회전·GitHub Pages를 검증해야 한다.

## Excluded

오프라인 실행, 게임패드, 서버 기록, 리더보드, 체력, 난이도 선택, 추가 키오스크 종류.

## Current provisional score

- Current provisional unweighted score is 90.5/100; the visual overhaul and desktop stress gate now pass.
- Release gate is not met: SPEC-02, SPEC-09, and SPEC-10 still require Android/iOS/native-share, final listening and human play-session evidence.
- Current defects: P0 0, P1 0; remaining evidence gaps are classified P3.
- Pages-equivalent `/IHFK/` relative-path campaign passed at full 50-kiosk/5,000-HP balance in 124.265 seconds automated lower-bound time.
- GitHub Pages is correctly configured from `main` `/` with HTTPS, but the live site remains the pre-refactor build until this worktree is reviewed and merged.
- External validation handoff: run `/qa/device.html` on Android Chrome and iOS Safari, then paste both reports into [DEVICE_QA_TEMPLATE.md](evidence/DEVICE_QA_TEMPLATE.md). A human timing sample is also required before the Goal can be marked complete.
