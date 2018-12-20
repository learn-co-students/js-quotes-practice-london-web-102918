// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const apiURL = 'http://localhost:3000/quotes'
const quoteListEl = document.querySelector('#quote-list')
const quoteFormEl = document.querySelector('#new-quote-form')
const newQuoteTypeEl = document.querySelector('#new-quote')
const newAuthorTypeEl = document.querySelector('#author')


const fetchQuotes = () => {
  fetch(apiURL)
  .then(response => response.json())
  .then(renderQuotes)
}

const renderQuotes = (quotesArray) => {
  console.log(quotesArray)
  quotesArray.forEach(renderSingleQuote)
}

const renderSingleQuote = (quote) => {
  const quoteEl = document.createElement('li')
  quoteEl.className = "quote-card"
  quoteEl.innerHTML =
  `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button id = "qid-${quote.id}" class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' data-id=${quote.id}>Delete</button>
  </blockquote>`

  quoteListEl.append(quoteEl)

  const deleteButton = quoteEl.querySelector('.btn-danger')
  deleteButton.addEventListener('click', () => deleteQuote(quote, quoteEl))

  const likeButton = quoteEl.querySelector('.btn-success')
  likeButton.addEventListener('click', () => likeQuote(quote, quoteEl))
  }

const handleNewQuoteSubmit = (e) => {
  e.preventDefault()
  renderSingleQuote({
    quote: newQuoteTypeEl.value,
    author: newAuthorTypeEl.value
  })
  fetch(apiURL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "applicaton/json"
    },
    body: JSON.stringify({
      quote: newQuoteTypeEl.value,
      author: newAuthorTypeEl.value,
      likes: 0
    })
  }).then(response => response.json)

}


quoteFormEl.addEventListener('submit', handleNewQuoteSubmit)

const deleteQuote = (quote, quoteEl) => {
  fetch(apiURL + "/" + `${quote.id}`, {
    method: 'DELETE',
  }).then(
    quoteEl.remove())
  }

const likeQuote = (quote, quoteEl) => {

  let quoteLikes = ++ quote.likes
  console.log(quoteLikes)
  // updateLikes(quote, quoteLikes)


  fetch(`${apiURL}/${quote.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      likes: quoteLikes
    })
  }).then(res => res.json())
  .then(quote => {
    quoteEl.querySelector("#" + `qid-${quote.id}`).innerHTML = `Likes: ${quoteLikes}`
  })

}


fetchQuotes()
