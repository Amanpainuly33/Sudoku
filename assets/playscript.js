let sudokuGrid = [];
let userGrid = [];
let selectedCell = null;

document.addEventListener("DOMContentLoaded", () => {
    generateRandomSudoku();
    document.getElementById("refresh-button").addEventListener("click", generateRandomSudoku);
});

function generateRandomSudoku() {
    sudokuGrid = generateSudoku(); // Generate a new random puzzle
    userGrid = JSON.parse(JSON.stringify(sudokuGrid)); // Reset user grid to initial puzzle state

    const board = document.getElementById("sudoku-board");
    board.innerHTML = ''; // Clear any existing cells

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("input");
            cell.setAttribute("type", "text");
            cell.setAttribute("maxlength", "1");
            cell.classList.add("cell");

            cell.addEventListener("click", () => selectCell(cell));
            cell.addEventListener("input", () => updateUserGrid(row, col, cell));

            if (sudokuGrid[row][col] !== 0) {
                cell.value = sudokuGrid[row][col];
                cell.setAttribute("readonly", "true");
                cell.classList.add("cell-initial");
            }

            board.appendChild(cell);
        }
    }
}

function generateSudoku() {
    const solution = createSolution();
    const puzzle = removeRandomCells(solution, 20); // Adjust the number of removed cells for difficulty
    return puzzle;
}

function createSolution() {
    const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    solve(emptyBoard);
    return emptyBoard;
}

function removeRandomCells(board, emptyCellsCount) {
    const puzzle = JSON.parse(JSON.stringify(board));
    for (let i = 0; i < emptyCellsCount; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (puzzle[row][col] === 0);
        puzzle[row][col] = 0;
    }
    return puzzle;
}

function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove("selected");
    }
    selectedCell = cell;
    cell.classList.add("selected");
}


function updateUserGrid(row, col, cell) {
    const value = parseInt(cell.value);
    if (value >= 1 && value <= 9) {
        userGrid[row][col] = value; // Allow user input without validation
        cell.classList.add("user-input");
    } else {
        userGrid[row][col] = 0; // Clear value in userGrid for invalid input
    }
}


function isValidEntry(row, col, value) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (userGrid[row][i] === value || userGrid[i][col] === value) {
            return false;
        }
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (userGrid[startRow + i][startCol + j] === value) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku() {
    const solvedBoard = JSON.parse(JSON.stringify(sudokuGrid));
    const isSolvable = solve(solvedBoard); // Generate the solution

    if (!isSolvable) {
        alert("No solution exists!");
        return;
    }

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const userValue = userGrid[row][col];
        const correctValue = solvedBoard[row][col];

        if (cell.hasAttribute("readonly")) {
            // Initially filled cells remain green
            cell.classList.remove("incorrect", "unfilled");
            cell.classList.add("nocolor");
        } else if (userValue === correctValue) {
            // Correct user entry
            cell.classList.remove("incorrect", "unfilled");
            cell.classList.add("correct");
        } else if (userValue === 0) {
            // Unattempted cell
            cell.classList.remove("correct", "incorrect");
            cell.classList.add("unfilled");

            // Fill unattempted cells with the correct value
            cell.value = correctValue;
        } else {
            // Incorrect user entry
            cell.classList.remove("correct", "unfilled");
            cell.classList.add("incorrect");

            // Show the correct value in the corner
            if (!cell.querySelector(".correct-value")) {
                const correctValueSpan = document.createElement("span");
                correctValueSpan.classList.add("correct-value");
                correctValueSpan.textContent = correctValue;
                cell.appendChild(correctValueSpan);
            }

            // Update the cell to show the correct value
            cell.value = correctValue;
        }
    });
}


function setBoardValues(board) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;

        if (board[row][col] !== 0 && !cell.hasAttribute("readonly")) {
            cell.value = board[row][col];
            cell.classList.add("solution");
        }
    });
}

function solve(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solve(board)) {
                            return true;
                        } else {
                            board[row][col] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num || 
            board[3 * Math.floor(row / 3) + Math.floor(x / 3)]
                 [3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function clearBoard() {
    const inputs = document.querySelectorAll(".cell");
    inputs.forEach((input, index) => {
        input.value = "";
        input.classList.remove("user-input", "solution");
        const row = Math.floor(index / 9);
        const col = index % 9;
        if (sudokuGrid[row][col] !== 0) {
            input.value = sudokuGrid[row][col];
            input.setAttribute("readonly", "true");
        }
    });
    userGrid = JSON.parse(JSON.stringify(sudokuGrid)); // Reset user grid
}
