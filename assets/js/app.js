let newNotes = '';
let theme = '';
const customThemeEl = document.getElementById('custom-theme');
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
        if (theme === 'custom'){
            customThemeEl.classList.add('show');
            if (localStorage.getItem('bgColor')){
                setColorFromStorage();
            }
        } else{
            document.querySelector('body').removeAttribute('style');
        }

    })
})

// Close theme Popup
document.querySelector('.close-popup').addEventListener('click', function(){
    customThemeEl.classList.remove('show');
})


// Background Color picker
document.querySelector('#bg-color').addEventListener('input', e=> {
    document.querySelector('body').style.setProperty('--note-bg', e.target.value);
    localStorage.setItem('bgColor', e.target.value);
});

// Background Color picker
document.querySelector('#font-color').addEventListener('input', e=> {
    document.querySelector('body').style.setProperty('--text', e.target.value);
    localStorage.setItem('fontColor', e.target.value);
});

// setColor from storage
setColorFromStorage = () => {
    if (localStorage.getItem('fontColor') !== undefined) {
        document.querySelector('body').style.setProperty('--text', localStorage.getItem('fontColor'));
        document.querySelector('#font-color').value = localStorage.getItem('fontColor');
    }
    if (localStorage.getItem('bgColor') !== undefined) {
        document.querySelector('body').style.setProperty('--note-bg', localStorage.getItem('bgColor'));
        document.querySelector('#bg-color').value = localStorage.getItem('bgColor');
    }
}



// Restore the previous theme 
restoreTheme = () => {
    theme = localStorage.getItem('theme');
    if (theme) {
        document.body.setAttribute('class', theme);
        document.querySelectorAll('.dropdown-menu li').forEach(list => {
            if (list.dataset.value == theme) {
                list.classList.add('active');
                if (theme === 'custom') {
                    setColorFromStorage()
                }
            } else {
                list.classList.remove('active');
            }
        })
    }
}






// Restore data from previous
restoreNotes();

// Theme restore
restoreTheme();


// Check tabs are sync with Notes
window.addEventListener("storage", (event) => {
    if (event.storageArea != localStorage) return;
    if (event.key === 'notes') {
        restoreNotes();
    }
    if (event.key === 'theme') {
        restoreTheme();
    }
})
