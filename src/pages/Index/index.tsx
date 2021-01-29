/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography, Button, message } from 'antd';
import { FormattedMessage } from 'umi';
import styles from './index.less';

const electron = window.require('electron');
const { remote, ipcRenderer } = electron;
const { dialog, BrowserWindow, Menu, MenuItem } = remote;
const isMac = process.platform === 'darwin';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => {
  // 在线状态 -------------------------------------------start
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    if (isOnline) message.success('网络已连接');
    else message.warn('网络已断开');
  }, [isOnline]);
  // 在线状态 -------------------------------------------end

  useEffect(() => {
    // 在线状态 -------------------------------------------start
    window.removeEventListener('online', () => {
      setIsOnline(navigator.onLine);
    });
    window.removeEventListener('offline', () => {
      setIsOnline(navigator.onLine);
    });
    window.addEventListener('online', () => {
      setIsOnline(navigator.onLine);
    });
    window.addEventListener('offline', () => {
      setIsOnline(navigator.onLine);
    });
    // 在线状态 -------------------------------------------end

    // 右击菜单实现 -------------------------------------------start
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
        menu.popup({ window: remote.getCurrentWindow() });
      },
      false,
    );
    //  右击菜单实现 -------------------------------------------end
  }, []);
  const createWindow = () => {
    console.log(ipcRenderer.sendSync('open-login', './index'));
  };
  const openTool = () => {
    console.log(ipcRenderer.sendSync('open-tool', './tool'));
  };
  /** 渲染进程使用remote打开新窗口 */
  const remoteCreateWindow = () => {
    const win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL('https://github.com');

    const contents = win.webContents;
    console.log(contents);
  };
  /** 修改自身窗体对象 */
  const updateSelfWindow = () => {
    const win = remote.getCurrentWindow();
    win.loadURL('https://www.baidu.com');
  };
  /** 打开文件 */
  const openFile = () => {
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
        if (!canceled) console.log(filePaths);
        else console.log('取消了文件选择');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /** 显示通知 */
  const showNotification = () => {
    const notice = {
      title: '自定义通知标题',
      message: '自定义通知的内容!',
    };
    const result = ipcRenderer.sendSync('send-notifier', JSON.stringify(notice));
    console.log(result);
  };
  const showMessageBox = () => {
    dialog.showMessageBoxSync({
      title: '提示信息标题',
      type: 'none', // "none", "info", "error", "question" 或者 "warning"
      message: '内容主题：内容内容内容内容内容内容内容内容内容内容内容',
      defaultId: 0,
      cancelId: 1,
      buttons: ['确定'],
    });
  };
  return (
    <PageContainer>
      <div
        style={{
          background: 'gray',
          padding: 20,
        }}
      >
        <Button className={styles.btn} onClick={createWindow}>
          主进程打开登录窗口
        </Button>
        <Button className={styles.btn} onClick={openTool}>
          主进程打开工具窗口
        </Button>
        <Button className={styles.btn} onClick={remoteCreateWindow}>
          渲染进程打开github
        </Button>
        <Button className={styles.btn} onClick={updateSelfWindow}>
          渲染进程修改自己的地址
        </Button>
        <Button className={styles.btn} onClick={openFile}>
          打开文件
        </Button>
        <Button className={styles.btn} onClick={showNotification}>
          显示系统通知
        </Button>
        <Button className={styles.btn} onClick={showMessageBox}>
          成功提示对话框
        </Button>
      </div>
      <div
        style={{
          background: 'gray',
          marginTop: 10,
          padding: 20,
          color: 'white',
        }}
      >
        右击菜单有实现哦
      </div>
      <Card>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="高级布局" />{' '}
          <a
            href="https:// procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="欢迎使用" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card>
    </PageContainer>
  );
};
