/* eslint-disable no-console */
/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
// import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch } from 'umi';
import { Link, connect, history } from 'umi';
import { SettingOutlined } from '@ant-design/icons';
import { Result, Button, Modal, Menu, Layout } from 'antd';
import Authorized from '@/utils/Authorized';
// import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
// import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import GlobalFooter from '@/components/GlobalFooter';

const { Header, Footer, Content } = Layout;
const { SubMenu } = Menu;

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};
/**
 * use Authorized check all menu item
 */

// const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
//   menuList.map((item) => {
//     const localItem = {
//       ...item,
//       children: item.children ? menuDataRender(item.children) : undefined,
//     };
//     return Authorized.check(item.authority, localItem, null) as MenuDataItem;
//   });

const electron = window.require('electron');
const { remote } = electron;
const { app } = remote;
const browserWindow = remote.getCurrentWindow();

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    // dispatch,
    children,
    // settings,
    location = {
      pathname: '/',
    },
  } = props;

  const menuDataRef = useRef<MenuDataItem[]>([]);
  const [windowStatus, setWindowStatus] = useState('normal');

  useEffect(() => {
    window.addEventListener('resize', () => {
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
  // get children authority
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  // const { formatMessage } = useIntl();

  const handleClick = (e: any) => {
    console.log(e, 'menu click');
  };

  return (
    <Layout className={styles.mainLayout}>
      <Header>
        <span className={styles.logo}>过程监控 ESP-iMonitorAssay</span>
        <div className={styles.icons}>
          <i
            className={styles.home}
            onClick={() => {
              history.push('/');
            }}
          />
          <i className={styles.minimize} onClick={() => browserWindow.minimize()} />
          {windowStatus === 'normal' && (
            <i className={styles.maximize} onClick={() => browserWindow.maximize()} />
          )}
          {windowStatus === 'maxi' && (
            <i className={styles.restore} onClick={() => browserWindow.unmaximize()} />
          )}
          <i
            className={styles.close}
            onClick={() => {
              Modal.confirm({
                title: '提醒',
                content: '是否确认关闭应用？',
                okButtonProps: { danger: true },
                onOk: app.exit,
              });
            }}
          />
        </div>
      </Header>
      <Menu onClick={handleClick} selectedKeys={[]} mode="horizontal">
        <SubMenu key="file" icon={<SettingOutlined />} title="文件">
          <Menu.Item key="fav">我的收藏</Menu.Item>
        </SubMenu>
        <SubMenu key="anysis" icon={<SettingOutlined />} title="分析">
          <Menu.Item key="hmi">画面</Menu.Item>
          <Menu.Item key="list">列表分析</Menu.Item>
          <Menu.Item key="trend">趋势分析</Menu.Item>
          <Menu.Item key="fitting">拟合分析</Menu.Item>
          <Menu.Item key="intuitive">直观分析</Menu.Item>
          <Menu.Item key="monitor">监视分析</Menu.Item>
          <Menu.Item key="indicators">指标分析</Menu.Item>
          <Menu.Item key="shift">班组分析</Menu.Item>
        </SubMenu>
        <SubMenu key="set" icon={<SettingOutlined />} title="配置">
          <Menu.Item key="hmi">画面管理</Menu.Item>
          <Menu.Item key="report">报表</Menu.Item>
          <Menu.Item key="line">折线图</Menu.Item>
          <Menu.Item key="scatter">散点图</Menu.Item>
          <Menu.Item key="histogram">柱状图</Menu.Item>
          <Menu.Item key="radar">雷达图</Menu.Item>
          <Menu.Item key="theme">主题</Menu.Item>
        </SubMenu>
        <SubMenu key="tool" icon={<SettingOutlined />} title="工具">
          <Menu.Item key="synchronous">同步</Menu.Item>
          <Menu.Item key="upload">上传</Menu.Item>
          <Menu.Item key="backup">备份</Menu.Item>
          <Menu.Item key="conversion">转换工具</Menu.Item>
          <Menu.Item key="check">清点工具</Menu.Item>
        </SubMenu>
        <SubMenu key="help" icon={<SettingOutlined />} title="帮助">
          <Menu.Item key="manual">使用手册</Menu.Item>
          <Menu.Item key="about">关于软件</Menu.Item>
        </SubMenu>
      </Menu>
      <Content>
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </Content>
      <Footer>
        <GlobalFooter />
      </Footer>
    </Layout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
