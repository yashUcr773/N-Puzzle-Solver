import { Component, OnInit, ChangeDetectorRef, HostListener, Output, EventEmitter } from '@angular/core';
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
    inputValue = "";
    puzzleSolved = false;
    originalState = this.puzzleState;

    @Output() movePuzzleToSolverEvent = new EventEmitter<any>();


    constructor(private boardHelperService: BoardHelperService,
        private ref: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        this.inputValue = "9";
        this.generatePuzzle();
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.code == 'Enter') {
            this.generatePuzzle();
        }
    }

    generatePuzzle() {
        this.displayPuzzle = false;
        this.ref.detectChanges()

        let size = +this.inputValue;
        let sqrt = Math.sqrt(size);
        if (size > 1 && sqrt * sqrt == size) {
            this.puzzleSize = size;
            this.solutionState = this.boardHelperService.generateDefaultSolutionStateFromSize(this.puzzleSize);
            this.puzzleState = this.boardHelperService.generateRandomStateFromSize(this.puzzleSize, this.solutionState);
            this.originalState = JSON.parse(JSON.stringify(this.puzzleState))
            this.mode = 'Play';
            this.showPuzzleError = false;
            this.displayPuzzle = true;
        } else {
            this.displayPuzzle = false;
            this.showPuzzleError = true;
        }

    }

    solvedEvent(event: boolean) {
        this.puzzleSolved = event;
    }

    movePuzzleToSolver() {
        this.movePuzzleToSolverEvent.emit({ puzzleState: this.puzzleState });
    }

    resetToOriginal() {
        this.puzzleState = JSON.parse(JSON.stringify(this.originalState));
        this.ref.detectChanges();
    }

}
