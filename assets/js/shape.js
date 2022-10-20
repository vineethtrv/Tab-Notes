
// const rectBtn = document.getElementById('rect');
const canvas = document.querySelector('#editor');
const strokeControlEl = document.getElementById('stroke-size-control');
let isDrawing = false;
let shapeType = '';
let selectedShape = null;
let isStartDrawingLCH = false;
let isSelected = false;





function draw(model){
    isDrawing = true;
    shapeType = model;
    // The event only fires once 
    // If user clicks on the shape buttons
    if (!isStartDrawingLCH){
        isStartDrawingLCH = true;
        createShape();
    }
}

function isLine(){
    return shapeType === 'line' || shapeType === 'arrow' || shapeType === 'selection-box'
}

function getFillColor() {
    document.querySelectorAll('.ql-picker-item').forEach(colorPicker => {
        colorPicker.addEventListener('click', e => {
            if (isSelected){
                let color = e.target.dataset.value;
                let isBgClrPicker =  e.target.parentElement.parentElement.classList.contains('ql-background');
                let  selectedShapeStyle = selectedShape.getAttribute('style');
    
                // Change backgroundColor
                if (isBgClrPicker){
                    selectedShape.style = `${selectedShapeStyle} background-color: ${color}`
                } else {
                    selectedShape.style = `${selectedShapeStyle} --stroke-color: ${color}`
                }
    
                // Store Shape Data
                setShapeStore(selectedShape.id)
            }
        });
    })
}

strokeControlEl.addEventListener('input', e => {
    if (selectedShape && isSelected){
        let selectedShapeStyle = selectedShape.getAttribute('style');
        selectedShape.style = `${selectedShapeStyle} --stroke-size: ${e.target.value}px`;
        // Store Shape Data
        setShapeStore(selectedShape.id)
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

            var sx = (originX + releaseX) / 2,
                sy = (originY + releaseY) / 2;

            var cx = sx - angle / 2,
                cy = sy;


            shape.style = `
                top: ${cy}px;
                left: ${cx}px;
                width: ${width}px;
                transform: translate(-50%, -50%) rotate(${deg}deg);
            `
        } 
        
        // All other shapes should  be drawn using  the default
        else{
            shape.style = `
                top: ${originY + (height / 2)}px;
                left: ${originX + (width/2)}px;
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
        
        // Store Shape Data
        setShapeStore(shape.id)

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

    // Store Shape Data
    setShapeStore(e.target.parentElement.parentElement.id)

}



/**
 * Select shape 
 * Add Select box 
 * */ 


function selectBox(event){
    event.stopPropagation();
    let target = event.target;
    // False click target changes
    if (target.classList.contains('selection-box')){
         target = selectedShape = event.target.parentElement;
    } else {
        selectedShape = target;
    }

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


        // rotateEl
        const rotateEl = document.createElement('div');
        rotateEl.className = 'dot rotate';
        rotateEl.id = 'rotate';
        selectionEl.appendChild(rotateEl);

        // left-mid
        const leftMidEl = document.createElement('div');
        leftMidEl.className = 'dot left-mid';
        leftMidEl.id = 'left-mid';
        selectionEl.appendChild(leftMidEl);

        // right-mid
        const rightMidEl = document.createElement('div');
        rightMidEl.className = 'dot right-mid';
        rightMidEl.id = 'right-mid';
        selectionEl.appendChild(rightMidEl); 

        if (!isLine()) {
            // left-top
            const leftTopEl = document.createElement('div');
            leftTopEl.className = 'dot left-top';
            leftTopEl.id = 'left-top';
            selectionEl.appendChild(leftTopEl);
    
            // left-Bottom
            const leftBottomEl = document.createElement('div');
            leftBottomEl.className = 'dot left-bottom';
            leftBottomEl.id = 'left-bottom';
            selectionEl.appendChild(leftBottomEl);
    
            // top-mid
            const topMidEl = document.createElement('div');
            topMidEl.className = 'dot top-mid';
            topMidEl.id = 'top-mid';
            selectionEl.appendChild(topMidEl);
    
            // bottom-mid
            const bottomMidEl = document.createElement('div');
            bottomMidEl.className = 'dot bottom-mid';
            bottomMidEl.id = 'bottom-mid';
            selectionEl.appendChild(bottomMidEl);
    
            // right-bottom
            const rightBottomEl = document.createElement('div');
            rightBottomEl.className = 'dot right-bottom';
            rightBottomEl.id = 'right-bottom';
            selectionEl.appendChild(rightBottomEl);
    
            // right-Top
            const rightTopEl = document.createElement('div');
            rightTopEl.className = 'dot right-top';
            rightTopEl.id = 'right-top';
            selectionEl.appendChild(rightTopEl);
        }

        target.appendChild(selectionEl);

        // Add Selection Styles to body
        isSelected = true;
        document.body.classList.add('is-selected');

        // Remove selection on double click
        selectionEl.ondblclick = (e) =>{
            // Add focus on the Textarea
            if(e.target.previousSibling){
                e.target.previousSibling.children[0].focus()
            }
            e.target.remove();
            // Remove selection style 
            isSelected = false;
            document.body.classList.remove('is-selected');
        }

       
        // Enable Shape transformation 
        // Move resize rotate
        transformShape(target);
    }

    
}



const drawShape = ()=> {
    shapeCollection.forEach(shapeItem => {
      const shape =  document.createElement('div');
        shape.id = shapeItem.id;
        shape.className = 'shape ' + shapeItem.type;
        shape.style = shapeItem.style;

        // Create textarea on non-line shape
        if (shapeItem.type !== 'line' && shapeItem.type !== 'arrow') {
            const texWrapper = document.createElement('div');
            texWrapper.className = "text-wrapper";
            const textArea = document.createElement('textarea');
            textArea.value = shapeItem.text;
            texWrapper.appendChild(textArea);
            shape.appendChild(texWrapper);
            textArea.oninput = autoGrowingTextField;
        }

        // add shape 
        canvas.appendChild(shape);
        shape.addEventListener('click', selectBox);
    })
}


const deleteShape = () => {
    if (document.querySelector('.selection-box')) {
        document.querySelector('.selection-box').parentElement.remove();

        // remove shape from Store
        removeShapeStore(selectedShape.id)

        // Remove selection style 
        isSelected = false;
        document.body.classList.remove('is-selected');
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
        isSelected = false;
        document.body.classList.remove('is-selected');
    }
});

// Remove Shape from Canvas
window.addEventListener("keydown", function (o) {
    if (o.keyCode === 46 || o.keyCode === 8) {
        deleteShape()
    }
});





