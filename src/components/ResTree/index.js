/*
 * @Author: quezhongyou 
 * @Date: 2018-08-08 17:10:50 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-09-03 18:03:37
 */
import {  Input  } from 'antd';
import React , {Component} from 'react';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';
import styles from './index.less';
import  'rc-tree/assets/index.css';

const Search = Input.Search;

/**
 * 
 * @param {*} data            数据
 * @param {*} searchVal       输入值
 * @param {*} expandedKeys    展开节点数组
 * @description               获取展开节点
 */
const getexpandedKeys = (data,searchVal,expandedKeys = [])=>{
  if(searchVal.length == 0 || !data) return false;
  const flag = data.children.some(item=>{
    let flag = item.name.indexOf(searchVal) >= 0;
    if(item.children){
      flag = getexpandedKeys(item,searchVal,expandedKeys) || flag;
    }
    return flag;
  });
  if(flag){
    expandedKeys.push(data.id);
  }
  return flag;
}


class ResTree extends Component {
  static propTypes = {
      expandedKeys: PropTypes.array,
      treerelative:PropTypes.object,
      autoExpandParent: PropTypes.bool,
      checkedKeys: PropTypes.array,
      selectedKeys: PropTypes.array,
      treeData: PropTypes.array,
      onExpand:PropTypes.func,
      onCheck:PropTypes.func,
      onSelect:PropTypes.func,
      onDoubleClick:PropTypes.func,
    };
    
  static defaultProps = {
      treerelative:{},
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData:[],
      onExpand: () => {},
      onCheck: () => {},
      onSelect: () => {},
      onDoubleClick:()=>{},
    }

  state = { searchVal:''}


  shouldComponentUpdate(nextProps ,nextState){
    let render = false;
    for(const key in this.props){
        if(nextProps[key] != this.props[key]){
          render = true;
         }
    }
    for(const key in this.state){
      if(nextState[key] != this.state[key]){
        render = true;
       }
    }
    return render;
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dcheckedid && nextProps.dcheckedid !=this.props.dcheckedid){
        let checkedKeys = nextProps.checkedKeys.filter(item=>item != nextProps.dcheckedid);
        this.onCheck(checkedKeys);
    }
  }

  onExpand = (expandedKeys) => {
    this.props.onExpand({expandedKeys,autoExpandParent:false})
  }


  onCheck = (newcheckedKeys) => {
    const { checkedKeys,expandedKeys} = this.props;
    const len = checkedKeys.length; const newLen = newcheckedKeys.length ;
    const newState = {checkedKeys:newcheckedKeys};
    if(newLen>len){
        newState.expandedKeys = [...new Set([...expandedKeys,newcheckedKeys[len]])];
    }
    this.props.onCheck(newState);
  }

  onSelect = (selectedKeys, info) => {
    const { checkedKeys ,expandedKeys} = this.props;
      const selectAllkey = [];
      if(info.selectedNodes){
        (function getkey(data){
         if(Object.prototype.toString.apply(data) =='[object Array]'){
          data.forEach(item => {
            selectAllkey.push(item.key);
            if(item.props && item.props.children){
              getkey(item.props.children);
            }
          });
         }
        })(info.selectedNodes)
      }
      this.props.onCheck({ 
        checkedKeys:[...checkedKeys,...selectAllkey],
        selectedKeys,
        expandedKeys: [...new Set([...expandedKeys,...selectAllkey])],
      })
    //  this.props.onSelect({selectedKeys});
  }

  onSearch =(value)=>{
    const { treeData } = this.props;
    const expandedKeys = [];
    getexpandedKeys(treeData[0],value,expandedKeys);
    this.setState({searchVal:value});
    this.props.onExpand({ expandedKeys , autoExpandParent:false });
  }
  
   onChange =(e)=>{
    const value = e.target.value;
    const { treeData } = this.props;
    const expandedKeys = [];
    getexpandedKeys(treeData[0],value,expandedKeys);
    this.setState({searchVal:value});
    this.props.onExpand({ expandedKeys , autoExpandParent:false });
  }


  onDoubleClick = (data)=>(e)=>{
    if(data.children) return ;
      const { checkedKeys , onCheck }  = this.props;
      const newcheckedKeys  = [...new Set([...checkedKeys,data.id])];
      onCheck({checkedKeys:newcheckedKeys});
  };


  onRightClick = (data) =>(event)=>{
    // 右键默认事件
    document.oncontextmenu = function(ev){ return false }
    setTimeout(()=>{ 
      document.oncontextmenu = null;
    },2000)
    event.nativeEvent.preventDefault();
    if(data.children) return ;
    if(event.nativeEvent.button == 2){
      const { checkedKeys , onCheck}  = this.props;
      const newcheckedKeys  = [...checkedKeys,data.id];
      onCheck({checkedKeys:newcheckedKeys});
    }
  }

  onDragStart = (event)=>{
    const {onCheck ,checkedKeys} = this.props;
    const selectAllkey = [];
    (function getkey(data){
      if(Object.prototype.toString.apply(data) =='[object Array]'){
       data.forEach(item => {
         selectAllkey.push(item.id);
         if(item.children){
           getkey(item.children);
         }
       });
      }
     })([event.node.props.dataRef])
     window.handleDrag = function(){
        onCheck({checkedKeys:[...checkedKeys,...selectAllkey]});
        window.handleDrag = null;
     }
  }
  
  onDragEnd =()=>{
    setTimeout(()=>{window.handleDrag = null},0);
  }

  renderTreeNodes = (data) => {
    const { searchVal } = this.state;
    const {treerelative} =this.props;
    return data.map((item) => {
      if(!item)return '';
      const index = item.name.indexOf(searchVal);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchVal.length);
      
      const name = (index > -1 && searchVal) ? (
        <span onDoubleClick={this.onDoubleClick(item)} onMouseDown={this.onRightClick(item)}>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchVal}</span>
          {afterStr}
        </span>
      ) : <span onDoubleClick={this.onDoubleClick(item)} onMouseDown={this.onRightClick(item)}>{item.name}</span>;

      if (item.children) {
        return (
          <TreeNode title={name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if(treerelative[item.id]){
        return <TreeNode title={name} key={item.id} dataRef={item} />;
      }else{
        return (
          <TreeNode title={name} key={item.id} dataRef={item}>
            <TreeNode title='' style={{display:'none'}} />
          </TreeNode>
)
      }
    });
  }

  render() {
        const heigth = window.innerHeight + (this.props.jheight || 0);
        const { treeData , expandedKeys , autoExpandParent , checkedKeys , selectedKeys } = this.props;
 
        return (
          <div className={this.props.className}>
            <div className={styles.search}>
              <Search placeholder="请输入关键词" onChange={this.onChange} size='small' />
            </div>
            <div className={styles.tree} style={{height:`${heigth}px`}}>
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={checkedKeys}
                //  onSelect={this.onSelect}
                selectedKeys={selectedKeys}
                draggable
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div>
          </div>
    );
  }
}

export default ResTree;

