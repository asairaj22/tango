const electron = require('electron');
const path = require('path');
const url = require('url');
const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({width: 1400, height:850, title:'Tango', icon: path.join(__dirname, 'src/assets/icons/icon.ico')});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes:true
  }));


  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);

});

// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If OSX, add empty object to menu (to fix a bug in menu alignment)
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}
