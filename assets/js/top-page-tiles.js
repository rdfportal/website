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
  #currentLaneDatasets = []; // Store current grid data for state handover

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

  async #startLoop() {
    if (this.#abortController) this.#abortController.abort();
    this.#abortController = new AbortController();
    const signal = this.#abortController.signal;

    const oldDirection = this.#direction;
    const oldLaneDatasets = this.#currentLaneDatasets;

    // 1. Toggle Direction
    this.#direction = this.#direction === 'vertical' ? 'horizontal' : 'vertical';
    this.#container.setAttribute('data-direction', this.#direction);
    this.#container.innerHTML = '';

    // 2. Prepare Data (Seamless Transition)
    const nextLaneCount = this.#calculateLaneCount();
    let nextDatasetsMatrix = [];

    if (oldLaneDatasets.length > 0) {
      // Transpose logic
      nextDatasetsMatrix = this.#generateTransposedData(oldLaneDatasets, oldDirection, nextLaneCount);
    } else {
      // First run: Random generation
      nextDatasetsMatrix = this.#generateRandomMatrix(nextLaneCount);
    }

    // Store for next loop
    this.#currentLaneDatasets = nextDatasetsMatrix;

    // 3. Render Lanes
    const lanes = this.#renderLanes(nextDatasetsMatrix);

    // 4. Animate Lanes
    if (!signal.aborted) {
      await new Promise(resolve => setTimeout(resolve, 4000)); // Pause 4s
    }
    if (signal.aborted) return;

    this.#animateLanes(lanes, signal).then(() => {
      if (!signal.aborted) {
        this.#startLoop();
      }
    });
  }

  #calculateLaneCount() {
    const isVertical = this.#direction === 'vertical';
    const screenSize = isVertical ? window.innerWidth : window.innerHeight;
    // Add extra lanes to ensure coverage
    return Math.ceil(screenSize / TopPageTilingDatasetsViewController.TILE_SIZE) + 1;
  }

  #generateRandomMatrix(laneCount) {
    const matrix = [];
    for (let i = 0; i < laneCount; i++) {
      const lane = [];
      for (let j = 0; j < TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE; j++) {
        lane.push(this.#getRandomDataset());
      }
      matrix.push(lane);
    }
    return matrix;
  }

  #generateTransposedData(oldMatrix, oldDirection, nextLaneCount) {
    // PREVIOUS state context
    const isOldVertical = oldDirection === 'vertical';
    const oldViewportSize = isOldVertical ? window.innerHeight : window.innerWidth;

    // Original calculation was: distance = contentSize - oldViewportSize
    const contentSize = TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE * TopPageTilingDatasetsViewController.TILE_SIZE;
    const distance = contentSize - oldViewportSize;

    // We snapped the previous animation to this distance:
    const snappedDistance = Math.floor(distance / TopPageTilingDatasetsViewController.TILE_SIZE) * TopPageTilingDatasetsViewController.TILE_SIZE;

    // Calculate visible start index based on the actua snapped distance
    // The previous animation moved 'snappedDistance' pixels.
    // So item[k] is at Y = k*TILE - snappedDistance.
    // We want the item at Y=0. => k*TILE = snappedDistance => k = snappedDistance / TILE.
    const startIndex = snappedDistance / TopPageTilingDatasetsViewController.TILE_SIZE;

    const itemsPerLane = TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE;
    const newMatrix = [];

    // Initialize new matrix
    for (let i = 0; i < nextLaneCount; i++) {
      newMatrix[i] = [];
    }

    const oldLaneCount = oldMatrix.length;

    for (let newLaneIdx = 0; newLaneIdx < nextLaneCount; newLaneIdx++) {
      // corresponding old item index 
      const oldItemOffset = newLaneIdx;
      const oldItemIdx = startIndex + oldItemOffset;

      // Try to construct valid transposed data
      if (oldItemIdx < itemsPerLane) {
        for (let newColIdx = 0; newColIdx < oldLaneCount; newColIdx++) {
          if (oldMatrix[newColIdx] && oldMatrix[newColIdx][oldItemIdx]) {
            newMatrix[newLaneIdx].push(oldMatrix[newColIdx][oldItemIdx]);
          } else {
            newMatrix[newLaneIdx].push(this.#getRandomDataset());
          }
        }
      }

      while (newMatrix[newLaneIdx].length < itemsPerLane) {
        newMatrix[newLaneIdx].push(this.#getRandomDataset());
      }
    }

    return newMatrix;
  }

  #renderLanes(matrix) {
    const lanes = [];

    matrix.forEach(laneData => {
      const lane = document.createElement('div');
      lane.className = 'lane';

      laneData.forEach(ds => {
        const card = new DatasetCard(ds, {
          showDescription: true,
          showFallbackDescription: true,
          customClasses: [],
        });
        const el = card.getElement();
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        lane.appendChild(el);
      });

      this.#container.appendChild(lane);
      lanes.push(lane);
    });
    return lanes;
  }

  #getRandomDataset() {
    return this.#datasets[Math.floor(Math.random() * this.#datasets.length)];
  }

  async #animateLanes(lanes, signal) {
    const isVertical = this.#direction === 'vertical';
    const contentSize = TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE * 320;
    const viewportSize = isVertical ? window.innerHeight : window.innerWidth;
    const distance = contentSize - viewportSize;

    const baseDuration = 5000;

    const animations = lanes.map((lane, index) => {
      // Random delay for Matrix effect
      const delay = Math.random() * 1000;
      const duration = baseDuration + (Math.random() * 1000);

      // Snap distance to grid to ensure seamless handover
      const snappedDistance = Math.floor(distance / TopPageTilingDatasetsViewController.TILE_SIZE) * TopPageTilingDatasetsViewController.TILE_SIZE;

      const axis = isVertical ? 'Y' : 'X';
      const start = `translate${axis}(0)`;
      const end = `translate${axis}(${-snappedDistance}px)`;

      const keyframes = [
        { transform: start },
        { transform: end }
      ];

      return lane.animate(keyframes, {
        duration: duration,
        delay: delay,
        easing: 'cubic-bezier(0.9, 0, 0.1, 1)',
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
