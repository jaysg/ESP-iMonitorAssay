import type { MenuDataItem } from '@ant-design/pro-layout';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps } from 'umi';
import { useIntl, connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import { Layout } from 'antd';
import styles from './UserLayout.less';
import GlobalFooter from '@/components/GlobalFooter';
import GlobalAppHeader from '@/components/GlobalAppHeader';
import { useEffect } from 'react';
import fAPIs from '@/utils/fs';

const { Header, Footer, Content } = Layout;

export type UserLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
} & Partial<ConnectProps>;

const UserLayout: React.FC<UserLayoutProps> = (props) => {
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

  useEffect(() => {
    fAPIs.genTestFile();
  }, []);

  // const [loginBgPath, setLoginBgPath] = useState<string>();
  // useEffect(() => {
  //   if (loginBgPath) {
  //     const dom: any = document.getElementById('loginLayout');
  //     if (dom) {
  //       // dom.style.background = new URL(loginBgPath)
  //     }
  //   } else {
  //     fAPIs.chkConfigFile().then((configObj: any) => {
  //       if (configObj && configObj.loginBgPath) {
  //         const tempPath = configObj.loginBgPath;
  //         setLoginBgPath(`${tempPath}`);
  //       }
  //     });
  //   }
  // }, [loginBgPath]);
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Layout
        id="loginLayout"
        className={styles.loginLayout}
        // style={{ background: loginBgPath ? `url(${new URL(loginBgPath).href})` : `url(${defaultLoginBg})` }}
      >
        <Header>
          <GlobalAppHeader type="login" />
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
