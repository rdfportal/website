/**
 * Top page dataset tiles - データセットタイル表示
 */

class TopPageTilingDatasetsViewController {
  static TILE_SIZE = 320; // Expanded to include margin
  static CONTAINER_SELECTOR = "#TopPageTilingDatasetsView > .container";
  static DATASET_COUNT_PER_LANE = 30;

  #container;
  #datasets = [];
  #datasetLoader;
  #direction = 'vertical'; // 'vertical' | 'horizontal'
  #abortController = null;

  constructor() {
    this.#container = document.querySelector(
      TopPageTilingDatasetsViewController.CONTAINER_SELECTOR
    );
    this.#datasetLoader = DatasetsManager.getInstance();

    if (this.#container) {
      this.#init();
    }
  }

  async #init() {
    try {
      const data = await this.#datasetLoader.getDatasets();
      this.#datasets = data;
      if (this.#datasets.length > 0) {
        this.#startLoop();
      }
    } catch (error) {
      console.error("Data load failed:", error);
    }
  }

  #startLoop() {
    if (this.#abortController) this.#abortController.abort();
    this.#abortController = new AbortController();
    const signal = this.#abortController.signal;

    // 1. Toggle Direction
    this.#direction = this.#direction === 'vertical' ? 'horizontal' : 'vertical';
    this.#container.setAttribute('data-direction', this.#direction);
    this.#container.innerHTML = '';

    // 2. Render Lanes
    const lanes = this.#renderLanes();

    // 3. Animate Lanes
    this.#animateLanes(lanes, signal).then(() => {
      if (!signal.aborted) {
        this.#startLoop(); // Next loop
      }
    });
  }

  #renderLanes() {
    const isVertical = this.#direction === 'vertical';
    const screenSize = isVertical ? window.innerWidth : window.innerHeight;
    const laneCount = Math.ceil(screenSize / TopPageTilingDatasetsViewController.TILE_SIZE) + 1;
    const itemsPerLane = TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE;

    const lanes = [];

    for (let i = 0; i < laneCount; i++) {
      const lane = document.createElement('div');
      lane.className = 'lane';

      // Generate random datasets for this lane
      const laneDatasets = [];
      for (let j = 0; j < itemsPerLane; j++) {
        laneDatasets.push(this.#getRandomDataset());
      }

      // Create tiles
      laneDatasets.forEach(ds => {
        const card = new DatasetCard(ds, {
          showDescription: true,
          showFallbackDescription: true,
          customClasses: [],
        });
        // Override style for relative positioning in flow
        const el = card.getElement();
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        lane.appendChild(el);
      });

      this.#container.appendChild(lane);
      lanes.push(lane);
    }
    return lanes;
  }

  #getRandomDataset() {
    return this.#datasets[Math.floor(Math.random() * this.#datasets.length)];
  }

  async #animateLanes(lanes, signal) {
    const isVertical = this.#direction === 'vertical';
    // Calculate scroll distance
    // Since we don't wait for layout, we approximate or measure
    // But better to measure first lane? Or just use approximate: 30 items * 320px
    const contentSize = TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE * 320;
    const viewportSize = isVertical ? window.innerHeight : window.innerWidth;
    const distance = contentSize - viewportSize;

    // Base duration for "Slow-Fast-Slow" requires roughly 20-30s total? 
    // User requested: Slow start -> Fast -> Slow end.
    // Let's use 20s base.
    const baseDuration = 30000;

    const animations = lanes.map((lane, index) => {
      // Random delay for Matrix effect
      const delay = Math.random() * 4000; // 0-4s stagger
      const duration = baseDuration + (Math.random() * 5000); // vary duration slightly

      const axis = isVertical ? 'Y' : 'X';
      const start = `translate${axis}(0)`;
      const end = `translate${axis}(${-distance}px)`; // Scroll to end
      // Or move completely out? if flow: maybe translate(-contentSize)
      // "Scroll through"

      const keyframes = [
        { transform: start },
        { transform: end }
      ];

      return lane.animate(keyframes, {
        duration: duration,
        delay: delay,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Ease-in-out
        fill: 'forwards'
      }).finished;
    });

    try {
      await Promise.all(animations);
    } catch (e) {
      // animation aborted
    }
  }
}

// DOM読み込み完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  new TopPageTilingDatasetsViewController();
});
