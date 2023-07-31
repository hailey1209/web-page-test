const scroller = new Scroller(false) // 스크롤 객체 생성

window.onload =() => {
  // 데이터 로딩 페이지 구현하기
  
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
    for(let navMenu of navMenus){
      navMenu.classList.toggle('dark')
    }
    for(let icon of icons){  //모드 버튼의 display설정 변경
      icon.classList.contains('show') ? 
      icon.classList.remove('show')
      : icon.classList.add('show')
    }
    console.log(e.target)
  })

  //브라우저 상단으로 스크롤링
  const arrowUp = document.querySelector('.back-to-top')
  arrowUp.addEventListener('click', (e) => {
      history.pushState({}, '', `#`) //url 주소 초기화
      scroller.setScrollPosition({top:0, behavior: 'smooth'})
  })
  const logo = document.querySelector('header .logo')
  logo.addEventListener('click', (e) =>{
      e.preventDefault()  //a태그의 기본적인 동작을 제거
      history.pushState({},'',`/`)
      scroller.setScrollPosition({top:0, behavior:'smooth'})
  })

  
  // 스크롤 내렷을때 사이드 모달창 나오게하기
  const sideModal = document.querySelector('.side-modal-container')
  const sideModalCloseBtn =sideModal.querySelector('.side-modal-container .side-modal button')
  sideModal.classList.add("hidden") //브라우저 로딩과 동시에 안보이게
  function scrollAct(e){
    const pageYOffset = window.pageYOffset
    console.log(pageYOffset) 
    if(pageYOffset > 0 && pageYOffset < 200 ){
      sideModal.classList.add("hidden")
    }else if(pageYOffset > 200){
       sideModal.classList.remove("hidden")
    }
  }
  function closeSideModal(e){
    console.log(e.target)
    if(e.target.classList.contains('close-btn')){
      sideModal.classList.add('hidden')
    }
  }
  window.addEventListener('scroll', scrollAct)
  sideModalCloseBtn.removeEventListener('click', scrollAct)
  sideModalCloseBtn.addEventListener('click', closeSideModal)

  //네비게이션 바 메뉴 클릭 이벤트
  const navMenuBar =document.querySelectorAll('header .navBar .nav .menus')
  const navMenus = document.querySelectorAll('header .navBar .nav .menus > li .sub-menu')
  // console.log(navMenus)
  for(let i=0; i < navMenuBar.length; i++){
    function menudisplay(e){
      console.log(e.target)
      switch(e.target.innerText){
        case 'Menu':
          navMenus[0].style.display ='block'
          break
        case 'About':
          navMenus[1].style.display ='block'
          break
        case 'Contact':
          navMenus[2].style.display ='block'
          break
        case 'My page':
          navMenus[3].style.display = 'block'
          break
      }
    }
    //네비게이션 서브메뉴 닫기 이벤트 (닫기 가능하지만 오류 있음)
    function menuhide(e){
      console.log(e.target)
      if(e.target.innerText == 'menu'){
        navMenus[1].style.display = 'none'
        navMenus[2].style.display = 'none'
        navMenus[3].style.display = 'none'
      }
    }
    navMenuBar[i].addEventListener('click', menudisplay)
    navMenuBar[i].addEventListener('click', menuhide)
  }
}

//스크롤링 중에 일어나는 이벤트
window.addEventListener('scroll', function(e){
  //스크롤이 끝났는지 아닌지 체크하기
  scroller.isScrollended()
  .then(result => console.log('scroll eneded!'))
  .catch(err => console.log('scrolling...'))

  const header = document.querySelector('header')
   //스크롤링중에 어느정도 스크롤바를 내리면 헤더에 그림자 추가
   scroller.getScrollPosition() > header.offsetHeight ? 
   header.classList.add('active')
   : header.classList.remove('active')
})


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
      scrollBox.innerHTML = `<div class="cards ${i}">
                              <div class="img">
                                <img src="${data[i].image}" alt="">
                              </div>
                              <div class="description">
                                <h1>${data[i].name.slice(data[i].brand.length)}</h1>
                                <p>${data[i].brand}</p>
                              </div>
                              <button class="${i}">more</button>
                            </div>
                            <div class="card-right ${i}">
                              <div class="detail">
                                <h4>${data[i].brand}</h3>
                                <p>${data[i].product_type}</p>
                                <p>$${data[i].price}</p>
                                <p>${data[i].description}</p>
                                <button class="${i}">x</button>
                              </div>
                            </div>`
      cardWrapper.appendChild(scrollBox)
    }
    // 각각의 카드의 버튼을 클릭했을때 각 디테일 박스가 나와야하기 위해서 
    //카드, 열기버튼, 닫기버튼에 같은 인덱스 값을 클래스명으로 지정해주고
    //for문으로 돌려서 같은 인덱스값을 가진 요소들에 이벤트를 처리해준다
    
    //카드 팝업 박스 이벤트
    const cards = document.querySelectorAll('main .main-top .card-wrapper .scroll-box .cards')
    const card = document.querySelectorAll('main .main-top .card-wrapper .scroll-box .cards button')
    // console.log(card)
    const cardDetail = document.querySelectorAll('main .main-top .card-wrapper .card-right')
    const cardCloseBtn = document.querySelectorAll('main .main-top .card-wrapper .card-right .detail button')
    // console.log(card)
    // console.log(cardDetail)

    for(let i=0; i <cards.length; i++){
      card[i].addEventListener('click', function(e){
        console.log(card[i])
        if(e.target.classList.contains(`${i}`)){
          cardDetail[i].style.display = 'block'
          cards[i].style = 'border-radius: 0.5rem 0 0 0.5rem; transition: 0s;'
        }
      })
      
      cardCloseBtn[i].addEventListener('click', function(e){
        if(e.target.classList.contains(`${i}`)){
          cardDetail[i].style.display = 'none'
          cards[i].style = 'border-radius: 0.5rem; transition: 0s;'
        }
      })
    }

    // 다크모드
    const mode = document.querySelector('.mode')
    const cardHeadings = document.querySelectorAll('main .main-top .scroll-box .cards .description h1')
    mode.addEventListener('click', function(e){
      for(let h of cardHeadings){
        h.classList.toggle('dark')
      }
    })
    //스크롤 할때마다 resultbox 추가하기
    const resultWrapper =document.querySelector('main .main-mid .search-result-container .result-wrapper')
    function getResultList(num){
      for(let i=0; i < num; i++ ){
        const resultList = document.createElement('div')
        resultList.className = 'result-box'
        resultList.innerHTML = `<img src="${data[i].image}" alt="">
                                <div class="content">
                                  <h1><a href="${data[i].itemLink}">${data[i].name.slice(data[i].brand.length)}</a></h1>
                                  <div>
                                    <p>${data[i].itemType}</p>
                                    <p>$${data[i].price}</p>
                                  </div>
                                </div>`
        resultWrapper.appendChild(resultList)
      }
    }
    window.addEventListener('load', getResultList(data.length)) //브라우저가 로딩되었을때 기본으로 보여지는 박스
    window.addEventListener('scroll', (e)=> {
      // const resultList = document.querySelector('.result-box')
      const scrollHeight =  Math.max(   // 전체문서 높이 (스크롤이벤트 내부에 있어야 함)
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
      );
      // console.log(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight))
      if(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight) < 50){
        console.log('scroll is bottom of browser')
        getResultList(data.length)
      }
    })
  })
}

loadApi('http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline')
.then(data => loadData(data))
.then(data => showApiData(data))

