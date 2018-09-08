import React, { PureComponent } from 'react'
import { Tree, Dropdown, Input, Icon, Popover, Checkbox, message } from 'antd'
import { Link } from 'dva/router'
import Item from 'antd/lib/list/Item';
import $ from 'jquery'
import styles from './index.less'

const TreeNode = Tree.TreeNode
const Search = Input.Search



class ListTree extends PureComponent {
  static defaultProps = {
    width : '200px',
    defaultWord: '请选择卡口！',
    className: {},
    treeData: {},
    isReset: false,
  }

  state = {
    content: [],
    treeTitle: [],
    checkedNodes: [],
    selectNodes: [],
    checkList: {},
    searchKey: '',
  }

  componentWillMount(){
    const { treeData } = this.props
    this.initCheckList(treeData);
  }

  componentDidMount() {
    const { treeData } = this.props
    const node = this.showTree(treeData, false,false)
    this.setState({
      content: node,
    })
    
  }
  componentWillReceiveProps(nextProps){
    //console.log(nextProps.treeData,1);
    const { treeData } = nextProps
    if(nextProps.isReset){
      this.reset()
    }
    this.initCheckList(treeData)
  }

  render() {
    const { className, width, defaultWord } = this.props
    const { content, checkedNodes, selectNodes } = this.state
    const baseContent = (
      <div style={{ height: 200, width: 345 }}>
        <div style={{ height: 30}}>
          <div className={styles.search_div}>
            <Search
              id="search"
              placeholder="请输入关键字"
              size="small"
              style={{ width: 200 }}
              // value={searchKey}
              suffix={<Icon id="searchEmpty" style={{display:'none'}} type="close-circle-o" className={styles.seach_icon} onClick={this.emitEmpty} />}
              onChange={this.onChangeSearchKey}
              // ref={node => this.userNameInput = node}
              enterButton
              onSearch={value => this.doSearch(value)}
            />
          </div>
          <div className={styles.btn_div} onClick={this.reset}>
            <Icon type="reload" style={{marginRight: 5, fontSize: '15px'}} />
            <span>重置</span>
          </div>
        </div>
        <div>{content}</div>
      </div>)
    let dow = (<div style={{marginLeft:10, color:'rgb(191, 191, 191)', height:30, lineHeight:'30px'}}> {defaultWord} </div>)
    let checkName = ''
    if(checkedNodes.length > 0){
      checkedNodes.map((item,i) =>{
        if(i===checkedNodes.length-1){
          checkName += item.name 
        }else{
          checkName += `${item.name },`
        }
      })
      dow = checkedNodes.map(item => (
        <div className={styles.result_item}>
          {item.name}
          <Icon type="close-circle-o" onClick={()=>this.deleteIcon(item,item.data)} style={{ color: 'rgb(197, 193, 193)', fontSize: 10, position: 'relative', top: '-5px'}} />
        </div>
      ))
    }
    this.props.getCheckName(checkName)
    this.props.getSelectNone(selectNodes)
    // if (this.props.reset === 'reset') {
    //   this.reset()
    // }
    // this.props.onreset = this.reset()
    return (
      <div className={styles.main_div} style={{ width: `${width}` }}>
        <div className={styles.result_div}>
          {dow}
        </div>
        <Popover content={baseContent} trigger="click" placement="bottomRight">
          <Icon className={styles.select_icon} type="down" onClick={this.initOpen} />
        </Popover>
      </div>
    );
  }

  doSearch = (value) =>{
    const { treeData } = this.props
    if(treeData.children!==null){
      let node = {id:treeData.id,name:treeData.name,children:treeData.children }
      let datas = this.getSearch(treeData,treeData.name,[node],[],value)
      const nodes = this.showSeachResult(datas)
      this.setState({
        content:nodes,
      })
    }
  }

  getSearch = (datas,name,node,result,key) =>{
    let names = name
    let results = result
    datas.children.map(item=>{
      names = `${name } > ${ item.name}`
      if(item.name.indexOf(key)!==-1){
        results.push({text:names, nodes:node, data: datas})
      }else if(item.children!==null){
          const nodes = node.slice()
          nodes.push({id:item.id,name:item.name,children:item.children })
          this.getSearch(item,names,nodes,results,key)
      }     
    })   
    return results
  }

  showSeachResult = (datas) => {
    return (
      <div className={styles.content_div} style={{height:170}}>
        { 
          datas.map(item =>(
            <div className={styles.search_result_div}>
              <Icon type="link" style={{marginRight: 5,color:'#2080da'}}  />
              <span style={{cursor:'pointer'}} onClick={()=>this.onResultClick(item)}>{item.text}</span>
            </div>
          ))
        }
      </div>
    )
  }

  onResultClick = (item) =>{
    new Promise((resolve,reject)=>{
      this.setState({
        treeTitle: item.nodes,
      })
      resolve()
    }).then(r=>{
      const node = this.showTree(item.data,false,true)
      this.setState({
        content: node,
      })
    })
  }

  showTree = (datas, isReset,isCheck) => {  
    return (
      <div>
        <div className={styles.title_div}>{ this.showTreeName(datas,isReset,isCheck)}</div>
        <div className={styles.content_div}>{ this.showTreeNodes(datas)}</div>
      </div>
    )
  }

  showMessage = () =>{
    message.info("开发中，本期暂不提供该功能")
  }

  initOpen = () => {
    const { treeData } = this.props
    this.setState({
      treeTitle: [{id:treeData.id,name:treeData.name,children:treeData.children }],
    })
    const node = this.showTree(treeData,true,false)
    $('#search').val('')
    $('#searchEmpty').hide()
    this.setState({
      content: node,
    })
  }

  reset = (noCheck) => {
    const { treeData } = this.props
    if (noCheck !== 1){
      this.initCheckList(treeData)
    }
    this.setState({
      treeTitle: [{id:treeData.id,name:treeData.name,children:treeData.children }],
      checkedNodes: [],
      selectNodes: [],
    })
    
    const node = this.showTree(treeData,true,false)
    this.setState({
      content: node,
    })
    $('#search').val('')
    $('#searchEmpty').hide()
  }

  showTreeName = (datas,isReset,isCheck) => {
    // this.setState(({treeTitle}) => ({
    //   treeTitle: [...treeTitle, title]
    // }))
    const name = []
    let treeTitle =this.state.treeTitle
    if(isReset){
      treeTitle = []
    }
    if(!isCheck){
      treeTitle.push({id:datas.id,name:datas.name,children:datas.children })
    }
    if(treeTitle.length>0){
      treeTitle.map((item, i) =>{
        if( i===treeTitle.length-1){
          name.push(<span>{item.name}</span>)
        }else{
          name.push(<span onClick={() =>this.onTitleClick(i,item)}>{item.name}<span style={{padding:5}}>></span></span>)
        }
      })
    }    
    return name;
  }

  showTreeNodes = (datas) =>{
    const nodes = datas.children
    const listNode = []
    const isLast = false
    if(nodes != null && nodes.length > 0){

      nodes.map(item => {
        if(item.children ===null || item.length <= 0){
          listNode.push(
            <div style={{margin: 5}}>
              <Checkbox id={item.id} checked={this.state.checkList[item.id] ? this.state.checkList[item.id].checked : false} onChange={(e) => this.onCheckChange(e,item,datas)} />
              <span>{item.name}</span>
            </div>
          )
          
        }else{
          listNode.push(
            <div style={{margin: 5}}>
              <Checkbox id={item.id} checked={this.state.checkList[item.id] ? this.state.checkList[item.id].checked : false} onChange={(e) => this.onCheckChange(e,item,datas)} />
              <input type="button" onDoubleClick={()=>this.onNodeClick(item)} value={item.name} className={styles.btn_input} />
              <Icon type="right" />
            </div>
          )
        }
      })
   
    }
    return listNode
  }

  onNodeClick = (item) =>{
    let node = (
      <div />
    )

    if(item.children.length > 0){
      node = this.showTree(item,false,false)
      // treeContent = this.showContent(node)
    }
    this.setState({
      content: node,
    })
  }

  onTitleClick = (i, nodes) =>{
    let treeContent = (
      <div />
    )
    const title = this.state.treeTitle
    title.splice(i,title.length-i)

    const node = this.showTree(nodes,false,false)
    // treeContent = this.showContent(node)
    this.setState({
      content: node,
    })
  }

  getNode = (name, datas) => {
    let data = []
    if(datas != null && datas.length>0){
      for(let i=0;i<datas.length;i++){
        if(name === datas[i].name){
          data = datas[i].children
          return data
        }else if(datas[i].children !==null){
            this.getNode(name,datas[i].children)
          }
      }
    }
    return data
  }

  addNode = (data) =>{
    const selectNodes = this.state.selectNodes
    data.children.map(item =>{
      if(item.children === null){
        selectNodes.push({vmspid:item.pId, vmspname:data.name, vmsdeviceid: item.id, vmsdevicename: item.name})
      }else{
        this.addNode(item)
      }
    })
    return selectNodes
  }

  deleteNode = (datas) =>{
    const selectNodes = this.state.selectNodes
    datas.map(data=>{
      if(data.children===null){
        selectNodes.map((item,i) =>{
          if(item.vmsdeviceid===data.id){
            selectNodes.splice(i,1)            
          }
        })
      }else{
        this.deleteNode(data.children)
      }
    })
  }

  findCheckNode = datas =>{
    const checkedNodes = this.state.checkedNodes
    datas.map(data=>{
      checkedNodes.map((item,i) =>{
        if(item.id===data.id){
          checkedNodes.splice(i,1)

          // this.setState(({ checkedNodes }) => {
          //   const newNodes = checkedNodes.slice()
          //   return {
          //     checkedNodes: newNodes,
          //   }
          // })
        }
      })
      if(data.children!==null){
        this.findCheckNode(data.children)
      }
    })
  }

 
  onCheckChange = (e,item,datas) =>{ 
    const checkItem = { id: item.id, name: item.name, children: item.children,data:datas}
    const checkNodes = this.state.checkedNodes
    let nodes = this.state.selectNodes
    if(e.target.checked){
      if(item.children !== null){
        this.findCheckNode(item.children)
        nodes = this.addNode(item)
      }else{
        nodes.push({vmspid:item.pId, vmspname:datas.name, vmsdeviceid: item.id, vmsdevicename: item.name})
      }
      checkNodes.push(checkItem)
      // this.setState(({ checkedNodes }) => ({
      //   checkedNodes: [...checkedNodes, checkItem],
      // }))
      // this.props.getSelectNone(nodes)
      this.setState({
        selectNodes: nodes,
      }) 
      this.checkItemFn(item,datas)
    }else{
      this.deleteIcon(checkItem,datas)
      // this.unCheckItemFn(item,datas)
    }

  }

  deleteIcon = (item,datas) => {
    this.unCheckItemFn(item,datas)
    this.setState(({ checkedNodes }) => {
      const newList = checkedNodes.slice();
      newList.map((node,i)=>{
        if(node.id===item.id ){
          newList.splice(i, 1)
        }
      })
      return {
        checkedNodes: newList,
      };
    })
    if(item.children!==null){
      this.deleteNode(item.children)
      this.findCheckNode(item.children)
    }else{
      this.setState(({ selectNodes }) => {
        const newNodes = selectNodes.slice()
        newNodes.map((node,i)=>{
          if(node.vmsdeviceid===item.id){
            newNodes.splice(i, 1)
          }
        })
        return {
          selectNodes: newNodes,
        }
      })
    }
    if(this.state.selectNodes === 0){
      this.setState({
       checkedNodes:[],
     })
    }
  }

  initCheckList = (data) => {
    const tree = {}
    this.initCheckNode(data, tree)
    //console.log(tree,2);
    this.setState({
      checkList: tree,
    }, ()=> {
      //console.log(this.state.checkList);
        this.reset(1)
      })
  }

  initCheckNode = (data, tree) => {
    tree[data.id] = {pId: data.pId, checked: data.checked}
    const children = data.children
    const length = children ? children.length:0
    const childrenIds = []
    for(let i = 0; i< length; i++){
      childrenIds.push(children[i].id)
      if(i == (length-1)){
        tree[data.id].childrenIds = childrenIds
      }
    }
    for (const num in data.children){
      this.initCheckNode(children[num], tree)
    }
  }

  checkItemFn = (item,datas) =>{
    const id = item.id
    const ids = []
    const checkList = this.state.checkList
    ids.push(id)

    this.addParentIds(ids, id, checkList)
    this.addChildrenIds(ids, id, item, checkList)  

    ids.forEach((id) =>{
          checkList[id].checked = true
        })
    const node = this.showTree(datas, false,true)
    // const treeContent = this.showContent(node)
    this.setState({
      checkList,
      content: node,
      })
  }

  unCheckItemFn = (item,datas) =>{
    const id = item.id
    const ids = []
    const checkList = this.state.checkList
    let ischangeP = true
    datas.children.map(data =>{
      if(id != data.id){
        if(checkList[data.id].checked === true){
          return ischangeP = false
        }
      }
    })
    ids.push(id)

    if(ischangeP){
      this.addParentIds(ids, id, checkList, true)
    }

    this.addChildrenIds(ids, id, item, checkList)  
    
    ids.forEach((id) =>{
          checkList[id].checked = false
        })
    let node = this.state.content
    if(datas!==null && datas!=undefined){
      node = this.showTree(datas, false,true)
      // treeContent = this.showContent(node)
    }
    this.setState({
      checkList,
      content: node,
      })
  }

  addParentIds = (ids, id, checkList, isUncheck, notFirst) => {
    const pId = checkList[id].pId
    const childrenIds = checkList[id].childrenIds
    if(isUncheck&&!notFirst){
      checkList[id].checked = false
    }
    let checnkNum = 0
    if(notFirst){
      for(const child in childrenIds){
        if(checkList[childrenIds[child]].checked){
          checnkNum++
        } 
      }
    }
    if(checnkNum >1){
      ids.splice(ids.indexOf(id), 1)
    }else if (pId) {
      if(isUncheck){
        const chechNodes = this.state.checkedNodes
        chechNodes.map((item,i)=>{
          if(pId===item.id){
            chechNodes.splice(i,1)
          }
        })
      }
      ids.push(pId)
      this.addParentIds(ids, pId, checkList, isUncheck, true)
    }
  }

  addChildrenIds = (ids, id, item, checkList) => {
    const children = item.children
    if (children) {
      for(const num in children){
        const id = children[num].id
        ids.push(id)
        this.addChildrenIds(ids, id, children[num], checkList)
      }
    }
  }

  emitEmpty = () => {
    // this.userNameInput.focus();
    $('#search').val('')
    this.reset()
  }

  onChangeSearchKey= (e) => {
    let key = e.target.value 
    // this.setState({ searchKey: key });
    if(key===''){
      this.reset()
    }else{
      $('#searchEmpty').show()
      // this.doSearch(e.target.value)

    }
  }

}

export default ListTree
