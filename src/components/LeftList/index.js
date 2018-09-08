import React, { PureComponent } from 'react'
import { Layout, Tree, List, Input, Icon } from 'antd'
import { Link } from 'dva/router'
import styles from './index.less'

const TreeNode = Tree.TreeNode
const Search = Input.Search
const { Sider } = Layout;


class LeftList extends PureComponent {
  static defaultProps = {
    listType: '1',
    listData: [],
  }

  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }

  componentDidMount() {
    const e = document.getElementById(this.props.selectId)
    if (e != null) {
      e.className = styles.list_item_select
    }
  }


  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onChange = (e) => {
    const value = e.target.value;
    this.setState({
      searchValue: value,
      autoExpandParent: true,
    });
  }

  render() {
    const { btnList, listType, listData, selectId ,children } = this.props
  
    
    if(children){
      return ( 
        <Sider className={styles.main}>
          {children}
        </Sider>
)
    };

    let Dom = {}
    if (listType === '1') {
      Dom = this.showBtnList(btnList)
    } else if (listType === '2') {
      Dom = this.showDataList(listData)
    }
    for(let i=0;i<btnList.length;i++){
      const e = document.getElementById(btnList[i].icon)
      if (e != null) {
        if(selectId === btnList[i].icon){
          e.className =styles.list_item_select
        }else{
          e.className =styles.list_item
        }
      }
    }

    return (
      <Sider className={styles.main}>
        { Dom}
      </Sider>
    );
  }

  showBtnList = (list) => {
    console.log(list)
    if (list.length > 0) {
      return (
        list.map((item) => (
          <Link key={item.route} to={item.route}>
            <div id={item.icon} className={styles.list_item} onClick={this.onClick}>
              <Icon type={item.icon} style={{ fontSize: 18, marginRight: 15 }} />
              {item.name}
            </div>
          </Link>
        ))
      )
    }
    return <div />;
  }

  showDataList = (listData) => {
    if (listData.length > 0) {
      const { searchValue, expandedKeys, autoExpandParent } = this.state;
      const loop = data => data.map((item) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title = index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : <span>{item.title}</span>;
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
      return (
        <div style={{height:'100%'}}>
          <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
          <Tree
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
          >
            {loop(listData)}
          </Tree>
        </div>
      );
    }
    return <div />
  }
}

export default LeftList
