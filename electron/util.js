const { app, BrowserWindow, ipcMain, Menu, Tray, globalShortcut } = require('electron');
const notifier = require('node-notifier');
const path = require('path');

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
module.exports = {
  initFlash,
  initFlashEvent,
  initShortcut,
  initLocaleEvent,
  initOSNotifierEvent,
};
