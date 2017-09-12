const electron = require('electron');

const { app, Menu, Tray, BrowserWindow } = electron;

app.on('ready', () => {
    console.log("App is loaded and ready");
    tray = new Tray(`${__dirname}/email.ico`);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
    const mainWindow = new BrowserWindow({
        icon: `${__dirname}/email.ico`,
        title: 'Video info',
        width: 380,
        height: 620
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

app.on('window-all-closed', () => {
    app.quit();
});
