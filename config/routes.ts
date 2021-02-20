export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/index',
              },
              {
                path: '/index',
                name: 'welcome',
                icon: 'smile',
                component: './Index',
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './TableList',
              },
              {
                path: '/set',
                name: 'set',
                icon: 'smile',
                routes: [
                  {
                    path: '/set/theme',
                    name: 'theme',
                    icon: 'smile',
                    component: './Set/Theme',
                  },
                  {
                    component: './404',
                  },
                ],
              },
              {
                path: '/tool',
                name: 'tool',
                icon: 'smile',
                routes: [
                  {
                    path: '/tool/synchronous',
                    name: 'synchronous',
                    icon: 'smile',
                    component: './Tool',
                  },
                  {
                    component: './404',
                  },
                ],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
