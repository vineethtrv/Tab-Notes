let newNotes = '';

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





// Restore data from previous
restoreNotes();
