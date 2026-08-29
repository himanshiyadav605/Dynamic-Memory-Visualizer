// ============================================================
// DYNAMIC MEMORY MANAGEMENT VISUALIZER
// FIFO + LRU PAGE REPLACEMENT
// ============================================================


// ------------------------------------------------------------
// APPLICATION STATE
// ------------------------------------------------------------

let selectedAlgo = "FIFO";

let allResults = [];
let allPages = [];

let nFrames = 3;

let currentStep = 0;

let playInterval = null;


// ------------------------------------------------------------
// DOM ELEMENTS
// ------------------------------------------------------------

const framesInput = document.getElementById("frames-input");
const pagesInput = document.getElementById("pages-input");

const runBtn = document.getElementById("run-btn");
const compareBtn = document.getElementById("compare-btn");
const resetBtn = document.getElementById("reset-btn");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const playBtn = document.getElementById("play-btn");

const stepCounter = document.getElementById("step-counter");

const vizOutput = document.getElementById("viz-output");

const currentPage = document.getElementById("current-page");

const errorMsg = document.getElementById("error-msg");

const speedSlider = document.getElementById("speed-slider");

const comparisonWrapper =
    document.getElementById("comparison-wrapper");


// ------------------------------------------------------------
// ALGORITHM TOGGLE
// ------------------------------------------------------------

document.querySelectorAll(".algo-btn").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".algo-btn")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedAlgo = button.dataset.algo;

        comparisonWrapper.hidden = true;

    });

});


// ------------------------------------------------------------
// INPUT VALIDATION
// ------------------------------------------------------------

function getInputs() {

    errorMsg.style.display = "none";

    const frameCount =
        Number.parseInt(framesInput.value, 10);

    if (
        Number.isNaN(frameCount) ||
        frameCount < 1 ||
        frameCount > 10
    ) {

        showError(
            "ERROR: Frames must be between 1 and 10."
        );

        return null;
    }


    const rawPages = pagesInput.value.trim();

    if (!rawPages) {

        showError(
            "ERROR: Page reference string cannot be empty."
        );

        return null;
    }


    const tokens = rawPages
        .split(",")
        .map(value => value.trim());


    if (
        tokens.some(
            token =>
                token === "" ||
                !/^\d+$/.test(token)
        )
    ) {

        showError(
            "ERROR: Use comma-separated non-negative integers."
        );

        return null;
    }


    const pages = tokens.map(Number);


    if (pages.length === 0) {

        showError(
            "ERROR: Invalid page reference string."
        );

        return null;
    }


    return {
        n: frameCount,
        pages
    };

}


// ------------------------------------------------------------
// ERROR MESSAGE
// ------------------------------------------------------------

function showError(message) {

    errorMsg.textContent = message;
    errorMsg.style.display = "block";

}


// ------------------------------------------------------------
// FIFO ALGORITHM
// ------------------------------------------------------------

function runFIFO(pages, frameCount) {

    const frames = [];

    const queue = [];

    const results = [];


    pages.forEach(page => {

        let fault = false;

        if (frames.includes(page)) {

            fault = false;

        } else {

            fault = true;


            if (frames.length < frameCount) {

                frames.push(page);

            } else {

                const pageToReplace = queue.shift();

                const index =
                    frames.indexOf(pageToReplace);

                frames[index] = page;
            }


            queue.push(page);

        }


        results.push({

            page,

            fault,

            snapshot: [...frames],

            algorithm: "FIFO"

        });

    });


    return results;

}


// ------------------------------------------------------------
// LRU ALGORITHM
// ------------------------------------------------------------

function runLRU(pages, frameCount) {

    const frames = [];

    const recent = [];

    const results = [];


    pages.forEach(page => {

        let fault = false;


        if (frames.includes(page)) {

            fault = false;

            const index =
                recent.indexOf(page);

            if (index !== -1) {

                recent.splice(index, 1);

            }

            recent.push(page);

        } else {

            fault = true;


            if (frames.length < frameCount) {

                frames.push(page);

            } else {

                const leastRecentlyUsed =
                    recent.shift();

                const index =
                    frames.indexOf(leastRecentlyUsed);

                frames[index] = page;

            }


            recent.push(page);

        }


        results.push({

            page,

            fault,

            snapshot: [...frames],

            algorithm: "LRU"

        });

    });


    return results;

}


// ------------------------------------------------------------
// CALCULATE STATISTICS
// ------------------------------------------------------------

function calculateStats(results) {

    const faults =
        results.filter(result => result.fault).length;

    const hits =
        results.length - faults;

    const faultRate =
        results.length === 0
            ? 0
            : (faults / results.length) * 100;


    return {

        hits,

        faults,

        faultRate

    };

}


// ------------------------------------------------------------
// UPDATE STATISTICS
// ------------------------------------------------------------

function updateStats(results, steps) {

    const visibleResults =
        results.slice(0, steps);


    const stats =
        calculateStats(visibleResults);


    document.getElementById("val-hits").textContent =
        stats.hits;

    document.getElementById("val-faults").textContent =
        stats.faults;

    document.getElementById("val-rate").textContent =
        `${stats.faultRate.toFixed(1)}%`;

}


// ------------------------------------------------------------
// BUILD TABLE
// ------------------------------------------------------------

function buildTable(pages, frameCount) {

    let html = "<table>";

    html += "<thead>";

    html += "<tr>";

    html += "<th>FRAME</th>";


    pages.forEach((page, index) => {

        html += `
            <th>
                <div class="reference-header">
                    <span>${page}</span>
                    <small>STEP ${index + 1}</small>
                </div>
            </th>
        `;

    });


    html += "</tr>";

    html += "</thead>";

    html += "<tbody>";


    for (let frame = 0; frame < frameCount; frame++) {

        html += `
            <tr>
                <td class="frame-label">
                    F${frame + 1}
                </td>
        `;


        pages.forEach((_, step) => {

            html += `
                <td
                    class="memory-cell"
                    id="frame-${frame}-step-${step}"
                >
                    —
                </td>
            `;

        });


        html += "</tr>";

    }


    html += "</tbody>";

    html += "</table>";


    return html;

}


// ------------------------------------------------------------
// RENDER CURRENT STEP
// ------------------------------------------------------------

function renderStep(step) {

    // Clear all cells first
    document
        .querySelectorAll(".memory-cell")
        .forEach(cell => {

            cell.textContent = "—";

            cell.className = "memory-cell";

        });


    // Render all steps up to current step
    for (let index = 0; index < step; index++) {

        const result = allResults[index];


        result.snapshot.forEach((page, frameIndex) => {

            const cell =
                document.getElementById(
                    `frame-${frameIndex}-step-${index}`
                );


            if (!cell) return;


            cell.textContent = page;

            cell.classList.add(
                result.fault
                    ? "fault-cell"
                    : "hit-cell"
            );


            if (index === step - 1) {

                cell.classList.add("current-cell");

            }

        });


        // Fill empty frames
        for (
            let frameIndex = result.snapshot.length;
            frameIndex < nFrames;
            frameIndex++
        ) {

            const cell =
                document.getElementById(
                    `frame-${frameIndex}-step-${index}`
                );


            if (cell) {

                cell.textContent = "—";

            }

        }

    }


    updateStats(allResults, step);


    stepCounter.textContent =
        `STEP ${step} / ${allResults.length}`;


    if (step === 0) {

        currentPage.textContent = "Ready";

    } else {

        const result =
            allResults[step - 1];

        currentPage.textContent =
            `PAGE ${result.page} — ${
                result.fault
                    ? "PAGE FAULT"
                    : "PAGE HIT"
            }`;

        currentPage.className =
            result.fault
                ? "current-page fault-text"
                : "current-page hit-text";

    }


    prevBtn.disabled =
        step === 0;

    nextBtn.disabled =
        step >= allResults.length;

    playBtn.disabled =
        allResults.length === 0;


    if (step >= allResults.length) {

        playBtn.textContent = "↻ REPLAY";

    } else {

        playBtn.textContent = "▶ PLAY";

    }

}


// ------------------------------------------------------------
// RUN SIMULATION
// ------------------------------------------------------------

runBtn.addEventListener("click", () => {

    const input =
        getInputs();

    if (!input) return;


    stopPlay();


    nFrames = input.n;

    allPages = input.pages;


    allResults =
        selectedAlgo === "FIFO"
            ? runFIFO(allPages, nFrames)
            : runLRU(allPages, nFrames);


    currentStep = 0;


    vizOutput.innerHTML =
        buildTable(allPages, nFrames);


    comparisonWrapper.hidden = true;


    renderStep(0);

});


// ------------------------------------------------------------
// PREVIOUS STEP
// ------------------------------------------------------------

prevBtn.addEventListener("click", () => {

    if (currentStep <= 0) return;

    currentStep--;

    renderStep(currentStep);

});


// ------------------------------------------------------------
// NEXT STEP
// ------------------------------------------------------------

nextBtn.addEventListener("click", () => {

    if (currentStep >= allResults.length) return;

    currentStep++;

    renderStep(currentStep);

});


// ------------------------------------------------------------
// PLAY / PAUSE
// ------------------------------------------------------------

playBtn.addEventListener("click", () => {

    if (allResults.length === 0) return;


    if (currentStep >= allResults.length) {

        currentStep = 0;

        renderStep(0);

    }


    if (playInterval) {

        stopPlay();

        return;

    }


    playBtn.textContent = "⏸ PAUSE";


    playInterval = setInterval(() => {

        if (currentStep >= allResults.length) {

            stopPlay();

            return;

        }


        currentStep++;

        renderStep(currentStep);

    }, Number(speedSlider.value));

});


// ------------------------------------------------------------
// STOP PLAYBACK
// ------------------------------------------------------------

function stopPlay() {

    if (playInterval) {

        clearInterval(playInterval);

        playInterval = null;

    }


    if (allResults.length) {

        playBtn.textContent =
            currentStep >= allResults.length
                ? "↻ REPLAY"
                : "▶ PLAY";

    }

}


// ------------------------------------------------------------
// COMPARE FIFO VS LRU
// ------------------------------------------------------------

compareBtn.addEventListener("click", () => {

    const input =
        getInputs();

    if (!input) return;


    stopPlay();


    const fifoResults =
        runFIFO(
            input.pages,
            input.n
        );


    const lruResults =
        runLRU(
            input.pages,
            input.n
        );


    const fifoStats =
        calculateStats(fifoResults);


    const lruStats =
        calculateStats(lruResults);


    document.getElementById("fifo-faults")
        .textContent =
        fifoStats.faults;


    document.getElementById("fifo-hits")
        .textContent =
        fifoStats.hits;


    document.getElementById("fifo-rate")
        .textContent =
        `${fifoStats.faultRate.toFixed(1)}%`;


    document.getElementById("lru-faults")
        .textContent =
        lruStats.faults;


    document.getElementById("lru-hits")
        .textContent =
        lruStats.hits;


    document.getElementById("lru-rate")
        .textContent =
        `${lruStats.faultRate.toFixed(1)}%`;


    const result =
        document.getElementById(
            "comparison-result"
        );


    if (fifoStats.faults < lruStats.faults) {

        result.textContent =
            "FIFO produced fewer page faults for this reference string.";

    } else if (lruStats.faults < fifoStats.faults) {

        result.textContent =
            "LRU produced fewer page faults for this reference string.";

    } else {

        result.textContent =
            "Both algorithms produced the same number of page faults.";

    }


    comparisonWrapper.hidden = false;

});


// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------

resetBtn.addEventListener("click", () => {

    stopPlay();


    allResults = [];

    allPages = [];

    currentStep = 0;


    vizOutput.innerHTML = `
        <div class="placeholder">

            <div class="placeholder-icon">
                ⬡
            </div>

            <p>
                Configure your parameters on the left
                <br>
                and click RUN SIMULATION to begin.
            </p>

        </div>
    `;


    currentPage.textContent =
        "Ready";

    currentPage.className =
        "current-page";


    document.getElementById("val-hits")
        .textContent = "—";

    document.getElementById("val-faults")
        .textContent = "—";

    document.getElementById("val-rate")
        .textContent = "—";


    stepCounter.textContent =
        "STEP 0 / 0";


    prevBtn.disabled = true;

    nextBtn.disabled = true;

    playBtn.disabled = true;

    playBtn.textContent =
        "▶ PLAY";


    comparisonWrapper.hidden = true;


    errorMsg.style.display =
        "none";

});


// ------------------------------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------------------------------

document.addEventListener("keydown", event => {

    if (event.key === "ArrowRight") {

        nextBtn.click();

    }


    if (event.key === "ArrowLeft") {

        prevBtn.click();

    }

});
