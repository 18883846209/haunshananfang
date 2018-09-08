// 两列布局layout
import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import { getRoutes } from 'utils/utils';
import Header from 'components/Head';
import LeftList from 'components/LeftList'

const { Content } = Layout;

class SidebarLayout extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { routerData, match, location, btnList, listType } = this.props;
    let selectId = 'usergroup-add'
    
    if(location.pathname === "/execute/personnelControl"||location.pathname ==='/retrieva/personnelRetrieva'){
      selectId = 'usergroup-add'
    }else if(location.pathname === "/execute/personnelControlShow"||location.pathname ==='/retrieva/retrievaSetting'||location.pathname === "/execute/personnelMap"){
      selectId = 'eye-o'
    }else if(location.pathname === '/map/layer'){
      selectId = 'setting'
    }else if(location.pathname ==='/map/monitor'){
      selectId = 'video-camera'
    }
    const layout = (
      <div style={{ background:'#f0f2f5',height:'100%',width:'100%'}}>
        <Header location={location} />
        <Layout style={{height:'90%',width:'100%'}}>
          <LeftList listType={listType} btnList={btnList} selectId={selectId} style={{display:'inline-block',height:'100%'}} />
          <Content style={{width:'87%',float:'left',height:'100%'}}>
            <Switch>
              {getRoutes(match.path, routerData).map((item,index) =>{ 
                  return(<Route path={item.path} component={item.component} key={item.key} />
                )})}
              <Redirect exact from="/retrieva" to="/retrieva/personnelRetrieva" />
              <Redirect exact from="/map" to="/map/monitor" />
              <Redirect exact from="/execute" to="/execute/personnelControl" />
            </Switch>
          </Content>
        </Layout>
      </div>
    );

    return (
      <DocumentTitle title={this.props.title}>
        {layout}
      </DocumentTitle>
    );
  }
}

export default SidebarLayout;
