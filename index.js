const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'

const paginator = document.querySelector('#paginator')
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const mode = document.querySelector('#mode')
let nowMode = 'card'

const movies = []
let filteredMovies = []
const MOVIES_PER_PAGE = 12

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
            <button class="btn btn-info btn-add-favorite" data-id="${movie.id}">+</button>
          </div>
        </div>
      </div>
    </div>
    
    `
  })
  dataPanel.innerHTML = htmlContent
}

// movie description
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const target = event.target
  if (target.classList.contains('btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.classList.contains('btn-add-favorite')) {
    addToFavorite(Number(target.dataset.id))
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

// localSotrage
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在清單中')
  }
  list.push(movie)
  console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// search movie
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyWord = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(keyWord)
  })
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyWord} 沒有符合條件的電影`)
  }
  if (nowMode === 'card') {
    renderPaginator(filteredMovies.length)
    renderMovieList(getMovieByPage(1))
  } else {
    renderPaginator(filteredMovies.length)
    renderListModeMovieList(getMovieByPage(1))
  }
})


// paginator
function getMovieByPage(page) {
  // page 1 => 0 ~ 11
  // page 2 => 12~ 24
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amout) {
  // 計算總頁數
  const numberOfPages = Math.ceil(amout / MOVIES_PER_PAGE)
  // 製作 template
  let rawHtml = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHtml
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  const target = event.target
  if (target.tagName !== 'A') return
  const page = Number(target.dataset.page)

  if (nowMode === 'card') {
    renderMovieList(getMovieByPage(page))
  } else {
    renderListModeMovieList(getMovieByPage(page))
  }
})


// change mode
mode.addEventListener('click', function onViewModeClick(event) {
  if (event.target.matches('#card-mode')) {
    nowMode = 'card'
    renderMovieList(getMovieByPage(1))
  } else if (event.target.matches('#list-mode')) {
    nowMode = 'list'
    renderListModeMovieList(getMovieByPage(1))
  }
})

function renderListModeMovieList(data) {
  let rawHTML = ''
  rawHTML += '<table class="table"><tbody>'
  data.forEach(item => {
    rawHTML += `
     <tr>
       <td>
         <h5 class="card-title">${item.title}</h5>
      </td>
       <td>
          <button class="btn btn-primary btn-show-movie mr-2" data-toggle="modal"
              data-target="#movie-modal-title" data-id=${item.id}>More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
       </td>
     </tr>
    `
  });
  rawHTML += '</tbody></table>'
  dataPanel.innerHTML = rawHTML
}

// axios get movies API
axios.get(INDEX_URL)
  .then(res => {
    const data = res.data.results
    movies.push(...data)
    renderPaginator(movies.length)
    renderMovieList(getMovieByPage(1))
  })
  .catch(err => console.log(err))