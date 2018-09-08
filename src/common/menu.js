import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '首页',
    path: 'home',
  },
  {
    name: '视频巡逻',
    path: 'videoSystem',
  },
  {
    name: '以脸搜脸',
    path: 'retrieva',
  },
  {
    name: '图上监控',
    path: 'map',
  },
  {
    name: '人员布控',
    path: 'execute',
  },
  {
    name: '车辆检索',
    path: 'carSearch',
  },
  {
    name: '名单库管理',
    path: 'listLibray',
  },
];

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
