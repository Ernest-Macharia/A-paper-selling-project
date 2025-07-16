<template>
    <div class="pdf-preview">
        <div class="toolbar mb-3">
            <button @click="prevPage" :disabled="pageNum <= 1">⬅ Prev</button>
            <span>Page {{ pageNum }} / {{ numPages }}</span>
            <div class="zoom-controls">
                <button @click="zoomOut" :disabled="scale <= 0.5">➖</button>
                <span>{{ scale.toFixed(1) }}x</span>
                <button @click="zoomIn" :disabled="scale >= 3">➕</button>
            </div>
            <button @click="nextPage" :disabled="pageNum >= numPages">Next ➡</button>
        </div>

        <div class="canvas-wrapper">
            <canvas ref="canvas" class="pdf-canvas" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const props = defineProps({
    src: { type: String, required: true },
    visible: { type: Boolean, required: true },
});

const canvas = ref(null);
const pageNum = ref(1);
const numPages = ref(0);
const scale = ref(0.7);
let pdfDoc = null;

const renderPage = async () => {
    if (!canvas.value || !pdfDoc) return;
    const page = await pdfDoc.getPage(pageNum.value);
    const viewport = page.getViewport({ scale: scale.value });

    const context = canvas.value.getContext('2d');
    canvas.value.height = viewport.height;
    canvas.value.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
};

const loadPdf = async () => {
    try {
        const loadingTask = pdfjsLib.getDocument(props.src);
        pdfDoc = await loadingTask.promise;
        numPages.value = pdfDoc.numPages;
        pageNum.value = 1;
        await renderPage();
    } catch (err) {
        console.error('Failed to load PDF:', err);
    }
};

const nextPage = () => {
    if (pageNum.value < numPages.value) {
        pageNum.value++;
        renderPage();
    }
};

const prevPage = () => {
    if (pageNum.value > 1) {
        pageNum.value--;
        renderPage();
    }
};

const zoomIn = () => {
    scale.value = Math.min(scale.value + 0.1, 3);
    renderPage();
};

const zoomOut = () => {
    scale.value = Math.max(0.5, scale.value - 0.1);
    renderPage();
};

onMounted(() => {
    if (props.visible) {
        loadPdf();
    }
});

watch(
    () => props.src,
    () => {
        if (props.visible) {
            loadPdf();
        }
    },
);

watch(
    () => props.visible,
    async (val) => {
        if (val && pdfDoc) {
            await nextTick();
            setTimeout(() => renderPage(), 100);
        }
    },
);
</script>

<style scoped>
.pdf-preview {
    text-align: center;
    padding: 1rem;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.zoom-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.canvas-wrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    min-height: 400px;
}

.pdf-canvas {
    max-width: 100%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
</style>
