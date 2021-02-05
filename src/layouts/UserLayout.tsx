import type { MenuDataItem } from '@ant-design/pro-layout';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps } from 'umi';
import { useIntl, connect } from 'umi';
import React, { useEffect, useState } from 'react';
import type { ConnectState } from '@/models/connect';
import { Modal, Layout } from 'antd';
import styles from './UserLayout.less';
import GlobalFooter from '@/components/GlobalFooter';
import { electron } from '@/utils/electron';

const { Header, Footer, Content } = Layout;

export type UserLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
} & Partial<ConnectProps>;

const UserLayout: React.FC<UserLayoutProps> = (props) => {
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
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Layout className={styles.loginLayout}>
        <Header>
          <span>过程监控 ESP-iMonitorAssay - 登录</span>
          <div className={styles.icons}>
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
        </Header>
        <Content>{children}</Content>
        <Footer>
          <GlobalFooter />
        </Footer>
      </Layout>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
