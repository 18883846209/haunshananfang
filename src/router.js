import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const ExecuteLayout = routerData['/execute'].component;// 人员布控
  const RetrievaLayout = routerData['/retrieva'].component;// 以脸搜脸
  const BasicLayout = routerData['/'].component;// 基础布局
  const MapLayout = routerData['/map'].component;// 图上监控
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route render={props => <ExecuteLayout {...props} />} path="/execute" />
          <Route render={props => <MapLayout {...props} />} path="/map" />
          <Route render={props => <RetrievaLayout {...props} />} path="/retrieva" /> 
          <Route render={props => <BasicLayout {...props} />} path="/" />
           
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
