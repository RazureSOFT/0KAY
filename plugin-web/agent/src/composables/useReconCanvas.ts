/**
 * Pan and zoom for the exploration canvas.
 *
 * Kept as a composable rather than a child component on purpose: the canvas is
 * an <svg> built from template bindings, and moving the DOM into a child would
 * have put the scoped styles in a different component. Logic has no such
 * constraint, so it moves and the markup stays where the styles are.
 */
import { ref } from 'vue';

export interface ReconCanvasLayout {
  width: number;
  height: number;
}

export function useReconCanvas(currentLayout: () => ReconCanvasLayout | null) {
  const reconZoom = ref(1);
  const reconPan = ref({ x: 0, y: 0 });
  const expandedDigests = ref(new Set<string>());
  let drag: { x: number; y: number; panX: number; panY: number; moved: boolean } | null = null;

  function onReconCanvasDown(event: PointerEvent) {
    if (event.button !== 0) return;
    const target = event.currentTarget as HTMLElement;
    drag = { x: event.clientX, y: event.clientY, panX: reconPan.value.x, panY: reconPan.value.y, moved: false };
    target.setPointerCapture(event.pointerId);
  }

  function onReconCanvasMove(event: PointerEvent) {
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    reconPan.value = { x: drag.panX + dx, y: drag.panY + dy };
  }

  function onReconCanvasUp(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    drag = null;
  }

  function onReconCanvasWheel(event: WheelEvent) {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
    reconZoom.value = Math.min(3, Math.max(0.25, reconZoom.value * factor));
  }

  function reconFit() {
    const canvas = document.querySelector('.recon-canvas') as HTMLElement | null;
    const layout = currentLayout();
    if (!canvas || !layout) return;
    const scale = Math.min(canvas.clientWidth / layout.width, canvas.clientHeight / layout.height, 1);
    reconZoom.value = Math.max(0.25, Math.round(scale * 100) / 100);
    reconPan.value = { x: 0, y: 0 };
  }

  return {
    reconZoom,
    reconPan,
    expandedDigests,
    onReconCanvasDown,
    onReconCanvasMove,
    onReconCanvasUp,
    onReconCanvasWheel,
    reconFit,
  };
}
