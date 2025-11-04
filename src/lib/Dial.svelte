<script lang="ts">
/**
 * Dial Component
 *
 * An interactive rotary dial/knob control for selecting grinder settings.
 * Uses pointer events to track rotation and converts angular position to numeric values.
 * The dial rotates within a 270-degree arc (-135° to +135°).
 */

  let { min, max, step, value = $bindable() } = $props();
  let knobEl: HTMLDivElement;
  let isDragging = $state(false);
  let knobAngle = $state(valueToAngle(value));

  /**
   * Converts an angle (in degrees) to a numeric value within the min-max range
   * @param angle - The angle in degrees (-135 to 135)
   * @returns The corresponding numeric value, rounded to the nearest step
   */
  function angleToValue(angle: number) {
    const startAngle = -135;
    const endAngle = 135;
    const clamped = Math.max(Math.min(angle, endAngle), startAngle);
    const ratio = (clamped - startAngle) / (endAngle - startAngle);
    const range = max - min;
    let val = min + ratio * range;
    val = Math.round(val / step) * step;
    return val;
  }

  /**
   * Converts a numeric value to an angle (in degrees)
   * @param val - The numeric value to convert
   * @returns The corresponding angle in degrees (-135 to 135)
   */
  function valueToAngle(val: number) {
    const startAngle = -135;
    const endAngle = 135;
    const ratio = (val - min) / (max - min);
    return startAngle + ratio * (endAngle - startAngle);
  }

  /**
   * Updates the dial value based on pointer position
   * Calculates the angle from the dial center to the pointer position
   * @param e - The pointer event containing cursor coordinates
   */
  function updateValueFromEvent(e: PointerEvent) {
    const rect = knobEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = angle - 90;
    if (angle < -180) angle += 360;
    if (angle > 180) angle -= 360;
    const val = angleToValue(angle);
    if (val !== value) {
      value = Math.round(val * 10) / 10;
    }
  }

  function pointerDown(e: PointerEvent) {
    isDragging = true;
    knobEl.setPointerCapture(e.pointerId);
    updateValueFromEvent(e);
  }

  function pointerMove(e: PointerEvent) {
    if (!isDragging) return;
    updateValueFromEvent(e);
  }

  function pointerUp(e: PointerEvent) {
    isDragging = false;
    knobEl.releasePointerCapture(e.pointerId);
  }

  $effect(() => {
    knobAngle = valueToAngle(value);
  });
</script>

<style>
.knob {
  width: 60px;
  height: 60px;
  border: 3px solid #eee;
  border-radius: 50%;
  position: relative;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;
}

.indicator {
  width: 4px;
  height: 40%;
  background: #f5f5f5;
  position: absolute;
  top: 10%;
  left: 50%;
  transform-origin: bottom center;
}
</style>

<div
  bind:this={knobEl}
  class="knob"
  onpointerdown={pointerDown}
  onpointermove={pointerMove}
  onpointerup={pointerUp}
>
  <div
    class="indicator"
    style="transform: rotate({knobAngle}deg);"
  ></div>
</div>
