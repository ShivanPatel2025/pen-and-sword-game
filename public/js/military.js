const name = document.getElementById('name')
const description = document.getElementById('description')
const current = document.getElementById('current').lastChild;

const enlist = document.querySelector('form#enlist input')
const discharge = document.querySelector('form#discharge input')
const attackable = document.getElementById('attackable')
const OPower = document.getElementById('OPower').lastChild.children[0]
const DPower = document.getElementById('DPower').lastChild.children[0]
const cost = document.getElementById('cost').lastChild.children[0]
const image = document.getElementById('image')

const display = document.querySelector('div.troop_display');


const groundSelections = document.querySelectorAll('div.select');
let selected = 'Warrior';


groundSelections.forEach((selection)=>{
    
    selection.addEventListener('click',()=>{
        let troop_name = selection.getAttribute('name');
        console.log(troop_name);
        console.log(selected);

        console.log(selected!==troop_name);
        if(selected!==troop_name){
            display.classList.add('troop_display_disappear');
            groundSelections.forEach((s)=>{
                s.children[0].classList.remove('circle_selected')
                s.children[1].classList.remove('bold')
            })
            selection.children[0].classList.add('circle_selected')
            selection.children[1].classList.add('bold')
            setTimeout(()=>{
                
                name.innerHTML = name.getAttribute(troop_name)
                description.innerHTML = description.getAttribute(troop_name);
                current.innerHTML= current.getAttribute(troop_name);
                enlist.setAttribute('name',troop_name);
                discharge.setAttribute('name',troop_name);
                attackable.innerHTML=attackable.getAttribute(troop_name )
                OPower.innerHTML=OPower.getAttribute(troop_name )
                DPower.innerHTML=DPower.getAttribute(troop_name)
                cost.innerHTML=cost.getAttribute(troop_name)
                image.setAttribute('data',`../media/${troop_name}.svg`)
                setTimeout(()=>{
                    display.classList.remove('troop_display_disappear');
                    selected = troop_name;
        
                },200)
            },500)
        }

    })
})


