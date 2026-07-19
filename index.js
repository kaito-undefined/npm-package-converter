const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const npmFetch = require('npm-registry-fetch');
const { promises } = require('fs');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'npm.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true
  });

  win.maximize();

  win.loadURL('https://www.npmjs.com'); 
}

ipcMain.on('save-url', async (event, url) => {
    try{
        const match = url.match(/^https:\/\/www\.npmjs\.com\/package\/([^/?#]+)\/?$/);
        if (!match) {
            throw new Error('Geçersiz npm package URL yapısı');
        }
        const packageName = match[1];
        const packageData = await npmFetch.json(`/${packageName}`);
        try {
          const outDir = path.join(__dirname, 'output');
          await promises.mkdir(outDir, { recursive: true });
          const fileName = `${packageName.replace(/[/\\?%*:|"<>]/g, '_')}.md`;
          const filePath = path.join(outDir, fileName);
          const content = packageData.readme || '';
          await promises.writeFile(filePath, content, 'utf8');
          exec(`explorer.exe "${outDir}"`);
        } catch (fsErr) {
          console.error('Dosya yazılırken hata oluştu:', fsErr);
        }
    } catch (error) {
        console.error('Paket verisi alınırken hata oluştu:', error);
    }
});

app.whenReady().then(createWindow);