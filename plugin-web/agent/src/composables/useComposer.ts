/**
 * The composer: draft text, attachments, drag-and-drop, and the send queue.
 *
 * Logic only. The form's markup and styles stay in the page — the same rule as
 * the other composables, so the scoped CSS keeps applying.
 */
import { computed, ref, type ComputedRef, type Ref } from 'vue';

export interface Attachment {
  name: string;
  url: string;
  mime: string;
  size: number;
}

/**
 * The composer's state comes from the caller.
 *
 * Those refs are read by top-level statements near the very top of the page
 * (the slash menu watches `draft`, the autosize watcher follows it). If this
 * composable created them, they would be declared after those statements and
 * every read would be a temporal-dead-zone error at module evaluation — which
 * is exactly the crash this shipped with. Declaring state in the page and
 * passing it in keeps the ordering obvious; only behaviour lives here.
 */
export interface ComposerState {
  draft: Ref<string>;
  attachments: Ref<Attachment[]>;
  uploading: Ref<boolean>;
  attachError: Ref<string>;
  fileInput: Ref<HTMLInputElement | null>;
  queuedMessages: Ref<string[]>;
  composerArea: Ref<HTMLTextAreaElement | null>;
}

export function useComposer(options: {
  busy: Ref<boolean>;
  archived: ComputedRef<boolean>;
  friendlyError: (message: string) => string;
} & ComposerState) {
  const { busy, archived, friendlyError } = options;
  const { draft, attachments, uploading, attachError, fileInput, queuedMessages, composerArea } = options;

  function pickFiles() { fileInput.value?.click(); }

  function removeAttachment(index: number) { attachments.value.splice(index, 1); }

  async function addFiles(files: File[]) {
    if (!files.length) return;
    uploading.value = true; attachError.value = '';
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        const response = await fetch('/api/files', { method: 'POST', body: form });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        attachments.value.push({
          name: data.name || file.name,
          url: data.url,
          mime: data.mime || file.type || 'application/octet-stream',
          size: data.size ?? file.size,
        });
      }
    } catch (e: any) {
      attachError.value = friendlyError(e?.message || String(e));
    } finally {
      uploading.value = false;
    }
  }

  async function onFilesPicked(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    await addFiles(files);
  }

  function onPaste(event: ClipboardEvent) {
    const files = Array.from(event.clipboardData?.files || []);
    if (!files.length) return;
    event.preventDefault();
    void addFiles(files);
  }

  const dragDepth = ref(0);
  const dropping = computed(() => dragDepth.value > 0);

  function hasFiles(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types || []).includes('Files');
  }

  function onDragEnter(event: DragEvent) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.value += 1;
  }

  function onDragOver(event: DragEvent) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  function onDragLeave(event: DragEvent) {
    if (!hasFiles(event)) return;
    dragDepth.value = Math.max(0, dragDepth.value - 1);
  }

  async function onDropFiles(event: DragEvent) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.value = 0;
    const files = Array.from(event.dataTransfer?.files || []);
    if (!files.length || busy.value || archived.value) return;
    await addFiles(files);
  }

  function dropQueued(index: number): void {
    queuedMessages.value.splice(index, 1);
  }

  function autosizeComposer() {
    const el = composerArea.value;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return {
    pickFiles,
    removeAttachment,
    addFiles,
    onFilesPicked,
    onPaste,
    dragDepth,
    dropping,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDropFiles,
    dropQueued,
    autosizeComposer,
  };
}
