import { Injectable } from "@angular/core";
import { Heuristic } from "../constants/solverConstants";
import { Node } from "./node-manager.service";

@Injectable()
export class NPuzzleSolverService {


    solveNPuzzle(input_state: number[], goal_state: number[], heuristic_measure: Heuristic) {

        let [final_node, max_queue_size, total_nodes_expanded]: any = this.general_search(input_state, goal_state, this.queueing_function, heuristic_measure);

    }

    checkIfSolved(puzzleState: number[], solvedState: number[]) {
        let x = puzzleState.join('');
        let y = solvedState.join('');
        return x == y;
    }

    general_search(input_state: number[], goal_state: number[], queueing_function: any, heuristic_measure: Heuristic) {

        let nodes = this.make_queue(this.make_node_from_state(input_state), goal_state, heuristic_measure);
        let total_nodes_expanded = 0;
        let max_queue_size = 0;

        while (true) {
            max_queue_size = Math.max(max_queue_size, nodes.length);

            if (this.is_queue_empty(nodes)) {
                return [undefined, total_nodes_expanded, max_queue_size];
            } else {
                let { queue, node } = this.remove_front(nodes);
                nodes = queue;

                if (this.checkIfSolved(goal_state, node.state)) {
                    return [node, max_queue_size, total_nodes_expanded];
                }
                else {

                    total_nodes_expanded += 1;
                    nodes = queueing_function(nodes, this.expand_nodes(node), heuristic_measure, goal_state);
                }
            }
        }
    }

    make_queue(node: Node, goal_state: number[], heuristic_measure: Heuristic) {
        let cost = node.get_heuristic_cost(heuristic_measure, goal_state);
        return [{ cost, node }] as QueueObject[];
    }

    is_queue_empty(queue: QueueObject[]) {
        return queue.length > 0 ? false : true;
    }

    remove_front(queue: QueueObject[]) {

        queue = queue.sort((a: QueueObject, b: QueueObject) => {
            return a.cost - b.cost;
        })
        let obj: QueueObject = queue.shift() as QueueObject;
        let node: Node = obj['node'];
        return { queue, node };
    }

    expand_nodes(node: Node) {
        let children = node.spawn_children();
        return children;
    }

    make_node_from_state(state: number[]) {
        let parent_node = new Node(0, [], state, undefined);
        return parent_node;
    }

    queueing_function(queue: QueueObject[], children: Node[], heuristic_measure: Heuristic, goal_state: number[]) {

        let child_queue: QueueObject[] = [];
        for (let node of children) {
            let cost = node.get_heuristic_cost(heuristic_measure, goal_state);
            child_queue.push({ cost, node });
        }

        queue = queue.concat(child_queue);
        queue = queue.sort((a: QueueObject, b: QueueObject) => {
            return a.cost - b.cost;
        })

        return queue;
    }

    print_trace(node: Node, goal_state: number[]) {

        if (node == undefined) {
            return;
        }

        if (node.parent) {
            this.print_trace(node.parent, goal_state);
            node.print_state(goal_state);
        }

    }

}

interface QueueObject {
    cost: number,
    node: Node
}