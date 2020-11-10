const unlocks = document.querySelectorAll('button.discover.unlock')
const locked_rows = document.querySelectorAll('tr.locked')

unlocks.forEach((u)=>{
    u.addEventListener('mouseover',()=>{
        u.children[1].setAttribute('class', 'fas fa-unlock')


    })
    u.addEventListener('mouseleave',()=>{
        u.children[1].setAttribute('class', 'fas fa-lock')


    })
})

locked_rows.forEach(r=>{
    let height = r.clientHeight
    

    const blocker = r.lastElementChild;
    blocker.style.height=`${height}px`


})