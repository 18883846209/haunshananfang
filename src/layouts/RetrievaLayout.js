// 以脸搜脸 layout
import React from 'react';
import SidebarLayout from './SidebarLayout'

class ExecuteLayout extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const btnList = [
      { icon: 'usergroup-add', name: '以脸搜脸', route: '/retrieva/personnelRetrieva' },
      { icon: 'eye-o', name: '搜脸配置', route: '/retrieva/retrievaSetting'  },
    ]

    return (
      <SidebarLayout {...this.props} title='以脸搜脸' btnList={btnList} />
    );
  }
}

export default ExecuteLayout;
