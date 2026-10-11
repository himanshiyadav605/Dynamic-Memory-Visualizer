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

        document.querySelectorAll(".algo-btn").forEach(btn => {
            const isSelected = btn === button;

            btn.classList.toggle("active", isSelected);
            btn.setAttribute("aria-pressed", String(isSelected));
        });

        selectedAlgo = button.dataset.algo;

        // Hide comparison when switching algorithm
        if (comparisonWrapper) {
            comparisonWrapper.hidden = true;
        }

    });

});



// ------------------------------------------------------------
// INPUT VALIDATION
// ------------------------------------------------------------

function getInputs() {

    errorMsg.style.display = "none";

    // Validate frame count
    const frameCount = Number(framesInput.value);

    if (
    !Number.isInteger(frameCount) ||
    frameCount < 1 ||
    frameCount > 10
) {

        showError(
            "ERROR: Frames must be between 1 and 10."
        );

        framesInput.focus();

        return null;
    }


    // Validate page reference string
    const rawPages =
        pagesInput.value.trim();

    if (!rawPages) {

        showError(
            "ERROR: Page reference string cannot be empty."
        );

        pagesInput.focus();

        return null;
    }


    const tokens =
        rawPages
            .split(",")
            .map(value => value.trim());


    // Reject invalid values such as:
    // 7,,1
    // 7,a,1
    // 7,-1,2
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

        pagesInput.focus();

        return null;
    }


    const pages =
        tokens.map(Number);


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
// FIFO PAGE REPLACEMENT
// ------------------------------------------------------------

function runFIFO(pages, frameCount) {

    const frames = [];
    const queue = [];
    const results = [];


    pages.forEach(page => {

        let fault = false;


        // PAGE HIT
        if (frames.includes(page)) {

            fault = false;

        }

        // PAGE FAULT
        else {

            fault = true;


            // Empty frame available
            if (frames.length < frameCount) {

                frames.push(page);

            }

            // Replace oldest page
            else {

                const pageToReplace =
                    queue.shift();

                const index =
                    frames.indexOf(pageToReplace);

                frames[index] = page;

            }


            queue.push(page);

        }


        results.push({

            page,
            fault,

            // Copy current frame state
            snapshot: [...frames],

            algorithm: "FIFO"

        });

    });


    return results;

}


// ------------------------------------------------------------
// LRU PAGE REPLACEMENT
// ------------------------------------------------------------

function runLRU(pages, frameCount) {

    const frames = [];
    const recent = [];
    const results = [];


    pages.forEach(page => {

        let fault = false;


        // PAGE HIT
        if (frames.includes(page)) {

            fault = false;


            // Remove old position
            const index =
                recent.indexOf(page);

            if (index !== -1) {

                recent.splice(index, 1);

            }


            // Mark as most recently used
            recent.push(page);

        }

        // PAGE FAULT
        else {

            fault = true;


            // Empty frame available
            if (frames.length < frameCount) {

                frames.push(page);

            }

            // Replace least recently used page
            else {

                const leastRecentlyUsed =
                    recent.shift();

                const index =
                    frames.indexOf(
                        leastRecentlyUsed
                    );

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
        results.filter(
            result => result.fault
        ).length;


    const hits =
        results.length - faults;


    const faultRate =
        results.length === 0
            ? 0
            : (faults / results.length) * 100;


    const hitRate =
        results.length === 0
            ? 0
            : (hits / results.length) * 100;


    return {

        hits,
        faults,
        faultRate,
        hitRate

    };

}


// ------------------------------------------------------------
// UPDATE MAIN STATISTICS
// ------------------------------------------------------------

function updateStats(results, steps) {

    const visibleResults =
        results.slice(0, steps);


    const stats =
        calculateStats(visibleResults);


    document.getElementById("val-hits")
        .textContent =
        steps === 0
            ? "—"
            : stats.hits;


    document.getElementById("val-faults")
        .textContent =
        steps === 0
            ? "—"
            : stats.faults;


    document.getElementById("val-rate")
        .textContent =
        steps === 0
            ? "—"
            : `${stats.faultRate.toFixed(1)}%`;

}


// ------------------------------------------------------------
// BUILD SIMULATION TABLE
// ------------------------------------------------------------

function buildTable(pages, frameCount) {

    let html = "<table>";

    // TABLE HEADER
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


    // TABLE BODY
    html += "<tbody>";


    for (
        let frame = 0;
        frame < frameCount;
        frame++
    ) {

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
// RENDER CURRENT SIMULATION STEP
// ------------------------------------------------------------

function renderStep(step) {

    // Clear all table cells
    document
        .querySelectorAll(".memory-cell")
        .forEach(cell => {

            cell.textContent = "—";

            cell.className =
                "memory-cell";

        });


    // Render simulation history
    for (
        let index = 0;
        index < step;
        index++
    ) {

        const result =
            allResults[index];


        result.snapshot.forEach(
            (page, frameIndex) => {

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


                // Highlight most recent step
                if (index === step - 1) {

                    cell.classList.add(
                        "current-cell"
                    );

                }

            }
        );


        // Fill unused frames
        for (
            let frameIndex =
                result.snapshot.length;

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


    // Update statistics
    updateStats(
        allResults,
        step
    );


    // Update step counter
    stepCounter.textContent =
        `STEP ${step} / ${allResults.length}`;


    // Update current page information
    if (step === 0) {

        currentPage.textContent =
            "Ready";

        currentPage.className =
            "current-page";

    }

    else {

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


    // Previous button
    prevBtn.disabled =
        step === 0;


    // Next button
    nextBtn.disabled =
        step >= allResults.length;


    // Play button
    playBtn.disabled =
        allResults.length === 0;


    // Button text
    if (
        step >= allResults.length &&
        allResults.length > 0
    ) {

        playBtn.textContent =
            "↻ REPLAY";

    }

    else {

        playBtn.textContent =
            "▶ PLAY";

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


    nFrames =
        input.n;

    allPages =
        input.pages;


    // Run selected algorithm
    allResults =
        selectedAlgo === "FIFO"
            ? runFIFO(
                allPages,
                nFrames
            )
            : runLRU(
                allPages,
                nFrames
            );


    currentStep = 0;


    // Build visualization
    vizOutput.innerHTML =
        buildTable(
            allPages,
            nFrames
        );


    // Hide comparison
    if (comparisonWrapper) {

        comparisonWrapper.hidden =
            true;

    }


    // Render initial state
    renderStep(0);

});


// ------------------------------------------------------------
// PREVIOUS STEP
// ------------------------------------------------------------

prevBtn.addEventListener("click", () => {

    if (currentStep <= 0) return;


    stopPlay();


    currentStep--;


    renderStep(
        currentStep
    );

});


// ------------------------------------------------------------
// NEXT STEP
// ------------------------------------------------------------

nextBtn.addEventListener("click", () => {

    if (
        currentStep >=
        allResults.length
    ) return;


    stopPlay();


    currentStep++;


    renderStep(
        currentStep
    );

});


// ------------------------------------------------------------
// PLAY / PAUSE / REPLAY
// ------------------------------------------------------------

playBtn.addEventListener("click", () => {

    if (allResults.length === 0) {
        return;
    }


    // Replay after reaching the end
    if (
        currentStep >=
        allResults.length
    ) {

        currentStep = 0;

        renderStep(0);

    }


    // Pause
    if (playInterval) {

        stopPlay();

        return;

    }


    playBtn.textContent =
        "⏸ PAUSE";


    playInterval =
        setInterval(() => {

            if (
                currentStep >=
                allResults.length
            ) {

                stopPlay();

                return;

            }


            currentStep++;


            renderStep(
                currentStep
            );


        }, Number(speedSlider.value));

});


// ------------------------------------------------------------
// STOP PLAYBACK
// ------------------------------------------------------------

function stopPlay() {

    if (playInterval) {

        clearInterval(
            playInterval
        );

        playInterval = null;

    }


    if (
        allResults.length > 0
    ) {

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
        calculateStats(
            fifoResults
        );


    const lruStats =
        calculateStats(
            lruResults
        );


    // FIFO statistics
    document.getElementById(
        "fifo-faults"
    ).textContent =
        fifoStats.faults;


    document.getElementById(
        "fifo-hits"
    ).textContent =
        fifoStats.hits;


    document.getElementById(
        "fifo-rate"
    ).textContent =
        `${fifoStats.faultRate.toFixed(1)}%`;


    // LRU statistics
    document.getElementById(
        "lru-faults"
    ).textContent =
        lruStats.faults;


    document.getElementById(
        "lru-hits"
    ).textContent =
        lruStats.hits;


    document.getElementById(
        "lru-rate"
    ).textContent =
        `${lruStats.faultRate.toFixed(1)}%`;


    // Comparison conclusion
    const result =
        document.getElementById(
            "comparison-result"
        );


    if (
        fifoStats.faults <
        lruStats.faults
    ) {

        result.textContent =
            "FIFO produced fewer page faults for this reference string.";

    }

    else if (
        lruStats.faults <
        fifoStats.faults
    ) {

        result.textContent =
            "LRU produced fewer page faults for this reference string.";

    }

    else {

        result.textContent =
            "Both algorithms produced the same number of page faults.";

    }


    // Show comparison panel
    comparisonWrapper.hidden =
        false;

});


// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------

resetBtn.addEventListener("click", () => {

    stopPlay();


    allResults = [];
    allPages = [];

    currentStep = 0;


    // Reset visualization
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


    // Reset current page
    currentPage.textContent =
        "Ready";

    currentPage.className =
        "current-page";


    // Reset statistics
    document.getElementById(
        "val-hits"
    ).textContent = "—";


    document.getElementById(
        "val-faults"
    ).textContent = "—";


    document.getElementById(
        "val-rate"
    ).textContent = "—";


    // Reset controls
    stepCounter.textContent =
        "STEP 0 / 0";


    prevBtn.disabled = true;

    nextBtn.disabled = true;

    playBtn.disabled = true;

    playBtn.textContent =
        "▶ PLAY";


    // Hide comparison
    if (comparisonWrapper) {

        comparisonWrapper.hidden =
            true;

    }


    // Clear errors
    errorMsg.style.display =
        "none";

});


// ------------------------------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------------------------------

document.addEventListener(
    "keydown",
    event => {

        // Don't hijack arrow keys while editing inputs
        const activeElement =
            document.activeElement;


        const isInput =
            activeElement === framesInput ||
            activeElement === pagesInput;


        if (isInput) return;


        // Right arrow → next step
        if (event.key === "ArrowRight") {

            event.preventDefault();

            nextBtn.click();

        }


        // Left arrow → previous step
        if (event.key === "ArrowLeft") {

            event.preventDefault();

            prevBtn.click();

        }


        // Space → play/pause
        if (
            event.code === "Space" &&
            allResults.length > 0
        ) {

            event.preventDefault();

            playBtn.click();

        }

    }
);


// ------------------------------------------------------------
// INITIAL UI STATE
// ------------------------------------------------------------

prevBtn.disabled = true;

nextBtn.disabled = true;

playBtn.disabled = true;

stepCounter.textContent =
    "STEP 0 / 0";
