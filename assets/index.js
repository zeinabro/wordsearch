function generateBoard() {
    board.innerHTML = ''

    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    const matrix = []
    let row

    for (let i=0; i<60; i++){
        const rand = alphabet[Math.floor(Math.random()*26)]
        let letter = document.createElement('div')
        letter.className = `letter ${i}`
        letter.textContent = rand
        board.appendChild(letter)

        //matrix for 6 cols 10 rows
        if (i == 0 || i % 6 == 0) {
            row = [rand]
            console.log(i,row,matrix)
        }
        else if (i % 6 > 0) {
            row.push(rand)
            console.log(i,row)
        }
        
        if (row.length==5){
            matrix.push(row)
        }
    }
    console.log(matrix)
}

const board = document.getElementById('board')
const gen_btn = document.getElementById('gen-btn')

gen_btn.addEventListener('click', () => {
    generateBoard()
})
