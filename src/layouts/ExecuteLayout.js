// 人员布控 layout
import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import SidebarLayout from './SidebarLayout'

class ExecuteLayout extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const btnList = [
      { icon: 'usergroup-add', name: '人员布控', route: '/execute/personnelControl' },
      { icon: 'eye-o', name: '布控告警', route: '/execute/personnelControlShow'  },
    ]

    return (
      <SidebarLayout {...this.props} title='人员布控' btnList={btnList} />
    );
  }
}

export default ExecuteLayout;
