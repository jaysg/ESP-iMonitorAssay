/* eslint-disable no-console */
import type {
  MenuDataItem,
  Settings,
  BasicLayoutProps as ProLayoutProps,
} from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import type { Dispatch } from 'umi';
import { Link, connect } from 'umi';
import { Result, Button, Layout } from 'antd';
import Authorized from '@/utils/Authorized';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import styles from './UserLayout.less';
import GlobalFooter from '@/components/GlobalFooter';
import MenuContent from '@/components/MenuContent';
import GlobalAppHeader from '@/components/GlobalAppHeader';
import { electron } from '@/utils/electron';

const { Header, Footer, Content } = Layout;

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
  useEffect(() => {
    window.addEventListener('resize', () => {
      console.log(window.document.body.clientHeight);
    });
    return () => {
      window.removeEventListener('resize', () => {});
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

  return (
    <Layout className={styles.mainLayout}>
      <Header style={{ display: electron ? 'flex' : 'none' }}>
        <GlobalAppHeader />
      </Header>
      <MenuContent />
      <Content
        style={{
          height: window.document.body.clientHeight - 60 - 48 - 48, // 文档高度减去header menu footer的高度
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </Content>
      <Footer style={{ display: electron ? 'flex' : 'none' }}>
        <GlobalFooter />
      </Footer>
    </Layout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
