const trades_selector = document.querySelectorAll('div.trades_selector h2')
const main_frames = document.querySelectorAll('div.trades_display div.disp')

const toggle_area = document.querySelector('div.toggle_area')
const personal_toggle = document.querySelector('h3#personal')
const global_toggle = document.querySelector('h3#global')
const toggler = document.querySelector('div.toggler')

const trader = document.querySelector('div.trader')
const submit_btn = document.querySelector('div#create form button')


personal_toggle.addEventListener('click',()=>{
    let c = toggler.getAttribute('class')
    

    if(c.length>7){
        toggler.classList.remove('toggle_on_trade')
        global_toggle.classList.remove('bold')
        personal_toggle.classList.add('bold')
        trader.classList.add('opacity_full')
        submit_btn.classList.remove('submit_move_up')
        

        
    }
})
global_toggle.addEventListener('click',()=>{
    let c = toggler.getAttribute('class')
    console.log(c)
    if(c.length<=7){
        toggler.classList.add('toggle_on_trade')
        personal_toggle.classList.remove('bold')

        global_toggle.classList.add('bold')
        trader.classList.remove('opacity_full')
        submit_btn.classList.add('submit_move_up')

    }
})

trades_selector.forEach(s=>{
    s.addEventListener('click',()=>{
        trades_selector.forEach(t=>{
            t.classList.remove('highlight')

        })
        setTimeout(()=>{
            s.classList.add('highlight')

        },50)
        



        let id = s.getAttribute('id')
        let target = document.querySelector(`div#${id}`)
        main_frames.forEach(m=>{
            m.classList.remove('opacity_full')
            m.classList.remove('top_zero')
            setTimeout(()=>{
                m.classList.remove('flex')
            },300)
        })
        
        

        setTimeout(()=>{
            target.classList.add('flex')
            
        },305)
        setTimeout(()=>{
            target.classList.add('opacity_full')
            target.classList.add('top_zero')
            
        },400)

        
        

    })
    

    
})