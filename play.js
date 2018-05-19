import slides from './slides.js'

let slide = 0, showHud = false, presenter = null

const next = () =>
  slide < slides.length - 1
    ? ++slide
    :
    slide

const prev = () =>
  slide > 0
    ? --slide
    :
    0

class Keys {
  Space() {
    video.paused
      ? video.play()
      : video.pause()
  }

  ArrowUp() {
    video.currentTime += frameTime
  }

  ArrowDown() {
    video.currentTime -= frameTime
  }

  ArrowRight() {
    if (slide === next(slide)) return
    const currentSlide = slides[slide]
    video.currentTime = currentSlide.time
    video.play()
  }

  KeyP() {
    presenter = window.open('presenter')
  }

  ArrowLeft() {
    const currentSlide = slides[slide]
    const timeOnSlide = video.currentTime - currentSlide.time
    const targetSlide =
      timeOnSlide <= 1
        ? slides[prev(slide)]
        : currentSlide
    video.currentTime =
      targetSlide
        ? targetSlide.time
        : 0
    video.play()
  }

  Backquote() {
    hud.hidden = !hud.hidden
  }

  default(evt) {
    console.log(evt)
  }
}

const frameRate = 29.97
const frameTime = 1 / frameRate
function tick(ts) {
  requestAnimationFrame(tick)

  const {currentTime} = video
  const currentSlide = slides[slide]

  if (!hud.hidden) {
    time.textContent = currentTime
    hudSlide.textContent = slide
  }

  if (presenter) {
    presenter.time.textContent = currentTime
    presenter.slide.textContent = slide
    presenter.slideTitle.textContent = currentSlide.title
  }

  const nextSlide = slides[slide + 1]
  if (!nextSlide) return

  if (currentTime >= nextSlide.time) {
    video.pause()
    video.currentTime = nextSlide.time - frameTime
  }
}
tick()

const bindings = new Keys
window.addEventListener('keydown',
  evt =>
    evt.code in bindings
      ? bindings[evt.code](evt)
      :
      bindings.default(evt)
)