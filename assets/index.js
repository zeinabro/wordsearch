function createBoard() {
    board.innerHTML = ''

    let rowCount
    let numRow = 0
    let numCol = 0

    //create empty tiles
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

async function generateBoard() {
    const words = await getWords()
    // console.log(words)

    createBoard()
    let matrix = [[],[],[],[],[],[],[],[],[],[]]
    
    words.forEach((word) => {
        let option = (word.length<numCols+1 ? 'horizontal' : 'vertical')
        
        const options = [option, 'diagonal']
        option = options[Math.floor(Math.random()*2)]
        console.log(word,option)

        let empty = false
        while (empty==false){
            // console.log(empty,word)
            // [row, col] -> y, x

            let start_pos
            if (option=='horizontal'){
                start_pos = [Math.floor(Math.random()*numRows), Math.floor(Math.random()*(numCols+1-word.length))]
            } else if (option=='vertical'){
                start_pos = [Math.floor(Math.random()*(numRows+1-word.length)), (Math.floor(Math.random()*numCols))]
            } else {
                start_pos = [Math.floor(Math.random()*numRows), (Math.floor(Math.random()*numCols))]
            }

            console.log(start_pos)
            let start_tile = document.querySelector(`[data-row="${start_pos[0]}"][data-column="${start_pos[1]}"]`)
            if (start_tile.textContent==''){
                // if (option=='horizontal'){ //=row +col
                //     // console.log(word)
                //     let valid = true
                //     let x = start_pos[1]
                //     while (valid==true && x<word.length+start_pos[1] && x<6){
                //         valid = (matrix[start_pos[0]][x] == "")
                //         console.log(x, valid, start_pos)
                //         x++
                //     }
                //     empty = valid ? false : true
                // } else {
                //     empty = false
                // }
                start_tile.textContent = word[0]
                matrix[start_pos[0]][start_pos[1]] = word[0]
                start_tile.style.backgroundColor = 'pink'
                empty=true
            }
        }
    })

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

    // console.log(matrix)
}

async function getWords() {
    //https://api.datamuse.com/words

    words_list.innerHTML = ''

    let topic = 'intelligent'
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
            console.log(word)
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

gen_btn.addEventListener('click', () => {
    generateBoard()
})
generateBoard()
