import React, { PureComponent } from 'react';
import { Layout, Icon, Menu,Popover,Button, message } from 'antd';
import { Link } from 'dva/router';
import logo from 'assets/logo/logo.png';
import pathToRegexp from 'path-to-regexp';
import styles from './index.less'
import { getMenuData } from '../../common/menu';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const dev = window.SSystem.development ;
const logoText = window.SSystem.logoText || '两江公安视综平台';
const logoUrl = window.SSystem.logoUrl || logo;
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    return keys;
  }, []);

export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );
  
export default class VideoHeader extends PureComponent {
  constructor() {
    super();
    this.flatMenuKeys = getFlatMenuKeys(getMenuData());
  }

  urlToList = (url) => {
    const urllist = url.split('/').filter(i => i);
    return urllist.map((urlItem, index) => {
      return `/${urllist.slice(0, index + 1).join('/')}`;
    });
  }
  
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    return getMenuMatchKeys(this.flatMenuKeys, this.urlToList(pathname));
  }

  stopTo = (e) => {
    e.preventDefault();
    message.info("开发中，本期暂不提供该功能")
    return false
  }

  render() {
    const path = this.props.location.pathname ;
    const selectedKeys = this.getSelectedMenuKeys();
    const content = (
      <div style={{ height: '60px'}}>
        <p style={{ color: '#595959'}}><Icon type="setting" />设置</p>
        <p style={{ color: '#595959'}}><Icon type="poweroff" />退出</p>
      </div>
          );
    return (
      <div className={styles.headerWrap}>
        <div className={styles.logoWrap}>
          <img className={styles.logo} src={logoUrl} alt="logo" />
          <span>{logoText}</span>
        </div>
        <div className={styles.userInfoPanel}>
          <Popover placement="bottomLeft" arrowPointAtCenter content={content} trigger="click">
            <Icon type="user" /><span className={styles.userName}>用户名</span>
            <Icon type="down" />
          </Popover>
        </div>
        {path !=='/home'?
        (
          <Menu
            selectedKeys={selectedKeys}
            mode="horizontal"
          >
            {getMenuData().map(item => (
              <Menu.Item key={item.path}>
              {item.path =='/videoSystem'?<a href={(dev?'#':'')+item.path}><span>{ item.name }</span></a>:
                <Link to={item.path}>
                  <span>{ item.name }</span>
                </Link>
              }
              </Menu.Item>
            ))
          }
            <SubMenu title={<div><Icon type="plus-circle-o" style={{margin:10}} /></div>}>
              {/* <Menu.Item key="setting:1">
              <Link to="/listLibray">
                <span>名单库管理</span>
              </Link>
            </Menu.Item> */}
              <Menu.Item key="setting:1">
                <Link to="/" onClick={(e) => { this.stopTo(e) }}>
                  <span>行为布控</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="setting:2">
                <Link to="/" onClick={(e) => { this.stopTo(e) }}>
                  <span>车辆布控</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="setting:3">
                <Link to="/" onClick={(e) => { this.stopTo(e) }}>
                  <span>模糊搜索</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="setting:4">
                <Link to="/" onClick={(e) => { this.stopTo(e) }}>
                  <span>案件检索</span>
                </Link>
              </Menu.Item>
              {/* <Menu.Item key="setting:2">Option 2</Menu.Item> */}
            </SubMenu>
          </Menu>
):''}
      </div>
    );
  }
}
