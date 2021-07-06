// 設定 API 
const BASIC_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASIC_URL + 'api/v1/movies/'
const POSTER_URL = BASIC_URL + 'posters/'
const LOCOSTORAGE = "Favorite Movie"

// 設定 DOM 節點
const dataPanel = document.querySelector('#data-panel')
// 設定 Movie List 存放位置
const movies = JSON.parse(localStorage.getItem(LOCOSTORAGE))


// 將清單放入 HTML 中
function renderMovieList(data) {
  let htmlContnet = ''
  data.forEach(movie => {
    htmlContnet += `
      <div class="col-sm-4 mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + movie.image}"
            class="card-img-top" alt="Movie-List">
          <div class="card-body text-center">
            <h6 class="card-title">${movie.title}</h6>
          </div>
          <div class="card-footer text-muted d-flex justify-content-center">
            <button class="btn btn-primary btn-show-movie mr-2" data-toggle="modal"
              data-target="#movie-modal-title" data-id=${movie.id}>More</button>
            <button class="btn btn-danger btn-delete" data-id="${movie.id}">X</button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = htmlContnet
}

// 顯示電影詳細資料即加入我的最愛
dataPanel.addEventListener('click', function (event) {
  const target = event.target
  if (target.matches('.btn-show-movie')) {
    console.log(target.dataset.id)
    console.log(typeof target.dataset.id)
    showMovieDetail(Number(target.dataset.id))
  } else if (target.matches('.btn-delete')) {
    deleteMovie(Number(target.dataset.id))
  }
})

renderMovieList(movies)

// 電影詳細資料
function showMovieDetail(id) {
  const title = document.querySelector('.modal-title')
  const date = document.querySelector('.movie-modal-date')
  const description = document.querySelector('.movie-modal-description')
  const img = document.querySelector('#movie-modal-image')

  axios.get(INDEX_URL + id)
    .then(res => {
      console.log(res.data.results)
      const movie = res.data.results
      title.innerHTML = movie.title
      date.innerHTML = 'Release date : ' + movie.release_date
      description.innerHTML = movie.description
      img.innerHTML = `
        <img src="${POSTER_URL}${movie.image}" alt="movie-poster" class="img-fluid">
      `
    })
    .catch(err => {
      console.log(err)
    })
}

// 刪除電影資料
function deleteMovie(id) {
  // findindex => 取得資料在陣列中的位子
  const movieIndex = movies.findIndex(movie => movie.id === id)
  console.log(movieIndex)
  // splice => 刪除陣列中的data
  movies.splice(movieIndex, 1)
  localStorage.setItem(LOCOSTORAGE, JSON.stringify(movies))
  renderMovieList(movies)
}






