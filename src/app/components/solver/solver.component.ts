import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { BoardHelperService } from 'src/app/services/board-helper.service';

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

    ngOnInit(): void {

    }

    generateInitialPuzzle() {

        this.inputConfig.displayPuzzle = false;
        this.ref.detectChanges()

        // read input
        let state: any = this.inputConfig.enteredValue.trim().split(' ');
        state = state.filter((elem: string) => elem >= '0' && elem <= '9')
        state.map((elem: string) => +elem);

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
        state.map((elem: string) => +elem);

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
