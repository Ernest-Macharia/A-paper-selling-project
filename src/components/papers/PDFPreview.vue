<template>
    <div class="pdf-preview-container">
        <!-- Enhanced Toolbar -->
        <div class="toolbar bg-white shadow-sm rounded-3 p-3 mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <!-- Navigation Controls -->
                <div class="d-flex align-items-center gap-2">
                    <button
                        class="btn btn-outline-primary btn-sm px-3"
                        @click="goToPage(pageNum - 1)"
                        :disabled="pageNum <= 1"
                    >
                        <i class="bi bi-chevron-left"></i> Previous
                    </button>

                    <div class="page-info bg-light px-3 py-1 rounded-2">
                        <span class="fw-semibold">Page {{ pageNum }} of {{ numPages }}</span>
                    </div>

                    <button
                        class="btn btn-outline-primary btn-sm px-3"
                        @click="goToPage(pageNum + 1)"
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
                    @change="goToPage(pageNum)"
                    :disabled="numPages <= 1"
                />
            </div>
        </div>

        <!-- PDF Container with Continuous Scrolling -->
        <div
            class="pdf-container bg-light rounded-3 p-3 shadow-sm"
            ref="pdfContainer"
            @scroll="handleScroll"
            :style="{ height: containerHeight }"
        >
            <div class="pdf-content" ref="pdfContent" :style="{ width: contentWidth }">
                <div
                    v-for="page in visiblePages"
                    :key="page.number"
                    class="pdf-page-wrapper"
                    :data-page-number="page.number"
                    :style="{ marginBottom: pageGap + 'px' }"
                >
                    <canvas
                        :ref="
                            (el) => {
                                if (el) pageCanvases[page.number - 1] = el;
                            }
                        "
                        class="pdf-page shadow"
                        :style="{
                            width: page.width + 'px',
                            height: page.height + 'px',
                        }"
                    />
                    <div v-if="loadingPages.includes(page.number)" class="page-loading-overlay">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Page Navigation Footer -->
        <div class="d-flex justify-content-between align-items-center mt-3">
            <button
                class="btn btn-outline-primary"
                @click="goToPage(pageNum - 1)"
                :disabled="pageNum <= 1"
            >
                <i class="bi bi-chevron-left"></i> Previous Page
            </button>

            <span class="text-muted">Page {{ pageNum }} of {{ numPages }}</span>

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
import { ref, onMounted, watch, computed, nextTick } from 'vue';
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
const rotation = ref(0);
const loading = ref(false);
const error = ref(false);
const pageDimensions = ref([]);
const scrollPosition = ref(0);
const loadingPages = ref([]);
const containerHeight = ref('70vh');
const pageGap = ref(20);

let pdfDoc = null;
let renderQueue = [];
let isRendering = false;

// Computed properties
const contentWidth = computed(() => {
    if (pageDimensions.value.length === 0 || !pageDimensions.value[0]) return 'auto';

    // Filter out null values in case some pages haven't loaded yet
    const validDimensions = pageDimensions.value.filter((dim) => dim !== null);
    if (validDimensions.length === 0) return 'auto';

    const maxWidth = Math.max(...validDimensions.map((p) => p.width));
    return `${maxWidth}px`;
});

const visiblePages = computed(() => {
    if (pageDimensions.value.length === 0 || pageDimensions.value.some((dim) => dim === null)) {
        return [];
    }

    // Calculate the range of pages that should be visible based on scroll position
    const container = pdfContainer.value;
    if (!container) return [];

    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    // Add buffer pages above and below the visible area
    const buffer = containerHeight * 2;
    const startPos = Math.max(0, scrollTop - buffer);
    const endPos = scrollTop + containerHeight + buffer;

    // Find which pages fall within this range
    let cumulativeHeight = 0;
    const visible = [];

    for (let i = 0; i < pageDimensions.value.length; i++) {
        const page = pageDimensions.value[i];
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
        loading.value = true;
        error.value = false;

        const loadingTask = pdfjsLib.getDocument(props.src);
        pdfDoc = await loadingTask.promise;
        numPages.value = pdfDoc.numPages;

        // Initialize page dimensions array
        pageDimensions.value = Array(numPages.value).fill(null);
        pageCanvases.value = Array(numPages.value).fill(null);

        // Pre-calculate dimensions for all pages
        await calculateAllPageDimensions();

        // Set the content height
        updateContentHeight();

        // Render initial visible pages
        renderVisiblePages();
    } catch (err) {
        console.error('Failed to load PDF:', err);
        error.value = true;
    } finally {
        loading.value = false;
    }
};

const calculateAllPageDimensions = async () => {
    for (let i = 1; i <= numPages.value; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({
            scale: scale.value,
            rotation: rotation.value,
        });

        pageDimensions.value[i - 1] = {
            width: viewport.width,
            height: viewport.height,
            viewport: viewport,
        };
    }
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
    if (!canvas) return false;
    return canvas.dataset.rendered === 'true';
};

const addToRenderQueue = (pageNumber) => {
    if (!renderQueue.includes(pageNumber)) {
        if (!loadingPages.value.includes(pageNumber)) {
            renderQueue.push(pageNumber);
            loadingPages.value = [...loadingPages.value, pageNumber];
        }
    }
};

const processRenderQueue = async () => {
    if (isRendering || renderQueue.length === 0) return;

    isRendering = true;
    const pageNumber = renderQueue.shift();

    try {
        await renderPage(pageNumber);
    } catch (err) {
        console.error(`Error rendering page ${pageNumber}:`, err);
    } finally {
        loadingPages.value = loadingPages.value.filter((n) => n !== pageNumber);
        isRendering = false;

        // Process next item in queue
        if (renderQueue.length > 0) {
            setTimeout(processRenderQueue, 0);
        }
    }
};

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
    }).promise;

    canvas.dataset.rendered = 'true';
};

const handleScroll = () => {
    if (!pdfContainer.value || pageDimensions.value.length === 0) return;

    const scrollTop = pdfContainer.value.scrollTop;
    scrollPosition.value = scrollTop;

    // Determine current page based on scroll position
    let cumulativeHeight = 0;
    let currentPage = 1;

    for (let i = 0; i < pageDimensions.value.length; i++) {
        const pageHeight = pageDimensions.value[i].height + pageGap.value;

        if (scrollTop >= cumulativeHeight && scrollTop < cumulativeHeight + pageHeight) {
            currentPage = i + 1;
            break;
        }

        cumulativeHeight += pageHeight;
    }

    if (currentPage !== pageNum.value) {
        pageNum.value = currentPage;
    }

    // Render newly visible pages
    renderVisiblePages();
};

const goToPage = (pageNumber) => {
    pageNumber = Math.max(1, Math.min(pageNumber, numPages.value));
    if (pageNumber === pageNum.value) return;

    pageNum.value = pageNumber;

    // Scroll to the page
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

const zoomIn = () => {
    scale.value = Math.min(scale.value + 0.1, 3);
    updatePdfScale();
};

const zoomOut = () => {
    scale.value = Math.max(0.5, scale.value - 0.1);
    updatePdfScale();
};

const resetZoom = () => {
    scale.value = 1.0;
    updatePdfScale();
};

const updatePdfScale = async () => {
    if (!pdfDoc) return;

    // Recalculate all page dimensions
    await calculateAllPageDimensions();
    updateContentHeight();

    // Clear all rendered flags
    pageCanvases.value.forEach((canvas) => {
        if (canvas) canvas.dataset.rendered = 'false';
    });

    // Render visible pages
    renderVisiblePages();

    // Try to maintain scroll position to the current page
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

// Lifecycle hooks
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
            renderVisiblePages();
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

.pdf-container {
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    border: 1px solid #dee2e6;
}

.pdf-content {
    position: relative;
}

.pdf-page-wrapper {
    position: relative;
    margin: 0 auto;
}

.pdf-page {
    display: block;
    margin: 0 auto;
    background-color: white;
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

    .pdf-container {
        height: 60vh !important;
    }
}
</style>
