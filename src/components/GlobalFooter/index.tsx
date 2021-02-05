/* eslint-disable no-console */
import { useNetworkStatus } from '@/utils/customerHooks';
import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { FormattedMessage, setLocale } from 'umi';
import React from 'react';
import { electron } from '@/utils/electron';

/** 窗体通用底部 */
const GlobalFooter = () => {
  const isOnline = useNetworkStatus();
  /** 告诉Electron 国际化变化了 */
  const setAppLocale = (locale: string) => {
    if (electron) console.log(electron.ipcRenderer.sendSync('set-locale', locale));
  };
  /** 菜单项点击事件 */
  const handleSelectLang = (e: any) => {
    setLocale(e.key);
    setAppLocale(e.key);
  };

  const menu = (
    <Menu onClick={handleSelectLang} defaultSelectedKeys={['zh']}>
      <Menu.Item key="zh-CN">简体中文 - Chinese</Menu.Item>
      <Menu.Item key="en-US">英语 - English </Menu.Item>
    </Menu>
  );
  return (
    <>
      <span>
        <FormattedMessage id="app.lineMode" />
        {isOnline ? <FormattedMessage id="app.online" /> : <FormattedMessage id="app.offline" />}
      </span>
      <span>Copyright © 2021 ESP-iMonitorAssay by Supcon</span>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <GlobalOutlined />
        </a>
      </Dropdown>
    </>
  );
};

export default GlobalFooter;
