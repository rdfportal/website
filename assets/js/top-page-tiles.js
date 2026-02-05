/**
 * Top page dataset tiles - データセットタイル表示
 */

class TopPageTilingDatasetsViewController {
  static TILE_SIZE = 320; // Expanded to include margin
  static CONTAINER_SELECTOR = "#TopPageTilingDatasetsView > .container";
  static DATASET_COUNT_PER_LANE = 36;
  static SCROLL_BUFFER_TILES = 6;
  static DRIFT_SPEED = 0.01; // 10px/s = 0.01px/ms

  #container;
  #datasets = [];
  #datasetLoader;
  #direction = 'vertical'; // 'vertical' | 'horizontal'
  #abortController = null;
  #currentLaneDatasets = []; // Store current grid data for state handover

  // Custom scrolling state
  #startTime = null;
  #lastGridShift = { x: 0, y: 0 };

  // Mouse Interaction State
  #isMouseHovering = false;
  #resumeTime = 0; // Timestamp when we can resume fast scroll

  constructor() {
    this.#container = document.querySelector(
      TopPageTilingDatasetsViewController.CONTAINER_SELECTOR
    );
    this.#datasetLoader = DatasetsManager.getInstance();

    // Initialize start time (will be reset on first init if needed, or now)
    this.#startTime = performance.now();

    if (this.#container) {
      // Initialize loop state with default "Active" assumption for first run
      this.#init();
      this.#setupMouseInteractions();
    }
  }

  #setupMouseInteractions() {
    document.documentElement.addEventListener('mouseenter', () => {
      this.#isMouseHovering = true;
    });

    document.documentElement.addEventListener('mouseleave', () => {
      this.#isMouseHovering = false;
      // Set resume time to 2 seconds from now
      this.#resumeTime = Date.now() + 2000;
    });
  }

  async #init() {
    try {
      const data = await this.#datasetLoader.getDatasets();
      this.#datasets = data;
      if (this.#datasets.length > 0) {
        // First run: Assume previous "animation" finished normal (random gen acts as such)
        this.#startLoop(true);
      }
    } catch (error) {
      console.error("Data load failed:", error);
    }
  }

  // didAnimatePrevious: true if the previous loop performed the Fast Scroll.
  // If false, it means we were just Drifting (Idle), so visual position matches Index 0.
  async #startLoop(didAnimatePrevious = true) {
    if (this.#abortController) this.#abortController.abort();
    this.#abortController = new AbortController();
    const signal = this.#abortController.signal;

    const oldDirection = this.#direction;
    const oldLaneDatasets = this.#currentLaneDatasets;

    // 1. Toggle Direction (State Only - View update delayed)
    this.#direction = this.#direction === 'vertical' ? 'horizontal' : 'vertical';
    // Logic continues... no innerHTML clearing here

    // 2. Prepare Data (Seamless Transition)
    // Global Drift Calculation
    const now = performance.now();
    const elapsed = now - this.#startTime;
    // Calculate Grid Shift (how many tiles we have moved)
    // Drift is Up-Left (-X, -Y) [Visual: Bottom-Right Scroll]
    // We invert the drift direction by multiplying by -1
    const totalDriftPx = elapsed * TopPageTilingDatasetsViewController.DRIFT_SPEED * -1;

    // Calculate Grid Shift (how many tiles we have moved)
    const gridShiftCount = Math.floor(totalDriftPx / TopPageTilingDatasetsViewController.TILE_SIZE);

    // Calculate Modulo Drift (remainder for visual transform)
    // This will be in range (-320..0]
    const driftMod = totalDriftPx % TopPageTilingDatasetsViewController.TILE_SIZE;

    // Base Visual Offset: 0
    // Since we are moving Up-Left, we don't need a buffer at the Top-Left.
    // The buffer is needed at the Bottom-Right which is covered by extra lanes.
    const baseOffset = 0;

    // Current Global Shift
    const currentGridShift = { x: gridShiftCount, y: gridShiftCount };

    // Delta Shift since last loop (to adjust data lookup)
    const deltaShift = {
      x: currentGridShift.x - this.#lastGridShift.x,
      y: currentGridShift.y - this.#lastGridShift.y
    };

    // Save for next loop
    this.#lastGridShift = currentGridShift;

    // 3. Render Lanes (To Fragment)
    const nextLaneCount = this.#calculateLaneCount();
    let nextDatasetsMatrix = [];

    if (oldLaneDatasets.length > 0) {
      // Transpose logic with Drift Adjustment
      nextDatasetsMatrix = this.#generateTransposedData(oldLaneDatasets, oldDirection, nextLaneCount, deltaShift, didAnimatePrevious);
    } else {
      // First run: Random generation
      nextDatasetsMatrix = this.#generateRandomMatrix(nextLaneCount);
    }

    // Store for next loop
    this.#currentLaneDatasets = nextDatasetsMatrix;

    const fragment = document.createDocumentFragment();
    const lanes = this.#renderLanes(nextDatasetsMatrix, fragment);

    // 4. Batch DOM Update (Atomic Switch)
    this.#container.setAttribute('data-direction', this.#direction);
    this.#container.replaceChildren(fragment);

    // Apply base visual offset to container (reset position)
    // Visual = Mod + BaseOffset (-320..0).
    const startPos = driftMod + baseOffset;
    this.#container.style.transform = `translate(${startPos}px, ${startPos}px)`;

    // 5. Animate Lanes (Conditional)
    if (!signal.aborted) {
      // Start Container Drift Animation
      // It should continue indefinitely until next loop resets it.
      // We animate from current driftMod to driftMod - (MAX_DURATION * SPEED) (Moving further negative)
      // Including the Base Offset (0).
      const maxDuration = 20000; // Enough time for 4s wait + 6.5s animation

      const startPos = driftMod + baseOffset;
      // Note: DRIFT_SPEED is positive magnitude (0.01), so we subtract it for Up-Left movement
      const targetDrift = startPos - (maxDuration * TopPageTilingDatasetsViewController.DRIFT_SPEED);

      const driftKeyframes = [
        { transform: `translate(${startPos}px, ${startPos}px)` },
        { transform: `translate(${targetDrift}px, ${targetDrift}px)` }
      ];

      this.#container.animate(driftKeyframes, {
        duration: maxDuration,
        fill: 'forwards'
      });

      await new Promise(resolve => setTimeout(resolve, 4000)); // Pause 4s
    }
    if (signal.aborted) return;

    // Determine if we should Fast Scroll (Active) or just Drift (Idle)
    // Check if mouse is hovering OR if we are waiting for resume delay
    const shouldPauseFastScroll = this.#isMouseHovering || (Date.now() < this.#resumeTime);

    if (shouldPauseFastScroll) {
      // Idle Mode: Just Drift.
      // Wait for roughly the duration an animation would have taken (e.g. 6s)
      // to maintain the loop rhythm.
      await new Promise(resolve => setTimeout(resolve, 6000));
      if (!signal.aborted) {
        this.#startLoop(false); // Recurse with didAnimate = false
      }
    } else {
      // Active Mode: Fast Scroll.
      this.#animateLanes(lanes, signal).then(() => {
        if (!signal.aborted) {
          this.#startLoop(true); // Recurse with didAnimate = true
        }
      });
    }
  }

  #calculateLaneCount() {
    const isVertical = this.#direction === 'vertical';
    const screenSize = isVertical ? window.innerWidth : window.innerHeight;
    // Add extra lanes to ensure coverage (Base covering + Drift Gap Filling)
    // +4 ensures we have content for the offset (-640px) and the far edge.
    return Math.ceil(screenSize / TopPageTilingDatasetsViewController.TILE_SIZE) + 4;
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

  #generateTransposedData(oldMatrix, oldDirection, nextLaneCount, deltaShift, didAnimatePrevious) {
    // PREVIOUS state context
    const isOldVertical = oldDirection === 'vertical';
    const oldViewportSize = isOldVertical ? window.innerHeight : window.innerWidth;

    let snappedDistance = 0;

    if (didAnimatePrevious) {
      // Original calculation was: distance = contentSize - oldViewportSize
      const contentCount = TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE - TopPageTilingDatasetsViewController.SCROLL_BUFFER_TILES;
      const contentSize = contentCount * TopPageTilingDatasetsViewController.TILE_SIZE;
      const distance = contentSize - oldViewportSize;

      // We snapped the previous animation to this distance:
      snappedDistance = Math.floor(distance / TopPageTilingDatasetsViewController.TILE_SIZE) * TopPageTilingDatasetsViewController.TILE_SIZE;
    } else {
      // If we didn't animate (Idle Mode), the visual position is effectively 0 relative to the lane start
      // (because the tiles didn't move *within* the lane, only the container drifted).
      // So snappedDistance is 0.
      snappedDistance = 0;
    }

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
          // Adjust lookup based on Delta Shift
          // If Previous was Vertical: OldLane=Col(X), OldItem=Idx(Y).
          // If Previous was Horizontal: OldLane=Col(Y), OldItem=Idx(X).

          let targetOldLaneIdx = newColIdx;
          let targetOldItemIdx = oldItemIdx;

          if (isOldVertical) {
            // Old: Lanes are X, Items are Y.
            // Drift is (+X, +Y) mapping to (+Lane, +Item).
            // Since the world shifted by Delta, the data we want (at visual position 0)
            // is essentially "behind" the drift.
            // VisualPosition = GridIndex * TILE + DriftOffset.
            // We want the item that WAS at this visual position.
            // NewGridIndex = 0.
            // OldGridIndex = NewGridIndex - Delta.
            targetOldLaneIdx = newColIdx - deltaShift.x;
            targetOldItemIdx = oldItemIdx - deltaShift.y;
          } else {
            // Old: Lanes are Y, Items are X.
            // Drift is (+X, +Y) mapping to (+Item, +Lane).
            targetOldLaneIdx = newColIdx - deltaShift.y;
            targetOldItemIdx = oldItemIdx - deltaShift.x;
          }

          if (
            targetOldLaneIdx >= 0 && targetOldLaneIdx < oldLaneCount &&
            oldMatrix[targetOldLaneIdx] &&
            oldMatrix[targetOldLaneIdx][Math.floor(targetOldItemIdx)] // Snap item idx
          ) {
            newMatrix[newLaneIdx].push(oldMatrix[targetOldLaneIdx][Math.floor(targetOldItemIdx)]);
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

  #renderLanes(matrix, parentNode) {
    const lanes = [];

    matrix.forEach(laneData => {
      const lane = document.createElement('div');
      lane.className = 'lane';

      laneData.forEach(ds => {
        const card = new DatasetCard(ds, {
          showLink: true,
          linkBaseUrl: ".",
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

      parentNode.appendChild(lane);
      lanes.push(lane);
    });
    return lanes;
  }

  #getRandomDataset() {
    return this.#datasets[Math.floor(Math.random() * this.#datasets.length)];
  }

  async #animateLanes(lanes, signal) {
    const isVertical = this.#direction === 'vertical';
    const contentCount = TopPageTilingDatasetsViewController.DATASET_COUNT_PER_LANE - TopPageTilingDatasetsViewController.SCROLL_BUFFER_TILES;
    const contentSize = contentCount * TopPageTilingDatasetsViewController.TILE_SIZE;
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
