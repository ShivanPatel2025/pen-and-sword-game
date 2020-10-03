



const types = document.querySelectorAll('div.military_buttons span');
const selections = document.querySelectorAll('div.select');
let selected = 'Warrior';


selections.forEach((selection)=>{
    
    selection.addEventListener('click',()=>{
        let troop_name = selection.getAttribute('name').toLowerCase();
        let id = selection.parentElement.getAttribute('id');
        

        const name = document.getElementById(`name_${id}`)
        const description = document.getElementById(`description_${id}`)
        const current = document.getElementById(`current_${id}`).lastChild;

        const enlist = document.querySelector(`form#enlist_${id} input`)
        const discharge = document.querySelector(`form#discharge_${id} input`)
        const attackable = document.getElementById(`attackable_${id}`)
        const OPower = document.getElementById(`OPower_${id}`).lastChild.children[0]
        const DPower = document.getElementById(`DPower_${id}`).lastChild.children[0]
        const cost = document.getElementById(`cost_${id}`).lastChild
        const image = document.getElementById(`image_${id}`)

        const display = document.getElementById(`display_${id}`);
        

        display.classList.remove('top_zero');
        display.classList.remove('opacity_full');
        selections.forEach((s)=>{
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
            
            cost.innerHTML='';
            for( const c in costs[troop_name]){
                let cost_line = document.createElement('div');
                let cost_num = document.createElement('span');
                let cost_var = document.createElement('img');
                cost_line.setAttribute('class', 'cost_line')
                cost_num.innerHTML = costs[troop_name][c];
                cost_var.setAttribute('src',`../media/${c}.png`)
                cost_line.appendChild(cost_num);
                cost_line.appendChild(cost_var);
                cost.appendChild(cost_line)

            }
            image.setAttribute('data',`../media/${troop_name}.svg`)
            setTimeout(()=>{
                display.classList.add('top_zero');
                display.classList.add('opacity_full');
                selected = troop_name;
    
            },200)
        },500)
        

    })
})

types.forEach((type)=>{
    let id =  type.innerHTML.toLowerCase();
    type.addEventListener('click',()=>{
        const display = document.getElementById(`display_${id}`);
        const selection = document.querySelector(`div.troop_selection#${id}`);
        const displays = document.querySelectorAll('div.troop_display');
        const selections_type = document.querySelectorAll(`div.troop_selection`);

        types.forEach(t=>{
            t.classList.remove('bold');
            t.classList.remove('highlight')
        })
        type.classList.add('bold')
        type.classList.add('highlight')

        displays.forEach((d)=>{
            d.classList.remove('opacity_full')
            d.classList.remove('top_zero')
            setTimeout(()=>{
                d.classList.remove('flex')
            },500)

        })
        selections_type.forEach((s)=>{
            s.classList.remove('opacity_full')
            s.classList.remove('top_zero')
            setTimeout(()=>{
                s.classList.remove('flex')
            },500)

        })

        setTimeout(()=>{
            display.classList.add('flex')
            selection.classList.add('flex')

        },510)

        setTimeout(()=>{
            display.classList.add('opacity_full')
            display.classList.add('top_zero')
            selection.classList.add('opacity_full')
            selection.classList.add('top_zero')
        },600)

        const first_selection  = document.querySelector(`div.troop_selection#${id}`).children[0].children[0];
        first_selection.classList.add('circle_selected');
        


    })
    
})


// Cost structures


const costs = {
    'warrior':{'gold':5},
    'archer':{'gold':7,'lumber':2},
    'cavalry': {'gold':20,'fauna':4, 'lumber':10},
    'blimp':{'gold':130, 'lumber':30, 'steel':50},
    'harpy':{'gold':60,'mana':5,'fauna':3},
    'angel':{'gold':60,'mana':15,'silver':15},
    'galley':{'gold':50, 'lumber':40, 'steel':30},
    'pirate':{'gold':25, 'lumber':70, 'steel':10},
    'serpent':{'gold':60, 'mana':250, 'fauna':5},
    'catapult':{'gold':250,'lumber':310},
    'trebuchet':{'gold':600,'lumber':400},
    'cannon':{'gold':1000,'iron':75,'steel':150}


}