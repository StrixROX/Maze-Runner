import * as Grid from './grid-basic.js'
import * as PathFinder from './path-finding.js'

//some probably useful custom functions
Array.prototype.has = function(pos){
    //tells if the array contains the given position array ([x, y])
    //Usage: [ [1,1], [2,4], [5,1] ].has([1,1]) //returns true

    for(let i of this){
        if(i[0] === pos[0] && i[1] === pos[1]) return true
    }

    return false
}
Array.prototype.remove = function(pos){
    //removes all instances of given position array ([x, y]) from the array
    //Usage: [ [1,1], [2,4], [5,1] ].remove([1,1]) //returns [ [2,4], [5,1] ]

    let temp = this
    for(let i = 0; i < this.length; i++){
        if(this[i][0] === pos[0] && this[i][1] === pos[1]) temp.splice(i,1)
    }

    return temp
}
String.prototype.count = function(char, count = 0){
    //just counts chars in a string
    if(!this.includes(char)) return count

    const index = this.indexOf(char)
    count += 1

    return (this.substring(0, index) + this.substring(index + 1)).count(char, count)
}

//random maze gen - nothing crazy, just putting random blocks and at random places
function genRandomMaze(f){  
    $('.block').removeAttr('data-type')

    let stack = []
    const randomBlock = () => { 
        let index = Math.floor((Grid.gridSize ** 2 - 1) * Math.random())
        while(stack.includes(index)){
            index = Math.floor((Grid.gridSize ** 2 - 1) * Math.random())
        }

        return $($('.block')[ index ])
    }

    const player = () => randomBlock().attr('data-type', 'player')
    const goal = () => randomBlock().attr('data-type', 'goal')

    const walls = () => {
        //selects a random place on the grid to start building a wall unit

        //1 wall unit = walls from the random point to the farthest boundary of the grid

        //kind of like making a perpendicular line of walls from a random point to
        //the farthest edge among the right and top one
        let [ rx, ry ] = JSON.parse(randomBlock().attr('data-pos'))
        for(let i = 0; i < Math.max(Grid.gridSize - rx, Grid.gridSize - ry); i++){
            if(!Grid.getBlockAtPos([rx, ry]).attr('data-type')){
                Grid.getBlockAtPos([rx, ry]).attr('data-type', 'wall')
            }

            if(rx >= ry){
                rx -= 1
            }else{
                ry -= 1
            }
        }
    }

    for(let i of f){
        if(i === 'P') player()
        if(i === 'G') goal()
        if(i === 'W') walls()
    }
}
//end

$('.run').click(() => {
    //genRandomMaze('PGWWWW')
    //'PGWWWW' => place at random places: first a player, then a goal, then three wall units

    let path = PathFinder.findPath()

    path.remove(Grid.getPosOfBlock(Grid.getPlayer()))
    path.remove(Grid.getPosOfBlock(Grid.getGoal()))

    while(path.length > 0){
        let step = path.shift()
        Grid.movePlayerTo(step)
    }
})