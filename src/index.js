// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.getElementById('quote-list')
  const apiURL = 'http://localhost:3000/quotes/'
  const quoteInputEl = document.getElementById('new-quote')
  const authorInputEl = document.getElementById('author')
  const newQuoteFormEl = document.getElementById('new-quote-form')

  const getQuotes = () => {
    fetch(apiURL)
      .then(reponse => reponse.json())
      .then(json => {
        state.quotes = json
        showAllQuotes(state.quotes)
      })
  }

  const showAllQuotes = (json) => {
    for (const quote of json) {
      showOneQuote(quote)
    }
  }

  const showOneQuote = (quote) => {
    let quoteLi = document.createElement('li')
    quoteLi.className = 'quote-card'
    quoteLi.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    let deleteButton = quoteLi.querySelector('.btn-danger')
    deleteButton.setAttribute('data-delete', `${quote.id}`)
    deleteButton.addEventListener('click', deleteQuote)
    let likeButton = quoteLi.querySelector('.btn-success')
    likeButton.setAttribute('data-like', `${quote.id}`)
    likeButton.addEventListener('click', () => likeQuote(quote))
    quoteList.appendChild(quoteLi)
  }

  const deleteQuote = (event) => {
    let quoteID = event.target.dataset.delete
    fetch(apiURL + `${quoteID}`, {
      method: 'DELETE'
    })
      .then(event.target.parentElement.parentElement.remove())
  }

  const addNewQuote = (event) => {
    event.preventDefault()
    let newQuote = {
      quote: quoteInputEl.value,
      likes: 0,
      author: authorInputEl.value
    }
    fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuote)
    })
      .then(state.quotes << newQuote)
      .then(showOneQuote(newQuote))
  }

  const likeQuote = (quote) => {
    state.currentQuote = quote
    let likes = state.currentQuote.likes
    let newLikes = likes += 1
    state.currentQuote.likes++
    let likedQuoteButton = document.querySelector(`[data-like='${state.currentQuote.id}']`)
    // debugger
    fetch(apiURL + state.currentQuote.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(likedQuoteButton.firstElementChild.innerText = newLikes)
  }

  newQuoteFormEl.addEventListener('submit', addNewQuote)
  getQuotes()
})

const state = {
  quotes: '',
  currentQuote: ''
}
