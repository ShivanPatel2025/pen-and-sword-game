const matches = document.getElementsByClassName('arena_match')

matches.array.forEach(m => {
    let id_pseudo= m.getPropertyValue('id');
    let pseudo = window.getComputedStyle(m, '::before')
    pseudo.style.content = id_pseudo+1;
    
});
