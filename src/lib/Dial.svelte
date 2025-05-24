<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let min: number = 0;
  export let max: number = 100;
  export let step: number = 1;
  export let value: number = 0;
  const dispatch = createEventDispatcher();
  let knobEl: HTMLDivElement;
  let isDragging = false;

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

  function valueToAngle(val: number) {
    const startAngle = -135;
    const endAngle = 135;
    const ratio = (val - min) / (max - min);
    return startAngle + ratio * (endAngle - startAngle);
  }

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
      value = Math.round((val*10))/10;
      dispatch('input', { value });
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

  $: knobAngle = valueToAngle(value);
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
  on:pointerdown={pointerDown}
  on:pointermove={pointerMove}
  on:pointerup={pointerUp}
>
  <div
    class="indicator"
    style="transform: rotate({knobAngle}deg);"
  ></div>
</div>
