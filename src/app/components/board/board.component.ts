import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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

    @Input()
    path: string[] = []

    @Output() solvedEvent = new EventEmitter<boolean>();

    rowSize: number = 3;

    replayState = this.puzzleState;
    randomHash = "";

    constructor(private boardHelperService: BoardHelperService,
        private ref: ChangeDetectorRef) {
    }


    ngOnInit(): void {
        this.randomHash = this.generateRandomHash();
        this.rowSize = Math.sqrt(this.puzzleSize);
        this.replayState = JSON.parse(JSON.stringify(this.puzzleState));

    }


    moveTile(index: number, forceMove = false) {

        if (forceMove == false && (this.mode != 'Play' && this.mode != 'Run')) {
            return;
        }

        let blankIndex = -1;
        let r = Math.floor(index / this.rowSize);
        let c = index % this.rowSize;
        let transitionClass = "";

        if (c != 0 && this.puzzleState[index - 1] == 0) {
            // check if left is not edge and can move left
            blankIndex = index - 1
            transitionClass = 'moveRight';
        }
        else if (c != this.rowSize - 1 && this.puzzleState[index + 1] == 0) {
            // check if right is not edge and check if can move right
            blankIndex = index + 1
            transitionClass = 'moveLeft';

        } else if (r != this.rowSize - 1 && this.puzzleState[index + this.rowSize] == 0) {
            // check if bottom is not edge and check if can move bottom
            blankIndex = index + this.rowSize
            transitionClass = 'moveUp';

        } else if (r != 0 && this.puzzleState[index - this.rowSize] == 0) {
            // check if top is not edge and check if can move top
            blankIndex = index - this.rowSize
            transitionClass = 'moveDown';

        }


        if (blankIndex != -1) {
            let elem = document.querySelector('.container-' + this.randomHash) as HTMLDivElement;
            elem.querySelector('#n-puzzle-tile-' + index)?.classList.add(transitionClass);
            this.puzzleState[blankIndex] = this.puzzleState[index]
            this.puzzleState[index] = 0
            setTimeout(() => {
                elem.querySelector('#n-puzzle-tile-' + blankIndex)?.classList.remove(transitionClass);
            }, 300);
        }

        if (this.boardHelperService.checkIfSolved(this.puzzleState, this.solutionState)) {
            this.solvedEvent.emit(true)
        } else {
            this.solvedEvent.emit(false)
        }

    }

    async playSolution() {
        // get list of moves
        let moves = this.path;
        this.puzzleState = JSON.parse(JSON.stringify(this.replayState));
        await this.delay(500);
        this.ref.detectChanges()
        // for each move, convert list of moves to index
        for (let move of moves) {

            let index = this.getIndexFromMove(move, this.puzzleState, this.puzzleSize, this.rowSize);

            this.moveTile(index, true);
            await this.delay(500);

        }

    }

    async rePlaySolution() {
        await this.resetState();
        this.playSolution();
    }

    getIndexFromMove(move: string, state: number[], size: number, row_length: number) {
        let index = state.indexOf(0);

        if (move == 'L') {
            return index - 1;
        } else if (move == 'R') {
            return index + 1;
        } else if (move == 'U') {
            return index - row_length;
        } else if (move == 'D') {
            return index + row_length;
        } else {
            console.log('why are you here????');
            return index;
        }
    }

    generateRandomHash(length = 32) {
        let acceptable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let hash = [];

        for (let i = 0; i < length; i += 1) {
            let idx = Math.floor(Math.random() * acceptable.length);
            hash.push(acceptable[idx]);
        }
        return hash.join('');
    }

    async resetState() {
        this.puzzleState = JSON.parse(JSON.stringify(this.replayState));
        this.ref.detectChanges();
        await this.delay(1000);
    }

    async delay(time = 500) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, time)
        })
    }

}
