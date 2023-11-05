function create_board() {
    board.innerHTML = ''

    let rowCount
    let numRow = 0
    let numCol = 0

    for (let i=0; i<(numRows*numCols); i++){
        let letter = document.createElement('div')
        letter.className = `letter ${i}`
        // if (letter.textContent==""){letter.style.padding = '9px'}
        letter.addEventListener('click', () => {
            letter.style.backgroundColor = 'grey'
        })

        if (i == 0 || i % numCols == 0) {
            rowCount = [1]
            letter.classList.add(`row${numRow}`, `col${numCol}`)
            letter.dataset.row = numRow
            letter.dataset.column = numCol
            numCol++
        } 
        else if (i % numCols > 0) {
            rowCount.push(1)
            letter.classList.add( `row${numRow}`, `col${numCol}`)
            letter.dataset.row = numRow
            letter.dataset.column = numCol
            numCol++
        }
        
        if (rowCount.length==numCols){
            numRow++
            numCol=0
        }

        board.appendChild(letter)
    }
}

async function place_words() {
    const words = await get_words()
    create_board()
    
    words.forEach((word) => {
        let counter = 0
        const options = ['vertical']
        if (word.length<numCols+1) {
            options.push('horizontal')
            options.push('diagonal') 
        }
        let len = options.length
        // let option = options[Math.floor(Math.random()*len)] 
        let available = false
        while (available==false){
            let option = options[Math.floor(Math.random()*len)]
            let start_pos = find_start_pos(word, option)
            let empty = check_placement(word,option,start_pos)
            // console.log('empty placement',empty)

            if (empty==true){
                available=true
            } else if (counter>50){
                let index = words.indexOf(word)
                let word_el = document.querySelector(`.word, .${index}`)
                console.log(word_el)
                word_el.textContent= ""
                available=true
            } else if (empty==false){
                counter++
            }
        }
        // console.log('counter ',counter)
    })
    place_random_letters()
}

function find_start_pos(word, option){
    // console.log(matrix)
    let start_pos                           
    let empty = false
    // console.log(word,option)
    while (empty==false){
        if (option=='horizontal'){
            start_pos = [Math.floor(Math.random()*numRows), Math.floor(Math.random()*(numCols+1-word.length))]
        } else if (option=='vertical'){
            start_pos = [Math.floor(Math.random()*(numRows+1-word.length)), (Math.floor(Math.random()*numCols))]
            // console.log('vertical start pos ',start_pos)
        } else if (option=='diagonal'){
            let len = word.length
            let combos = []
            if (len<numCols) {
                combos.push([(numCols-2)+(numCols-len),0])
                for (let c=1;c<numCols-len;c++){
                    //4
                    if (combos.indexOf([(numCols-2)+numCols-len,c])==-1){
                        combos.push([(numCols-2)+numCols-len,c])  
                    } 
                }
            }
            for (let c=0;c<(numCols-len)+1;c++){
                for (let r=0;r<((numCols-2)+(numCols-len)+1);r++){
                    if (combos.indexOf([r,c]) == -1){combos.push([r,c])}
                }
            } 
            start_pos=combos[Math.floor(Math.random()*(combos.length-1))]
        } else {
            // console.log('no option?')
            empty = true
        }
        // console.log(word," start_pos ",start_pos)
        
        let start_tile = document.querySelector(`[data-row="${start_pos[0]}"][data-column="${start_pos[1]}"]`)

        // console.log('start tile ', start_tile, start_tile.textContent)

        if (start_tile && start_tile.textContent == ""){
            empty=true
        } else {
            // console.log('not empty in fsp ',empty)
        }
        // empty=true
    }
    // console.log('in fps empty is ',empty)
    // console.log(start_pos)
    return start_pos
}

function check_placement(word,option,start_pos){

    let start_tile = document.querySelector(`[data-row="${start_pos[0]}"][data-column="${start_pos[1]}"]`)

    let empty = true //tile is empty
    // if (start_tile.textContent == ""){
        //[row,col] -> [y,x]
        let x = start_pos[1]
        let y = start_pos[0]
        if (option == "horizontal"){
            while (empty==true && x<start_pos[1]+word.length-1){
                x++
                let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                empty = (next_tile && next_tile.textContent=="") ? true : false
            }
            if (empty){
                let i = 0
                for (let x=start_pos[1];x<word.length+start_pos[1];x++){
                    let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                    // console.log(next)
                    next.style.backgroundColor = 'yellow'
                    next.textContent = word[i]
                    matrix[y][x] = word[i]
                    i++
                }
            }
        }
        else if (option == 'vertical'){
            //same col, row++ ->
            while (empty==true && y<start_pos[0]+word.length-1){
                y++
                let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                empty = (next_tile && next_tile.textContent=="") ? true : false
            }
            if (empty){
                let i = 0
                for (let y=start_pos[0];y<word.length+start_pos[0];y++){
                    let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                    // console.log(next)
                    next.style.backgroundColor = 'pink'
                    next.textContent = word[i]
                    matrix[y][x] = word[i]
                    i++
                }
            }
        }
        else if (option == 'diagonal'){
            //[row,col] -> [y,x]
            //&& x<numCols-1 && y<numRows-1
            while (empty==true && x<start_pos[1]+word.length-1 && y<start_pos[0]+word.length-1){
                y++
                x++
                let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                // console.log(next_tile,y,x)
                empty = (next_tile && next_tile.textContent=="") ? true : false
                // if (empty==false){
                //     console.log('not empty',next_tile.textContent)
                // }
            }
            if (empty){
                let i = 0
                let x = start_pos[1]
                for (let y=start_pos[0];y<word.length+start_pos[0];y++) {
                    let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                    // console.log(next)
                    next.style.backgroundColor='green'
                    next.textContent = word[i]
                    matrix[y][x] = word[i]
                    i++
                    x++
                }
            }
        }
    // } else {
    //     console.log('else')
    //     empty = false
    // }
    return empty
}

function place_random_letters() {
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    let numCol = 0
    let numRow = 0
    let row

    for (let i=0; i<(numRows*numCols); i++){
        let rand = alphabet[Math.floor(Math.random()*26)]
        let letter = document.getElementsByClassName(i)[0]
        if (letter.textContent == '') {
            letter.textContent = rand //rand
        } else {
            rand = letter.textContent
        }
        // if (letter.textContent!==""){letter.style.padding = '0px'}

        if (i == 0 || i % numCols == 0) {
            row = [rand]
            numCol++
        }
        else if (i % numCols > 0) {
            row.push(rand)
            numCol++
        }
        if (row.length==numCols-1){
            matrix[numRow] = row
        } else if (row.length==numCols){
            numRow++
            numCol=0
        }
    }
    console.log(matrix)
}

async function get_words() {
    //https://api.datamuse.com/words

    words_list.innerHTML = ''

    let topic = 'intelligent'
    let max = 5

    const resp =  await fetch(`https://api.datamuse.com/words?ml=${topic}`)
    const data = await resp.json()

    let words_length = 0
    let num_words = 0
    let i = 0
    let words = []

    while (num_words < numCols && i<data.length){
        const word = data[i].word
        if (!word.includes(' ') && !word.includes('-') && word.length<numRows-3){
            const word_item = document.createElement('li')
            word_item.className = `word ${i}`
            word_item.textContent = word
            words_list.appendChild(word_item)
            words_length += (word.length)
            num_words++
            words.push(word.toUpperCase())           
        }
        i++  
    }
    // console.log(words)
    return words
}

const board = document.getElementById('board')
const gen_btn = document.getElementById('gen-btn')
const words_list = document.getElementById('words-list')

const numRows = 21
const numCols = 20

document.documentElement.style.setProperty('--cols',`${'auto '.repeat(numCols)}`)

let matrix = []

for (let x=0;x<numRows;x++){
    let row = []
    for (let y=0;y<numCols;y++){
        row.push([])
    }
    matrix.push(row)
}

gen_btn.addEventListener('click', () => {
    // get_words()
    place_words()
})
// get_words()
place_words()
