// 你可以在这个脚本中续写或者使用require引入独立的js文件.
const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');

const notifier = require('node-notifier');
const path = require('path');

// ======================= 系统托盘图表及菜单 start
let appIcon = null;
app.whenReady().then(() => {
  appIcon = new Tray(path.join(__dirname, './favicon.ico'));
  //参考electron/electron.d.ts or https://www.electronjs.org/docs/api/menu-item
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { type: 'separator' },
    { role: 'minimize', label: '最小化' },
    { role: 'quit', label: '退出' },
  ]);

  // Make a change to the context menu
  contextMenu.items[1].checked = true;
  appIcon.setToolTip('过程监控');
  // 添加到上下文
  appIcon.setContextMenu(contextMenu);
});
// ======================= 系统托盘图表及菜单 end

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
  // 创建浏览器窗口,宽高自定义具体大小你开心就好
  Menu.setApplicationMenu(null);
  loginWindow = new BrowserWindow({
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
    },
  });

  // 加载应用----适用于 react 项目
  // loginWindow.loadURL(mode === 'dev' ? 'http://localhost:8000/#/' : startUrl);
  loginWindow.loadURL('http://localhost:8000/#/user/login');

  // 打开开发者工具，默认不打开
  loginWindow.webContents.openDevTools();

  // 关闭window时触发下列事件.
  loginWindow.on('closed', () => {
    loginWindow = null;
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
    loginWindow.hide();
  }
  if (mainWindow) {
    mainWindow.hide();
    mainWindow = null;
  }
  // 创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
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
    },
  });

  // 加载应用----适用于 react 项目
  // mainWindow.loadURL(mode === 'dev' ? 'http://localhost:8000/#/user/login' : startUrl);
  mainWindow.loadURL('http://localhost:8000/#/index');
  mainWindow.show();
  mainWindow.webContents.openDevTools();

  event.returnValue = mainWindow.id;
});
//关闭所有窗口，打开登录窗口
ipcMain.on('open-login', (event, arg) => {
  const wins = BrowserWindow.getAllWindows();
  wins.forEach((win) => {
    win.webContents.closeDevTools();
    win.close();
  });
  loginWindow.show();
});

//打开工具窗口
ipcMain.on('open-tool', (event, arg) => {
  if (toolWindow) {
    toolWindow.hide();
    toolWindow = null;
  }
  // 创建浏览器窗口,宽高自定义
  toolWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // 加载应用----适用于 react 项目
  // toolWindow.loadURL(mode === 'dev' ? 'http://localhost:8000/#/tool' : startUrl);
  toolWindow.loadURL('http://localhost:8000/#/tool');
  toolWindow.show();

  event.returnValue = toolWindow.id;
});
//在主进程中创建事件监听，调用系统通知
ipcMain.on('send-notifier', (event, arg) => {
  const notice = JSON.parse(arg);
  // String
  // notifier.notify(notice.message);
  // Object
  notifier.notify(notice);
  event.returnValue = 'success';
});
