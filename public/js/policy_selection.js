const allSections = document.querySelectorAll('section');
const backBtn = document.querySelector('i.back');
const nextBtn = document.querySelector('i.next');
const submit = document.querySelector('button.policy_selection_submit');

let index=0;
const next = ()=>{
    if(index<allSections.length-1){
        allSections.forEach(section=>{
            section.classList.remove('show');
            section.classList.remove('active');

        })
    
    
        index++;
        allSections[index].classList.add('show');
        allSections[index].classList.add('active');
        if(index===allSections.length-1){
            submit.classList.add('show');
            setTimeout(()=>{
                submit.classList.add('active');

            },100)
        }
    }

}
const back = ()=>{
    if(index>0){
        allSections.forEach(section=>{
            section.classList.remove('show');
            section.classList.remove('active');

        })
        if(index===allSections.length-1){
            submit.classList.remove('active');
            setTimeout(()=>{
                submit.classList.remove('show');


            },500)
        }
    
    
        index--;
        allSections[index].classList.add('show');
        allSections[index].classList.add('active');
        console.log(index)
    }
}   

backBtn.addEventListener('click',back);
nextBtn.addEventListener('click',next);