/* eslint-disable no-console */

const getElectron = () => {
  if (window.navigator.userAgent.indexOf('Electron') === -1) return null;
  const electron = window.require('electron');
  return electron;
};

// 判断操作环境
const isMac = process.platform === 'darwin';

export const electron = getElectron();

export const openLoginWin = () => {
  if (electron) console.log(electron.ipcRenderer.sendSync('open-login', './index'));
};

export const trayFlashing = () => {
  if (electron) console.log(electron.ipcRenderer.sendSync('ico-flashing', './icoflashing'));
};

export const trayFlashEnd = () => {
  if (electron) console.log(electron.ipcRenderer.sendSync('ico-flash-end', './icoflashend'));
};

/** 渲染进程使用remote打开新窗口 */
export const remoteToGithub = () => {
  if (!electron) return;
  const { BrowserWindow } = electron.remote;
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL('https://github.com');

  // const contents = win.webContents;
  // console.log(contents);
};

/** 修改自身窗体对象 */
export const remoteToBaidu = () => {
  const win = electron.remote.getCurrentWindow();
  win.loadURL('https://www.baidu.com');
};

/** 打开文件 */
export const openFile = () => {
  if (electron) {
    const { dialog } = electron.remote;
    const promise: Promise<any> = dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: '图片', extensions: ['jpg', 'png', 'gif'] },
        { name: '视频', extensions: ['mkv', 'avi', 'mp4'] },
        { name: '自定义类型', extensions: ['as'] },
        { name: '全部', extensions: ['*'] },
      ],
    });
    promise
      .then((data) => {
        const { canceled, filePaths } = data;
        if (!canceled) {
          console.log(filePaths);
        } else console.log('取消了文件选择');
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log('客户端功能 dialog');
  }
};

/** 显示通知 */
export const showNotification = () => {
  if (!electron) return;
  const notice = {
    title: '自定义通知标题',
    message: '自定义通知的内容!',
  };
  const result = electron.ipcRenderer.sendSync('send-notifier', JSON.stringify(notice));
  console.log(result);
};

/** 显示系统通知 */
export const showMessageBox = () => {
  if (!electron) return;
  const { dialog } = electron.remote;
  dialog.showMessageBoxSync({
    title: '提示信息标题',
    type: 'none', // "none", "info", "error", "question" 或者 "warning"
    message: '内容主题：内容内容内容内容内容内容内容内容内容内容内容',
    defaultId: 0,
    cancelId: 1,
    buttons: ['确定'],
  });
};

/** 右键菜单配置 */
export const setContextMenu = () => {
  if (electron) {
    const { Menu, MenuItem } = electron.remote;
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: '常规菜单项',
        click() {
          console.log('item 1 clicked');
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'File',
        submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac
            ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                  label: 'Speech',
                  submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
                },
              ]
            : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
        ],
      }),
    );
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ label: '开关菜单项', type: 'checkbox', checked: true }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(
      new MenuItem({
        label: '常规菜单项',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      }),
    );

    window.removeEventListener('contextmenu', () => {});
    window.addEventListener(
      'contextmenu',
      (e) => {
        e.preventDefault();
        if (electron) menu.popup({ window: electron.remote.getCurrentWindow() });
        else menu.popup({ window });
      },
      false,
    );
  }
};
const APIs = {
  openLoginWin,
  trayFlashing,
  trayFlashEnd,
  remoteToGithub,
  remoteToBaidu,
  openFile,
  showNotification,
  showMessageBox,
  setContextMenu,
};

export default APIs;
