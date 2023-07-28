import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { BoardHelperService } from 'src/app/services/board-helper.service';
import { DIRECTIONS_MAP, Heuristic } from 'src/app/constants/solverConstants';

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

    solutionConfig: solutionConfig = {
        showSolvedBoard: false,
        displayPuzzle: false,
        puzzleSize: 9,
        puzzleState: [],
        solutionState: [],
        mode: 'Run',
        path: []
    }

    constructor(private boardHelperService: BoardHelperService,
        private ref: ChangeDetectorRef) {

    }

    solverAlgorithms: any = {
        '1': 'A* with Misplaced Tile Distance',
        '2': 'A* with Manhattan Distance',
        '3': 'Uniform Cost Search',
    }
    solverAlgorithmsToEnum: any = {
        '1': Heuristic.MISPLACED,
        '2': Heuristic.MANHATTAN,
        '3': Heuristic.UNIFORM,
    }

    errorConfig = {
        mismatchedSize: false,
        parityError: false,
        noSolutionFound: false,
    }

    totalNodes = 0;
    maxQueueSize = 0;
    path: string = "";
    depth = 0;
    showSolverLoader = false;
    solutionFound = false;
    solutionNotFound = false;

    ngOnInit(): void {
        this.inputConfig.enteredValue = "1 2 3 4 0 5 6 7 8";
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

        this.errorConfig.parityError = false;
        this.showSolverLoader = true;
        this.solutionFound = false;
        this.solutionNotFound = false;
        this.solutionConfig.showSolvedBoard = false;

        this.generateInitialPuzzle();
        this.generateGoalPuzzle();
        this.ref.detectChanges();

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
            this.showSolverLoader = false;
            this.solutionFound = false;
            this.solutionNotFound = false;
            this.solutionConfig.showSolvedBoard = false;
            return;
        }

        this.ref.detectChanges();
        setTimeout(() => {

            let [finalNode, maxQueueSize, totalNodes]: any = this.boardHelperService.solveNPuzzle(this.inputConfig.puzzleState, this.goalConfig.puzzleState, this.solverAlgorithmsToEnum[value]);

            if (finalNode == undefined) {
                this.solutionNotFound = true;
            } else {
                this.solutionFound = true;
            }

            this.totalNodes = totalNodes;
            this.maxQueueSize = maxQueueSize;
            this.path = finalNode.path.map((elem: string) => DIRECTIONS_MAP[elem]).join('--> ');
            this.depth = finalNode.depth;
            this.showSolverLoader = false;
            this.solutionConfig = {
                displayPuzzle: true,
                showSolvedBoard: true,
                puzzleSize: finalNode.state_length,
                puzzleState: JSON.parse(JSON.stringify(this.inputConfig.puzzleState)),
                solutionState: JSON.parse(JSON.stringify(this.goalConfig.puzzleState)),
                mode: 'Run',
                path: finalNode.path
            }
            this.ref.detectChanges();
            document.querySelector('.solved-puzzle-container')?.scrollIntoView({ behavior: 'smooth' });
        })

    }


}

interface stateConfig {
    enteredValue: string,
    displayPuzzle: boolean,
    puzzleSize: number,
    puzzleState: number[],
    solutionState: number[],
    mode: 'Play' | 'Solve' | 'Run',
    inputError: boolean
}

interface solutionConfig {
    showSolvedBoard: boolean,
    displayPuzzle: boolean,
    puzzleSize: number,
    puzzleState: number[],
    solutionState: number[],
    mode: 'Play' | 'Solve' | 'Run',
    path: string[]
}
