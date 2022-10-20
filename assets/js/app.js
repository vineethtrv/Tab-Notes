let newNotes = '';
let theme = '';
let shapeCollection = [];
const customThemeEl = document.getElementById('custom-theme');
const clearAllPopup = document.getElementById('clear-all-confirmation');
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




/**
 * Draw Shapes
 * 
 * */ 

// Assign Drawing shapes action to buttons
document.querySelectorAll('.btn-draw-shape').forEach(shapeBtn =>{

    shapeBtn.addEventListener('click', () => {
        if (document.querySelector('.btn-draw-shape.active')){
            document.querySelector('.btn-draw-shape.active').classList.remove('active');
        }
        shapeBtn.classList.add('active');
        document.querySelector('#editor').classList.add('isDrawing');
        draw(shapeBtn.dataset.shape);

    });
});


const saveShape = ()=> {
    localStorage.setItem('shapes', JSON.stringify(shapeCollection));
}

const setShapeStore = (shapeId)=> {
    const shape = document.getElementById(shapeId);
    let text = document.querySelector(`#${shapeId} textarea`) ? document.querySelector(`#${shapeId} textarea`).value : '';
    let type = shape.className.replace('shape ', '');
    let shapeData = {
        id: shapeId,
        type,
        text,
        style: shape.getAttribute('style')
    }

    // Check Shape is already stored
    if (shapeCollection.filter(item => item.id === shapeData.id).length){
        // Update shape collection
        shapeCollection = shapeCollection.map(item => item.id === shapeData.id ? shapeData : item);
    } else {
        // Add new shape to collection
        shapeCollection.push(shapeData);
    }
    saveShape();
}

const removeShapeStore = (shapeId)=> {
    // Check Shape is available on storage
    if (shapeCollection.filter(item => item.id === shapeId).length){
        // remove shape from collection
        shapeCollection = shapeCollection.filter(item => item.id !== shapeId);
    } 
    saveShape();
}

// Delete Button
document.getElementById('delete-shape').addEventListener("click", e => {
    deleteShape()
})




// Clear all Popup

// Show Clear all Popup
document.getElementById('clear-all-q').addEventListener("click", e => {
    clearAllPopup.classList.add('show')
    document.querySelector('body').classList.add('is-clear-all');
})
// Cancel Clear all Popup
document.getElementById('clear-all-c').addEventListener("click", e => {
    clearAllPopup.classList.remove('show')
    document.querySelector('body').classList.remove('is-clear-all');
})

// Clear All notes
document.getElementById('clear-all').addEventListener("click", e => {
    // Remove all Shapes;
    document.querySelectorAll('.shape').forEach(shp => shp.remove());
    shapeCollection = [];
    saveShape();
    // Remove all Notes
    localStorage.setItem('notes', '');
    quill.setContents('');

    // Close Clear all Popup
    clearAllPopup.classList.remove('show');
    document.querySelector('body').classList.remove('is-clear-all');
})




// Restore the previous Shapes 
const restoreShapes = () => {
    shapeStore = localStorage.getItem('shapes');
    if (shapeStore) {
        shapeCollection = JSON.parse(shapeStore);
        if (shapeCollection.length) {
            // Clear shape over lapping 
            document.querySelectorAll('.shape').forEach(shp => shp.remove());
            drawShape();
        }
    }
}




/**
 * Theme settings
 * 
 * */ 

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



/**
 * Sync Notes
 * EVENTs
 * 
 * */ 


// Restore data from previous
restoreNotes();

// Restore shape
restoreShapes();

// Theme restore
restoreTheme();


// Color Filling
getFillColor();

// Check tabs are sync with Notes
window.addEventListener("storage", (event) => {
    if (event.storageArea != localStorage) return;
    if (event.key === 'notes') {
        restoreNotes();
    }
    if (event.key === 'theme') {
        restoreTheme();
    }
    if (event.key === 'shapes') {
        restoreShapes();
    }
})
