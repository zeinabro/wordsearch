function createBoard() {
    board.innerHTML = ''

    let rowCount
    let numRow = 0
    let numCol = 0

    for (let i=0; i<(numRows*numCols); i++){
        let letter = document.createElement('div')
        letter.className = `letter ${i}`
        if (letter.textContent==""){letter.style.padding = '9px'}
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
    const words = await getWords()
    createBoard()
    
    words.forEach((word) => {
        const options = ['vertical']
        if (word.length<numCols+1) {
            options.push('horizontal')
            options.push('diagonal') 
        }
        // let option = options[Math.floor(Math.random()*3)] 
        let available = false
        let counter=0
        while (available==false){
            let option = options[Math.floor(Math.random()*3)] 
            let start_pos = find_start_pos(word, option)
            let empty = check_placement(word,option,start_pos)
            console.log(word, option,"empty: ",empty)

            if (empty==true){
                available=true
            } else if (counter>10){
                let index = words.indexOf(word)
                let word_el = document.getElementsByClassName(`word ${index}`)
                console.log(word_el)
                word_el.innerHTML= ""
            } else if (empty==false){
                counter++
            }
        }
    })
    place_random_letters()
}

function find_start_pos(word, option){
    // console.log(matrix)
    let start_pos
    let empty = false
    while (empty==false){
        if (option=='horizontal'){
            start_pos = [Math.floor(Math.random()*numRows), Math.floor(Math.random()*(numCols+1-word.length))]
        } else if (option=='vertical'){
            start_pos = [Math.floor(Math.random()*(numRows+1-word.length)), (Math.floor(Math.random()*numCols))]
        } else {
            let len = word.length
            let combos = []
            if (len<numCols) {
                combos.push([(numCols-2)+(numCols-len),0])
                for (let c=1;c<numCols-len;c++){
                    if (combos.indexOf([4+numCols-len,c])==-1){
                        combos.push([4+numCols-len,c])  
                    } 
                }
            }
            for (let c=0;c<(numCols-len)+1;c++){
                for (let r=0;r<(4+(numCols-len)+1);r++){
                    if (combos.indexOf([r,c]) == -1){combos.push([r,c])}
                }
            } 
            start_pos=combos[Math.floor(Math.random()*(combos.length-1))]
        }

        let start_tile = document.querySelector(`[data-row="${start_pos[0]}"][data-column="${start_pos[1]}"]`)

        if (start_tile.textContent == ""){
            empty=true
        }
        // empty=true
    }
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
            while (empty==true && x<numCols-1 && x<start_pos[1]+word.length-1){
                x++
                let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                empty = (next_tile.textContent=="") ? true : false
            }
            if (empty){
                let i = 0
                for (let x=start_pos[1];x<word.length+start_pos[1];x++){
                    let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                    next.style.backgroundColor = 'yellow'
                    next.textContent = word[i]
                    matrix[y][x] = word[i]
                    i++
                }
            }
        }
        else if (option == 'vertical'){
            //same col, row++ ->
            console.log(word,'vertical')
            while (empty==true && y<numRows-1 && y<start_pos[0]+word.length-1){
                y++
                console.log(y)
                let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                console.log([y,x],next_tile)
                console.log("is empty: ",next_tile.textContent == "")
                empty = (next_tile.textContent=="") ? true : false
                console.log(empty)
            }
            if (empty){
                let i = 0
                for (let y=start_pos[0];y<word.length+start_pos[0];y++){
                    let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                    next.style.backgroundColor = 'pink'
                    next.textContent = word[i]
                    matrix[y][x] = word[i]
                    i++
                }
            }
        }
        else if (option == 'diagonal'){
            //[row,col] -> [y,x]
            console.log(word,word.length,y,x)

            while (empty==true && x<numCols-1 && y<numRows-1 && x<start_pos[1]+word.length-1 && y<start_pos[0]+word.length-1){

            // while (empty==true && x<numCols-1 &&x<numCols-start_pos[1]+1 && y<numRows-1 && y<word.length-start_pos[0]+1){
                y++
                x++
                console.log("d ",y,x)
                let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                empty = (next_tile.textContent=="") ? true : false
                if (empty==false){
                    console.log('not empty',next_tile.textContent)
                }
                console.log(next_tile,empty)
            }
            if (empty){
                let i = 0
                let x = start_pos[1]
                for (let y=start_pos[0];y<word.length+start_pos[0];y++) {
                    let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
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
            letter.textContent = "" //rand
        } else {
            rand = letter.textContent
        }
        if (letter.textContent!==""){letter.style.padding = '0px'}

        //matrix for 6 cols 10 rows
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

async function getWords() {
    //https://api.datamuse.com/words

    words_list.innerHTML = ''

    let topic = 'dog'
    let max = 5

    const resp =  await fetch(`https://api.datamuse.com/words?ml=${topic}&max=${max+5}`)
    const data = await resp.json()

    let words_length = 0
    let num_words = 0
    let i = 0
    let words = []

    while (num_words < 5 && i<10){
        const word = data[i].word
        if (!word.includes(' ') && !word.includes('-') && word.length<numRows){
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

const numRows = 10
const numCols = 6
const matrix = [[],[],[],[],[],[],[],[],[],[]]

gen_btn.addEventListener('click', () => {
    place_words()
})
place_words()
