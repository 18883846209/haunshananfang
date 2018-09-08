// 图上监控 layout
import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import SidebarLayout from './SidebarLayout'

class MapLayout extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const btnList = [
      { icon: 'video-camera', name: '图上监控', route: '/map/monitor' },
      { icon: 'dot-chart', name: '轨迹目标', route: '/map/trajectory'  },
      { icon: 'setting', name: '图层配置', route: '/map/layer'  },
    ]

    return (
      
      <SidebarLayout {...this.props} title='图上监控' btnList={btnList} />
    );
  }
}

export default MapLayout;
