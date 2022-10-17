
// const rectBtn = document.getElementById('rect');
const canvas = document.querySelector('#editor');
const strokeControlEl = document.getElementById('stroke-size-control');
let isDrawing = false;
let shapeType = '';
let selectedShape = null;
let isStartDrawingLCH = false;




function draw(model){
    isDrawing = true;
    shapeType = model;
    // The event only fires once 
    // If user clicks on the shape buttons
    if (!isStartDrawingLCH){
        isStartDrawingLCH = true;
        createShape();
        getFillColor();
    }
}

function isLine(){
    return shapeType === 'line' || shapeType === 'arrow' || shapeType === 'selection-box';
}

function getFillColor() {
    document.querySelectorAll('.ql-picker-item').forEach(colorPicker => {
        colorPicker.addEventListener('click', e => {
            let color = e.target.dataset.value;
            let isBgClrPicker =  e.target.parentElement.parentElement.classList.contains('ql-background');
            let  selectedShapeStyle = selectedShape.getAttribute('style');

            // Change backgroundColor
            if (isBgClrPicker){
                selectedShape.style = `${selectedShapeStyle} background-color: ${color}`
            } else {
                selectedShape.style = `${selectedShapeStyle} --stroke-color: ${color}`
            }
        });
    })
}

strokeControlEl.addEventListener('input', e => {
    if (selectedShape){
        let selectedShapeStyle = selectedShape.getAttribute('style');
        selectedShape.style = `${selectedShapeStyle} --stroke-size: ${e.target.value}px`;
    }
})



function createShape() {
    const MIN_SIZE = 10;
    let shape, originX, originY, releaseX, releaseY, width, height;
    // Create a new drag element
    canvas.onmousedown = dragMouseDown;
    canvas.classList.add('isDrawing');


    function dragMouseDown(e) {
        if (!isDrawing) { return; }
        
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        originX = e.clientX;
        originY = e.clientY;

        
        

        shape = document.createElement('div');
        shape.className = 'shape ' + shapeType;
        shape.id = 'sh-' + Math.random().toString(36).slice(8);


        // Create textarea on non-line shape
        if(!isLine()){
            const texWrapper = document.createElement('div');
            texWrapper.className = "text-wrapper";
            const textArea = document.createElement('textarea');
            texWrapper.appendChild(textArea);
            shape.appendChild(texWrapper);
            textArea.oninput = autoGrowingTextField;
        }
        
    
        document.onmouseup = closeShape;
        // call a function whenever the cursor moves:
        document.onmousemove = shapeDrag;
    }

    function shapeDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        releaseX = e.clientX;
        releaseY = e.clientY;

        width = originX > releaseX ? MIN_SIZE : Math.abs(originX - releaseX);
        height = originY > releaseY ? MIN_SIZE : Math.abs(originY - releaseY);

        
        // To avoid false click    
        if(width > (MIN_SIZE/2) && height > (MIN_SIZE/2) ){

        canvas.appendChild(shape);
        shape.addEventListener('click', selectBox);

        // Draw Line
        if(isLine()){
            let x = originX - releaseX,
                y = originY - releaseY,
                width = Math.sqrt(x * x + y * y),
                angle = Math.PI - Math.atan2(-y, x),
                deg  =(angle * 180.0) / Math.PI;

                if(90 <= deg &&  deg <= 245){
                    shape.dataset.rotate = 'true'
                } else {
                    shape.dataset.rotate = 'false'
                }


            shape.style = `
                top: ${originY}px;
                left: ${originX}px;
                width: ${width}px;
                transform: rotate(${deg}deg);
            `
        } 
        
        // All other shapes should  be drawn using  the default
        else{
            shape.style = `
                top: ${originY}px;
                left: ${originX}px;
                width: ${width}px;    
                height: ${height}px;
            `
            }

    
        }

    }

    function closeShape() {
        // stop moving when mouse button is released:
        isDrawing = false;
        // Remove Active class from the header
        if (document.querySelector('.btn-draw-shape.active')) {
            document.querySelector('.btn-draw-shape.active').classList.remove('active');
        }
        document.querySelector('#editor').classList.remove('isDrawing');

        document.onmouseup = null;
        document.onmousemove = null;
    }
}


/**
 * Auto Growing text field
 * 
 * */ 
function autoGrowingTextField(e) {
    e.target.parentElement.dataset.replicatedValue = e.target.value;
}



/**
 * Select shape 
 * Add Select box 
 * */ 


function selectBox(e){
    e.stopPropagation();
    const target = selectedShape = e.target;
    shapeType = target.classList.value.replace('shape ', ''); // Find shape type
    
    // Update Stroke control values
    let selectedShapeStrokeSize = getComputedStyle(selectedShape).getPropertyValue('--stroke-size');
    strokeControlEl.value = parseInt(selectedShapeStrokeSize);


    //  If Shape not contains selection box then
    if( !target.contains(document.querySelector('.selection-box')) && target.classList.contains('shape')){
        // Remove Selection-box from other Shapes
        if (document.querySelector('.selection-box')) {
            document.querySelector('.selection-box').remove();
        }

        const selectionEl = document.createElement('div');
        selectionEl.setAttribute('data-target', target.id);  
        selectionEl.className = 'selection-box';

        // Resize Top Left
        const resizeTopLeft = document.createElement('div');
        resizeTopLeft.className = 'resizer top-left';
        selectionEl.appendChild(resizeTopLeft);

        // Resize Top Right
        const resizeTopRight = document.createElement('div');
        resizeTopRight.className = 'resizer top-right';
        selectionEl.appendChild(resizeTopRight);

        // Resize Bottom- Left
        const resizeBottomLeft = document.createElement('div');
        resizeBottomLeft.className = 'resizer bottom-left';
        selectionEl.appendChild(resizeBottomLeft);

        // Resize Bottom Right
        const resizeBottomRight = document.createElement('div');
        resizeBottomRight.className = 'resizer bottom-right';
        selectionEl.appendChild(resizeBottomRight);

        target.appendChild(selectionEl);

        // Add Selection Styles to body
        document.body.classList.add('is-selected');

        // Remove selection on double click
        selectionEl.ondblclick = (e) =>{
            // Add focus on the Textarea
            if(e.target.previousSibling){
                e.target.previousSibling.children[0].focus()
            }
            e.target.remove();
            // Remove selection style 
            document.body.classList.remove('is-selected');
        }

        // Enable resizing on
        resizeShape(target);
        // Enable Moving 
        moveShape(selectionEl)
    }

    
}




/**
 * Move Element
 * 
 * */ 
function moveShape(movableEl)   {
    let originX, originY, moveX, moveY = 0;
    movableEl.onmousedown = moveMouseDown;
    TARGET = movableEl.parentElement;

    
    function moveMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        // get the mouse cursor position at startup:
        originX = e.clientX;
        originY = e.clientY;
        document.onmouseup = closeMoveElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementMove;
    }

    function elementMove(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        // calculate the new cursor position:
        moveX = originX - e.clientX;
        moveY = originY - e.clientY;
        originX = e.clientX;
        originY = e.clientY;

        // set the element's new position:
        let x = (TARGET.offsetLeft - moveX)
        let y = (TARGET.offsetTop - moveY);

        // Prevent move outer window
        if (x > 0 && x <= (canvas.scrollWidth - TARGET.clientWidth) || isLine()) {
            TARGET.style.left = `${x}px`;
        }
        if (y > 0 && y <= (canvas.scrollHeight - TARGET.clientHeight || isLine())) {
            TARGET.style.top = `${y}px`;
        }
        
    }

    function closeMoveElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}





/***
 * Resize Shape
 * 
 * */ 
function resizeShape(TARGET) {
// const TARGET = document.querySelector(div);

const RESIZERS = document.querySelectorAll(`#${TARGET.id} .resizer`);
const MIN_SIZE = 20;
let original_width = 0;
let original_height = 0;
let original_x = 0;
let original_y = 0;
let original_mouse_x = 0;
let original_mouse_y = 0;
for (let i = 0; i < RESIZERS.length; i++) {
    const currentResizer = RESIZERS[i];
    currentResizer.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        original_width = parseFloat(getComputedStyle(TARGET, null).getPropertyValue('width').replace('px', ''));
        original_height = parseFloat(getComputedStyle(TARGET, null).getPropertyValue('height').replace('px', ''));
        original_x = TARGET.getBoundingClientRect().left;
        original_y = TARGET.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)
    })

    function resize(e) {
        if (currentResizer.classList.contains('bottom-right')) {
            const width = original_width + (e.pageX - original_mouse_x);
            const height = original_height + (e.pageY - original_mouse_y)
            if (width > MIN_SIZE) {
                TARGET.style.width = width + 'px'
            }
            if (height > MIN_SIZE && !isLine()) {
                TARGET.style.height = height + 'px'
            }
        }
        else if (currentResizer.classList.contains('bottom-left')) {
            const height = original_height + (e.pageY - original_mouse_y)
            const width = original_width - (e.pageX - original_mouse_x)
            if (height > MIN_SIZE && !isLine()) {
                TARGET.style.height = height + 'px'
            }
            if (width > MIN_SIZE) {
                TARGET.style.width = width + 'px';
                if(!isLine()){
                    TARGET.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                }
            }
        }
        else if (currentResizer.classList.contains('top-right')) {
            const width = original_width + (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > MIN_SIZE) {
                TARGET.style.width = width + 'px'
            }
            if (height > MIN_SIZE && !isLine()) {
                TARGET.style.height = height + 'px'
                TARGET.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
            }
        }
        else {
            const width = original_width - (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > MIN_SIZE) {
                TARGET.style.width = width + 'px'
                if(!isLine()) {
                    TARGET.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                }
            }
            if (height > MIN_SIZE && !isLine()) {
                TARGET.style.height = height + 'px'
                TARGET.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
            }
        }
    }

    function stopResize() {
        window.removeEventListener('mousemove', resize)
    }
}
}










/**
 * Get outside click
 * Remove selection if click is happening outside of shapes
 * */ 
canvas.addEventListener('click', function (e) {
    if(selectedShape && !selectedShape.contains(e.target) && document.querySelector('.selection-box')){
        document.querySelector('.selection-box').remove();
        // Remove selection style 
        document.body.classList.remove('is-selected');
    }
});

window.addEventListener("keydown", function (o) {
    if (o.keyCode === 46 || o.keyCode === 8) {
        if (document.querySelector('.selection-box')) {
            document.querySelector('.selection-box').parentElement.remove()
            // Remove selection style 
            document.body.classList.remove('is-selected');
        }
    }
});

