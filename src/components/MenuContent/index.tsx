import { electron } from '@/utils/electron';
import { SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { history } from 'umi';

const { SubMenu } = Menu;
const MenuContent = () => {
  /** 窗体主菜单 点击事件 */
  const handleClick = (e: any) => {
    const keyPath = e.keyPath.reverse().join('-');
    console.log(keyPath);
    switch (keyPath) {
      case 'tool-synchronous':
        // 打开工具窗口 跳转到同步页面
        if (electron) console.log(electron.ipcRenderer.sendSync('open-tool', 'tool/synchronous'));
        break;
      case 'set-theme':
        // 打开工具窗口 跳转到同步页面
        history.push('/set/theme');
        break;

      default:
        break;
    }
  };
  return (
    <Menu
      style={{ display: electron ? 'block' : 'none' }}
      onClick={handleClick}
      selectedKeys={[]}
      mode="horizontal"
    >
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
  );
};
export default MenuContent;
