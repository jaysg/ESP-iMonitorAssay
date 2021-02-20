import { Modal } from 'antd';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { electron } from '@/utils/electron';

const GlobalAppHeader = (props: any) => {
  const winStatBtnClick = (type: string) => {
    if (!electron) return;
    const browserWindow = electron.remote.getCurrentWindow();
    switch (type) {
      case 'home':
        history.push('/');
        break;
      case 'mini':
        browserWindow.minimize();
        break;
      case 'maxi':
        browserWindow.maximize();
        break;
      case 'restore':
        browserWindow.unmaximize();
        break;
      case 'close':
        electron.remote.app.exit();
        break;
      default:
        break;
    }
  };
  const [windowStatus, setWindowStatus] = useState('normal');
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!electron) return;
      const browserWindow = electron.remote.getCurrentWindow();
      if (browserWindow.isMaximized()) {
        setWindowStatus('maxi');
      } else if (browserWindow.isNormal()) {
        setWindowStatus('normal');
      }
    });
    return () => {
      window.removeEventListener('resize', () => {
        console.log('移除监听');
      });
    };
  }, []);
  return (
    <>
      <span className={props.type === 'normal' ? styles.logo : undefined}>
        过程监控 ESP-iMonitorAssay
      </span>
      <div className={styles.icons}>
        {props.type === 'normal' && (
          <i className={styles.home} onClick={() => winStatBtnClick('home')} />
        )}
        <i className={styles.minimize} onClick={() => winStatBtnClick('mini')} />
        {windowStatus === 'normal' && (
          <i className={styles.maximize} onClick={() => winStatBtnClick('maxi')} />
        )}
        {windowStatus === 'maxi' && (
          <i className={styles.restore} onClick={() => winStatBtnClick('restore')} />
        )}
        <i
          className={styles.close}
          onClick={() => {
            Modal.confirm({
              title: '提醒',
              content: '是否确认关闭应用？',
              okButtonProps: { danger: true },
              onOk() {
                winStatBtnClick('close');
              },
            });
          }}
        />
      </div>
    </>
  );
};

export default GlobalAppHeader;
