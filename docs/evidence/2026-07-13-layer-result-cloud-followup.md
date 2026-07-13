# 2026-07-13 Layer, Result Preview and Cloud Follow-up

## Scope

This follow-up fixes three presentation regressions without changing campaign balance: factory assembly products now pass behind the factory target, the completion kiosk displays the exact share-card canvas that will be shared, and the street sky uses independent continuously moving cloud sprites.

## Factory render order

- Room-only background: depth `-10`
- Conveyor/launch product kiosk: depth `2`
- Destructible factory target: depth `3`
- Player and combat effects remain above the target.

The browser regression test waits for a live assembly product and asserts `product.depth < factory.depth`. The capture shows the product partially occluded by the factory machinery rather than drawn over it.

## Result share-card preview

`ResultScene` creates one 1080×1080 canvas when the scene opens. The same canvas is converted to a PNG data URL for the in-kiosk preview and passed to `ShareCardService.share()` for Web Share or download. This prevents the preview and exported image from diverging. The result layout keeps the preview, localized receipt and all three actions within the 1080×640 kiosk screen.

## Moving cloud layer

- The baked clouds were removed from `assets/background/street.png`.
- `assets/background/layers/street-cloud.png` is a 240×112 hard-alpha raster derived from the approved street art.
- Two instances move at 18 px/s and 11 px/s and wrap only after leaving the right edge.
- Background depth is `-10`; cloud depth is `-9`, so clouds remain behind gameplay entities.

`scripts/build_street_cloud_layer.py` reproducibly rebuilds the clean sky and cloud layer from the preserved source composite.

## Verification

```text
npm run check
PASS 46 runtime assets exist
PASS street cloud is a 240x112 hard-alpha pixel layer

npm test
PASS browser unit suite (34 passed, 0 failed)
PASS factory product depth is below factory target depth
PASS street cloud x positions increase during a 500ms sample
PASS result preview is a 1080x1080 PNG and all controls remain inside the kiosk screen
```

- [Factory product behind target](runtime-factory-product-behind-1080x640.png)
- [Result with share-card preview](runtime-result-share-preview-1080x640.png)
- [Street with moving cloud layer](runtime-street-moving-clouds-1080x640.png)

## Known limitation

The native mobile share sheet and physical-device FPS/audio gates remain open under SPEC-08 and SPEC-10.
