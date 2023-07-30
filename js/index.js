const scroller = new Scroller(false) // 스크롤 객체 생성

window.onload =() => {

  // 새로고침시 페이지 상단으로 올리기
  scroller.setScrollPosition({top:0, behavior:'smooth'})
  // 테마 변경(다크 / 일반)
  const mode = document.querySelector('.mode')
  const icons = document.querySelectorAll('header .navBar .mode .material-symbols-outlined')
  const menuBtn = document.querySelectorAll('header .navBar .nav .menus')
  const header =document.querySelector('header')
  const hamBtn = document.querySelector('.hambtn')
  const nav = document.querySelector('.navBar')

  mode.addEventListener('click', (e) => {
    document.body.classList.toggle('dark')
    nav.classList.toggle('dark')
    header.classList.toggle('dark')
    // hamBtn.classList.toggle('dark')
    
    for(let btn of menuBtn){  //메뉴 버튼이 여러개라서 for문으로 돌려서 하나씩 지정해줌
      btn.classList.toggle('dark')
    }

    for(let icon of icons){  //모드 버튼의 display설정 변경
      icon.classList.contains('show') ? 
      icon.classList.remove('show')
      : icon.classList.add('show')
    }
    console.log(e.target)
  })
}

// 모달창 열기
const openModalBtn = document.querySelector('header .navBar .modal button')
const closeModalBtn = document.querySelector('header .navBar .modal-window button')
const modalWindow = document.querySelector('header .navBar .modal-window')

console.log(openModalBtn)
function openModal(){
  let btnPosition = openModalBtn.getBoundingClientRect()
  modalWindow.style.left = (btnPosition.left-150) + 'px'
  modalWindow.style.top =  (btnPosition.bottom +20) +'px'

  modalWindow.classList.add('show')
  console.log(document.body.clientWidth)
  setTimeout(closeModal,5000)
}

// 모달창 닫기
function closeModal(){
  modalWindow.classList.remove('show')
  console.log(document.body.clientWidth)
}
openModalBtn.addEventListener('click', openModal)
closeModalBtn.removeEventListener('click', openModal)
closeModalBtn.addEventListener('click', closeModal)

// 마우스 가로 스크롤 이벤트 
const scrollBox =document.querySelector('main .main-top .card-wrapper')

let isDown = false
let startX
let scrollLeft

scrollBox.addEventListener('mousedown', e => {
  isDown = true
  scrollBox.classList.add('scroll-active')
  startX = e.pageX - scrollBox.offsetLeft
  scrollLeft = scrollBox.scrollLeft
})

function deactive(){
  isDown = false
  scrollBox.classList.remove('scroll-active')
}

scrollBox.addEventListener('mouseleave', deactive)
scrollBox.addEventListener('mouseup', deactive)

scrollBox.addEventListener('mousemove', e => {
  if(!isDown) return
  e.preventDefault()
  const x= e.pageX -scrollBox.offsetLeft
  const walk = x - startX
  scrollBox.scrollLeft = scrollLeft - walk
})

//Api 데이터 가져오기
function loadApi(url){
  return fetch('http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline')
  .then(response => response.json())
  // .then(response => console.log(response))
}
function loadData(data){
  const datas = data
  const dataList = []
  for(let itemData of datas){
    const brand = itemData.brand
    const name = itemData.name
    const price = itemData.price
    const description = itemData.description
    const image = itemData.image_link
    const itemLink = itemData.product_link
    const itemType = itemData.product_type
    const dataObj = {brand, name, price, description, image, itemLink,itemType}
    dataList.push(dataObj)
  }
  return dataList
}
function showApiData(data){
  return new Promise(function(resolve, reject){
    for(let i=0; i <data.length; i++){
      console.log(data.length)
      const cardWrapper = document.querySelector('main .main-top .card-wrapper')
      const scrollBox = document.createElement('div')
      scrollBox.className = 'scroll-box'
      scrollBox.innerHTML = `<div class="cards">
                      <img src="${data[i].image}" alt="">
                      <div class="description">
                        <h1>${data[i].name}</h1>
                        <p>${data[i].brand}</p>
                      </div>
                      <button>more</button>
                    </div>
                    <div class="card-right">
                      <div class="detail">
                      <h4>${data[i].brand}</h3>
                      <p>${data[i].product_type}</p>
                      <p>$${data[i].price}</p>
                      <p>${data[i].description}</p>
                      <button>x</button>
                    </div>
                  </div>`
      cardWrapper.appendChild(scrollBox)
    }

    //카드 팝업 박스 이벤트
const card = document.querySelector('main .main-top .card-wrapper .scroll-box .cards button')
console.log(card)
const cardDetail = document.querySelector('main .main-top .card-wrapper .card-right')
const cardCloseBtn = document.querySelector('main .main-top .card-wrapper .card-right .detail button')
console.log(card)
console.log(cardDetail)

card.addEventListener('click', function(e){
  console.log(e.target)
  if(e.target == card){
    cardDetail.style.display = 'block'
  }
})
cardCloseBtn.addEventListener('click', function(e){
  console.log(e.target)
  if(e.target == cardCloseBtn){
    cardDetail.style.display = 'none'
  }
})

// 다크모드
const mode = document.querySelector('.mode')
const cardHeadings = document.querySelectorAll('main .main-top .scroll-box .cards .description h1')
mode.addEventListener('click', function(e){
  for(let h of cardHeadings){
    h.classList.toggle('dark')
  }
})

})
}

loadApi('http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline')
.then(data => loadData(data))
// .then(data => console.log(data))
.then(data => showApiData(data))

