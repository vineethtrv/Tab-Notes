let newNotes = '';
let theme = '';
let showCalc = localStorage.getItem('showCalc');
const calcEl = document.getElementById("calculator");
const calcDisplayEl = document.getElementById("calc-display");
const operators = ['-', '+', '*', '/'];
let calcValue = '';
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
    })
})

restoreTheme = () => {
    theme = localStorage.getItem('theme');
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
}




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
        if (x > 0 && x <= (window.innerWidth - dragEL.clientWidth)){
            dragEL.style.left = x + "px";
            localStorage.setItem("calcX", x + "px")
        }
        if ( y > 0 && y <= (window.innerHeight - dragEL.clientHeight)){
            dragEL.style.top = y + "px";
            localStorage.setItem("calcY", y + "px")
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
    calcDisplayEl.focus();
    localStorage.setItem('showCalc', 'true');
});
document.querySelector('.btn-close').addEventListener('click', () => {
    calcEl.classList.remove('show');
    localStorage.setItem('showCalc', 'false');
});





// Print Numbers
document.querySelectorAll('.btn-calc').forEach(calcBtn => {
    // calcDisplayEl
    calcBtn.addEventListener('click', (e) => {
        let val = calcBtn.dataset.eval;
        
        if(val){
            calcValue = calcValue === 0? val : calcValue + val;
            calcValue = operatorsDupeCheck(calcValue);
        }

        // Answer
        if (calcBtn.getAttribute('id') === 'enter'){
            calculateValue()
        }
        // Clear calculate value
        if (calcBtn.getAttribute('id') === 'clear'){
            calcValue = 0;
        }

        calcDisplayEl.value = calcValue;
        localStorage.setItem('calcValue', calcValue);
    });
})





const calculateValue = () => {
    let lastVal = calcValue[calcValue.length - 1];
    if (calcValue == 0 || operators.includes(lastVal) || lastVal == '.'){
        return
    }
    let numbers = calcValue.split(/\+|\-|\*|\//g);
    let calcOperators = calcValue.replace(/[0-9]|\./g, "").split("");
    let nextVal = 0;
    let currentVal = 0;
    calcOperators.forEach((op, i) => {
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
    localStorage.setItem('calcValue', calcValue);
}


calcDisplayEl.addEventListener('keydown', e => {
    let allowedKeys = [...operators, '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];   
    // Get Answer if pressed Ender or equal
    if (e.key == "Enter" || e.keyCode == 13 || e.key == "=") {
        calculateValue();
        e.preventDefault()
        return 
    }   
    if(!allowedKeys.includes(e.key)){
        e.preventDefault()
        return
    }
})

calcDisplayEl.addEventListener('input', e => {
    calcValue = calcDisplayEl.value = operatorsDupeCheck(calcDisplayEl.value);
    localStorage.setItem('calcValue', calcValue);
});






// Avoid using duplicate operators 
const operatorsDupeCheck = (str)=>{
    if (operators.includes(str[0])) {
        str = str.substring(1, str.length);
    } else {
        for (let i = 0; i < str.length; i++) {
            str = operators.includes(str[i]) && operators.includes(str[i - 1]) ? str.substring(0, i - 1) + str.substring(i, str.length) : str;
            str = str[i] == '.' && str[i - 1] == '.' ? str.substring(0, i - 1) + str.substring(i, str.length) : str;
        }
    }
    return str;
}











// Restore data from previous
restoreNotes();

// Theme restore
restoreTheme()

// Make calculator movable
dragElement(calcEl);

// Open Calculator
if (showCalc === 'true') {
    // Calculator position
    calcEl.style.left = localStorage.getItem("calcX") ? localStorage.getItem("calcX") : "0px";
    calcEl.style.top = localStorage.getItem("calcY") ? localStorage.getItem("calcY") : "0px";
    calcEl.classList.add('show');
    calcDisplayEl.value = calcValue = localStorage.getItem("calcValue");
    calcDisplayEl.focus();
}


// Window resize
window.addEventListener('resize', (e) => {
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    if (calcEl.offsetLeft > (vw - calcEl.clientWidth)) {
        let x = (vw - calcEl.clientWidth);
        calcEl.style.left = x > 0 ? x + 'px' : '0px';
        localStorage.setItem("calcX", calcEl.style.left);
    }
    if (calcEl.offsetTop > (vh - calcEl.clientHeight)) {
        let y = (vh - calcEl.clientHeight);
        calcEl.style.top = y > 0 ? y + 'px' : '0px';
        localStorage.setItem("calcY", calcEl.style.top);
    }
})




// Check tabs are sync with Notes
window.addEventListener("storage", (event) => {
    if (event.storageArea != localStorage) return;
    if (event.key === 'notes') {
        restoreNotes();
    }
    if (event.key === 'theme') {
        restoreTheme();
    }
    
    if (event.key === 'showCalc') {
        if(localStorage.getItem('showCalc') === true){
            calcEl.classList.add('show');
        } else{
            calcEl.classList.remove('show');
        }
    }
    if (event.key === 'calcValue') {
        calcDisplayEl.value = calcValue = localStorage.getItem("calcValue");
    }
    if (event.key === 'calcX') {
        calcEl.style.left = localStorage.getItem("calcX") ? localStorage.getItem("calcX") : "0px";
    }
    if (event.key === 'calcY') {
        calcEl.style.top = localStorage.getItem("calcY") ? localStorage.getItem("calcY") : "0px";
    }
})
