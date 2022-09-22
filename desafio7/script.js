const startBtn = document.querySelector('.startBtn');
const tipBtn = document.querySelector('.tipBtn');
const submitBtn = document.querySelector('.submitBtn');
const wordUl = document.querySelector('.word');
const missedLettersUl = document.querySelector('.missedLetters')
const currentWord = [];
const correctLetters = [];
const missedLetters = [];

const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getData = (req) => {
    return fetch(`http://localhost:3000/${req}`)
    .then(response  => response.json())
    .catch(err => console.error(err));
}

const postData = (submissionType, submission) => {
        fetch(` http://localhost:3000/${submissionType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submission),
        })
        .then((response) => response.json())
        .catch((err) => console.error(err));
}

const getWord = async () => {
    const cats = await getData('categorias');
    let words = await getData('palavras');

    const cat = cats[randomNum(0, 1)];

    let word = words.filter((el) => {
        return Number(el.categoriaId) == Number(cat.id);
    })
    
    word = word[randomNum(0, 1)].palavra
    return word.toLocaleUpperCase();
}

const addLetter = (letters, element) => {
    const addLetters = (classToAdd = '') => {
        const lettersLength = String(letters).length;

        for (let i = 0; i < lettersLength; i++) {
            const liEl = document.createElement('li')

            if (letters[i].match(/\s/)) {
                liEl.classList.add('space')
            }
            
            element.appendChild(liEl);
    
            liEl.innerHTML = `<h2 class="${classToAdd}">${letters[i]}</h2>`
        }
    }
    
    if (element === missedLettersUl) {
        addLetters('missed');
    } else if (element === wordUl) {
        addLetters('hidden');
    }
}

const showLetters = (lett) => {
    const hiddenEls = [...document.getElementsByClassName('hidden')];
    let numOfTimes = 0;

    hiddenEls.forEach((el) => {
        if (el.innerText === lett) {
            el.classList.remove('hidden');
            numOfTimes++;
        }
    })

    for (let i = 0; i < numOfTimes; i++) {
        correctLetters.push(lett);
    }
}

const handleSubmit = (evt) => {
    evt.preventDefault();

    const letter = document.querySelector('#letterSubmit').value.toLocaleUpperCase();

    const word = document.querySelector('#wordSubmit').value.toLocaleUpperCase();

    if (missedLetters.includes(letter) || correctLetters.includes(letter)) {
        window.alert('You already typed this letter')
    } else if (word && word === currentWord[0]) {
        window.alert('You Win!');
        location.reload();
    } else if (word && word !== currentWord[0]) {
        window.alert('You Loose!');
        location.reload();
    } else if (String(currentWord[0]).includes(letter)) {
        showLetters(letter);

        if (correctLetters.length === currentWord[0].replace(/\s/, '').length) {
            window.alert('You Win!');
            location.reload();
        }
    } 
    else {
        missedLetters.push(letter);

        addLetter(missedLetters[missedLetters.length - 1], missedLettersUl);

        if (missedLetters.length === 6) {
            window.alert('You Loose!');
            location.reload();
        }
    }

    document.querySelector('#letterSubmit').value = '';
    return 0;
}

const handleClick = async (evt) => {  
    submitBtn.disabled = false;
    tipBtn.disabled = false;
    startBtn.disabled = true;

    if (evt.target.classList.contains('submitBtn')) {
        handleSubmit(evt);
    } else if (evt.target.classList.contains('tipBtn')) {
        console.log('Tip');
    } else if (evt.target.classList.contains('startBtn')) {
        currentWord.push(await getWord());

        addLetter(currentWord[0], wordUl);
    }
}

const onLoad = () => {
    document.querySelector('.gameControl').addEventListener('click', handleClick);
    document.querySelector('form#submitLetterForm').addEventListener('click', handleClick)

    document.removeEventListener('DOMContentLoaded', onLoad)
}

document.addEventListener('DOMContentLoaded', onLoad);