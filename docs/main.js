const electron = require('electron');
const { ipcRenderer } = electron;
let $ = require('jquery');
let filePath = 'data/contacts';
let sno = 0;
let btn = document.getElementById('linkBtn');


btn.addEventListener('click', function(){
    window.alert("HELLO");
});

$("#contact-table").on("click", "tr", function(e) {
    let row = $(e.currentTarget).index();
    $(e.currentTarget).remove();
    ipcRenderer.send('request:removeContact', row, filePath);
});

$('#add-to-list').on('click', () => {
    let validData = validateEntry();
    if(validData.result){
        ipcRenderer.send('request:addContact', validData.contact, filePath);
    };
});

ipcRenderer.on('return:addContactSuccess', (event, msg, contact) => {
    addEntry(contact);
    window.alert(msg);
    $('#Dept').val("");
    $('#Title').val("");
    $('#Name').val("");
    $('#Email').val("");
});

ipcRenderer.on('return:removeContactSuccess', (event, msg) => {
    window.alert(msg);
});

function addEntry(contact) {
    let [ dept, title, name, email ] = contact.split(',');
    if(dept && title && name && email) {
        sno++
        let updateString = '<tr class="tbrow" id="' + sno + '"><td class="cell">'+ sno + '</td><td class="cell">'+ dept +'</td><td class="cell">'+ title +'</td><td class="cell">'+ name +'</td><td class="cell">' 
            + email +'</td><td class="cell flyout-' + sno + '">X</td></tr>';
        $('#contact-table').append(updateString);
    }
};

$("#contact-table").on("hover", 'tr', function(e) {
    console.log("ASSHOLE");
});

$(".tbrow").hover(function(e){
    console.log(e);
    $('.flyout').show();
},function(){
    $('.flyout').hide();
});

function loadAndDisplayContacts() {  
    //Request data from main.js via event
    ipcRenderer.send('request:contacts', filePath);
};

ipcRenderer.on('return:contacts', (event, data) => {
    data.forEach((contact) => {
        addEntry(contact);
    });
});

ipcRenderer.on('return:addContactError', (event, msg) => {
    window.alert(msg);
    $('#Email').focus();
});

function validateEntry() {
    let dept = $('#Dept').val();
    let title = $('#Title').val();
    let name = $('#Name').val();
    let email = $('#Email').val();
    let contact = dept + ',' + title + ',' + name + ',' + email;
    result = false;
    if(dept !== 'QC' && dept !== "MTC" && dept !== "PROD"){
        window.alert("You must enter a valid department.\n\n- QC\n- MTC\n- PROD");
    }else if(title !== 'TM' && title !== "TL" && title !== "GL" && title !== "AM"){
        window.alert("You must enter a valid title.\n\n- TM\n- TL\n- GL\n- AM");
    }else if(name === "" || name === " " || name === "  "){
        window.alert("You must enter a name.");
    }else if(email === "" || email === " " || email === "  "){
        window.alert("You must enter a email address.");
    }else if(!email.includes('@') || (!email.includes('.com') && !email.includes('.ca')) || (email.lastIndexOf('.ca') !== (email.length - 3) && email.lastIndexOf('.com') !== email.length - 4)){
        window.alert("Please enter a valid email address.");
    }else{
        result = true;
    }
    return {
        result: result,
        contact: contact
            };
}

window.onbeforeunload = (e) => {

    let num = Math.floor((Math.random() * 7) + 1);
    let msg;
    switch(num){
        case 1:
            msg = 'I WILL NEVER DIE!!';
            break;
        case 2:
            msg = 'YOU CAN\'T KILL ME!';
            break;
        case 3:
            msg = 'NOPE, NOT GONNA CLOSE.';
            break;
        case 4:
            msg = 'NICE TRY, NOTHING\'S GONNA WORK!';
            break;
        case 5:
            msg = 'YOU CAN RUN BUT YOU CAN\'T HIDE!';
            break;
        case 6:
            msg = 'BUT WE\'VE ONLY JUST BEGUN!';
            break;
        case 7:
            msg = 'WHERE DO YOU THINK YOU\'RE GOING?';
            break;
    }
    window.alert(msg);

  // Unlike usual browsers that a message box will be prompted to users, returning
  // a non-void value will silently cancel the close.
  // It is recommended to use the dialog API to let the user confirm closing the
  // application.
  e.returnValue = false;
}

loadAndDisplayContacts();