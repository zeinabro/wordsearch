function generateBoard() {
    board.innerHTML = ''
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    for (let i=1; i<61; i++){
        const rand = alphabet[Math.floor(Math.random()*26)]
        let letter = document.createElement('div')
        letter.className = `letter ${i}`
        letter.textContent = rand
        board.appendChild(letter)
    }
}

const board = document.getElementById('board')
const gen_btn = document.getElementById('gen-btn')

gen_btn.addEventListener('click', () => {
    generateBoard()
})
