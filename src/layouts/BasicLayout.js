// 基本布局 header content
import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { getRoutes } from 'utils/utils';
import Header from 'components/Head';
import NotFound from '../routes/Exception/404';

const logoText = window.SSystem.logoText || '两江公安视综平台';

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentWillMount() {

  }

  render() {
    const { routerData, match, location } = this.props;

    const layout = (
      <div style={{ width: '100%', height: '100%' }}>
        <Header location={location} />
        <div style={{ width: '100%', height: '91%', backgroundColor: '#f0f2f5' }}>
          <div style={{ height: '100%' }}>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route path={item.path} component={item.component} key={item.key} />
              ))}
              <Redirect exact from="/" to='home' />
              <Route render={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    );

    return (
      <DocumentTitle title={logoText}>
        {layout}
      </DocumentTitle>
    );
  }
}

export default BasicLayout;
