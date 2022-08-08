const navToggler = document.getElementById('navToggler');
const navUl = document.getElementById('navUl');
const menuBars = document.querySelectorAll('.menuBar');
const navLinks = document.querySelectorAll('.navLink');

function toggleMenu() {
    navUl.classList.toggle('hidden');

    menuBars.forEach(bar => {
        bar.classList.toggle('active');
    })
}

navToggler.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', toggleMenu)
})

navLinks[3].addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        titleText: '¿Bugs o consultas?',
        html:
          `<br><h2>Podés encontrarme acá ↓</h2><br><a href="https://www.linkedin.com/in/santiagofonzo/" target="_blank"><i class="fa-brands fa-linkedin-in fa-4x" style="color: #00BCE1; filter: drop-shadow(0 0 0.1rem #00BCE1);" alt='linkedIn link'></i></a>`,
        focusConfirm: false,
        background: '#051C2C',
        color: '#fff',
        confirmButtonText:
          'De vuelta al sitio',
        confirmButtonColor: '#00BCE1',
        customClass:{ confirmButton: 'swalBtnCustom'}
      })
})