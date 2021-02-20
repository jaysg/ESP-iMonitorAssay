// 你可以在这个脚本中续写或者使用require引入独立的js文件.
const { app, BrowserWindow, ipcMain, Menu, Tray, globalShortcut } = require('electron');
const notifier = require('node-notifier');
const path = require('path');

app.whenReady().then(() => {
  initFlash();
  initFlashEvent, initShortcut();
  initLocaleEvent();
  initOSNotifierEvent();
  console.log('AppPath: ', app.getAppPath());
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

let appIcon = null;
let timer = null;
let timerTick = 0;

/** 初始化系统托盘图标 */
const initFlash = () => {
  //实现图标闪烁
  appIcon = new Tray(path.join(__dirname, '../public/tray.ico'));
  //参考electron/electron.d.ts or https://www.electronjs.org/docs/api/menu-item
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio', checked: true },
    { label: 'Item2', type: 'radio' },
    { type: 'separator' },
    {
      label: '最小化',
      click: () => {
        const wins = BrowserWindow.getAllWindows();
        wins.forEach((win) => {
          win.minimize();
        });
      },
    },
    {
      label: '退出',
      click: () => {
        app.exit(0);
      },
    },
  ]);
  // contextMenu.items[1].checked = true;
  appIcon.setToolTip('过程监控');
  appIcon.on('click', function () {
    const wins = BrowserWindow.getAllWindows();
    wins.forEach((win) => {
      win.show();
    });
  });
  // 添加到上下文
  appIcon.setContextMenu(contextMenu);
  initFlashEvent();
};

/** 监听系统托盘图表事件 */
const initFlashEvent = () => {
  ipcMain.on('ico-flashing', (event, arg) => {
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      timerTick++;
      if (timerTick % 2 === 0) appIcon.setImage(path.join(__dirname, '../public/tray.ico'));
      else appIcon.setImage(path.join(__dirname, '../public/tray2.ico'));
    }, 500);
    event.returnValue = 'flashing';
  });
  ipcMain.on('ico-flash-end', (event, arg) => {
    timerTick = 0;
    if (timer) clearInterval(timer);
    appIcon.setImage(path.join(__dirname, '../public/tray.ico'));
    event.returnValue = 'flash-end';
  });
};

/** 注册应用全局快捷键 */
const initShortcut = () => {
  const ret = globalShortcut.register('CommandOrControl+Alt+V', () => {
    // Do stuff when V and either Command/Control is pressed.
    console.log('Ctrl+Alt+V pressed');
  });
  if (!ret) {
    console.log('Ctrl+Alt+V is register faild');
  }

  // 检查快捷键是否注册成功
  // console.log(globalShortcut.isRegistered('Ctrl+Alt+V is registered'));
};

/** 注册国际化事件 */
const initLocaleEvent = () => {
  // 窗口的国际化切换
  ipcMain.on('set-locale', (event, arg) => {
    console.log(arg);
    // 实现
    event.returnValue = arg;
  });
};

/** 在主进程中创建事件监听，调用系统通知 */
const initOSNotifierEvent = () => {
  // 窗口的国际化切换
  ipcMain.on('send-notifier', (event, arg) => {
    const notice = JSON.parse(arg);
    notifier.notify(notice);
    event.returnValue = 'success';
  });
};
