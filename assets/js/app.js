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
document.querySelector('.btn-calculator').addEventListener('click', () => {
    calcEl.classList.toggle('show');
});
document.querySelector('.btn-close').addEventListener('click', () => {
    calcEl.classList.remove('show');
});


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
        let operations = ['-','+', '*' , '/'];
        if(val){
            let lastIndex = calcValue.length - 1;
            let lastLatter = calcValue[lastIndex];
            // Remove if lastIndex is operations
            calcValue = operations.includes(lastLatter) && operations.includes(val) ? calcValue.substring(0, lastIndex) : calcValue; 
            calcValue = calcValue === 0? val : calcValue + val;

        }

        // Answer
        if(calcBtn.getAttribute('id') === 'enter'){
            calculateValue()
        }
        // Clear calculate value
        if (calcBtn.getAttribute('id') === 'clear'){
            calcValue = 0;
        }

        calcDisplayEl.value = calcValue;
    });
})





const calculateValue = () => {
    let numbers = calcValue.split(/\+|\-|\*|\//g);
    let operators = calcValue.replace(/[0-9]|\./g, "").split("");
    let nextVal = 0;
    let currentVal = 0;
    operators.forEach((op, i) => {
        currentVal = i === 0 ? parseFloat(numbers[i]) : currentVal;
        nextVal = parseFloat(numbers[1 + i]);
        switch (op) {
            case '+':
                currentVal = currentVal + nextVal;
                break;
            case '-':
                currentVal = currentVal - nextVal;
                break;
            case '*':
                currentVal = currentVal * nextVal;
                break;
            case '/':
                currentVal = currentVal / nextVal;
                break;
        }
    })
    calcValue = currentVal;
    calcDisplayEl.value = calcValue;
}


calcDisplayEl.addEventListener('keydown', e => {
    let allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '+', '*', '/', '.', 'Backspace'];    
    // Get Answer if pressed Ender or equal
    if (e.key == "Enter" || e.keyCode == 13 ||e.key == "=" ) {
        calculateValue();
        e.preventDefault()
        return 
    }   
    if(!allowedKeys.includes(e.key)){
        e.preventDefault()
        return
    }
})

calcDisplayEl.addEventListener('input', e=> {
   calcValue = calcDisplayEl.value;
})