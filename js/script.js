let lastConfettiThreshold = 0;
let isMuted = false;

document.addEventListener("DOMContentLoaded", function () {
    generateBingoBoard("bingoBoard");
    generatePercentageRow("bingoPercentage");
    generatePlayerBoard("playerBoard");
});

function updateTotalProgress() {
    const totalCells = 75;
    const markedCells = document.querySelectorAll(`.bingo-cell.marked`).length;
    const percentage = Math.round((markedCells / totalCells) * 100);

    const progressBar = document.getElementById("bingoProgressBar");
    progressBar.style.width = percentage + "%";
    progressBar.setAttribute("aria-valuenow", percentage);
    progressBar.textContent = percentage + "%";

    if (percentage >= lastConfettiThreshold + 10) {
        fireConfetti(percentage);
        lastConfettiThreshold += 10;
    }

    if (percentage < lastConfettiThreshold) {
        lastConfettiThreshold = Math.floor(percentage / 10) * 10;
    }
}

function fireConfetti(percentage) {
    const count = 200 + (percentage * 2);
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26 + percentage / 2, startVelocity: 55 + percentage / 3 });
    fire(0.2, { spread: 60 + percentage / 2 });
    fire(0.35, { spread: 100 + percentage / 2, decay: 0.91, scalar: 0.8 + percentage / 100 });
    fire(0.1, { spread: 120 + percentage / 2, startVelocity: 25 + percentage / 3, decay: 0.92, scalar: 1.2 + percentage / 100 });
    fire(0.1, { spread: 120 + percentage / 2, startVelocity: 45 + percentage / 3 });
}

function generateBingoBoard(boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = "";
    const columns = ["B", "I", "N", "G", "O"];

    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < columns.length; col++) {
            const num = row + 1 + col * 15;
            const cell = document.createElement("div");
            cell.classList.add("bingo-cell");
            cell.setAttribute("data-column", col);
            cell.textContent = num;
            cell.addEventListener("click", () => {
                cell.classList.toggle("marked");
                updatePercentage(col);
                updateTotalProgress();
                playSound(num); // 🔊 sonido
            });
            board.appendChild(cell);
        }
    }
}

function generatePlayerBoard(boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");
            cell.classList.add("player-cell");
            cell.addEventListener("click", () => cell.classList.toggle("marked"));
            board.appendChild(cell);
        }
    }
}

function generatePercentageRow(boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const cell = document.createElement("div");
        cell.classList.add("percentage-cell");
        cell.setAttribute("data-column", i);
        cell.textContent = "0%";
        board.appendChild(cell);
    }
}

function updatePercentage(columnIndex) {
    const totalCells = 15;
    const markedCells = document.querySelectorAll(`.bingo-cell.marked[data-column="${columnIndex}"]`).length;
    const percentage = Math.round((markedCells / totalCells) * 100);

    document.querySelector(`.percentage-cell[data-column="${columnIndex}"]`).textContent = percentage + "%";
}

function resetBoard(boardId) {
    document.querySelectorAll(`#${boardId} .bingo-cell, #${boardId} .player-cell`).forEach(cell => {
        cell.classList.remove("marked");
    });

    if (boardId === "bingoBoard") {
        document.querySelectorAll(".percentage-cell").forEach(cell => cell.textContent = "0%");
        lastConfettiThreshold = 0;
        updateTotalProgress();
    }
}

function playSound(number) {
    if (isMuted) return;
    const audio = new Audio(`sound/${number}.mp3`);
    audio.play().catch(error => console.error(`Error al reproducir sonido ${number}.mp3`, error));
}

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById("toggleSound");
    btn.textContent = isMuted ? "🔇" : "🔊";
}
