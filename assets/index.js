async function generateBoard() {
    const words = await getWords()
    console.log(words)
    board.innerHTML = ''

    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    const matrix = []
    let row
    let numRow = 0
    let numCol = 0

    words.forEach((word) => {

    })

    for (let i=0; i<60; i++){
        const rand = alphabet[Math.floor(Math.random()*26)]
        let letter = document.createElement('div')
        letter.className = `letter ${i}`
        if (letter.textContent=='') {letter.textContent = rand}
        letter.style.padding = letter.textContent==''?'9px':'0px'
        letter.addEventListener('click', () => {
            letter.style.backgroundColor = 'grey'
        })
        board.appendChild(letter)

        //matrix for 6 cols 10 rows
        if (i == 0 || i % 6 == 0) {
            row = [rand]
            // letter.classList.add(`row${numRow}`, `col${numCol}`)
            letter.dataset.row = numRow
            letter.dataset.column = numCol
            numCol++
        }
        else if (i % 6 > 0) {
            row.push(rand)
            // letter.classList.add(`row${numRow}`, `col${numCol}`)
            letter.dataset.row = numRow
            letter.dataset.column = numCol
            numCol++
        }
        
        if (row.length==5){
            matrix.push(row)
        } else if (row.length==6){
            numRow++
            numCol=0
        }
    }
    console.log(matrix)
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

    while (num_words < 5){
        const word = data[i].word
        if (!word.includes(' ') && !word.includes('-') && word.length<10){
            const word_item = document.createElement('li')
            word_item.className = `word ${i}`
            word_item.textContent = word
            words_list.appendChild(word_item)
            words_length += (word.length)
            num_words++ 
            words.push(word)           
        }
        i++
    }
    console.log(words_length)
    return words
}

const board = document.getElementById('board')
const gen_btn = document.getElementById('gen-btn')
const words_list = document.getElementById('words-list')

gen_btn.addEventListener('click', () => {
    generateBoard()
})
generateBoard()
