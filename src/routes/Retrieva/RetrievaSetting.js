
/**
 * @flow
 */
// import 'babel-polyfill';
import React from 'react';
// import DateInput from 'components/DateInput'
import { connect } from 'dva';
import ListTree from 'components/ListTree';
import jsonToExcel from '../../utils/jsonToExcel';
import { List, Icon, Popover, Button, Input, Select,Checkbox, Pagination, message } from 'antd';
import styles from './RetrievaSetting.less';
import ContentHeader from 'components/ContentHeader';
import DeleteTips from 'components/DeleteTips';
import Pagenation from 'components/Pagenation';

const { Search } = Input;
const { Option } = Select;

// var TableToExcel = require('table-to-excel');
// var tableToExcel=new TableToExcel();

@connect(({ personnelRetrievaIO, loading }) => ({
  personnelRetrievaIO,
  loading: loading.models.personnelRetrievaIO,
}))

export default class RetrievaSetting extends React.Component {
  constructor() {
    super();
    this.changeStatus = this.changeStatus.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.reset = this.reset.bind(this);
    this.taskTypeChange = this.taskTypeChange.bind(this);
    this.state = {
      treeData: {},
      hasDelMask: false,
      searchKey: '',
      tasktype: 'IPC',
      cardtype: '请选择卡口位置',
      // isConfirm: true,
      taskTypeNum: 0, // 新建任务 0: ipc 5: 抓拍机
      tollgatelist: [], // 新建任务时选择的卡口信息数组
      currentPage: 1, // 当前页数
      listCount: 8,
      checklist: {},
      allList: {},
      selectAll: false,
      isauthor_list_libdown: true,
      iscreated_time_list_libdown: true,
      isupdated_time_list_libdown: true,
      treeDow: (<Select placeholder="选择卡口类型" style={{ width: "62%" }} />),
      nameList: [
      //   { isopen: true, taskid: '201812879871201812879871', taskname: 'testtesttesttesttesttest', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称',  status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879872', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879873', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879874', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879876', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879877', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879878', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879879', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879880', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' },
      // { isopen: true, taskid: '201812879881', taskname: 'test', capturetype: 'ipc/抓拍机', vmsdivicename: '摄像头名称', vmspname: '卡口名称', status: '监控中', createdby: 'zhangjie', createdtime: '2018-08-12 09:20:56', updatetime: '2018-08-22 09:20:56' }
      ],
    }
  }

  changeStatus(e, status) { // 改变监控状态
    // console.log(e.target.getAttribute('data-value'))
    // let clickdata = e.target.getAttribute('data-value');
    // let { nameList } = this.state;
    // nameList.forEach((item) => {
    //   if (clickdata === item.taskid) {
    //     if (item.isopen) {
    //         item.status = '停止',
    //         item.isopen = false
    //     } else {
    //       item.status = '监控中';
    //       item.isopen = true;
    //     }
    //   }
    // })
    // this.setState({
    //   nameList
    // })
    // console.log(nameList[0].status, nameList[0].isopen)
  }

  delItem = () => { // 删除任务
    const clickdata = this.state.clickdata;
    this.props.dispatch({
      type: 'personnelRetrievaIO/deletetask',
      payload: {
        Vmsdeviceid: clickdata.split(',')[0],
        capturetype: clickdata.split(',')[1],
      },
    })
  }

  showDelMask = (p1, p2) => { // 显示删除弹窗
    let clickdata = p1 + ',' + p2;
    this.setState({
      hasDelMask: true,
      clickdata
    })
  }

  delKeyDown = (e) => {
    e.stopPropagation();
    // e.preventDefault();
    if (this.state.hasDelMask && e.key === 'Enter') {
      this.delConfirm();
    }
    this.setState({
      hasDelMask: false,
    })
  }

  delConfirm = () => {
    this.delItem();
    this.setState({
      hasDelMask: false,
    })
  }

  delCancel = () => {
    console.log(1)
    this.setState({
      hasDelMask: false,
    })
  }

  returnback = () => {
    message.info("开发中，本期暂不提供该功能");
    // var arr = [
    //   ['Name', 'Age', 'Sex', 'Country', 'pic'],
    //   ['ecofe', '18', 'male', 'china', 'http://img1.imgtn.bdimg.com/it/u=3044191397,2911599132&fm=27&gp=0.jpg'],
    //   ['alice', '3', 'female', 'china', 'http://img1.imgtn.bdimg.com/it/u=3044191397,2911599132&fm=27&gp=0.jpg']
    // ]
    // tableToExcel.render(arr);
    // let tHeader = [
    //   '鲜花',
    //   '颜色',
    //   '照片'
    // ]
    // let tbody = [
    //   {
    //     name: '玫瑰花',
    //     color: '红色',
    //     pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2801998497,4036145562&fm=27&gp=0.jpg'
    //   },
    //   {
    //     name: '菊花',
    //     color: '黄色',
    //     pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1506844670,1837003941&fm=200&gp=0.jpg'
    //   },
    //   {
    //     name: '牵牛花',
    //     color: '紫色',
    //     pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3056120770,1115785765&fm=27&gp=0.jpg'
    //   },
    //   {
    //     name: '梅花',
    //     color: '白色',
    //     pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2700343322,3431874915&fm=27&gp=0.jpg'
    //   },
    //   {
    //     name: '桃花花',
    //     color: '粉色',
    //     pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=602076004,4209938077&fm=27&gp=0.jpg'
    //   }
    // ]
    // jsonToExcel(tHeader, tbody, 'test')
  }

  showModal = () => { // 显示创建弹窗
    this.setState({
      taskTypeNum: 0,
      treeDow: (<ListTree width="62%" isReset={ true } defaultWord="请选择卡口位置" treeData={ this.state.treeData } getSelectNone={this.getSelectNone} getCheckName={this.getCheckName} />)
    })
    this.getCard(1)
    this.reset();
    this.refs.createmodel.style.display = 'block';
  }
  hideModal = () => {
    this.refs.createmodel.style.display = 'none';
  }

  taskTypeChange(value) { // 任务类型改变
    console.log(value)
    // debugger;
    if (value === 'ipc') {
      this.setState({
        taskTypeNum: 0,
        tasktype: value,
      })
      this.getCard(1)
    } else {
      this.setState({
        taskTypeNum: 5,
        tasktype: value,
      })
      this.getCard(5)
    }
  }

  // 重置
  reset = () => {
    const taskname = document.getElementById('taskName');
    taskname.value = '';
    this.setState({
      // tasktype: '选择任务类型',
      tasktype: 'IPC',
      cardtype: '请选择卡口位置',
      treeDow: (<ListTree width="62%" isReset={ true } defaultWord="请选择卡口位置" treeData={ this.state.treeData } getSelectNone={this.getSelectNone} getCheckName={this.getCheckName} />)
    })
  }
  doSort = (item, rule) => { // 排序
    const up = document.getElementById(`${item}up`);
    const down = document.getElementById(`${item}down`);
    if (rule === 'asc') {
      up.style.display = 'inline-block';
      down.style.display = 'none';
    } else {
      up.style.display = 'none';
      down.style.display = 'inline-block';
    }
    if (item === 'author_list_lib') {
      this.setState((state) => ({
        isauthor_list_libdown: !state.isauthor_list_libdown,
      }))
      this.getList({
        page: this.state.currentPage,
        sort: rule,
        order: 'createdby',
      })
    } else if (item === 'created_time_list_lib') {
      this.setState((state) => ({
        iscreated_time_list_libdown: !state.iscreated_time_list_libdown,
      }))
      this.getList({
        page: this.state.currentPage,
        sort: rule,
        order: 'createdtime',
      })
    } else if (item === 'updated_time_list_lib') {
      this.setState((state) => ({
        isupdated_time_list_libdown: !state.isupdated_time_list_libdown,
      }))
      this.getList({
        page: this.state.currentPage,
        sort: rule,
        order: 'updatetime',
      })
    }
  }

  changeCheck = (e, id) => {
    let { checklist, selectAll } = this.state;
    checklist[id] = e.target.checked;
    // let check = e.target.checked;
    if (!checklist[id]) {
      selectAll = false
    }
    this.setState({
      checklist,
      selectAll,
    })
  }

  selectAll = (e) => {
    let { selectAll, checklist } = this.state;
    selectAll = e.target.checked;
    if (selectAll) {
      for (const item in checklist) {
        checklist[item] = true;
      }
    } else {
      for (const item in checklist) {
        checklist[item] = false;
      }
    }
    this.setState({
      selectAll,
      allList: checklist,
    })
  }
  getList = (params) => {
    this.props.dispatch({
      type: 'personnelRetrievaIO/searchList',
      payload: {
        key: params && params.key || '',
        page: params && params.page || 1,
        size: 8,
        // order: 'createdby',
        order: params && params.order || 'updatetime',
        sort: params && params.sort || 'desc',
        datetime: (new Date().valueOf()),
      }
    })
  }

  search = (val) => {
    if (val === '' || val === undefined || val === null) {
      message.info('请输入关键字');
    } else {
      this.getList({
        key: val,
      })
    }
    // console.log(val)
  }

  onChangeSearchKey = (e) => {
    this.setState({ searchKey: e.target.value });
    // console.log(e)
    if (e.target.value==='') {
      this.getList()
    }
  }
  emitEmpty = () => { // 情况搜索框
    this.userNameInput.focus();
    this.setState({ searchKey: '' });
    this.getList()
  }

  listOnChange = (e) => { // 页码改变
    // console.log(e);
    this.setState({
      isauthor_list_libdown: true,
      iscreated_time_list_libdown: true,
      isupdated_time_list_libdown: true,
      currentPage: e,
    })
    this.getList({
      page: e,
    })
  }

  toFirst = () => {
    if (this.state.page !== 1) {
      this.setState({
        currentPage: 1,
      })
      this.listOnChange(1);
    }
  }

  toLast = () => {
    // console.log(this.state.listCount, 'listcount');
    const lastpagenum = Math.ceil(parseInt(this.state.listCount) / 8);
    if (this.state.page !== lastpagenum) {
      this.setState({
        currentPage: lastpagenum,
      })
      this.listOnChange(lastpagenum);
    }
  }

  componentWillReceiveProps (nextprops) { // 处理请求获取的数据
    let { checklist, selectAll } = this.state;
    const { personnelRetrievaIO } = this.props;
    // const { personnelRetrievaIO } = nextprops;
    if(personnelRetrievaIO.listInfo && personnelRetrievaIO.listInfo.data !== undefined) { // 处理任务列表数据
      const res = personnelRetrievaIO.listInfo.data;
      if (selectAll) {
        res.data.forEach(item => {
          checklist[item.viewid] = true;
        })
      }
      this.setState({
        nameList: res.data,
        listCount: res.totalCount,
        currentPage: res.currentPage,
        checklist,
      });
    }
    if(personnelRetrievaIO.succinfo !== undefined) { // 创建成功后
      const res = personnelRetrievaIO.succinfo;
      // debugger;
      if (parseInt(res.code) === 1) {
        message.info('创建成功')
        this.getList()
      } else if (parseInt(res.code) === 0) {
        message.info('创建失败');
      }
      personnelRetrievaIO.succinfo = {};
    }
    
    if (personnelRetrievaIO.delinfo !== undefined) { // 删除任务
      let res = personnelRetrievaIO.delinfo
      if (parseInt(res.code) === 1) {
        message.info('删除成功')
        this.getList()
        this.setState({
          currentPage: 1
        })
      } else if (parseInt(res.code) === 0) {
        message.info('删除失败，该摄像头已布控任务')
      }
      personnelRetrievaIO.delinfo = {}
    }
    if(personnelRetrievaIO.cardInfo && personnelRetrievaIO.cardInfo.data !== undefined) { // 获取卡口
      const data = personnelRetrievaIO.cardInfo.data;
      // const treeDow = (<ListTree width="62%" defaultWord="请选择卡口位置" treeData={data} getSelectNone={this.getSelectNone} getCheckName={this.getCheckName}  />)
      this.setState({
        treeData: data,
        treeDow: (<ListTree width="62%" isReset={ true } defaultWord="请选择卡口位置" treeData={data} getSelectNone={this.getSelectNone} getCheckName={this.getCheckName}  />)
      });
    }
  }

  componentDidMount() {
    message.config({
      top: 50,
      duration: 1,
      maxCount: 1,
    });
    window.addEventListener('keydown', this.delKeyDown)
    this.getList({
      page: 1,
      order: 'updatetime',
      sort: 'desc',
    })
    this.getCard(1)
  }

  getSelectNone = (nodes) => { // 新建任务时获取选择的卡口信息
    this.setState({
      tollgatelist: nodes,
    })
    //console.log(nodes);
  }

  getCheckName = () => {
    //console.log('')
  }

  newTask = (params) => { // 新建任务
    const data = {
      taskname: params.name || '',
      capturetype: params.type,
      // status: 8,
      comments: '',
      vmsIaCodeReqDTOList: this.state.tollgatelist,
    }
    // debugger;
    this.props.dispatch({
      type: 'personnelRetrievaIO/createtask',
      payload: data,
    })
  }

  confirm = () => {
    const { tasktype, tollgatelist } = this.state;
    const name = document.getElementById('taskName').value;
    // console.log(name.length)
    if (name.length <= 0) {
      message.info('请输入任务名称');
    } else if (tasktype === '选择任务类型') {
      message.info('请选择任务类型');
    } else if (tollgatelist.length <= 0) {
      message.info('请选择卡口');
    } else {
      this.hideModal();
      this.setState({
        isConfirm: false
      })
      this.newTask({
        name: name || '',
        type: this.state.taskTypeNum === 0 ? 1 : 2,
      })
    }
  }

  getCard = (num) => {
    this.props.dispatch({
      type: 'personnelRetrievaIO/searchcard',
      payload: num,
    })
  }

  disScroll = (e) => {
    e.stopPropagation();
    e.preventDefault(); 
  }

  render() {
    const { nameList, checklist, selectAll, tasktype, cardtype, searchKey, hasDelMask } = this.state;
    const { personnelRetrievaIO } = this.props;
    const suffix = searchKey ? <Icon type="close-circle-o" className={styles.seach_icon} onClick={this.emitEmpty} /> : null
    const hascard = !!(personnelRetrievaIO.cardInfo && personnelRetrievaIO.cardInfo.data !== undefined);
    if (selectAll) {
      nameList.forEach(item => {
        checklist[item.viewid] = true
      })
    }
    return (
      <div>
        {/* 删除弹窗 */}
        <DeleteTips deleteSure={this.delConfirm} deleteCancel={this.delCancel} deleteStyle={{ display: this.state.hasDelMask ? 'block' : 'none' }}/>
        {/*内容头部*/}
        <ContentHeader contentTitle='搜脸配置管理'/>
        <div className={styles.content}>
          <div className={styles.content_box}>
            <Search
              style={{ marginLeft: 10, width: 240 }}
              placeholder="示例:编号/名称/创建者"
              suffix={suffix}
              onChange={this.onChangeSearchKey}
              onSearch={(value) => this.search(value)}
              value={searchKey}
              ref={node => this.userNameInput = node}
              enterButton
            />
            <Button type="primary" icon="plus" style={{ float: 'right', marginRight: 10 }} onClick={this.showModal}>新建</Button>
            <div id="createmodel" ref="createmodel" style={{ display: 'none' }} onWheel={ this.disScroll }>
                <div className={ styles.model_mask } style={{ zIndex:1000 }} onClick={() => this.hideModal()} />
                <div className={ styles.model_wrap } style={{ zIndex:1001 }}>
                  <div className={ styles.model_content } style={{ top: 123, left: '50%' }}>
                    <div className={ styles.model_content_i }>
                      <button className={ styles.model_close } onClick={() => this.hideModal()}>
                        <span className={ styles.model_close_x } />
                      </button>
                      <div id="model_title" className={ styles.model_header }>
                        <div className={ styles.model_header_title }>创建任务</div>
                      </div>
                      <div className={ styles.model_body }>
                        <div style={{ padding: 24 }} onMouseDown={ this.onModalMouseDown } onMouseUp={ this.onModalMouseUp }>
                          <div style={{ marginBottom: 20, marginTop: 20 }}>
                            <div className={ styles.div_name }>任务名称<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <Input id="taskName" placeholder="请输入任务名称" style={{ width: '62%' }} />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <div className={styles.div_name}>任务类型<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <Select id="taskType"  className={styles.taskType} value={tasktype} style={{ width: '62%' }} onChange={ (e) => { this.taskTypeChange(e) } }>
                              {/* { nametypeList.map(item =>(<Option key={item.id}>{item.name}</Option> ))} */}
                              <Option key='ipc'>IPC</Option>
                              <Option key='camera'>抓拍机</Option>
                            </Select>
                          </div>
                          <div style={{ marginBottom: 20  }}>
                            <div className={ styles.div_name }>卡口选择<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            { this.state.treeDow }
                          </div>
                          {/* <div style={{ marginBottom: 20, height: 100 }}>
                            <div className={styles.div_name}>说明<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <TextArea id="taskRemark" rows={4} maxLength="30" placeholder="请控制在30字以内" style={{ float: 'left', width: '62%' }} />
                          </div> */}
                        <div style={{ marginTop: hascard ? 72 : 0, height: 45, position: 'relative' }}>
                          <div style={{ position: 'absolute', right: 115 }}>
                            <Button type="primary" style={{ marginRight: 20 }} onClick={() => this.confirm()}>确认</Button>
                            <Button type="primary" ghost onClick={this.reset}>重置</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 任务列表 */}
          <div id="listheight" className={styles.listheight_namelist}>
            <List
              header={
                <div className={styles.listtitle} style={{ border: 'none' }}>
                  <div className={styles.list_line1} style={{ width: '6%' }}>
                    {/* <Checkbox checked={this.state.checkAllState} onChange={(e)=>this.changeCheckAll(e)} /> */}
                    <Checkbox checked={selectAll} onChange={(e) => this.selectAll(e)} />
                    {/* <span>全选</span> */}
                  </div>
                  <div className={styles.list_line1} style={{ width: '4%' }}>
                      序号
                  </div>
                  <div className={styles.list_line1} style={{ width: '10%' }}>
                      ID编号
                  </div>
                  <div className={styles.list_line1} style={{ width: '7%' }}>
                      任务名称
                  </div>
                  <div className={styles.list_line1} style={{ width: '5%' }}>
                      分类
                  </div>
                  <div className={styles.list_line1} style={{ width: '9%' }}>
                      地点
                  </div>
                  <div className={styles.list_line1} style={{ width: '9%' }}>
                      摄像头名称
                  </div>
                  <div className={styles.list_line1} style={{ width: '5%' }}>
                      状态
                  </div>
                  <div className={styles.list_line1} style={{ width: '8%' }} id="author_list_lib" onClick={() => this.doSort('author_list_lib', this.state.isauthor_list_libdown ? 'asc' : 'desc')}>
                       创建人
                    <Icon type="caret-up" id="author_list_libup" style={{ display:'none', marginLeft:'3px', fontSize: 12, cursor: 'pointer' }} />
                    <Icon type="caret-down" id="author_list_libdown" style={{ marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                  </div>
                  <div className={styles.list_line1} style={{ width: '14%' }} id="created_time_list_lib" onClick={() => this.doSort('created_time_list_lib', this.state.iscreated_time_list_libdown ? 'asc' : 'desc')}>
                      创建时间
                    <Icon type="caret-up" id="created_time_list_libup" style={{ display:'none', marginLeft: '3px',fontSize: 12, cursor: 'pointer' }} />
                    <Icon type="caret-down" id="created_time_list_libdown" style={{ marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                  </div>
                  <div className={styles.list_line1} style={{ width: '14%' }} id="updated_time_list_lib" onClick={() => this.doSort('updated_time_list_lib', this.state.isupdated_time_list_libdown ? 'asc' : 'desc')}>
                      最后修改时间
                    <Icon type="caret-up" id="updated_time_list_libup" style={{ display:'none', marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                    <Icon type="caret-down" id="updated_time_list_libdown" style={{ marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                  </div>
                  {/* <div className={styles.list_line1} style={{ width: '10%' }}>
                      创建说明
                    </div> */}
                  <div className={styles.list_line1} style={{ width: '9%' }}>
                      操作
                  </div>
                </div>}             
              itemLayout="vertical"
              size="small"
              dataSource={nameList}
              renderItem={(item, index) => (
                <List.Item key={item.title}>
                  <div className={`${((this.state.currentPage - 1) * 9 + index + 1) % 2 === 0 ? `${ styles.item_div0 }` : `${ styles.item_div1 }`}`}>
                    <div className={styles.list_line} style={{ width: '6%' }}>
                      <Checkbox
                          // checked={this.state.checkList[item.idListLib] ? this.state.checkList[item.idListLib].checkState : false}
                        onChange={(e) => this.changeCheck(e, item.viewid)}
                          // checked={ selectAll ? allList[item.viewid] : checklist[item.viewid] }
                        checked={checklist[item.viewid]}
                      />
                    </div>
                    <div className={styles.list_line} style={{ width: '4%' }}>
                      {(this.state.currentPage-1) * 8 + index + 1}
                    </div>
                    <div className={styles.list_line} style={{ width: '10%', color: '#2080da' }}>
                      <a src="" style={{ textDecoration: 'underline' }}>{ item.viewid }</a>
                    </div>
                    <div className={styles.list_line} style={{ width: '7%' }}>
                      <Popover content={item.taskname}>
                        {item.taskname.substr(0, 6)}
                      </Popover>
                    </div>
                    {/* <div className={styles.list_line} style={{ display: item.nameListLib.length <= 6 ? 'block' : 'none', width: '5%' }}>
                          {item.nameListLib}
                      </div> */}
                    <div className={styles.list_line} style={{ width: '5%' }}>
                      {parseInt(item.capturetype) === 1 ? 'IPC' : '抓拍机'}
                    </div>
                    <div className={styles.list_line} style={{ width: '9%' }}>
                      <Popover content={item.vmspname || '暂无'}>
                        {item.vmspname || '暂无'}
                      </Popover>
                    </div>
                    <div className={styles.list_line} style={{ width: '9%' }}>
                      <Popover content={item.vmsdevicename || '暂无'}>
                        {item.vmsdevicename || '暂无'}
                      </Popover>
                    </div>
                    <div className={styles.list_line} style={{ width: '5%', color: (item.status !== '1' && item.status !== '5' && item.status !== '-1') ? 'red' : 'black' }}>
                      {/* {item.status === '-1' ? '已删除' : item.status === '0' ? '已失效' : item.status === '1' ? '创建中' : item.status === '2' ? '校验中' : item.status === '3' ? '已创建' : item.status === '4' ? '创建失败' : item.status === '5' ? '创建成功' : '校验中'} */}
                      {item.status === '1' ? '创建中' : item.status === '5' ? '创建成功' : item.status === '-1' ? '已删除' : '创建失败'}
                    </div>
                    <div className={styles.list_line} style={{ width: '8%' }}>
                      {item.createdby}
                    </div>
                    <div className={styles.list_line} style={{ width: '14%' }}>
                      {item.createdtime}
                    </div>
                    <div className={styles.list_line} style={{ width: '14%' }}>
                      {item.updatetime}
                    </div>
                    {/* <div className={styles.list_line} style={{ width: '10%' }}>
                        {this.showDesc(item.descListLib)}}
                      </div> */}
                    <div className={styles.list_line} style={{ width: '9%', color: '#2080da'}}>
                      {/* <Icon type="download" style={{margin: 5}} onClick={()=>this.showModal('pull','1',item.idListLib)} />
                        <Icon type="edit" style={{margin: 5}} onClick={this.returnback} />
                        <Icon type="delete" style={{margin: 5}} onClick={this.returnback} /> */}
                      <Popover content="编辑">
                        <Icon type="edit" style={{ marginLeft: -1, marginRight: 5, cursor: 'pointer' }} data-value={item.viewid} onClick={this.returnback} />
                      </Popover>
                      {/* <Popover content="停止监控">
                          <Icon type="pause-circle-o" data-value={ item.taskid } style={{margin: 5, cursor: 'pointer', display: item.isopen ? 'inline-block' : 'none' }} onClick={ (e) => { this.changeStatus(e, 'stop') } }  />
                        </Popover>
                        <Popover content="启动监控">
                          <Icon type="play-circle-o" data-value={ item.taskid } style={{margin: 5, cursor: 'pointer', display: !item.isopen ? 'inline-block' : 'none'}} onClick={ (e) => { this.changeStatus(e, 'start') } } />
                        </Popover> */}
                      <Popover content="删除">
                        {/* <Icon type="delete" data-value={ [item.vmsdeviceid, item.capturetype] } style={{ cursor: 'pointer' }} onClick={(e) => this.showDelMask(e)} /> */}
                        <Icon type="delete" data-value={[item.vmsdeviceid, item.capturetype]} style={{ cursor: 'pointer' }} onClick={(e) => this.showDelMask(item.vmsdeviceid, item.capturetype)} />
                      </Popover>
                    </div>
                  </div>
                </List.Item>
                )}
            />
          </div>
          {/* 分页 */}
          
            {/* <div style={{ float: 'right', display: 'flex', position: 'relative', marginRight: 20 }}>
              <div className={styles.itemRenderFirst} onClick={this.toFirst} style={{ display: this.state.listCount > 0 ? 'block' : 'none' }}>首页</div>
              <Pagination
                style={{ display: 'inline-block' }}
                defaultCurrent={1}
                defaultPageSize={8}
                showQuickJumper
                total={this.state.listCount}
                    // total={this.state.nameList.length}
                hideOnSinglePage
                onChange={this.listOnChange}
                current={this.state.currentPage}
              />
              <div className={styles.itemRenderLast} onClick={this.toLast} style={{ display: this.state.listCount > 0 ? 'block' : 'none' }}>尾页</div>
            </div> */}
            <Pagenation 
              pagStyle={{float: 'right',display: 'flex', position: 'relative', marginRight: 20 }}
              firstStyle={{display: this.state.listCount > 0 ? 'block' : 'none'}}
              toFirst={this.toFirst}
              toLast={this.toLast}
              defaultCurrent={1}
              defaultPageSize={8}
              currentPage={this.state.currentPage}
              totlePage={this.state.listCount}
              listOnChange={this.listOnChange}
            />
        </div>
      </div>
    );
  }
}
