import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardHelperService } from 'src/app/services/board-helper.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {


    @Input()
    puzzleSize: number = 9;

    @Input()
    puzzleState: number[] = [];

    @Input()
    solutionState: number[] = [];

    @Input()
    mode = 'Play'

    @Input()
    displayPuzzle = false

    @Output() solvedEvent = new EventEmitter<boolean>();

    rowSize: number = 3;


    constructor(private boardHelperService: BoardHelperService) {
    }


    ngOnInit(): void {
        this.rowSize = Math.sqrt(this.puzzleSize);
    }


    moveTile(index: number) {

        if (this.mode != 'Play') {
            return;
        }

        let blankIndex = -1;
        let r = Math.floor(index / this.rowSize);
        let c = index % this.rowSize;

        if (c != 0 && this.puzzleState[index - 1] == 0) {
            // check if left is not edge and can move left
            blankIndex = index - 1
        }
        else if (c != this.rowSize - 1 && this.puzzleState[index + 1] == 0) {
            // check if right is not edge and check if can move right
            blankIndex = index + 1
        } else if (r != this.rowSize - 1 && this.puzzleState[index + this.rowSize] == 0) {
            // check if bottom is not edge and check if can move bottom
            blankIndex = index + this.rowSize
        } else if (r != 0 && this.puzzleState[index - this.rowSize] == 0) {
            // check if top is not edge and check if can move top
            blankIndex = index - this.rowSize
        }


        if (blankIndex != -1) {
            this.puzzleState[blankIndex] = this.puzzleState[index]
            this.puzzleState[index] = 0
        }

        if (this.boardHelperService.checkIfSolved(this.puzzleState, this.solutionState)) {
            this.solvedEvent.emit(true)
        } else {
            this.solvedEvent.emit(false)
        }

    }

}
