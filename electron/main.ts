import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let imageresizer : BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  imageresizer = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width:600 ,
    height:800 ,
    frame:false , 
    resizable:false , 
    center:true ,
    movable:true,
    title:"imageresizer",
    webPreferences: {
      sandbox: false ,
      contextIsolation:true , 
      nodeIntegration:false,
      preload: path.join(__dirname, 'preload.js'),

    },
  })
  
  imageresizer.webContents.on('did-finish-load', () => {
    imageresizer?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    imageresizer.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // imageresizer.loadFile('dist/index.html')
    imageresizer.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    imageresizer = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)


ipcMain.on('Not-an-Image',()=>{
  dialog.showErrorBox('Type Error' ,"Please Enter an Image")

})
ipcMain.on('Fill-Inputs',()=>{
  dialog.showErrorBox('Type Error' ,"Please Fill Width and Height")
})
ipcMain.on('Image-Resize',(e,options)=>{
  console.log(options) 
  options.dest = path.join(os.homedir(), 'imageresizer');
  resizeImage(options);
})

async function resizeImage({ imgPath, height, width, dest } : any ) {
  try {
     console.log(imgPath, height, width, dest);

    // Resize image
    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    // Get filename
    const filename = path.basename(imgPath);

    // Create destination folder if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Write the file to the destination folder
    fs.writeFileSync(path.join(dest, `resizer-${filename}`), newPath);

    // Send success to renderer
      const options :  Electron.MessageBoxOptions = {
      type: 'info',
      title: 'Success',
      message: `Image is Successfully resized and saved at ${dest} , Click OK to open ` ,
      buttons: ['OK' , 'Cancel'] , 
    };
    dialog.showMessageBox( options)
    .then((response: Electron.MessageBoxReturnValue) => {
      if (response.response === 0) {
        shell.openPath(imgPath);
      } else {
        console.log('User clicked Cancel');
      }
    })
    .catch((error: Error) => {
      console.error('Error displaying message box:', error);
    });
    // Open the folder in the file explorer
    

  } catch (err) {
    console.log(err);
  }
}