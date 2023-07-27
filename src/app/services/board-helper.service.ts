import { Injectable } from '@angular/core'

@Injectable()
export class BoardHelperService {

    generateRandomStateFromSize(size: number, solvedState: number[]) {

        let state = this.shuffleArray(this.generateArray(size));
        while (!this.isNPuzzleSolvable(state) || this.checkIfSolved(state, solvedState)) {
            state = this.shuffleArray(this.generateArray(size));
        }
        return state

    }

    generateDefaultSolutionStateFromSize(size: number) {
        let arr = this.generateArray(size);
        arr.shift();
        arr.push(0);
        return arr
    }

    shuffleArray(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    pickRandomFromArray(array: number[]) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    generateArray(size: number) {
        return Array.from({ length: size }, (_, index) => index);
    }

    checkIfSolved(puzzleState: number[], solvedState: number[]) {
        let x = puzzleState.join('');
        let y = solvedState.join('');
        return x == y;
    }

    isNPuzzleSolvable(puzzle_array: number[]) {
        const n = puzzle_array.length;
        let flatArray = puzzle_array // Flatten the 2D array into a 1D array
        let inversionCount = 0;
        let blankTileRow = 0;

        // Calculate the inversion count and find the row number of the blank tile
        for (let i = 0; i < n * n - 1; i++) {
            if (flatArray[i] === 0) {
                blankTileRow = Math.floor(i / n) + 1;
                continue;
            }
            for (let j = i + 1; j < n * n; j++) {
                if (flatArray[j] !== 0 && flatArray[i] > flatArray[j]) {
                    inversionCount++;
                }
            }
        }

        // Check if the puzzle is solvable based on the inversion count and blank tile row
        if (n % 2 === 1) {
            // For odd-sized puzzle
            return inversionCount % 2 === 0;
        } else {
            // For even-sized puzzle
            if (blankTileRow % 2 === 0) {
                return inversionCount % 2 !== 0;
            } else {
                return inversionCount % 2 === 0;
            }
        }
    }

    validatePuzzleInput(puzzle_array: number[]) {
        let l = puzzle_array.length;

        if (l < 2 || Math.sqrt(l) * Math.sqrt(l) != l) {
            return false;
        }

        let s_puzzle = new Set(puzzle_array);
        let s_solution = new Set(this.generateDefaultSolutionStateFromSize(l));

        if ([...s_puzzle].sort().join('') == [...s_solution].sort().join('')) {
            return true;
        } else {
            return false;
        }
    }


}