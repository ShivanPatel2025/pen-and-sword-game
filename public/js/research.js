const unlocks = document.querySelectorAll('button.discover.unlock')
const locked_rows = document.querySelectorAll('tr.locked')
const selectors = document.querySelectorAll('div.research_selector h3')
const table_containers = document.querySelectorAll('div.research_container div')

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

selectors.forEach(s=>{
    s.addEventListener('click',()=>{
        let id= s.getAttribute('id')
        let disp= document.querySelector(`div#${id}`)
        selectors.forEach(sel=>{
            sel.classList.remove('highlight')
        })
        s.classList.add('highlight')
        table_containers.forEach(t=>{
            t.classList.remove('top_zero')
            t.classList.remove('opacity_full')
            setTimeout(()=>{
                t.classList.remove('block')
            },300)
        })
        setTimeout(()=>{
            disp.classList.add('block')

        },305)
        setTimeout(()=>{
            disp.classList.add('top_zero')
            disp.classList.add('opacity_full')

        },400)


    })

})

