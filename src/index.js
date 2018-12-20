// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

const quoteApi = 'http://localhost:3000/quotes'
const quoteListEl = document.querySelector('#quote-list')
const quoteEl = document.querySelector('#new-quote')
const authorEl = document.querySelector('#author')
const quoteFormEl = document.querySelector('#new-quote-form')

const fetchQuotes = () => {
  fetch(quoteApi)
  .then(response => response.json())
  .then(renderQuotes)
}

const renderQuotes = (quotesArray) => {
  console.log(quotesArray)
  quotesArray.forEach(renderSingleQuote)
}

const renderSingleQuote = (quote) => {
  const quoteEl = document.createElement('li')
  quoteEl.className = 'quote-card'
  quoteEl.innerHTML =
  `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button id="like-${quote.id}" class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' data-id=${quote.id}>Delete</button>
  </blockquote>`
  
  quoteListEl.append(quoteEl)

  const deleteBtn = quoteEl.querySelector('.btn-danger')
  deleteBtn.addEventListener('click', (event) => deleteQuote (quote, quoteEl))

  const likeBtn = quoteEl.querySelector('.btn-success')
  likeBtn.addEventListener('click', (event) => likeQuote (quote, quoteEl))

}

const likeQuote = (quote, quoteEl) => {
    let updatedLikes = ++quote.likes
    console.log(updatedLikes)

    // debugger
    fetch(quoteApi + `/${quote.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({likes: updatedLikes})
    }).then(res => res.json())
    .then(quote => {
        quoteEl.querySelector("#" + `like-${quote.id}`).innerHTML = `Likes: ${updatedLikes}`
    })
  }

const deleteQuote = (quote, quoteEl) => {
    return fetch(quoteApi + `/${quote.id}`, {
        method: 'DELETE',
        }).then(quoteEl.remove())
}

const saveNewQuote = (event) => {
    event.preventDefault()
    console.log(event)
    const quote = quoteEl.value
    const author = authorEl.value
    renderSingleQuote({
      quote: quote,
      author: author
    })
  
    fetch(quoteApi, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        quote: quote,
        author: author
      })
    }).then(console.log)
    .then(quoteFormEl.reset())
  }

quoteFormEl.addEventListener('submit', saveNewQuote)

fetchQuotes()