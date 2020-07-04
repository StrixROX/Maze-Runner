export let gridSize = 6
export let grid = createGrid() // 2D matrix of jQuery objects of each block of the grid

//the grid system:
//x-axis -> left to right
//y-axis -> top to bottom
//[ top-left block is (0, 0) ]

export const getPlayer = () => $('.block[data-type="player"]')
export const getGoal = () => $('.block[data-type="goal"]')

function createGrid(){
    $('.block').remove() //delete all prev. blocks

    let temp = []

    for(let y = 0; y < gridSize; y++){
        let rowElements = []
        for(let x = 0; x < gridSize; x++){
            $('.grid').append('<p class="block button"></p>')

            //custom attributes of the grid blocks
            $('.block').last().attr('data-pos', JSON.stringify([x, y]))
            // * data-type * attribute is added seperately by setBlockTypeOf()
            
            rowElements.push($('.block').last())
        }
        temp.push(rowElements)
    }

    $('.block').css({
        width: ($('.grid').innerWidth() - 4*gridSize) / (gridSize),
        height: ($('.grid').innerHeight() - 4*gridSize) / (gridSize)
    })

    $('.block').click(function(){ setBlockTypeOf(this) })

    $('.block').on('mousedown', () => {
        $('.block').on('mouseenter', function(){ setBlockTypeOf(this) })
    })//allows mouse dragging to create walls continuously

    $('.block').on('mouseup', () => $('.block').off('mouseenter'))

    return temp
}

function setBlockTypeOf(el){
    //walls, player, and goal blocks have respective 'data-type' attributes
    //open blocks don't have data-type attribute

    const currentSel = $('.block-type.selected').attr('data-value')

    if(!$(el).attr('data-type')){
        if(currentSel === 'player') getPlayer().removeAttr('data-type')
        if(currentSel === 'goal') getGoal().removeAttr('data-type')
        
        $(el).attr('data-type', currentSel)
    }else{
        $(el).removeAttr('data-type')
    }
}

$('.block-type').click(function(){ $(this).addClass('selected').siblings().removeClass('selected') })

$('.size').on('input', function(){ gridSize = $(this).val(); grid = createGrid() })

$('.reset').click(() => $('.block').removeAttr('data-type'))
$('.clear').click(() => $('.block[data-type="mark"]').removeAttr('data-type'))

export function movePlayerTo([x, y]){
    setTimeout(() => grid[y][x].attr('data-type', 'mark'), 300)
}

export function getBlockAtPos([x, y]){
    return $( $('.block')[ y * gridSize + x + 1 ] )
}

export function getPosOfBlock(block){
    return JSON.parse(block.attr('data-pos') || null) || [-1, -1]
    //gives pos of block in the grid if block exists otherwise returns [-1, -1]
}