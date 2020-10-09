const nav = document.createElement('nav');
const logo = document.createElement('img');
logo.setAttribute('src',"https://cdn.discordapp.com/attachments/577269190835044362/723302943130124328/Text_Logo_1_24_50.png")
const menu_container = document.createElement('div');
menu_container.setAttribute('class', 'menu')
const menu_title = document.createElement('h3')
menu_title.innerHTML = 'Menu'
const menu_bars = document.createElement('div')
menu_bars.setAttribute('class','menu_bars')
for(let i=0;i<3;i++){
    const bar = document.createElement('i')
    menu_bars.appendChild(bar)
}

menu_container.appendChild(menu_title)
menu_container.appendChild(menu_bars)
nav.appendChild(logo)
nav.appendChild(menu_container)

const body = document.querySelector('body')
body.appendChild(nav)




const nav_overlay = document.createElement('div')
nav_overlay.setAttribute('class','nav_overlay')
const col1 = document.createElement('div');
const col2 = document.createElement('div');
col1.setAttribute('class','nav_col')
col2.setAttribute('class','nav_col')
nav_overlay.appendChild(col1)
nav_overlay.appendChild(col2)

const links = [
    'Kingdom' ,
    'Province' ,
    'Guild' ,
    'Military' ,
    'War' ,
    'Arena' ,
    'Wonders' ,
    'Trade' ,
    'Research' ,
    'Logout' 
]
let count = 0;
links.forEach(link=>{
    let name =  link;
    let route = link.toLowerCase();
    let h2 =document.createElement('h2')
    let a = document.createElement('a')
    a.setAttribute('href',route)
    h2.innerHTML=link
    a.appendChild(h2)
    count<5? col1.appendChild(a) : col2.appendChild(a)
    count++
    
})
body.appendChild(nav_overlay);
let show = false;
let showing = false

menu_container.addEventListener('click',()=>{
    if(showing===false){
        show ? show = false : show = true;
        showing = true
        
        nav_overlay.classList.toggle('show_nav')
        const link_list = document.querySelectorAll(".nav_overlay a")
        let inc = 0
        if(show===true){
            let count=0;
            
            link_list.forEach(link=>{
                inc+=100
                setTimeout(()=>{
                    link.classList.toggle('one_nav_animation')
                    link.classList.toggle('two_nav_animation')
                    body.classList.add('stop_scroll')
                    count++
                    if(count===10){
                        showing=false
                    }
                },inc)
            })
        }else{
            link_list.forEach(link=>{
                link.classList.remove('one_nav_animation')
                body.classList.remove('stop_scroll')
                setTimeout(()=>{
                    link.classList.remove('two_nav_animation')
                    showing=false
                },1100)
                
            })

        } 
    }
        
    
        
    
})