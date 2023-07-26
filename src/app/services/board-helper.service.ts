import { Injectable } from '@angular/core'

@Injectable()
export class BoardHelperService {

    generateRandomStateFromSize(size: number) {
        return this.shuffleArray(this.generateArray(size));
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


}