import { Component, OnInit } from '@angular/core'
import { BoardHelperService } from 'src/app/services/board-helper.service';

@Component({
    selector: 'app-solver',
    templateUrl: './solver.component.html',
    styleUrls: ['./solver.component.scss']
})
export class SolverComponent implements OnInit {

    puzzleSize: number = 9;
    puzzleState: number[] = [];
    solutionState: number[] = [];
    mode: string = 'Solve';

    constructor(private boardHelperService: BoardHelperService) {

    }

    ngOnInit(): void {
        this.puzzleSize = 9
        this.puzzleState = this.boardHelperService.generateRandomStateFromSize(this.puzzleSize)
        this.solutionState = this.boardHelperService.generateDefaultSolutionStateFromSize(this.puzzleSize)
        this.mode = 'Solve'
    }


}
