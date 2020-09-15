const sign_up=document.querySelector('form.sign_up_form div.sign_in_btns h3');
const sign_in=document.querySelector('form.sign_in_form div.sign_in_btns h3');


const overlay = document.querySelector('.overlay_display')
const form = document.querySelector('.overlay_display form')
sign_up.addEventListener('click',()=>{
    overlay.classList.add('show_display');
    setTimeout(()=>{
        form.classList.add('show_form');
    },300);
    
    
})

sign_in.addEventListener('click',()=>{
    overlay.classList.remove('show_display');
    setTimeout(()=>{
        form.classList.remove('show_form');
    },500);
})
