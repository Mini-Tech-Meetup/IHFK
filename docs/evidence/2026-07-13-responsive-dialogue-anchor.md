# 2026-07-13 Responsive Dialogue Anchor

## Root Cause

The Intro dialogue used fixed viewport percentages. Phaser renders its 1080×640 world through FIT scaling and may center a letterboxed Canvas, so a percentage of the browser window is not the same point as the character's world position.

## Implementation

- `IntroScene.syncBubble()` projects the hero head from the camera world view into the current Canvas DOM rectangle.
- `GameUi.positionIntroBubble()` positions the DOM panel in pixels, clamps the panel inside the viewport, and independently moves the CSS triangle so the tail still targets the projected head when the panel is edge-clamped.
- Phaser scale resize and `visualViewport` resize events invalidate the projection. The short Intro update loop also detects Canvas rectangle changes that occur without either event.

## Automated Proof

The responsive browser test measures the actual triangle tip and independently projected hero-head point at 516×288, 844×390, and 1080×640. Horizontal and vertical error must remain no more than 2 CSS pixels, while the bubble and tail remain inside the viewport. All three sizes pass.

## Visual Proof

- [516×288 resize case](runtime-intro-bubble-516x288.png)
- [1080×640 dialogue](runtime-intro-dialogue-1080x640.png)

The 516×288 capture matches the reported failure class: a small non-native aspect window with FIT scaling and horizontal letterboxing.
