import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BoardHelperService } from 'src/app/services/board-helper.service';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {


    puzzleSize: number = 0;
    puzzleState: number[] = [];
    solutionState: number[] = [];
    mode: string = 'Play';
    showPuzzleError = false;
    displayPuzzle = false;

    constructor(private boardHelperService: BoardHelperService,
        private ref: ChangeDetectorRef) {

    }

    ngOnInit(): void {

    }

    generatePuzzle() {
        this.displayPuzzle = false;
        this.ref.detectChanges()
        let elem = document.querySelector('#player-puzzle-size-input') as HTMLInputElement;
        if (elem) {
            let size = +elem.value;
            let sqrt = Math.sqrt(size);
            if (size > 1 && sqrt * sqrt == size) {
                this.puzzleSize = size;
                this.puzzleState = this.boardHelperService.generateRandomStateFromSize(this.puzzleSize);
                this.solutionState = this.boardHelperService.generateDefaultSolutionStateFromSize(this.puzzleSize);
                this.mode = 'Play';
                this.showPuzzleError = false;
                this.displayPuzzle = true;
            } else {
                this.displayPuzzle = false;
                this.showPuzzleError = true;
            }

        }
    }


}
