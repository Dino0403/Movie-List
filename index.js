// 設定 API 
const BASIC_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASIC_URL + 'api/v1/movies/'
const POSTER_URL = BASIC_URL + 'posters/'
const LOCOSTORAGE = "Favorite Movie"

// 設定 DOM 節點
const dataPanel = document.querySelector('#data-panel')
const searchInput = document.querySelector('#submit-input')
const searchForm = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const mode = document.querySelector('#mode')

// 預設 mode 
let nowMode = 'card'

// 設定 Movie List 存放位置
const movies = []
let filterMoveis = []

// 預設每頁有 12 筆資料
const MOVIE_PER_PAGES = 12

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
            <button class="btn btn-info btn-add-favorite" data-id="${movie.id}">+</button>
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
  } else if (target.matches('.btn-add-favorite')) {
    console.log(target.dataset.id)
    addFavoriteMoive(Number(target.dataset.id))
  }
})

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

// 我的最愛
function addFavoriteMoive(id) {
  console.log(id)
  const lists = JSON.parse(localStorage.getItem(LOCOSTORAGE)) || []
  // find => 找到第一個符合條件的 item 後就回停下來回傳該 item
  const movie = movies.find(movie => movie.id === id)
  // some => 與 find 使用方式類似，但只會回報「陣列裡有沒有 item 通過檢查條件」，有的話回傳 true ，到最後都沒有就回傳 false。
  if (lists.some(movie => movie.id === id)) {
    return alert('此電影已經在清單中')
  }
  lists.push(movie)
  console.log(lists)
  localStorage.setItem(LOCOSTORAGE, JSON.stringify(lists))
}


// 搜尋功能
searchInput.addEventListener('click', function (event) {
  event.preventDefault()
  let value = searchForm.value.toLowerCase().trim()
  filterMoveis = movies.filter(movie => {
    if (movie.title.toLowerCase().includes(value)) {
      return movie
    }
  })
  if (filterMoveis.length === 0) {
    alert(`關鍵字: [${value}] 無搜尋到相關電影`)
  }
  if (nowMode === 'card') {
    renderPaginator(filterMoveis.length)
    renderMovieList(getMovieListPage(1))
  } else {
    renderPaginator(filterMoveis.length)
    renderListMode(getMovieListPage(1))
  }
})

// 分頁功能
function getMovieListPage(page) {
  // 計算起始 index
  const data = filterMoveis.length ? filterMoveis : movies
  const startIndex = (page - 1) * MOVIE_PER_PAGES
  // 回傳
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGES)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGES)
  let htmlContnet = ''
  for (let i = 1; i <= numberOfPages; i++) {
    htmlContnet += `<li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>`
  }
  paginator.innerHTML = htmlContnet
}

paginator.addEventListener('click', function (event) {
  const target = event.target
  const page = target.dataset.page
  if (target.tagName !== 'A') {
    return
  }
  if (nowMode === 'card') {
    renderMovieList(getMovieListPage(page))
  } else {
    renderListMode(getMovieListPage(page))
  }
})

// 切換 Mode
mode.addEventListener('click', function (event) {
  const target = event.target
  if (target.matches('#card-mode')) {
    nowMode = 'card'
    renderMovieList(getMovieListPage(1))
  } else if (target.matches('#list-mode')) {
    nowMode = 'list'
    renderListMode(getMovieListPage(1))
  }
})

function renderListMode(data) {
  let rawHTML = ''
  rawHTML += '<table class="table"><tbody>'
  data.forEach(item => {
    rawHTML += `
     <tr>
       <td class="col-8 list">
         <h5 class="card-title">${item.title}</h5>
      </td>
       <td class="col-4 buttonTD text-right">
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
// 串接 API
axios.get(INDEX_URL)
  .then(res => {
    const moviesAPI = res.data.results
    moviesAPI.forEach(movie => {
      movies.push(movie)
    })
    renderPaginator(movies.length)
    renderMovieList(getMovieListPage(1)) // 預設產生第一頁內容
  })
  .catch(err => {
    console.log(err)
  })