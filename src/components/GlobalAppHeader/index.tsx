import { Modal } from 'antd';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { electron } from '@/utils/electron';

const GlobalAppHeader = () => {
  const [winStatus, setWinStatus] = useState('restore');
  useEffect(() => {
    if (!electron) return;
    const browserWindow = electron.remote.getCurrentWindow();
    switch (winStatus) {
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
  }, [winStatus]);
  return (
    <>
      <span className={styles.logo}>过程监控 ESP-iMonitorAssay</span>
      <div className={styles.icons}>
        <i
          className={styles.home}
          onClick={() => {
            history.push('/');
          }}
        />
        <i className={styles.minimize} onClick={() => setWinStatus('mini')} />
        {winStatus === 'restore' && (
          <i className={styles.maximize} onClick={() => setWinStatus('maxi')} />
        )}
        {winStatus === 'maxi' && (
          <i className={styles.restore} onClick={() => setWinStatus('restore')} />
        )}
        <i
          className={styles.close}
          onClick={() => {
            Modal.confirm({
              title: '提醒',
              content: '是否确认关闭应用？',
              okButtonProps: { danger: true },
              onOk() {
                setWinStatus('close');
              },
            });
          }}
        />
      </div>
    </>
  );
};

export default GlobalAppHeader;
