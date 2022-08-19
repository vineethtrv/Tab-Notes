let newNotes = '';
let theme = localStorage.getItem('theme');
var quill = new Quill('#editor', {
      theme: 'snow',
    modules: {
        toolbar: '#toolbar'
    }
});




// Restore data from previous
const restoreNotes = ()=> {
    if (localStorage.getItem('notes')) {
        newNotes = JSON.parse(localStorage.getItem('notes'));
        quill.setContents(newNotes);
    }
}




// Store data for later use
quill.on('text-change', function () {
    newNotes = quill.getContents();
    localStorage.setItem('notes', JSON.stringify(newNotes));
});


// Check tabs are sync with Notes
window.addEventListener("storage", (event) => {
    if (event.storageArea != localStorage) return;
    if (event.key === 'notes') {
        restoreNotes();
    }
})



// Theme
document.querySelector('.dropdown-toggle').addEventListener('click', () => {
    document.querySelector('.dropdown-toggle').classList.toggle('open');
});


// Theme Dropdown 
document.querySelectorAll('.dropdown-menu li').forEach(list => {
    list.addEventListener('click', (e) => {
        document.querySelector('.dropdown-menu li.active').classList.remove('active');
        e.target.classList.add('active');
        theme = e.target.dataset.value;
        localStorage.setItem('theme', theme);
        document.body.setAttribute('class', theme);
    })
})











// Restore data from previous
restoreNotes();

// Theme restore
if (theme) {
    document.body.setAttribute('class', theme);
    document.querySelectorAll('.dropdown-menu li').forEach(list => {
        if (list.dataset.value == theme){
            list.classList.add('active');
        } else{
            list.classList.remove('active');
        }
    }) 
}
