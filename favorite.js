const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
console.log(movies)

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
// render MovieList
function renderMovieList(data) {
  let htmlContent = ''

  // process data
  data.forEach(movie => {
    console.log(movie)
    // title image
    htmlContent += `
     <div class="col-sm-3 mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + movie.image}"
            class="card-img-top" alt="Movie-List">
          <div class="card-body">
            <h6 class="card-title">${movie.title}</h6>
          </div>
          <div class="card-footer text-muted d-flex justify-content-center">
            <button class="btn btn-primary btn-show-movie mr-2" data-toggle="modal"
              data-target="#movie-modal-title" data-id=${movie.id}>More</button>
            <button class="btn btn-danger btn-add-favorite" data-id="${movie.id}">X</button>
          </div>
        </div>
      </div>
    </div>
    
    `
  })
  dataPanel.innerHTML = htmlContent
}

renderMovieList(movies)

// movie description
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const target = event.target
  if (target.classList.contains('btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.classList.contains('btn-add-favorite')) {
    removeFavoriteMovie(Number(target.dataset.id))
  }
})

function showMovieModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('.movie-modal-data')
  const modalDescription = document.querySelector('.movie-modal-description')
  axios.get(INDEX_URL + id)
    .then(res => {
      const data = res.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image
        }" alt="movie-poster" class="img-fluid">`
    })
    .catch(err => console.log(err))
}

function removeFavoriteMovie(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)
  console.log(movieIndex)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

