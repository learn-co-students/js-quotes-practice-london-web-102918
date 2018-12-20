// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

const quotesListEl = document.querySelector('#quote-list')
const quotesURL = 'http://localhost:3000/quotes'
const quotesForm = document.querySelector('#new-quote-form')


document.addEventListener('DOMContentLoaded', () => {
    
    quotesForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const inputQuote = e.target.querySelector('#new-quote')
        const inputAuthor = e.target.querySelector('#author')
        const inputLikes = 1

        const newQuote = {
            quote: inputQuote.value,
            author: inputAuthor.value,
            likes: inputLikes
        }

        fetch(quotesURL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(newQuote)
        }).then(response => response.json())
        .then(newData => renderSingleQuote(newData))
       
    })
    
    fetch(quotesURL)
    .then(response => response.json())
    .then(renderQuotes)


})

const renderQuotes = quotes => {
    quotes.forEach(renderSingleQuote)
}

const renderSingleQuote = quote => {
    const newListQuote = document.createElement('li')
    newListQuote.innerHTML = 
    `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-like-id="${quote.id}">Likes: ${quote.likes} <span>0</span></button>
      <button class='btn-danger' data-id="${quote.id}">Delete</button>
    </blockquote>
    `
    quotesListEl.appendChild(newListQuote)

    const addLikes = e => {
        let currentLikes = quote.likes++
        currentLikes
        const newNumOfLikes = quote.likes
        fetch(`${quotesURL}/${quote.id}`, {
            method: 'PATCH', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        }).then(response => response.json())
        .then(newData => {
            e.target.innerHTML = `Likes: ${newNumOfLikes} <span>0</span>`
        })
    }

    const likeButton = document.querySelector(`[data-like-id="${quote.id}"`)
    likeButton.addEventListener('click', addLikes)
    

  

    const deleteButton = document.querySelector(`[data-id="${quote.id}"`)
    deleteButton.addEventListener('click', () => {
        fetch(`${quotesURL}/${quote.id}`, {
            method: 'DELETE',
        }).then(newListQuote.remove())
    })
}


