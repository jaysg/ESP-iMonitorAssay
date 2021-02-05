// 你可以在这个脚本中续写或者使用require引入独立的js文件.
const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron');
const path = require('path');
const {
  initFlash,
  initFlashEvent,
  initShortcut,
  initLocaleEvent,
  initOSNotifierEvent,
} = require('./util');

app.whenReady().then(() => {
  initFlash();
  initShortcut();
  initFlashEvent();
  initLocaleEvent();
  initOSNotifierEvent();
});

app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll();
});

// 获取在 package.json 中的命令脚本传入的参数，来判断是开发还是生产环境
// const mode = process.argv[2];
// console.log(mode)

// 引入electron并创建一个Browserwindow
// const url = require('url');
// const startUrl = url.format({
//   pathname: path.join(__dirname, './dist/index.html'),
//   protocol: 'file:',
//   slashes: true,
// });

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let loginWindow;
let mainWindow;
let toolWindow;

function createLoginWindow() {
  const wins = BrowserWindow.getAllWindows();
  wins.forEach((win) => {
    win.webContents.closeDevTools();
    win.close();
  });

  loginWindow = new BrowserWindow({
    title: 'login',
    minWidth: 960,
    minHeight: 540,
    width: 960,
    height: 540,
    frame: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  loginWindow.loadURL('http://localhost:8000/#/user/login');

  // 打开开发者工具，默认不打开
  loginWindow.webContents.openDevTools();

  // 关闭window时触发下列事件.
  loginWindow.on('closed', () => {
    loginWindow = null;
  });
}
function createMainWindow() {
  Menu.setApplicationMenu(null);
  if (mainWindow) {
    mainWindow.close();
  }
  mainWindow = new BrowserWindow({
    title: 'main',
    minWidth: 1280,
    minHeight: 768,
    width: 1280,
    height: 768,
    frame: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL('http://localhost:8000/#/index');
  mainWindow.show();
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.on('crashed', () => {
    console.log('crashed');
    //当渲染进程崩溃或被结束时触发
  });
  mainWindow.on('render-process-gone', () => {
    console.log('render-process-gone');
    //当渲染程序进程意外消失时触发。这通常是因为它销毁或终止。
  });
  mainWindow.on('unresponsive', () => {
    console.log('unresponsive');
    //网页变得未响应时触发
  });
  mainWindow.on('plugin-crashed', () => {
    console.log('plugin-crashed');
    //当有插件进程崩溃时触发
  });
  mainWindow.on('destroyed', () => {
    //当webContents被销毁时，触发该事件
    console.log('destroyed');
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', () => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.ikobit.desktop-notifications');
  }
  createLoginWindow();
});

// 所有窗口关闭时退出应用.
app.on('window-all-closed', () => {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (loginWindow === null) {
    createLoginWindow();
  }
});

//在主进程中创建事件监听，用来打开新窗口，如果想在渲染进程直接打开窗口也可以，使用remote
ipcMain.on('open-main', (event, arg) => {
  if (loginWindow) {
    loginWindow.webContents.closeDevTools();
    loginWindow.close();
  }
  createMainWindow();
  event.returnValue = mainWindow.id;
});

//关闭所有窗口，打开登录窗口
ipcMain.on('open-login', (event, arg) => {
  createLoginWindow();
  event.returnValue = loginWindow.id;
});

//打开工具窗口
ipcMain.on('open-tool', (event, arg) => {
  if (toolWindow) {
    toolWindow.close();
    toolWindow = null;
  }
  // 创建浏览器窗口,宽高自定义
  toolWindow = new BrowserWindow({
    parent: mainWindow,
    title: 'tools',
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  toolWindow.loadURL(`http://localhost:8000/#/${arg}`);
  toolWindow.show();

  event.returnValue = toolWindow.id;
});
