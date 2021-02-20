import { electron } from '@/utils/electron';
/** 文件模块工具类 */
const fs = window.require('fs');
const path = require('path');
//  window.navigator.userAgent.indexOf('Electron') !== -1

/** 检查系统配置目录，不存在则创建 */
function chkConfigDir() {
  if (fs) {
    const destPath = path.join(electron.remote.app.getAppPath(), 'espima');
    // 路径校验
    if (!fs.existsSync(destPath)) {
      fs.mkdir(destPath, '0777', (err: any) => {
        if (err) throw err;
      });
    }
    return destPath;
  }
  return false;
}
/**
 * 生成配置文件
 * @param customerObject 自定义的配置对象
 */
function genConfigFile(opt: any = {}) {
  const destPath = chkConfigDir();
  const configObj = {
    ...opt,
  };
  Object.keys(configObj).forEach((key) => {
    configObj[key] = path.join(destPath, configObj[key]);
  });
  if (destPath) {
    fs.writeFile(
      path.join(destPath, 'config.json'),
      JSON.stringify(configObj),
      'utf8',
      (err: any) => {
        if (err) {
          console.log(err);
          return false;
        }
        console.log('配置文件写入成功');
        return true;
      },
    );
  }
}

/**
 * 生成配置文件 测试 放置项目根目录
 * @param customerObject 自定义的配置对象
 */
function genTestFile() {
  const destPath = chkConfigDir();
  // 根目录生成配置目录
  fs.mkdir(destPath, '0777', () => {});
  fs.writeFileSync(
    path.join(destPath, 'config.json'),
    JSON.stringify({
      a: 1,
      b: 2,
    }),
    'utf8',
    (err: any) => {
      if (err) {
        console.log(err);
        return false;
      }
      console.log('配置文件写入成功');
      return true;
    },
  );
}

/** 复制文件到项目根目录 */
function copyFileToDir(filePath: string, fileName: string) {
  const destPath = chkConfigDir();
  if (!destPath) return;
  fs.copyFile(filePath, path.join(destPath, fileName), (err: any) => {
    if (err) throw err;
  });
}

/** 检查配置文件 有则返回配置对象 Promise */
function chkConfigFile() {
  return new Promise((resolve, reject) => {
    const destPath = chkConfigDir();
    const rcPath = path.join(destPath, 'config.json');
    fs.stat(rcPath, (err: any, stats: { isFile: () => any }) => {
      if (err) {
        reject(err);
      } else if (stats.isFile()) {
        fs.readFile(rcPath, (errf: any, data: any) => {
          if (errf) reject(err);
          else {
            const configObj = JSON.parse(data.toString());
            resolve(configObj);
          }
        });
      } else {
        reject(err);
      }
    });
  });
}

const APIs = {
  genTestFile,
  copyFileToDir,
  chkConfigFile,
  genConfigFile,
};

export default APIs;
