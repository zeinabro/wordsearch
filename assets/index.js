async function generateBoard() {
    await getWords()
    board.innerHTML = ''

    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    const matrix = []
    let row
    let numRow = 0
    let numCol = 0

    for (let i=0; i<60; i++){
        const rand = alphabet[Math.floor(Math.random()*26)]
        let letter = document.createElement('div')
        letter.className = `letter ${i}`
        if (letter.textContent=='') {letter.textContent = rand}
        letter.style.padding = letter.textContent==''?'9px':'0px'
        board.appendChild(letter)

        //matrix for 6 cols 10 rows
        if (i == 0 || i % 6 == 0) {
            row = [rand]
            letter.classList.add('row0', `col${numCol}`)
            numCol++
        }
        else if (i % 6 > 0) {
            row.push(rand)
            letter.classList.add(`row${numRow}`, `col${numCol}`)
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
    const words = await resp.json()
    console.log(words)
    let words_length = 0
    for (let i=0; i<max; i++){
        const word = document.createElement('li')
        word.className = `word ${i}`
        word.textContent = words[i].word
        words_list.appendChild(word)
        words_length += (words[i].word.length)
    }
}

const board = document.getElementById('board')
const gen_btn = document.getElementById('gen-btn')
const words_list = document.getElementById('words-list')

gen_btn.addEventListener('click', () => {
    generateBoard()
})
generateBoard()
