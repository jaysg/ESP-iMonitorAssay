import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Space } from 'antd';
import styles from './index.less';
import Authorized from '@/utils/Authorized';
import eAPIs from '@/utils/electron';

export default (): React.ReactNode => {
  const [downKeys, setDownKeys] = useState<string[]>([]);
  const onKeyPress = (e: any) => {
    // 只能监测到ctrl、shift和基础按键的组合，alt在keydown可监测
    const keys = [];
    if (e.ctrlKey) keys.push('ctrl');
    if (e.shiftKey) keys.push('shift');
    if (e.altKey) keys.push('alt');
    keys.push(e.code);
    keys.push(e.key);
    console.log(keys.join('+'));
    setDownKeys(keys);
  };
  useEffect(() => {
    eAPIs.setContextMenu();
    // 按键监听 logger 监听
    window.addEventListener('keypress', onKeyPress);
    return () => {
      // 组件卸载移除按键监听
      window.removeEventListener('keypress', onKeyPress);
    };
  }, []);

  /** Alert效果 */
  const showMessageBoxAlert = () => {
    // eslint-disable-next-line no-alert
    alert('alert：我想写log');
  };

  /** Modal */
  const showModal = () => {
    Modal.info({
      title: '标题',
      content: '内容',
      closable: true,
    });
  };

  return (
    <Space
      direction="vertical"
      wrap={true}
      style={{ width: '100%', padding: 50, position: 'absolute', top: 0 }}
    >
      <Card title="进程通讯">
        <Button className={styles.btn} onClick={eAPIs.openLoginWin}>
          主进程打开登录窗口
        </Button>
        <Button className={styles.btn} onClick={eAPIs.remoteToGithub}>
          渲染进程打开github
        </Button>
        <Button className={styles.btn} onClick={eAPIs.remoteToBaidu}>
          渲染进程修改自己的地址
        </Button>
      </Card>
      <Card title="弹窗">
        <Button className={styles.btn} onClick={showModal}>
          页面级对话框ant-modal（Web）
        </Button>
        <div>https://ant.design/components/modal-cn/#API</div>
        <Button className={styles.btn} onClick={eAPIs.showMessageBox}>
          窗口级对话框dialog（Window）
        </Button>
        <div>https://www.electronjs.org/docs/api/dialog</div>
        <Button className={styles.btn} onClick={showMessageBoxAlert}>
          窗口级对话框alert（WebBrowser）（纯文本）
        </Button>
      </Card>
      <Card title="系统">
        <Button className={styles.btn} onClick={eAPIs.openFile}>
          打开文件
        </Button>
        <Button className={styles.btn} onClick={eAPIs.showNotification}>
          显示系统通知
        </Button>
        <Button className={styles.btn} onClick={eAPIs.trayFlashing}>
          小图标闪烁
        </Button>
        <Button className={styles.btn} onClick={eAPIs.trayFlashEnd}>
          关闭小图标闪烁
        </Button>
      </Card>
      <Card title="右击菜单">右击鼠标</Card>
      <Card title="快捷键">
        当前按键：{downKeys.length ? downKeys.join('+') : '无'}
        <br />
        已注册的快捷键：ctrl+shift+V
        <br />
        提示：与系统或其他进程注册的快捷键会失效
      </Card>
      <Card title="权限校验">
        权限控制(admin可以看到的按钮)：
        {Authorized.check(['admin'], <Button>我是admin的按钮</Button>, null)}
        <br />
        权限控制(guest可以看到的按钮)：
        {Authorized.check(['guest'], <Button>我是guest的按钮</Button>, null)}
      </Card>
    </Space>
  );
};
