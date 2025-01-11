import { app, BrowserWindow, ipcMain } from 'electron';
import remoteMain from '@electron/remote/main/index.js';
import { spawn } from 'child_process';


let fastApiProcess;


function createWindow () {
  const win = new BrowserWindow({
    width: 1300,
    height: 750,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true, // Don't expose remote modules directly
      preload: 'titleBar.js' // Path to the preload script
    }
  });

  remoteMain.initialize();
  win.loadFile('index.html');


  let maximizeToggle = false;
  ipcMain.on("manualMinimize", () => {
    win.minimize()
  })

  ipcMain.on("manualMaximize", () => {
    if (maximizeToggle) win.unmaximize()  
    else win.maximize();

    maximizeToggle = !maximizeToggle;
  })

  ipcMain.on("manualClose", () => {
    win.close()
  })
}




function startFastAPIServer() {
  fastApiProcess = spawn('python', ['-m', 'uvicorn', 'server:app', '--reload']);

  fastApiProcess.stdout.on('data', (data) => {
    console.log(`FastAPI: ${data}`);
  });

  fastApiProcess.stderr.on('data', (data) => {
    console.error(`FastAPI Error: ${data}`);
  });

  fastApiProcess.on('close', (code) => {
    console.log(`FastAPI process exited with code ${code}`);
  });
}


app.whenReady().then(() => {
  createWindow();
  startFastAPIServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});