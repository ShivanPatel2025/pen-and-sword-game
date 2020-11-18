const greeting = document.querySelector('div.greeting')
const shade = document.querySelector('div.greeting_shade')
const greeting_close = document.querySelector('div.greeting div.close')

greeting_close.addEventListener('click',()=>{
    shade.classList.remove('opacity_full')
    greeting.style.top='-100vh'
    setTimeout(()=>{
        shade.style.zIndex='-1';
        

    },260)
})