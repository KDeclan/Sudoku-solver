const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    
    test('Logic handles a valid puzzle string of 81 characters', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.validate(testString);
        assert.isNull(validateResult, 'Puzzle string is valid and should return null')
        done();
    })

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
        let testString = '1@5@@2@84@@63@12@7@2@@5@@@@@9@@1@@@@8@2@3674@3@7@2@@9@47@@@8@@1@@16@@@@926914@37@';
        let validateResult = solver.validate(testString);
        assert.isObject(validateResult, 'Invalid characters in puzzle');
        done();
    })

    test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16';
        let validateResult = solver.validate(testString);
        assert.isObject(validateResult, 'Expected puzzle to be 81 characters long');
        done();
    })

    test('Logic handles a valid row placement', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.checkRowPlacement(testString, 'A', 2, 3);
        assert.isObject(validateResult, 'Expected result is true');
        done();
    })

    test('Logic handles an invalid row placement', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.checkRowPlacement(testString, 'A', 1, 1);
        assert.isObject(validateResult, 'Expected result is false');
        done();
    })

    test('Logic handles a valid column placement', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.checkColPlacement(testString, 'A', 2, 3);
        assert.isObject(validateResult, 'Expected result is true');
        done();
    })

    test('Logic handles an invalid column placement', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.checkColPlacement(testString, 'A', 2, 2);
        assert.isObject(validateResult, 'Expected result is false');
        done();
    })

    test('Logic handles a valid region (3x3 grid) placement', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.checkRegionPlacement(testString, 'A', 2, 3);
        assert.isObject(validateResult, 'Expected result is true');
        done();
    })

    test('Logic handles an invalid region (3x3 grid) placement', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.checkRegionPlacement(testString, 'A', 2, 6);
        assert.isObject(validateResult, 'Expected result is false');
        done();
    })

    test('Valid puzzle strings pass the solver', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let validateResult = solver.solve(testString);
        assert.isObject(validateResult, 'Expected result is an object');
        assert.isString(validateResult.solution, 'Expected result includes a solved string');
        done();
    });

    test('Invalid puzzle strings fail the solver', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16';
        let validateResult = solver.solve(testString);
        assert.isObject(validateResult, 'Expected result is false, the puzzle cant be solved');
        done();
    })

    test('Solver returns the expected solution for an incomplete puzzle', function(done) {
        let testString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        let expectedSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        let validateResult = solver.solve(testString);
        assert.equal(validateResult.solution, expectedSolution, 'Solver should return the expected solution');
        done();
    });
});
