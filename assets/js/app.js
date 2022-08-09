let toolbarOptions = [
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge',] }],  // Headers

    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    ['blockquote', 'code-block' ],
    
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'align': [] }],
    ['link'],
    ['clean']                                         // remove formatting button
];

const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: toolbarOptions
    }
});

let newNotes = '';

// Restore data from previous
if (localStorage.getItem('notes')) {
    newNotes =  JSON.parse(localStorage.getItem('notes'));
    quill.setContents(newNotes);
}



// Store data for later use
quill.on('text-change', function () {
    newNotes = quill.getContents();
    localStorage.setItem('notes', JSON.stringify(newNotes));
});