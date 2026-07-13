# SPEC-08: HUD, Result and Share

## 목표
HUD, 현재 판 결과와 정사각형 공유 카드를 구현한다.

## 사용자 동작
플레이 중 목표·시간·무기 잔량을 보고, 완료 후 시간과 파괴 수만 확인해 재시작·계속 부수기·공유 중 하나를 고른다.

## 기술 설계
Hud가 세션을 읽고 Result가 시간을 동결한다. ShareCardService는 별도 1080 Canvas와 Web Share/PNG·clipboard 폴백을 제공한다.

## 의존 SPEC
SPEC-01, SPEC-04, SPEC-07

## 제외 범위
localStorage, 최고 기록, 서버 업로드

## 구현 체크리스트
- [x] 목표·진행·시간·무기 HUD
- [x] 시간·파괴 수 결과
- [x] 다시 하기·계속 부수기
- [x] 1080×1080 결과 카드
- [x] Web Share와 PNG/clipboard 폴백
- [x] 공유 카드 전경에 실제 최종 파손 키오스크 래스터 3대 합성

## 인수 조건
- [x] localStorage 사용 없음
- [x] 공유 카드에 선택 언어와 #IHFK 표시
- [x] 공유 카드에 캐릭터·붕괴 공장·파손 키오스크가 모두 표시됨

## 테스트
- [x] 자동: Canvas 크기·PNG 다운로드 폴백·최종 파손 키오스크 텍스처 합성
- [x] 데스크톱: Result/Retry/Keep Breaking
- [ ] 모바일: native file share sheet
- [x] 시각 검수: 결과 화면과 카드 구성

## 증거
- 명령 및 결과: 단위 PNG fallback PASS; 실제 Result 공유 동작 `downloaded` 반환; 1080×640 버튼 y=406–452가 화면 y=142–509.6 내부임을 실측
- 스크린샷: [1080×640 Result](../evidence/runtime-result-1080x640.png), [파손 키오스크 포함 1080×1080 공유 카드](../evidence/runtime-share-card-broken-kiosks-1080x1080.png)
- 성능 수치: card 1080×1080 PNG; 로드된 strong character/factory/destroyed-kiosk rasters 사용 검사 PASS
- 알려진 제한: native Web Share 파일 시트 실기기 미검증
- 상세: [polish validation](../evidence/2026-07-13-polish-validation.md)
- 실기기 수집 도구: `/qa/device.html`, [report template](../evidence/DEVICE_QA_TEMPLATE.md)
- DPS·공유 카드 후속 검증: [DPS and share-card follow-up](../evidence/2026-07-13-dps-share-followup.md)

## 평가
기능 정확성 39/40 · 게임 감각 17/20 · 시각·오디오 14/15 · 호환성·현지화 12/15 · 코드 품질 9/10 · 총점 91/100
