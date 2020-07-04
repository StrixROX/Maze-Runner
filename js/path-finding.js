import * as Grid from "./grid-basic.js"

const distance = ([x1, y1], [x2, y2]) => Math.abs(x2 - x1) + Math.abs(y2 - y1)
//apparently, this is called the manhattan distance formula

//current algorithm
//recursively go to all neighbours of the player block and then their neighbours and so on until goal is reached
//it decides which nighbour to go to first by calculating the distance between current block the program is on
//and the goal block

export function findPath(){
    let solutionPath = []
    let badPaths = []
    
    const player = Grid.getPosOfBlock(Grid.getPlayer())
    const goal = Grid.getPosOfBlock(Grid.getGoal())

    if(player[0] < 0 || goal[0] < 0 || player[1] >= Grid.gridSize || goal[1] >= Grid.gridSize) return []

    function anchorAt([x, y], pathLen = 0){
        pathLen += 1
        //'pathLen' represents the distance from the player block traversed by the algorithm
        //'pathLen' is obsolete now but still left for dev purposes.

        if(x < 0 || x >= Grid.gridSize || y < 0 || y >= Grid.gridSize) return false

        const block = Grid.grid[y][x]

        if(
            block.attr('data-type') === 'wall' ||
            badPaths.has([x, y]) ||
            solutionPath.has([x, y])
        ) return false
        
        solutionPath.push([x, y])

        if(x === goal[0] && y === goal[1]) return true

        const nextAnchors = [
            [x, y + 1],
            [x, y - 1],
            [x + 1, y],
            [x - 1, y]
        ].sort((a, b) => distance(goal, a) - distance(goal, b)) 
        //sorted in ascending order based on distance from goal block

        for(let anchor of nextAnchors){
            if(anchorAt(anchor, pathLen)) return true
        }
        //explores the neighbouring blocks

        //if all neighbours are blocked
        badPaths.push(solutionPath.pop())

        return false
    }

    anchorAt(player)

    return solutionPath //array of positions
}