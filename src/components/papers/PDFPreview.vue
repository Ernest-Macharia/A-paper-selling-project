<template>
    <div class="pdf-preview-container">
        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger d-flex align-items-center">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <span>Failed to load PDF document</span>
            <button @click="loadPdf" class="btn btn-sm btn-outline-danger ms-auto">Retry</button>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading.pdf" class="loading-overlay">
            <div class="spinner-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading document...</p>
            </div>
        </div>

        <!-- Enhanced Toolbar -->
        <div class="pdf-toolbar">
            <div class="toolbar-group">
                <button
                    class="toolbar-btn btn-outline-primary"
                    @click="goToPage(pageNum - 1)"
                    :disabled="pageNum <= 1"
                    aria-label="Previous page"
                >
                    <i class="bi bi-chevron-left"></i>
                    <span class="btn-text">Previous</span>
                </button>

                <div class="page-info">
                    <span>Page {{ pageNum }} of {{ numPages }}</span>
                </div>

                <button
                    class="toolbar-btn btn-outline-primary"
                    @click="goToPage(pageNum + 1)"
                    :disabled="pageNum >= numPages"
                    aria-label="Next page"
                >
                    <span class="btn-text">Next</span>
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>

            <div class="toolbar-group">
                <button
                    class="toolbar-btn btn-outline-secondary"
                    @click="zoomOut"
                    :disabled="scale <= 0.5"
                    aria-label="Zoom out"
                >
                    <i class="bi bi-zoom-out"></i>
                </button>

                <input
                    type="range"
                    class="zoom-slider"
                    min="50"
                    max="300"
                    step="5"
                    v-model.number="zoomLevel"
                    @input="setZoom(zoomLevel / 100)"
                />

                <div class="zoom-level">{{ Math.round(scale * 100) }}%</div>

                <button
                    class="toolbar-btn btn-outline-secondary"
                    @click="zoomIn"
                    :disabled="scale >= 3"
                    aria-label="Zoom in"
                >
                    <i class="bi bi-zoom-in"></i>
                </button>

                <button
                    class="toolbar-btn btn-outline-secondary"
                    @click="resetZoom"
                    aria-label="Reset zoom"
                >
                    <i class="bi bi-fullscreen"></i>
                </button>
            </div>

            <div class="toolbar-group">
                <button
                    class="toolbar-btn btn-outline-secondary"
                    @click="rotateLeft"
                    aria-label="Rotate left"
                >
                    <i class="bi bi-arrow-counterclockwise"></i>
                </button>

                <button
                    class="toolbar-btn btn-outline-secondary"
                    @click="rotateRight"
                    aria-label="Rotate right"
                >
                    <i class="bi bi-arrow-clockwise"></i>
                </button>

                <button
                    class="toolbar-btn btn-outline-secondary"
                    @click="toggleFullscreen"
                    aria-label="Toggle fullscreen"
                >
                    <i class="bi" :class="fullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'"></i>
                </button>

                <button
                    class="toolbar-btn btn-outline-secondary"
                    @click="downloadPdf"
                    v-if="props.src"
                    aria-label="Download PDF"
                >
                    <i class="bi bi-download"></i>
                </button>
            </div>
        </div>

        <!-- Page Navigation Slider -->
        <div class="page-slider-container">
            <input
                type="range"
                class="page-slider"
                min="1"
                :max="numPages"
                v-model.number="pageNum"
                @change="goToPage(pageNum)"
                :disabled="numPages <= 1"
            />
        </div>

        <!-- PDF Container with Continuous Scrolling -->
        <div
            class="pdf-viewport"
            ref="pdfContainer"
            @scroll="handleScroll"
            :style="{ height: containerHeight }"
        >
            <div class="pdf-content" ref="pdfContent">
                <div
                    v-for="page in visiblePages"
                    :key="page.number"
                    class="pdf-page-wrapper"
                    :data-page-number="page.number"
                    :style="{
                        marginBottom: pageGap + 'px',
                        height: page.height + 'px',
                    }"
                >
                    <canvas
                        :ref="
                            (el) => {
                                if (el) pageCanvases[page.number - 1] = el;
                            }
                        "
                        class="pdf-page"
                        :style="{
                            width: page.width + 'px',
                            height: page.height + 'px',
                        }"
                    />
                    <div v-if="loading.pages[page.number]" class="page-loading-overlay">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Page Navigation Footer -->
        <div class="page-navigation">
            <button
                class="btn btn-outline-primary"
                @click="goToPage(pageNum - 1)"
                :disabled="pageNum <= 1"
            >
                <i class="bi bi-chevron-left"></i> Previous Page
            </button>

            <div class="page-info">
                <span>Page {{ pageNum }} of {{ numPages }}</span>
                <span v-if="documentTitle" class="document-title">{{ documentTitle }}</span>
            </div>

            <button
                class="btn btn-outline-primary"
                @click="goToPage(pageNum + 1)"
                :disabled="pageNum >= numPages"
            >
                Next Page <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue';
import { debounce } from 'lodash';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const props = defineProps({
    src: { type: String, required: true },
    visible: { type: Boolean, required: true },
});

// Refs
const pdfContainer = ref(null);
const pdfContent = ref(null);
const pageCanvases = ref([]);
const pageNum = ref(1);
const numPages = ref(0);
const scale = ref(1.0);
const zoomLevel = ref(100);
const rotation = ref(0);
const loading = ref({
    pdf: false,
    pages: {},
});
const error = ref(null);
const pageDimensions = ref([]);
const scrollPosition = ref(0);
const containerHeight = ref('70vh');
const pageGap = ref(20);
const fullscreen = ref(false);
const documentTitle = ref('');

let pdfDoc = null;
let renderQueue = [];
let isRendering = false;

// Computed properties
const visiblePages = computed(() => {
    // Return empty array if no page dimensions
    if (!pageDimensions.value || pageDimensions.value.length === 0) {
        console.warn('No page dimensions available');
        return [];
    }

    // Show all pages if less than 5 (with null checks)
    if (numPages.value <= 4) {
        return pageDimensions.value.map((page, i) => {
            if (!page) {
                console.warn(`Page ${i + 1} dimensions are null`);
                return {
                    number: i + 1,
                    width: 0,
                    height: 0,
                };
            }
            return {
                number: i + 1,
                width: page.width,
                height: page.height,
            };
        });
    }

    // Virtual scrolling for more than 4 pages
    const container = pdfContainer.value;
    if (!container) {
        console.warn('PDF container not available');
        return pageDimensions.value.map((page, i) => ({
            number: i + 1,
            width: page?.width || 0,
            height: page?.height || 0,
        }));
    }

    const buffer = container.clientHeight * 2;
    const scrollTop = container.scrollTop;
    const startPos = Math.max(0, scrollTop - buffer);
    const endPos = scrollTop + container.clientHeight + buffer;

    let cumulativeHeight = 0;
    const visible = [];

    for (let i = 0; i < pageDimensions.value.length; i++) {
        const page = pageDimensions.value[i];
        if (!page) {
            console.warn(`Page ${i + 1} dimensions are null`);
            continue;
        }

        const pageHeight = page.height + pageGap.value;

        if (cumulativeHeight + pageHeight > startPos && cumulativeHeight < endPos) {
            visible.push({
                number: i + 1,
                width: page.width,
                height: page.height,
            });
        }

        cumulativeHeight += pageHeight;
        if (cumulativeHeight > endPos) break;
    }
    return visible;
});

// Methods
const loadPdf = async () => {
    try {
        error.value = null;
        loading.value.pdf = true;
        loading.value.pages = {};

        const loadingTask = pdfjsLib.getDocument({
            url: props.src,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
            cMapPacked: true,
        });

        pdfDoc = await loadingTask.promise;
        numPages.value = pdfDoc.numPages;

        // Initialize with correct length
        pageDimensions.value = Array(numPages.value).fill(null);
        pageCanvases.value = Array(numPages.value).fill(null);

        await calculateAllPageDimensions();
        updateContentHeight();

        // Force render first 4 pages immediately
        for (let i = 1; i <= Math.min(4, numPages.value); i++) {
            addToRenderQueue(i);
        }
        processRenderQueue();

        // Set initial scroll position
        nextTick(() => {
            if (pdfContainer.value) {
                pdfContainer.value.scrollTop = 0;
            }
        });
    } catch (err) {
        console.error('PDF loading error:', err);
        error.value = err;
    } finally {
        loading.value.pdf = false;
    }
};

const calculateAllPageDimensions = async () => {
    const newDimensions = [];
    for (let i = 1; i <= numPages.value; i++) {
        try {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({
                scale: scale.value,
                rotation: rotation.value,
            });
            newDimensions.push({
                width: viewport.width,
                height: viewport.height,
                viewport: viewport,
            });
        } catch (err) {
            console.error(`Error getting dimensions for page ${i}:`, err);
            // Provide fallback dimensions
            newDimensions.push({
                width: 595, // Standard A4 width in points
                height: 842, // Standard A4 height in points
                viewport: null,
            });
        }
    }
    pageDimensions.value = newDimensions;
};

const updateContentHeight = () => {
    nextTick(() => {
        if (pdfContent.value && pageDimensions.value.length > 0) {
            const totalHeight = pageDimensions.value.reduce(
                (sum, page) => sum + page.height + pageGap.value,
                -pageGap.value,
            );
            pdfContent.value.style.height = `${totalHeight}px`;
        }
    });
};

const renderVisiblePages = async () => {
    const pagesToRender = visiblePages.value.map((p) => p.number);

    for (const pageNumber of pagesToRender) {
        if (!isPageRendered(pageNumber)) {
            addToRenderQueue(pageNumber);
        }
    }

    processRenderQueue();
};

const isPageRendered = (pageNumber) => {
    const canvas = pageCanvases.value[pageNumber - 1];
    return canvas?.dataset.rendered === 'true';
};

const addToRenderQueue = (pageNumber) => {
    if (!renderQueue.includes(pageNumber) && !loading.value.pages[pageNumber]) {
        renderQueue.push(pageNumber);
        loading.value.pages[pageNumber] = true;
    }
};

const processRenderQueue = debounce(async () => {
    if (isRendering || renderQueue.length === 0) return;

    isRendering = true;
    const pageNumber = renderQueue.shift();

    try {
        await renderPage(pageNumber);
    } catch (err) {
        console.error(`Error rendering page ${pageNumber}:`, err);
    } finally {
        loading.value.pages[pageNumber] = false;
        isRendering = false;
        if (renderQueue.length > 0) processRenderQueue();
    }
}, 50);

const renderPage = async (pageNumber) => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > numPages.value) return;

    const canvas = pageCanvases.value[pageNumber - 1];
    if (!canvas) return;

    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({
        scale: scale.value,
        rotation: rotation.value,
    });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
        intent: 'display',
    }).promise;

    canvas.dataset.rendered = 'true';
};

const handleScroll = debounce(() => {
    if (!pdfContainer.value) return;

    const scrollTop = pdfContainer.value.scrollTop;
    scrollPosition.value = scrollTop;

    // Update current page number
    let cumulativeHeight = 0;
    for (let i = 0; i < pageDimensions.value.length; i++) {
        const page = pageDimensions.value[i];
        if (!page) continue;

        const pageHeight = page.height + pageGap.value;

        if (scrollTop >= cumulativeHeight && scrollTop < cumulativeHeight + pageHeight) {
            if (pageNum.value !== i + 1) {
                pageNum.value = i + 1;
            }
            break;
        }
        cumulativeHeight += pageHeight;
    }

    // Ensure all pages are in render queue
    visiblePages.value.forEach((page) => {
        if (!isPageRendered(page.number)) {
            addToRenderQueue(page.number);
        }
    });
    processRenderQueue();
}, 100);

const goToPage = (pageNumber) => {
    pageNumber = Math.max(1, Math.min(pageNumber, numPages.value));
    if (pageNumber === pageNum.value) return;

    pageNum.value = pageNumber;

    nextTick(() => {
        if (!pdfContainer.value || pageDimensions.value.length === 0) return;

        let offset = 0;
        for (let i = 0; i < pageNumber - 1; i++) {
            offset += pageDimensions.value[i].height + pageGap.value;
        }

        pdfContainer.value.scrollTo({
            top: offset,
            behavior: 'smooth',
        });
    });
};

const setZoom = (level) => {
    scale.value = Math.min(3, Math.max(0.5, level));
    zoomLevel.value = Math.round(scale.value * 100);
    updatePdfScale();
};

const zoomIn = () => setZoom(scale.value + 0.1);
const zoomOut = () => setZoom(scale.value - 0.1);
const resetZoom = () => setZoom(1.0);

const updatePdfScale = async () => {
    if (!pdfDoc) return;

    await calculateAllPageDimensions();
    updateContentHeight();

    pageCanvases.value.forEach((canvas) => {
        if (canvas) canvas.dataset.rendered = 'false';
    });

    renderVisiblePages();
    goToPage(pageNum.value);
};

const rotateLeft = () => {
    rotation.value = (rotation.value - 90) % 360;
    updatePdfScale();
};

const rotateRight = () => {
    rotation.value = (rotation.value + 90) % 360;
    updatePdfScale();
};

const toggleFullscreen = () => {
    fullscreen.value = !fullscreen.value;
    containerHeight.value = fullscreen.value ? '90vh' : '70vh';
};

const downloadPdf = () => {
    if (!props.src) return;

    const link = document.createElement('a');
    link.href = props.src;
    link.download = documentTitle.value || props.src.split('/').pop() || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Lifecycle hooks
onMounted(() => {
    if (props.visible) loadPdf();
});

onBeforeUnmount(() => {
    if (pdfDoc) {
        pdfDoc.cleanup();
        pdfDoc.destroy();
    }
});

watch(() => props.src, loadPdf);
watch(
    () => props.visible,
    (val) => val && pdfDoc && renderVisiblePages(),
);
</script>

<style scoped>
.pdf-preview-container {
    --toolbar-bg: #ffffff;
    --toolbar-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    --page-bg: #f8f9fa;
    --page-border: #e9ecef;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --primary-color: #0d6efd;
    --border-radius: 0.5rem;
    --transition-speed: 0.2s;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    position: relative;
}

/* Loading States */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.spinner-container {
    text-align: center;
    background: var(--toolbar-bg);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--toolbar-shadow);
}

/* Toolbar Styles */
.pdf-toolbar {
    background-color: var(--toolbar-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--toolbar-shadow);
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.toolbar-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.toolbar-btn {
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--border-radius) - 0.1rem);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all var(--transition-speed) ease;
    background-color: transparent;
    border: 1px solid #dee2e6;
    color: var(--text-primary);
    cursor: pointer;
}

.toolbar-btn:hover:not(:disabled) {
    background-color: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
}

.btn-outline-primary {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.btn-outline-primary:hover:not(:disabled) {
    background-color: var(--primary-color);
    color: white;
}

.btn-outline-secondary {
    border-color: #dee2e6;
    color: var(--text-secondary);
}

.btn-outline-secondary:hover:not(:disabled) {
    background-color: #f8f9fa;
    color: var(--text-primary);
}

.page-info,
.zoom-level {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
}

/* Sliders */
.page-slider-container,
.zoom-slider-container {
    padding: 0.5rem 0;
}

.page-slider,
.zoom-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #dee2e6;
    -webkit-appearance: none;
}

.page-slider::-webkit-slider-thumb,
.zoom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
}

.zoom-slider {
    width: 100px;
    margin: 0 0.5rem;
}

/* PDF Display Area */
.pdf-viewport {
    width: 100%;
    height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    scroll-behavior: smooth;
}

.pdf-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.pdf-page-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-page {
    display: block;
    max-width: 100%;
    height: auto;
    border: 1px solid #eee;
}
.page-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.7);
}

/* Page Navigation Footer */
.page-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: var(--toolbar-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--toolbar-shadow);
}

.page-navigation .page-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.document-title {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
}

/* Scrollbar styling */
.pdf-viewport::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.pdf-viewport::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.pdf-viewport::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}

.pdf-viewport::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
    .pdf-viewport {
        height: 60vh;
    }

    .toolbar-group {
        flex-wrap: wrap;
    }
}

@media (max-width: 768px) {
    .pdf-preview-container {
        padding: 0.5rem;
    }

    .pdf-viewport {
        height: 50vh;
    }

    .pdf-toolbar {
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .toolbar-btn {
        padding: 0.4rem;
    }

    .btn-text {
        display: none;
    }

    .zoom-slider {
        width: 70px;
    }
}

@media (max-width: 576px) {
    .pdf-viewport {
        height: 40vh;
    }

    .page-navigation {
        flex-direction: column;
        gap: 0.5rem;
    }

    .zoom-level {
        display: none;
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .pdf-preview-container {
        --toolbar-bg: #2d2d2d;
        --toolbar-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        --page-bg: #252525;
        --page-border: #3d3d3d;
        --text-primary: #f8f9fa;
        --text-secondary: #adb5bd;
    }

    .pdf-page-wrapper {
        background-color: #2d2d2d;
    }

    .toolbar-btn:hover:not(:disabled) {
        background-color: #3d3d3d;
    }

    .pdf-viewport::-webkit-scrollbar-track {
        background: #2d2d2d;
    }

    .pdf-viewport::-webkit-scrollbar-thumb {
        background: #555;
    }

    .pdf-viewport::-webkit-scrollbar-thumb:hover {
        background: #666;
    }

    .loading-overlay {
        background-color: rgba(0, 0, 0, 0.7);
    }
}
</style>
