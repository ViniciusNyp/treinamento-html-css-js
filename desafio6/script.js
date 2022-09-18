document.addEventListener('DOMContentLoaded', () => {
    document
        .querySelector('#game')
        .addEventListener('click', mark)
})

let player;
let winner;
let playerCount = 0;

const winningCombs = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
]

function mark(evt) {
    playerCount % 2 === 0 ? player = 'X' : player = 'O';

    document.querySelector('#playerName').innerHTML = `Último a jogar: ${player}`

    if (evt.target.innerHTML === '') {
        evt.target.innerHTML = `<h1 class='prop' >${player}</h1>`
        evt.target.classList.add(`${player}`)

        playerCount++;
    } else {
        window.alert('Campo já preenchido')
    }

    verify(player)
    verifyVelha()
}

function verify(player) {
    let cellsInserted = document.getElementsByClassName(`${player}`)
    let combination = [];

    for (let i = 0; i < cellsInserted.length; i++) {
        combination.push(Number(cellsInserted[i].id))
    }

    if (combination.length >= 3) {
        let winTest = winningCombs.some((el) => {
            return el.every((val) => {          
                    return combination.includes(val)
                })
            })
    
        if (winTest) {
            window.alert(`${player} Win!`)
            document.location.reload()
        }
    }
}

function verifyVelha() {
    let elements = [...document.getElementsByClassName('X'), ...document.getElementsByClassName('O')]

    if (elements.length >= 9) {
        window.alert('Velha!')
        document.location.reload()
    }
}