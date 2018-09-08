import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      app.model(require(`../models/${model}`).default);
    }
  });

  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }

  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    },
    '/execute': {
      component: dynamicWrapper(app, [], () => import('../layouts/ExecuteLayout')),
    },
    '/execute/personnelControl': {
      component: dynamicWrapper(app, ['personnelControl'], () => import('../routes/Execute/PersonnelControl')),
    },
     '/execute/personnelControlShow': {
      component: dynamicWrapper(app, ['personnelControl'], () => import('../routes/Execute/PersonnelControlShow')),
    },
    '/execute/personnelMap': {
      component: dynamicWrapper(app, ['personnelControl'], () => import('../routes/Execute/PersonnelMap')),
    },
    '/retrieva': {
      component: dynamicWrapper(app, [], () => import('../layouts/RetrievaLayout')),
    },
    '/retrieva/retrievaSetting': {
      component: dynamicWrapper(app, ['personnelRetrievaIO'], () => import('../routes/Retrieva/RetrievaSetting')),
    },
    '/retrieva/personnelRetrieva': {
      component: dynamicWrapper(app, ['personnelRetrievaIO'], () => import('../routes/Retrieva/PersonnelRetrieva')),
    },
    '/carSearch': {
      component: dynamicWrapper(app, ['carSearch'], () => import('../routes/CarSearch/CarSearch')),
    },
    '/home': {
      component: dynamicWrapper(app, [], () => import('../routes/Home/Home')),
    },
    '/map': {
      component: dynamicWrapper(app, [], () => import('../layouts/MapLayout')),
    },
    '/map/monitor': {
      component: dynamicWrapper(app, ['mapMonitor'], () => import('../routes/Map/MapMonitor')),
    },
    '/map/layer': {
      component: dynamicWrapper(app, [], () => import('../routes/Map/addLayer')),
    },
    '/map/trajectory': {
      component: dynamicWrapper(app, [], () => import('../routes/Map/trajectory')),
    },
    '/videoSystem':{
      component: dynamicWrapper(app, ['videoSystem'], () => import('../routes/VideoSystem')),
    },
    '/listLibray': {
      component: dynamicWrapper(app, ['nameListLibrary'], () => import('../routes/ListLibrary/NameListLibrary')),
    },
  };

  const routerData = {};
  Object.keys(routerConfig).forEach(path => {
    let router = routerConfig[path];
    router = {
      ...router,
      name: router.name,
    };
    routerData[path] = router;
  });
  return routerData;
};
