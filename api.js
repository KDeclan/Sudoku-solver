'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validationError = solver.validate(puzzle);
    if (validationError) {
      return res.json(validationError);
    }

    const row = coordinate.charAt(0);
    const column = parseInt(coordinate.charAt(1));

    if (row < 'A' || row > 'I' || isNaN(column) || column < 1 || column > 9) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const validRow = solver.checkRowPlacement(puzzle, row, column, value);
    const validColumn = solver.checkColPlacement(puzzle, row, column, value);
    const validRegion = solver.checkRegionPlacement(puzzle, row, column, value);

    const conflicts = [];
    if (!validRow.valid) conflicts.push('row');
    if (!validColumn.valid) conflicts.push('column');
    if (!validRegion.valid) conflicts.push('region');

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, conflict: conflicts });
    }
  });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validationError = solver.validate(puzzle);
      if (validationError) {
        return res.json(validationError);
      }

      const solution = solver.solve(puzzle);
      if (solution.error) {
        return res.json(solution);
      } else {
        return res.json({ solution: solution.solution });
      }
    });
};
