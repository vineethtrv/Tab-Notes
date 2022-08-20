let newNotes = '';
let theme = localStorage.getItem('theme');
const calcEl = document.getElementById("calculator");
const calcDisplayEl = document.getElementById("calc-display");
let calcValue = 0;
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




// Drag 
function dragElement(dragEL) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("calc-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("calc-header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        dragEL.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:

        let x = (dragEL.offsetLeft - pos1) 
        let y = (dragEL.offsetTop - pos2); 

        // Prevent move outer window
        if (x > 0 && y > 0 && 
            x <= (window.innerWidth - dragEL.clientWidth) &&
            y <= (window.innerHeight - dragEL.clientHeight) 
            ){
            dragEL.style.top = y + "px";
            dragEL.style.left = x + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}






// Toggle calculator
const toggleCalculator = ()=> {
    calcEl.classList.toggle('show');
}


// Restore data from previous
restoreNotes();

// Theme restore
if (theme) {
    document.body.setAttribute('class', theme);
    document.querySelectorAll('.dropdown-menu li').forEach(list => {
        if (list.dataset.value == theme) {
            list.classList.add('active');
        } else {
            list.classList.remove('active');
        }
    })
}

// Make calculator movable
dragElement(calcEl);


// Print Numbers
document.querySelectorAll('.btn-calc').forEach(calcBtn => {
    // calcDisplayEl
    calcBtn.addEventListener('click', (e) => {
        let val = calcBtn.dataset.eval;
        if(val){
            calcValue = calcValue === 0? val : calcValue + val;

        }

        // Answer
        if(calcBtn.getAttribute('id') === 'enter'){
            calcValue = eval(calcValue);
        }
        // Clear calculate value
        if (calcBtn.getAttribute('id') === 'clear'){
            calcValue = 0;
        }

        calcDisplayEl.value = calcValue;
        console.log(calcValue)
    })
})