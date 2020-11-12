const province_selections = document.querySelectorAll('div.province_selection h3');
const province_sections = document.querySelectorAll('div.province_buildings');




province_selections.forEach(p=>{

    p.addEventListener('click',()=>{
        let id = p.getAttribute('id');
        let province = document.querySelector(`div.province_buildings#${id}`)


        province_selections.forEach(s=>{
            s.classList.remove('highlight')
        })
        p.classList.add('highlight')

        province_sections.forEach(prov=>{
            prov.classList.remove('top_zero')
            prov.classList.remove('opacity_full')
            setTimeout(()=>{
                prov.classList.remove('flex')
            },300)
        })
        setTimeout(()=>{
            province.classList.add('flex');
        },305)
        setTimeout(()=>{
            province.classList.add('top_zero');
            province.classList.add('opacity_full');

        },400)

        })
    


})