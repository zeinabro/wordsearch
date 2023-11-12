function create_table() {
    board.innerHTML = ''

    let rowCount
    let numRow = 0
    let numCol = 0
    let table = document.createElement('table')
    let tr = document.createElement('tr')

    for (let i=0; i<(numRows*numCols); i++){
        let letter = document.createElement('td')
        letter.className = `letter ${i}`

        letter.addEventListener(('click'), () => {
            letters_chosen = select_letter(letter,letters_chosen)
        })

        if (i == 0 || i % numCols == 0) {
            rowCount = [1]
            letter.classList.add(`row${numRow}`, `col${numCol}`)
            letter.dataset.row = numRow
            letter.dataset.column = numCol
            numCol++
            tr=document.createElement('tr')
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
            table.appendChild(tr)
            numCol=0
        }
        tr.appendChild(letter)
    }
    board.appendChild(table)
}

function select_letter(letter,letters_chosen){
    letter.classList.toggle('selected')

    if (letters_chosen.some(letter => letter.classList.contains('found'))){
        letters_chosen = []
    }
            
    if (letter.classList.contains('selected') && !letter.classList.contains('found')){
        letters_chosen.push(letter)
    } else if (!letter.classList.contains('selected') || letter.classList.contains('found')){
        let idx = letters_chosen.indexOf(letter)
        if (idx != -1) { letters_chosen.splice(letters_chosen.indexOf(letter),1) }
    }
    
    if (letters_chosen.length>0){
        letters_chosen = check_letters(letters_chosen)
    }

    return letters_chosen
}

function check_letters(letters_chosen) {
    let index = answers[letters_chosen[0].dataset.row][letters_chosen[0].dataset.column] 
    let found=false
    let word = words[index]
    if (word && letters_chosen.length==word.length) { found = true }
    let i=1

    while (found==true && i<letters_chosen.length){
        let r = parseInt(letters_chosen[i].dataset.row)
        let c = parseInt(letters_chosen[i].dataset.column)
        if (answers[r][c]!==index){
            found=false
        }
        i++
    }

    if (found==true){
        letters_chosen.forEach((letter) => {
            letter.classList.add('found')
            letter.disabled = true
        })
        words_list.children[index].classList.add('word-found')
        let curr_score = parseInt(ws_score_span.textContent[0])+1
        ws_score_span.textContent = `${curr_score}/${words.length}`
        if (curr_score == words.length){
            finish()
        }
    }

    return letters_chosen
}

function finish() {
    score = JSON.parse(score)+words.length
    localStorage.setItem('score', JSON.stringify(score))
    msg.textContent = `You have completed the wordsearch!`
    const shuffle_btn = document.createElement('button')
    shuffle_btn.textContent = 'Shuffle'
    shuffle_btn.className = 'shuffle-btn'
    shuffle_btn.addEventListener('click', () => {
        let form_data = new FormData(form)
        let topic = form_data.get('topic')
        if (topic) {place_words(topic)}
        msg.textContent = ""
        msg_container.remove(shuffle_btn)
    })
    msg_container.appendChild(shuffle_btn)
}

async function place_words(topic) {
    words = await get_words(topic)
    create_table()
    let removed_words = []
    let i = 0
    words.forEach((word) => {
        let counter = 0
        const options = ['vertical']
        if (word.length<numCols+1) {
            options.push('horizontal')
            options.push('diagonal') 
        }
        let len = options.length
        let available = false

        while (available==false){
            let option = options[Math.floor(Math.random()*len)]
            let start_pos = find_start_pos(word, option)
            let empty = check_placement(word,option,start_pos,i)

            if (empty==true){
                i++
                available=true
            } else if (counter>50){
                let index = words.indexOf(word)
                removed_words.push(index)
                available=true
            } else if (empty==false){
                counter++
            }
        }
    })
    for (let i=0;i<removed_words.length;i++){
        words.splice(removed_words[i],1)
    }
    total_score_span.textContent = `Total score: ${score}`
    ws_score_span.textContent = `0/${words.length}`
    console.log(words)
    place_words_list(words)
    place_random_letters()
}

function find_start_pos(word, option){
    let start_pos                           
    let empty = false
    while (empty==false){
        if (option=='horizontal'){
            start_pos = [Math.floor(Math.random()*numRows), Math.floor(Math.random()*(numCols+1-word.length))]
        } else if (option=='vertical'){
            start_pos = [Math.floor(Math.random()*(numRows+1-word.length)), (Math.floor(Math.random()*numCols))]
        } else if (option=='diagonal'){
            let len = word.length
            let combos = []
            if (len<numCols) {
                combos.push([(numCols-2)+(numCols-len),0])
                for (let c=1;c<numCols-len;c++){
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
            empty = true
        }
        
        let start_tile = document.querySelector(`[data-row="${start_pos[0]}"][data-column="${start_pos[1]}"]`)

        if (start_tile && start_tile.textContent == ""){
            empty=true
        }
    }
    return start_pos
}

function check_placement(word,option,start_pos,index){
    let empty = true
    let x = start_pos[1]
    let y = start_pos[0]
    let direction  = Math.floor(Math.random()*2)

    if (option == "horizontal"){
        while (empty==true && x<start_pos[1]+word.length-1){
            x++
            let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
            empty = (next_tile && next_tile.textContent=="") ? true : false
        }
        if (empty){
            let i = (direction==0 ? 0 : word.length-1)
            for (let x=start_pos[1];x<word.length+start_pos[1];x++){
                let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                next.textContent = word[i]
                matrix[y][x] = word[i]

                if (index==0 || answers.some(row => row.includes(index-1))){
                    answers[y][x] = index
                } else if (index>0 && !answers.some(row => row.includes(index-1))){
                    answers[y][x] = index-1
                }

                direction==0 ? i++ : i--
            }
        }
    }
    else if (option == 'vertical'){
        while (empty==true && y<start_pos[0]+word.length-1){
            y++
            let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
            empty = (next_tile && next_tile.textContent=="") ? true : false
        }
        if (empty){
            let i = (direction==0 ? 0 : word.length-1)
            for (let y=start_pos[0];y<word.length+start_pos[0];y++) {
                let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                next.textContent = word[i]
                matrix[y][x] = word[i]

                if (index==0 || answers.some(row => row.includes(index-1))){
                    answers[y][x] = index
                } else if (index>0 && !answers.some(row => row.includes(index-1))){
                    answers[y][x] = index-1
                }

                direction==0 ? i++ : i--
            }
        }
    }
    else if (option == 'diagonal'){
        while (empty==true && x<start_pos[1]+word.length-1 && y<start_pos[0]+word.length-1){
            y++
            x++
            let next_tile = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
            empty = (next_tile && next_tile.textContent=="") ? true : false
        }
        if (empty){
            let i = (direction==0 ? 0 : word.length-1)
            let x = start_pos[1]
            for (let y=start_pos[0];y<word.length+start_pos[0];y++) {
                let next = document.querySelector(`[data-row="${y}"][data-column="${x}"]`)
                next.textContent = word[i]
                matrix[y][x] = word[i]

                if (index==0 || answers.some(row => row.includes(index-1))){
                    answers[y][x] = index
                } else if (index>0 && !answers.some(row => row.includes(index-1))){
                    answers[y][x] = index-1
                }

                direction==0 ? i++ : i--
                x++
            }
        }
    }
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
            letter.textContent = rand
            answers[numRow][numCol] = -1
        } else {
            rand = letter.textContent
        }

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
    console.log(answers)
}

async function get_words(topic) {
    //https://api.datamuse.com/words

    while (!topic) {
        // const resp = await fetch('https://random-word-api.herokuapp.com/word')
        // const data = await resp.json()
        // if (data.length < (numRows+numCols)/2){
        //     topic = data
        // }
        const random_words = ['cat','dog','harry potter','hunger games','red','school','gaming','reading','snake']
        topic = random_words[Math.floor(Math.random()*random_words.length)]
    }
    const resp =  await fetch(`https://api.datamuse.com/words?ml=${topic}`)
    const data = await resp.json()

    const input_field = document.querySelector('#input-topic')
    input_field.value = topic

    let words_length = 0
    let num_words = 0
    let i = 0
    words = []

    while (num_words < (numCols+numRows)/2 && i<data.length){
        const word = data[i].word
        if (!word.includes(' ') && !word.includes('-') && word.length<numCols && word.length<numRows && word.length>2){
            words_length += (word.length)
            num_words++
            words.push(word.toUpperCase())           
        }
        i++  
    }
    if (words.length > 1)
    { return words }
    else { get_words() }
}

function place_words_list(spliced_words) {
    words_list.innerHTML = ''
    spliced_words.forEach((word,i) => {
        const word_item = document.createElement('li')
        word_item.className = `word ${i}`
        word_item.textContent = word.toLowerCase()
        words_list.appendChild(word_item)
    })
}

const board = document.getElementById('board')
const gen_btn = document.getElementById('gen-btn')
const words_list = document.getElementById('words-list')

const total_score_span = document.querySelector('#total-score')
const ws_score_span = document.querySelector('#ws-score')
const msg_container = document.querySelector('#message-container')
const msg = document.querySelector('.message')

const numRows = 10
const numCols = 10
let score = localStorage.getItem('score') || 0

document.documentElement.style.setProperty('--cols',`${'auto '.repeat(numCols)}`)

let words
let matrix = []
let answers = []
let letters_chosen = []

for (let x=0;x<numRows;x++){
    let row = []
    for (let y=0;y<numCols;y++){
        row.push([])
    }
    matrix.push(row)
    answers.push(row)
}

const form = document.querySelector('#topic-form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    let form_data = new FormData(form)
    let topic = form_data.get('topic')
    if (topic) {place_words(topic)}
})

const rand_btn = document.querySelector('#rand-btn')
rand_btn.addEventListener('click', () => {
    place_words()
})
