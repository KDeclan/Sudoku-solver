class SudokuSolver {

  validatePlacement(row, column, value) {
    const valRegex = /^[1-9.]$/;
    
    if (!valRegex.test(value)) {
      return { error: "Invalid value" };
    }

    if (!row || !column || !value) {
      return { error: "Required field(s) missing" };
    }

    return null;
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    
    const validCharsRegex = /^[1-9.]+$/;
    
    if (!validCharsRegex.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }

    return null;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const validationError = this.validatePlacement(row, column, value);
    if (validationError) return validationError;
  
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const rowStart = rowIndex * 9;
    const rowString = puzzleString.slice(rowStart, rowStart + 9);
  
    if (rowString[column - 1] === value) {
      return { valid: true };
    }
  
    if (rowString.includes(value)) {
      return { valid: false, conflict: 'row' };
    }
    return { valid: true };
  }
  
  checkColPlacement(puzzleString, row, column, value) {
    const validationError = this.validatePlacement(row, column, value);
    if (validationError) return validationError;
  
    const columnIndex = column - 1;
    let columnString = "";
    for (let i = 0; i < 9; i++) {
      columnString += puzzleString[columnIndex + i * 9];
    }
  
    if (columnString[row.charCodeAt(0) - 'A'.charCodeAt(0)] === value) {
      return { valid: true };
    }
  
    if (columnString.includes(value)) {
      return { valid: false, conflict: 'column' };
    }
    return { valid: true };
  }
  
  checkRegionPlacement(puzzleString, row, column, value) {
    const validationError = this.validatePlacement(row, column, value);
    if (validationError) return validationError;
  
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const columnIndex = column - 1;
  
    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(columnIndex / 3) * 3;
  
    let regionValues = "";
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        regionValues += puzzleString[(regionRowStart + r) * 9 + (regionColStart + c)];
      }
    }
  
    const regionIndex = (rowIndex % 3) * 3 + (columnIndex % 3);
    
    if (regionValues[regionIndex] === value) {
      return { valid: true };
    }
  
    if (regionValues.includes(value)) {
      return { valid: false, conflict: 'region' };
    }
    return { valid: true };
  }
  

  isValidPuzzle(puzzleString) {
    for (let i = 0; i < 9; i++) {
      const row = puzzleString.slice(i * 9, (i + 1) * 9);
      const col = Array.from({ length: 9 }, (_, j) => puzzleString[i + j * 9]).join('');
      const region = this.getRegion(puzzleString, Math.floor(i / 3) * 3, (i % 3) * 3);

      if (this.hasDuplicate(row) || this.hasDuplicate(col) || this.hasDuplicate(region)) {
        return false;
      }
    }
    return true;
  }

  hasDuplicate(section) {
    const nums = section.replace(/\./g, '').split('');
    return new Set(nums).size !== nums.length;
  }

  getRegion(puzzleString, rowStart, colStart) {
    let region = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        region += puzzleString[(rowStart + r) * 9 + (colStart + c)];
      }
    }
    return region;
  }

  solve(puzzleString) {
    const validationError = this.validate(puzzleString);
    if (validationError) return validationError;

    if (!this.isValidPuzzle(puzzleString)) {
      return { error: 'Puzzle cannot be solved' };
    }

    const grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i * 9, (i + 1) * 9).split(''));
    }

    const isSolved = this.solveSudoku(grid);

    if (isSolved) {
      const solvedString = grid.flat().join('');
      return { solution: solvedString };
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }

  solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            const value = num.toString();

            if (this.checkRowPlacement(grid.flat().join(''), String.fromCharCode('A'.charCodeAt(0) + row), col + 1, value).valid &&
                this.checkColPlacement(grid.flat().join(''), String.fromCharCode('A'.charCodeAt(0) + row), col + 1, value).valid &&
                this.checkRegionPlacement(grid.flat().join(''), String.fromCharCode('A'.charCodeAt(0) + row), col + 1, value).valid) {

              grid[row][col] = value;

              if (this.solveSudoku(grid)) {
                return true;
              }

              grid[row][col] = '.';  // Backtrack
            }
          }
          return false;  // No valid number found, puzzle is unsolvable
        }
      }
    }
    return true;  // Puzzle is solved
  }
}

module.exports = SudokuSolver;
