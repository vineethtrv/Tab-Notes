function transformShape(TARGET) {

    let box = document.querySelector(".selection-box");
    // let TARGET = document.getElementById("box-wrapper");
    const minWidth = 40;
    const minHeight = 40;


    let initX, initY, mousePressX, mousePressY, initW, initH, initRotate;

    function repositionElement(x, y) {
        TARGET.style.left = x + 'px';
        TARGET.style.top = y + 'px';

        // Store Shape Data
        setShapeStore(TARGET.id)
    }

    function resize(w, h) {
        TARGET.style.width = w + 'px';
        TARGET.style.height = h + 'px';

        // Store Shape Data
        setShapeStore(TARGET.id)
    }


    function getCurrentRotation(el) {
        let st = window.getComputedStyle(el, null);
        let tm = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform")
        "none";
        if (tm != "none") {
            let values = tm.split('(')[1].split(')')[0].split(',');
            let angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
            return (angle < 0 ? angle + 360 : angle);
        }
        return 0;
    }

    function rotateBox(deg) {
        TARGET.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;

        // Store Shape Data
        setShapeStore(TARGET.id)
    }

    // drag support
    TARGET.addEventListener('mousedown', function (event) {
        if (event.target.className.indexOf("dot") > -1) {
            return;
        }

        initX = this.offsetLeft;
        initY = this.offsetTop;
        mousePressX = event.clientX;
        mousePressY = event.clientY;


        function eventMoveHandler(event) {
            repositionElement(initX + (event.clientX - mousePressX),
                initY + (event.clientY - mousePressY));
        }

        TARGET.addEventListener('mousemove', eventMoveHandler, false);
        window.addEventListener('mouseup', function eventEndHandler() {
            TARGET.removeEventListener('mousemove', eventMoveHandler, false);
            window.removeEventListener('mouseup', eventEndHandler);
        }, false);

    }, false);
    // done drag support

    // handle resize
    let rightMid = document.getElementById("right-mid");
    let leftMid = document.getElementById("left-mid");

    if (!isLine()) {

    }

    function resizeHandler(event, left = false, top = false, xResize = false, yResize = false) {
        initX = TARGET.offsetLeft;
        initY = TARGET.offsetTop;
        mousePressX = event.clientX;
        mousePressY = event.clientY;

        initW = box.offsetWidth;
        initH = box.offsetHeight;

        initRotate = getCurrentRotation(TARGET);
        let initRadians = initRotate * Math.PI / 180;
        let cosFraction = Math.cos(initRadians);
        let sinFraction = Math.sin(initRadians);
        function eventMoveHandler(event) {
            let wDiff = (event.clientX - mousePressX);
            let hDiff = (event.clientY - mousePressY);
            let rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
            let rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

            let newW = initW, newH = initH, newX = initX, newY = initY;

            if (xResize) {
                if (left) {
                    newW = initW - rotatedWDiff;
                    if (newW < minWidth) {
                        newW = minWidth;
                        rotatedWDiff = initW - minWidth;
                    }
                } else {
                    newW = initW + rotatedWDiff;
                    if (newW < minWidth) {
                        newW = minWidth;
                        rotatedWDiff = minWidth - initW;
                    }
                }
                newX += 0.5 * rotatedWDiff * cosFraction;
                newY += 0.5 * rotatedWDiff * sinFraction;
            }

            if (yResize) {
                if (top) {
                    newH = initH - rotatedHDiff;
                    if (newH < minHeight) {
                        newH = minHeight;
                        rotatedHDiff = initH - minHeight;
                    }
                } else {
                    newH = initH + rotatedHDiff;
                    if (newH < minHeight) {
                        newH = minHeight;
                        rotatedHDiff = minHeight - initH;
                    }
                }
                newX -= 0.5 * rotatedHDiff * sinFraction;
                newY += 0.5 * rotatedHDiff * cosFraction;
            }

            resize(newW, newH);
            repositionElement(newX, newY);
        }


        window.addEventListener('mousemove', eventMoveHandler, false);
        window.addEventListener('mouseup', function eventEndHandler() {
            window.removeEventListener('mousemove', eventMoveHandler, false);
            window.removeEventListener('mouseup', eventEndHandler);
        }, false);
    }


    rightMid.addEventListener('mousedown', e => resizeHandler(e, false, false, true, false));
    leftMid.addEventListener('mousedown', e => resizeHandler(e, true, false, true, false));

    if(!isLine()){
        let topMid = document.getElementById("top-mid");
        let bottomMid = document.getElementById("bottom-mid");

        let leftTop = document.getElementById("left-top");
        let rightTop = document.getElementById("right-top");
        let rightBottom = document.getElementById("right-bottom");
        let leftBottom = document.getElementById("left-bottom");

        topMid.addEventListener('mousedown', e => resizeHandler(e, false, true, false, true));
        bottomMid.addEventListener('mousedown', e => resizeHandler(e, false, false, false, true));
        leftTop.addEventListener('mousedown', e => resizeHandler(e, true, true, true, true));
        rightTop.addEventListener('mousedown', e => resizeHandler(e, false, true, true, true));
        rightBottom.addEventListener('mousedown', e => resizeHandler(e, false, false, true, true));
        leftBottom.addEventListener('mousedown', e => resizeHandler(e, true, false, true, true));
    }

    // handle rotation
    let rotate = document.getElementById("rotate");
    rotate.addEventListener('mousedown', function (event) {

        initX = this.offsetLeft;
        initY = this.offsetTop;
        mousePressX = event.clientX;
        mousePressY = event.clientY;

        let arrowRects = box.getBoundingClientRect();
        let arrowX = arrowRects.left + arrowRects.width / 2;
        let arrowY = arrowRects.top + arrowRects.height / 2;

        function eventMoveHandler(event) {
            let angle = Math.atan2(event.clientY - arrowY, event.clientX - arrowX) + Math.PI / 2;
            rotateBox(angle * 180 / Math.PI);
        }

        window.addEventListener('mousemove', eventMoveHandler, false);

        window.addEventListener('mouseup', function eventEndHandler() {
            window.removeEventListener('mousemove', eventMoveHandler, false);
            window.removeEventListener('mouseup', eventEndHandler);
        }, false);
    }, false);


    
}