
boton = document.getElementById('boton');
gallery = document.getElementById('gallery');
gallery__item = document.getElementById('gallery__item');
caja = document.getElementById('caja');
input = document.getElementById('input');
form = document.getElementById('form');
button = document.getElementById('button');
// gallery.addEventListener('click', (e) =>{
//     console.log(e.target.textContent);
//     e.target.classList.add('red');
// })

// gallery.addEventListener('click',(e) =>{
//     e.target.classList.add('red');
// })

gallery__item.addEventListener('click',() =>{
    gallery__item.classList.add('yellow');
})
gallery__item.addEventListener('mouseleave',() =>{
    gallery__item.classList.replace('yellow', 'green');
 })

caja.addEventListener('click',() =>{
    caja.classList.add('red');
})

caja.addEventListener('mouseleave',() =>{
    caja.classList.replace('red', 'yellow');
})



// form.addEventListener('keyup', () =>{
//     console.log(input.value);
// })

// addEventListener('click',(e)=>{
//     console.log(e);
// })
// gallery.addEventListener('click', (e)=>{
//     console.log(e.target.textContent);
//     e.target.classList.add('green');
// })

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log('El formulario se ha enviado ');
})

// button.addEvenListener('click', ()=>{
//     // input.value = ' !as hecho clic '
   
// })