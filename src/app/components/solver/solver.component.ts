import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { BoardHelperService } from 'src/app/services/board-helper.service';
import { Heuristic } from 'src/app/constants/solverConstants';

@Component({
    selector: 'app-solver',
    templateUrl: './solver.component.html',
    styleUrls: ['./solver.component.scss']
})
export class SolverComponent implements OnInit {



    inputConfig: stateConfig = {
        enteredValue: "",
        displayPuzzle: false,
        puzzleSize: 9,
        puzzleState: [],
        solutionState: [],
        mode: 'Solve',
        inputError: false

    }

    goalConfig: stateConfig = {
        enteredValue: "",
        displayPuzzle: false,
        puzzleSize: 9,
        puzzleState: [],
        solutionState: [],
        mode: 'Solve',
        inputError: false
    }

    constructor(private boardHelperService: BoardHelperService,
        private ref: ChangeDetectorRef) {

    }

    solverAlgorithms: any = {
        '1': 'Uniform Cost Search',
        '2': 'A* with Manhattan Distance',
        '3': 'A* with Misplaced Tile Distance'
    }
    solverAlgorithmsToEnum: any = {
        '1': Heuristic.UNIFORM,
        '2': Heuristic.MANHATTAN,
        '3': Heuristic.MISPLACED,
    }

    errorConfig = {
        mismatchedSize: false,
        parityError: false,
        noSolutionFound: false,
    }

    ngOnInit(): void {
        this.inputConfig.enteredValue = "5 2 1 3 8 4 6 0 7";
        this.goalConfig.enteredValue = "1 2 3 4 5 6 7 8 0";
        this.generateInitialPuzzle();
        this.generateGoalPuzzle();
    }

    generateInitialPuzzle() {

        this.inputConfig.displayPuzzle = false;
        this.ref.detectChanges()

        // read input
        let state: any = this.inputConfig.enteredValue.trim().split(' ');
        state = state.filter((elem: string) => elem >= '0' && elem <= '9')
        state = state.map((elem: string) => +elem);

        // validate and set error if any
        let result = this.boardHelperService.validatePuzzleInput(state);
        this.inputConfig.inputError = !result;
        if (result) {
            this.inputConfig.puzzleSize = state.length;
            this.inputConfig.solutionState = this.boardHelperService.generateDefaultSolutionStateFromSize(this.inputConfig.puzzleSize);
            this.inputConfig.puzzleState = state;
            this.inputConfig.mode = 'Solve';
            this.inputConfig.displayPuzzle = true;

        } else {
            this.inputConfig.displayPuzzle = false;
        }

    }

    generateGoalPuzzle() {
        this.goalConfig.displayPuzzle = false;
        this.ref.detectChanges()

        // read input
        let state: any = this.goalConfig.enteredValue.trim().split(' ');
        state = state.filter((elem: string) => elem >= '0' && elem <= '9')
        state = state.map((elem: string) => +elem);

        // validate and set error if any
        let result = this.boardHelperService.validatePuzzleInput(state);
        this.goalConfig.inputError = !result;
        if (result) {
            this.goalConfig.puzzleSize = state.length;
            this.goalConfig.solutionState = this.boardHelperService.generateDefaultSolutionStateFromSize(this.goalConfig.puzzleSize);
            this.goalConfig.puzzleState = state;
            this.goalConfig.mode = 'Solve';
            this.goalConfig.displayPuzzle = true;

        } else {
            this.goalConfig.displayPuzzle = false;
        }
    }

    solvePuzzle() {

        this.generateInitialPuzzle();
        this.generateGoalPuzzle();

        let dropdown = document.getElementById("solver-algorithm-dropdown") as HTMLSelectElement;
        let value = dropdown.value;

        if (this.inputConfig.puzzleSize != this.goalConfig.puzzleSize) {
            this.errorConfig.mismatchedSize = true;
            return;
        }

        let solutionState = this.goalConfig.puzzleState;
        let defualtGoalState = this.boardHelperService.generateDefaultSolutionStateFromSize(this.goalConfig.puzzleSize);
        let isGoalDefault = this.boardHelperService.checkIfSolved(solutionState, defualtGoalState);

        let isSolvable = isGoalDefault && this.boardHelperService.isNPuzzleSolvable(this.inputConfig.puzzleState);
        if (!isSolvable) {
            this.errorConfig.parityError = true;
            return;
        }

        this.boardHelperService.solveNPuzzle(this.inputConfig.puzzleState, this.goalConfig.puzzleState, this.solverAlgorithmsToEnum[value]);

    }


}

interface stateConfig {
    enteredValue: string,
    displayPuzzle: boolean,
    puzzleSize: number,
    puzzleState: number[],
    solutionState: number[],
    mode: string,
    inputError: boolean
}
