<template>
    <div class="pdf-preview-container">
        <!-- Enhanced Toolbar -->
        <div class="toolbar bg-white shadow-sm rounded-3 p-3 mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <!-- Navigation Controls -->
                <div class="d-flex align-items-center gap-2">
                    <button
                        class="btn btn-outline-primary btn-sm px-3"
                        @click="prevPage"
                        :disabled="pageNum <= 1"
                    >
                        <i class="bi bi-chevron-left"></i> Previous
                    </button>

                    <div class="page-info bg-light px-3 py-1 rounded-2">
                        <span class="fw-semibold">Page {{ pageNum }} of {{ numPages }}</span>
                    </div>

                    <button
                        class="btn btn-outline-primary btn-sm px-3"
                        @click="nextPage"
                        :disabled="pageNum >= numPages"
                    >
                        Next <i class="bi bi-chevron-right"></i>
                    </button>
                </div>

                <!-- Zoom Controls -->
                <div class="d-flex align-items-center gap-2">
                    <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="zoomOut"
                        :disabled="scale <= 0.5"
                        title="Zoom Out"
                    >
                        <i class="bi bi-zoom-out"></i>
                    </button>

                    <div class="zoom-level bg-light px-3 py-1 rounded-2">
                        <span class="fw-semibold">{{ Math.round(scale * 100) }}%</span>
                    </div>

                    <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="zoomIn"
                        :disabled="scale >= 3"
                        title="Zoom In"
                    >
                        <i class="bi bi-zoom-in"></i>
                    </button>

                    <button
                        class="btn btn-outline-secondary btn-sm ms-2"
                        @click="resetZoom"
                        title="Reset Zoom"
                    >
                        <i class="bi bi-zoom-reset"></i>
                    </button>
                </div>

                <!-- Additional Controls -->
                <div class="d-flex align-items-center gap-2">
                    <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="rotateLeft"
                        title="Rotate Left"
                    >
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </button>

                    <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="rotateRight"
                        title="Rotate Right"
                    >
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>

                    <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="downloadPdf"
                        title="Download PDF"
                        v-if="props.src"
                    >
                        <i class="bi bi-download"></i>
                    </button>
                </div>
            </div>

            <!-- Page Navigation Slider -->
            <div class="mt-3">
                <input
                    type="range"
                    class="form-range"
                    min="1"
                    :max="numPages"
                    v-model="pageNum"
                    @change="renderPage"
                    :disabled="numPages <= 1"
                />
            </div>
        </div>

        <!-- PDF Canvas Container -->
        <div class="canvas-container bg-light rounded-3 p-3 shadow-sm">
            <div
                class="canvas-wrapper d-flex justify-content-center align-items-center"
                :style="{ minHeight: '70vh' }"
            >
                <div v-if="loading" class="loading-spinner text-primary">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading PDF...</p>
                </div>

                <div v-if="error" class="error-message text-danger">
                    <i class="bi bi-exclamation-triangle-fill fs-1"></i>
                    <p class="mt-2">Failed to load PDF document</p>
                    <button class="btn btn-outline-primary mt-2" @click="loadPdf">Retry</button>
                </div>

                <canvas v-show="!loading && !error" ref="canvas" class="pdf-canvas shadow" />
            </div>
        </div>

        <!-- Page Navigation Footer -->
        <div class="d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-outline-primary" @click="prevPage" :disabled="pageNum <= 1">
                <i class="bi bi-chevron-left"></i> Previous Page
            </button>

            <span class="text-muted">Page {{ pageNum }} of {{ numPages }}</span>

            <button
                class="btn btn-outline-primary"
                @click="nextPage"
                :disabled="pageNum >= numPages"
            >
                Next Page <i class="bi bi-chevron-right"></i>
            </button>
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
const scale = ref(1.0);
const rotation = ref(0);
const loading = ref(false);
const error = ref(false);
let pdfDoc = null;

const renderPage = async () => {
    if (!canvas.value || !pdfDoc) return;

    try {
        loading.value = true;
        error.value = false;

        const page = await pdfDoc.getPage(pageNum.value);
        const viewport = page.getViewport({
            scale: scale.value,
            rotation: rotation.value,
        });

        const context = canvas.value.getContext('2d');
        canvas.value.height = viewport.height;
        canvas.value.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport,
        }).promise;
    } catch (err) {
        console.error('Error rendering PDF page:', err);
        error.value = true;
    } finally {
        loading.value = false;
    }
};

const loadPdf = async () => {
    try {
        loading.value = true;
        error.value = false;

        const loadingTask = pdfjsLib.getDocument(props.src);
        pdfDoc = await loadingTask.promise;
        numPages.value = pdfDoc.numPages;
        pageNum.value = 1;
        await renderPage();
    } catch (err) {
        console.error('Failed to load PDF:', err);
        error.value = true;
    } finally {
        loading.value = false;
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

const resetZoom = () => {
    scale.value = 1.0;
    renderPage();
};

const rotateLeft = () => {
    rotation.value = (rotation.value - 90) % 360;
    renderPage();
};

const rotateRight = () => {
    rotation.value = (rotation.value + 90) % 360;
    renderPage();
};

const downloadPdf = () => {
    if (!props.src) return;

    const link = document.createElement('a');
    link.href = props.src;
    link.download = props.src.split('/').pop() || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
.pdf-preview-container {
    max-width: 1000px;
    margin: 0 auto;
}

.toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
}

.canvas-container {
    overflow: auto;
    max-height: 80vh;
}

.pdf-canvas {
    max-width: 100%;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.page-info,
.zoom-level {
    min-width: 100px;
    text-align: center;
}

.loading-spinner,
.error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
}

.form-range {
    cursor: pointer;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .toolbar > div {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .d-flex.align-items-center {
        justify-content: center;
    }
}
</style>
