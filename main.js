var app = require('app');
var BrowserWindow = require('browser-window');
var shell = require('shell');

require('crash-reporter').start();

var mainWindow = null;

function init() {
  if (mainWindow !== null) {
    return;
  }

  mainWindow = new BrowserWindow({ width: 900, height: 700 });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('will-navigate', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
}

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate-with-no-open-windows', init);

app.on('ready', init);
