
const all_plan_offensives = document.querySelectorAll('h2.plan_offensive')



const all_prepare_attacks = document.querySelectorAll('div.prepare_attack')
const prepare_attack_overlay = document.querySelector('div.prepare_attack_overlay')


const war_selections = document.querySelectorAll('div.war_selection_circles div.select')
const war_button_selections = document.querySelectorAll('div.war_buttons span')

const prepare_attack_selections = document.querySelectorAll('div.prepare_attack_selection')


const war_selection_circles = document.querySelector('div.war_selection_circles_container')
const war_control_panel = document.querySelector('div.war_control_panel')


const closes = document.querySelectorAll('div.close')

war_selection_circles.style.height = `${war_selection_circles.clientHeight}px`;
const dummy_war = document.querySelector('div.war')


// const h = document.querySelectorAll('form')

// h.forEach(i=>{
//     let id = i.parentElement.getAttribute('id')
//     i.children[0].setAttribute('value',id);
// })

setTimeout(()=>{
    let control_panel_height = document.querySelectorAll('div.war')[0].clientHeight
    console.log(control_panel_height)
    war_control_panel.style.height = `${dummy_war.clientHeight}px`;

},200)








//open prepare attack
all_plan_offensives.forEach(plan=>{
    
    plan.addEventListener('click',()=>{
        let id = plan.parentElement.getAttribute('id'); 
        let stance = plan.parentElement.getAttribute('type'); 
        console.log(id)
        const prepare_attack_window = document.querySelector(`div.prepare_attack.${stance}#${id}`)
        const prepare_attack_windows = document.querySelectorAll(`div.prepare_attack.${stance}`)
        if(prepare_attack_window){

            prepare_attack_windows.forEach(p=>{
                p.classList.remove('flex')
                p.classList.remove('opacity_full')
            })


            prepare_attack_overlay.classList.add('flex')
            prepare_attack_window.classList.add('flex')


            setTimeout(()=>{
                prepare_attack_overlay.classList.add('opacity_full')
                prepare_attack_window.classList.add('opacity_full')

            },100)


        }
        
        
    
    })

})

//prepare attack selections

prepare_attack_selections.forEach(selection=>{
    let id = selection.parentElement.getAttribute('id')
    let stance = selection.parentElement.getAttribute('type');
    const h2s = document.querySelectorAll(`div.prepare_attack.${stance}#${id} h2.val`)
    const form = document.querySelector(`div.prepare_attack.${stance}#${id} form`)
    
    console.log(h2s)
    for(let i=0;i<selection.childElementCount;i++){
        selection.children[i].addEventListener('click',()=>{

            for(let j=0;j<selection.childElementCount;j++){
                selection.children[j].children[0].classList.remove('circle_selected')
                selection.children[j].children[1].classList.remove('bold')
            }
            selection.children[i].children[0].classList.add('circle_selected')
            selection.children[i].children[1].classList.add('bold')
            




            let name = selection.children[i].getAttribute('name')
            form.setAttribute('action', `/${name}`)
        
            h2s.forEach(h2=>{
                if(h2.getAttribute('id')!==name){
                    h2.classList.remove('flex')
                }else{
                    h2.classList.add('flex')
                }
                
            })

        })
        
        
    }
})
/// close prepare attack
closes.forEach(c=>{
    c.addEventListener('click',()=>{
        let stance = c.parentElement.getAttribute('type')
        let id = c.parentElement.getAttribute('id')
        const prepare_attack_window = document.querySelector(`div.prepare_attack.${stance}#${id}`)
        if(prepare_attack_window){
            prepare_attack_overlay.classList.remove('opacity_full')
            


            setTimeout(()=>{
                prepare_attack_window.classList.remove('opacity_full')
                prepare_attack_overlay.classList.remove('flex')
                prepare_attack_window.classList.remove('flex')
                

            },260)


        }
    })

})


war_selections.forEach(selection=>{

    selection.addEventListener('click',()=>{
        let id = selection.getAttribute('id')
        let stance = selection.parentElement.getAttribute('id')
        
        const war = document.querySelector(`div.war.${stance}`)
        const attacker = document.querySelectorAll(`div.war.${stance} div.attacker h1`)
        const defender = document.querySelectorAll(`div.war.${stance} div.defender h1 `)
        const attacker_points = document.querySelectorAll(`div.war.${stance} div.attacker_points h2 `)
        const defender_points = document.querySelectorAll(`div.war.${stance} div.defender_points h2 `)
        const attacker_stability = document.querySelectorAll(`div.war.${stance} div.attacker_stability h2 `)
        const defender_stability = document.querySelectorAll(`div.war.${stance} div.defender_stability h2 `)
         
        const changes = [attacker,defender,attacker_points,defender_points,attacker_stability,defender_stability]
        
        war.setAttribute('id',id)
        war.classList.remove('opacity_full')
        war.classList.remove('top_zero')
        setTimeout(()=>{
            changes.forEach(change=>{
                change.forEach(c=>{
                    c.classList.remove('flex')
                    console.log(c.ge=tAttribute('id'))
                    if(c.getAttribute('id')===id){
                        c.classList.add('flex')
                    }
                })

                
            })
        },550)
        setTimeout(()=>{
            war.classList.add('opacity_full')
            war.classList.add('top_zero')

        },560)
        war_selections.forEach(s=>{
            if(s.parentElement.getAttribute('id')===stance){
                s.children[0].classList.remove('circle_selected')
                s.children[1].classList.remove('bold')

            }
            
                 
        })
        selection.children[0].classList.add('circle_selected')
        selection.children[1].classList.add('bold')

        
        
        

    })


    

})
let stance_change = false
war_button_selections.forEach(selection=>{

    

    selection.addEventListener('click',()=>{
        if(stance_change===false){
            stance_change = true;

            let stance = selection.getAttribute('id');
            const stance_selections = document.querySelectorAll('div.war_selection_circles')
            const stance_selection = document.querySelector(`div.war_selection_circles#${stance}`)
            const wars = document.querySelectorAll(`div.war`)
            const war = document.querySelector(`div.war.${stance}`)


            war_button_selections.forEach(s=>{
                s.classList.remove('highlight')
            })
            selection.classList.add('highlight')

            wars.forEach(w=>{
                w.classList.remove('top_zero')
                w.classList.remove('opacity_full')
                setTimeout(()=>{
                    w.classList.remove('flex')
                },510)

            })

            stance_selections.forEach(s=>{
                
                s.classList.remove('top_zero')
                s.classList.remove('opacity_full')
                setTimeout(()=>{
                    s.classList.remove('flex')
                },510)

            })
            setTimeout(()=>{
                if(stance_selection){
                    stance_selection.classList.add('flex')
                }
                war.classList.add('flex')
                

            },520)
            setTimeout(()=>{
                if(stance_selection){
                    stance_selection.classList.add('top_zero')
                    stance_selection.classList.add('opacity_full')

                }
                
                
                war.classList.add('top_zero')
                war.classList.add('opacity_full')
                stance_change = false;

            },550)

        }
        
        
        
    

    })



})




 






