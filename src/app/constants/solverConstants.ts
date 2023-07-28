export const enum Heuristic {
    UNIFORM, MISPLACED, MANHATTAN
}

export const DIRECTIONS_MAP: { [key: string]: string } = {
    'R': 'Right',
    'L': 'Left',
    'U': 'Up',
    'D': 'Down'
}