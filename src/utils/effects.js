export function hitStop(scene, duration = 45) {
  if (scene.registry.get('hitStopActive')) return;
  scene.registry.set('hitStopActive', true);
  scene.game.loop.sleep();
  window.setTimeout(() => {
    scene.registry.set('hitStopActive', false);
    if (!scene.game.isDestroyed) scene.game.loop.wake();
  }, duration);
}

export function scatterRectangles(scene, x, y, colors, count = 8, spread = 130) {
  for (let index = 0; index < count; index += 1) {
    const fragment = scene.add.rectangle(
      x,
      y,
      Phaser.Math.Between(8, 23),
      Phaser.Math.Between(6, 16),
      Phaser.Utils.Array.GetRandom(colors)
    ).setDepth(18);
    scene.tweens.add({
      targets: fragment,
      x: x + Phaser.Math.Between(-spread, spread),
      y: y + Phaser.Math.Between(-150, 80),
      angle: Phaser.Math.Between(-270, 270),
      alpha: 0,
      duration: Phaser.Math.Between(350, 700),
      onComplete: () => fragment.destroy()
    });
  }
}
