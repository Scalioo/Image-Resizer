import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let imageresizer : BrowserWindow | null
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
    imageresizer.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    imageresizer = null
  }
})

app.on('activate', () => {

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

    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    const filename = path.basename(imgPath);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    fs.writeFileSync(path.join(dest, `resizer-${filename}`), newPath);

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
    

  } catch (err) {
    console.log(err);
  }
}