const {app, Menu, Tray, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
let $ = require('jquery');
let fs = require('fs');

let win;
let tray;

function createWindow() { 
    tray = new Tray(`${__dirname}/res/images/icon.png`);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);
    console.log("App is loaded and ready\n");
    tray.setToolTip('Emailer App');
    tray.setContextMenu(contextMenu);
    win = new BrowserWindow({
        width: 380, 
        height: 650,
        minWidth: 380,
        minHeight: 650,
        maxWidth: 400,
        title: 'Emailer',
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'res/images/icon.png')
        });
    win.loadURL(url.format ({ 
        pathname: path.join(__dirname, 'index.html'), 
        protocol: 'file:', 
        slashes: true
    }));
};

ipcMain.on('request:contacts', (event, fileName) => {
    console.log("File data requested for: " +fileName);
    //Check if file exists
    let data;

    if(fs.existsSync(fileName)) {
        data = fs.readFileSync(fileName, 'utf8').split('\n');
        console.log(data);
    } else {
        console.log("File Doesn\'t Exist. Creating new file.");
        fs.writeFile(fileName, '', (err) => {
            if(err)
                console.log(err);
        });
        data = "";
    }
     win.webContents.send('return:contacts', data);
});

ipcMain.on('request:addContact', (event, contact, fileName) => {

    let newLine = contact+"\n";
    let msg;

    if(checkIfExists(contact[3], fileName, 'utf8')){
        msg = "A contact with that email address already exists.\nPlease try again."
        win.webContents.send('return:addContactError', msg);
    }else{
        let str = JSON.stringify(contact);
        fs.writeFile(fileName, str, (err) => {
            if(err)
                console.log(err);
        });
        fs.appendFile(fileName, newLine);
        msg = "The contact has been successfully added."
        win.webContents.send('return:addContactSuccess', msg, contact);
    }
});

ipcMain.on('request:removeContact', (event, row, fileName) => {

    let msg;
    let index = row - 1;
    let data = fs.readFileSync(fileName, 'utf8').split('\n');
    let removedContact = data.splice(index, 1);
    fs.writeFile(fileName, '', function() {
        data.forEach((contact) => {
            if(contact !== ''){
                let newLine = contact + '\n';
                fs.appendFile(fileName, newLine);
            }
        });
        let [ dept, title, name, email ] = String(removedContact).split(',');
        msg = name + " has been removed from your contacts."
        win.webContents.send('return:removeContactSuccess', msg);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

/*
* A function to search for a string line by line in a text file.
* @param {string} string - the string to search for in the text file.
* @param {string} filePath - the path and name of the file to search in. The reference directory is the directory where this file resides.
* @param {string} charType - the character code of the text file to search.
* @return - returns a boolean value of false if the file does not contain the string and a value of true if it does contain the string.
*/
let checkIfExists = function(string, filePath, charType){

    let fileJSON = JSON.parse(fs.readFileSync('data/emailer.json', charType));
    let result = false;

    console.log(fileJSON);

        let arr = fileJSON['primary-contacts'];
        let arrLen = arr.length;

        for (var i = 0; i < arrLen; i++){
            for (var key in arr[i]) {
                if (arr[i].hasOwnProperty(key) && key === 'email') {
                    var val = arr[i][key];
                    if(val === string){
                        result = true;
                    }
                }
            }
        }
    return result;
};

app.on('ready', createWindow);
