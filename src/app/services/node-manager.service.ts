import { Heuristic } from "../constants/solverConstants";

export class Node {

    static global_states_manager: {
        [key: string]: number;
    } = {}

    state_length: number = 0;
    row_length: number = 0;
    col_length: number = 0;


    constructor(
        public depth: number,
        public path: string[],
        public state: number[],
        public parent: Node | undefined
    ) {
        this.state_length = this.state.length;
        this.row_length = Math.sqrt(this.state.length);
        this.col_length = Math.sqrt(this.state.length);

        if (this.parent == undefined) {

            Node.global_states_manager = {};
            Node.global_states_manager[this._get_state_string(this.state)] = this.depth;
        }
    }

    spawn_children() {

        let blank_idx = this.state.indexOf(0);
        let children_list: Node[] = [];
        let moves = this.get_valid_moves();

        for (let move of moves) {
            let state_copy = JSON.parse(JSON.stringify(this.state));
            let path = JSON.parse(JSON.stringify(this.path));

            if (move == 'U') {
                path.push('U');

                let temp = state_copy[blank_idx];
                state_copy[blank_idx] = state_copy[blank_idx - this.row_length];
                state_copy[blank_idx - this.row_length] = temp;
            } else if (move == 'L') {
                path.push('L');

                let temp = state_copy[blank_idx];
                state_copy[blank_idx] = state_copy[blank_idx - 1];
                state_copy[blank_idx - 1] = temp;
            } else if (move == 'R') {
                path.push('R');

                let temp = state_copy[blank_idx];
                state_copy[blank_idx] = state_copy[blank_idx + 1];
                state_copy[blank_idx + 1] = temp;
            } else if (move == 'D') {
                path.push('D');

                let temp = state_copy[blank_idx];
                state_copy[blank_idx] = state_copy[blank_idx + this.row_length];
                state_copy[blank_idx + this.row_length] = temp;
            }

            let past_depth_if_generated = this._is_state_already_generated(state_copy);

            if (past_depth_if_generated == -1 || past_depth_if_generated > this.depth + 1) {

                let child_node = new Node(this.depth + 1, path, state_copy, this)
                Node.global_states_manager[this._get_state_string(child_node.state)] = this.depth + 1;
                children_list.push(child_node)
            }
        }
        return children_list


    }

    get_valid_moves() {
        let valid = ['U', 'L', 'R', 'D'];

        let blank_idx = this.state.indexOf(0)

        // up
        if (blank_idx >= 0 && blank_idx < this.col_length) {
            valid = this.removeItemFromArray(valid, 'U');
        }

        // down
        if (blank_idx >= (this.col_length * this.col_length - this.col_length) && blank_idx < this.col_length * this.col_length) {
            valid = this.removeItemFromArray(valid, 'D');
        }

        // left
        if (blank_idx % this.col_length == 0) {
            valid = this.removeItemFromArray(valid, 'L');

        }
        // right
        if ((blank_idx + 1) % this.col_length == 0) {
            valid = this.removeItemFromArray(valid, 'R');
        }

        return valid

    }

    removeItemFromArray(array: any[], val: any) {
        array = array.filter(item => item !== val)
        return array
    }

    _is_state_already_generated(state: number[]) {

        let state_string = state.join('');
        return Node.global_states_manager[state_string] || -1;
    }

    _get_state_string(state: number[]) {
        let state_string = state.join('');
        return state_string
    }

    manhattan_distance_heuristic(goal_state: number[]) {
        let total_manhattan_distance = 0

        for (let value of goal_state) {

            if (value == 0) {
                continue
            }

            let [goal_state_row, goal_state_colums] = this._get_row_col_position(goal_state, value)
            let [random_state_row, random_state_colums] = this._get_row_col_position(this.state, value)
            total_manhattan_distance += Math.abs(goal_state_colums - random_state_colums) + Math.abs(goal_state_row - random_state_row)
        }

        return Math.floor(total_manhattan_distance)
    }

    _get_row_col_position(state: number[], element: number) {
        let idx = state.indexOf(element)
        let column_val = Math.floor(idx % this.row_length)
        let r_val = Math.floor(idx / this.row_length)
        return [r_val, column_val]
    }

    misplaced_tile_heuristic(goal_state: number[]) {
        let misplaced_count = 0
        for (let idx in goal_state) {

            if (goal_state[idx] == 0) {
                continue
            }

            if (this.state[idx] != goal_state[idx]) {
                misplaced_count += 1
            }

        }
        return misplaced_count
    }

    get_heuristic_cost(heuristic_measure: Heuristic, goal_state: number[]) {

        let g_n = this.depth;
        let h_n = 0;

        if (heuristic_measure == Heuristic.MANHATTAN) {
            h_n = this.manhattan_distance_heuristic(goal_state);
        }
        else if (heuristic_measure == Heuristic.MISPLACED) {
            h_n = this.misplaced_tile_heuristic(goal_state);
        }
        else if (heuristic_measure == Heuristic.UNIFORM) {
            h_n = 0;
        }
        else {
            h_n = 0;
        }
        return g_n + h_n;
    }

    print_state(goal_state?: number[]) {

        goal_state = goal_state || this.state;

        let temp = [];
        for (let i = 0; i < this.state_length; i += 1) {
            temp.push(this.state[i])
            if ((i + 1) % this.row_length == 0) {
                console.log(temp)
                temp = []
            }
        }

    }

}
