let selectedCell = null;

document.addEventListener("DOMContentLoaded", createBoard);
function createBoard() {
    const board = document.getElementById("sudoku-board");
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("input");
        cell.setAttribute("type", "text");
        cell.setAttribute("maxlength", "1");
        cell.classList.add("cell");

        cell.addEventListener("click", () => selectCell(cell));

        cell.addEventListener("input", () => {
            const value = cell.value;
            if (value && isValidEntry(cell, value)) {
                cell.dataset.initial = "true";
                cell.classList.add("user-input");
            } else {
                cell.value = "";  // Clear the invalid input
                alert("Invalid entry! Duplicate number in row, column, or 3x3 grid.");
            }
        });

        board.appendChild(cell);
    }
}

function isValidEntry(cell, value) {
    const board = document.getElementById("sudoku-board");
    const cells = Array.from(board.children);
    const index = cells.indexOf(cell);
    const row = Math.floor(index / 9);
    const col = index % 9;

    // Check row
    for (let i = row * 9; i < row * 9 + 9; i++) {
        if (cells[i].value === value && cells[i] !== cell) {
            return false;
        }
    }

    // Check column
    for (let i = col; i < 81; i += 9) {
        if (cells[i].value === value && cells[i] !== cell) {
            return false;
        }
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cellIndex = (startRow + i) * 9 + (startCol + j);
            if (cells[cellIndex].value === value && cells[cellIndex] !== cell) {
                return false;
            }
        }
    }

    return true;
}



function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove("selected");
    }
    selectedCell = cell;
    cell.classList.add("selected");
}

function setNumber(number) {
    if (selectedCell) {
        selectedCell.value = number;
        selectedCell.dataset.initial = "true";  // Mark as user input
        selectedCell.classList.add("user-input");
    }
}

function getBoardValues() {
    const inputs = document.querySelectorAll("#sudoku-board input");
    const values = Array.from(inputs).map(input => parseInt(input.value) || 0);
    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push(values.slice(i * 9, i * 9 + 9));
    }
    return board;
}

function setBoardValues(board) {
    const inputs = document.querySelectorAll("#sudoku-board input");
    inputs.forEach((input, i) => {
        const row = Math.floor(i / 9);
        const col = i % 9;
        
        if (!input.dataset.initial) { // Only change cells that weren't initially filled by the user
            input.value = board[row][col] || '';
            input.classList.remove("user-input"); // Remove color from solution cells
        } else {
            input.classList.add("user-input"); // Ensure user-filled cells keep their color
        }
    });
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
function isBoardValid() {
    const board = getBoardValues();
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = board[row][col];
            if (num !== 0) {
                board[row][col] = 0; // Temporarily clear the cell
                if (!isValid(board, row, col, num)) {
                    return false; // Invalid configuration
                }
                board[row][col] = num; // Restore the number
            }
        }
    }
    return true; // All cells are valid
}
function solveSudoku() {
    if (!isBoardValid()) {
        alert("Invalid board configuration! Please fix errors before solving.");
        return;
    }
    const board = getBoardValues();
    if (solve(board)) {
        setBoardValues(board);
        // alert("Sudoku Solved!");
    } else {
        alert("No solution exists!");
    }
}

function clearBoard() {
    const inputs = document.querySelectorAll("#sudoku-board input");
    inputs.forEach(input => {
        input.value = "";
        input.classList.remove("user-input");
        delete input.dataset.initial;
    });
    selectedCell = null;
}
function clearCell() {
    if (selectedCell) {
        selectedCell.value = "";  // Clear the cell's current value
        selectedCell.classList.remove("user-input");  // Optionally remove user-input styling
        delete selectedCell.dataset.initial;  // Remove any data attribute if needed
    } else {
        alert("No cell selected to clear.");
    }
}
