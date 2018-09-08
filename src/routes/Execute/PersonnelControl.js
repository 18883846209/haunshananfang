/**
 * @flow
 */

import React from 'react';
import { Input,  Select, Slider, List, Icon, Button, Pagination, Popover,Checkbox,message, Modal } from 'antd';
import { connect } from 'dva';
import $ from 'jquery';
import  '../../common/drag.js';
import DateInput from 'components/DateInput';
import ListTree from 'components/ListTree';
import styles from './PersonnelControl.less';
import ContentHeader from 'components/ContentHeader';
import DeleteTips from 'components/DeleteTips';
import Pagenation from 'components/Pagenation';

const { TextArea, Search } = Input
const Option = Select.Option
let nameList = []
let listCount = 8
const date = new Date();
const enddate = new Date();
enddate.setDate(enddate.getDate() + 30);
let pictureData = []

@connect(({ personnelControl, loading }) => ({
  personnelControl,
  loading: loading.models.personnelControl,
}))

@connect(({ nameListLibrary, loading }) => ({
  nameListLibrary,
  loading: loading.models.nameListLibrary,
}))

export default class PersonnelControl extends React.Component {
  constructor() {
    super();
    this.state = {
      taskname:'',
      pictureList: [],
      uploading: false,
      namelistid:'',
      startValue: date,
      endValue: enddate,
      similar: 80,
      tollgatelist: [],
      dispositionarea: '',
      dispositiontype: '选择布控目标',
      orderFiled: '',
      orderRule: '',
      listPage: 1,
      listCount:'',
      modalLeft: null,
      modalTop: null,
      isapplicantnameup: true,
      iscreattimeup: true,
      issimilaritydegreeup: true,
      checkList:{},
      checkAllState: false,
      listData:[],
      searchKey:'',
      imgUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      imgName: '1111',
      imgAge: '20-30',
      imgSex: '男',
      imgWeight: '有',
      imgHeight: '无',
      imgOrther: 'yellow',
      imgMask: '无',
      checkedData: [],
      picturePage: 1,
      pictureId: '',
      clickdata:'',
      treeDow:(
        <Select placeholder="选择布控范围" style={{ width: '62%', float: 'left' }} />
      ),
      hasDelMask: false,
      treeData: {}
    }
      this.moving = false;
      this.startX = 0;
      this.startY = 0;
  }

  imageUrl = window.SSystem.imageUrl ||  '';

  componentDidMount () {
    window.addEventListener('keydown', this.delKeyDown)//监听键盘回车事件
    this.queryTaskList('','')
    $('#model').hide();
    $('#pictureModal').hide();
    this.props.dispatch({
      type: 'personnelControl/queryTollgateList',
      payload: {
        treeType: '0,1',
        deviceType: '5',
      },
    })
    this.props.dispatch({
      type: 'nameListLibrary/getnamelistall', 
    })
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
  }

  returnback=()=>{
    message.info("开发中，本期暂不提供该功能")
  }

  // 获取布控列表
  queryTaskList = (word,rule) => {
    this.setState({checkedData: []})
    this.props.dispatch({
      type: 'personnelControl/getTaskList',
      payload: {
        page: this.state.listPage,
        size: 8,
        word,
        rule,
        key: this.state.searchKey,
        datetime: (new Date()).valueOf(),
      },
    })
  }

  onMouseMove = (e) => {
    if(this.moving){
      const left = e.clientX - this.startX
      const top = e.clientY - this.startY
      if(left > 5 || left<-5){
          this.setState({
          modalLeft: left,
          })
      }
      if(top > 5 || top < -5){
          this.setState({
          modalTop: top,
          })
      }
    }
  }
    
  onModalMouseDown = (e) =>{
    this.moving = true
    this.startX = e.clientX;
    this.startY = e.clientY;
  }
    
  onModalMouseUp = (e) =>{
    this.moving = false;
    
  }

  showModal = (type) => {
    if(type==='add'){
      document.getElementById("addOk").disabled=false;
      $('#model').show();
    }else if(type==='picture'){
      $('#pictureModal').show();
    }
  }

  handleCancel = (type) => {
    if(type==='add'){
      $('#model').hide();
      this.resetModle()
    }else if(type==='picture'){
      $('#pictureModal').hide();
    }
  }

  // 日期选择
  onhandleDateChange = (state)=>(e)=>{
    if(e){
     this.setState({[state]:e})
    }
   }

  onchangesimilar = (value) => {
    this.setState({ similar: value })
  }

  addPicture = (e) => {
    const _this = this
    const files = e.currentTarget.files
    for(let i=0;i<files.length;i++){
      const reader = new FileReader()
      const file = files[i]
      reader.readAsDataURL(file)
      reader.onload = function (event) {
        const url = event.target.result
        file.url = url
        _this.setState(({ pictureList }) => ({
          pictureList: [...pictureList, file],
        }))
      }
    }
   
    $('#addFile').val(null)
  }

  deletePicture = (i) => {
    this.setState(({ pictureList }) => {
      const newFileList = pictureList.slice();
      newFileList.splice(i, 1);
      return {
        pictureList: newFileList,
      };
    }
     );
  }

  selectFilter=(inputValue, option)=>{
    const arr= option.key.split(',,');
    if(arr[1].includes(inputValue)){
      return true
    }
  }

  nameOnchange=(e)=>{
    this.setState({ namelistid: e })
  }

  tpyeOnchange = (e) => {
    if(e === "1"){
      document.getElementById('list').style.display="none"
      document.getElementById('namelist').style.display="block"
      this.setState({ dispositiontype: '布控库图片' })
    }else{
      document.getElementById('list').style.display="block"
      document.getElementById('namelist').style.display="none"
      this.setState({ dispositiontype: '单个目标图片' })
    }
  }

  // 新建布控任务
  addControl = () => {
    document.getElementById("addOk").disabled=true;
    const tollgatelist = this.state.tollgatelist;
    const dispositionarea = this.state.dispositionarea;
    const type = this.state.dispositiontype
    const namelistid=this.state.namelistid
    const startTime = Date.parse(new Date(this.state.startValue));
    const endTime = Date.parse(new Date(this.state.endValue));
    const title =  $('#taskName').val();
    const taskUser = "郭林" ;
    const reason = $('#taskRemark').val();
    const similar = this.state.similar / 100;
    const image = this.state.pictureList;
    setTimeout(()=>{
      document.getElementById("addOk").disabled=false;
    })
    // let dispositiontype = type === '0'? '单个目标图片' : '布控库图片'
    if(type === "单个目标图片"){
      if(image.length <= 0){
        message.info('布控目标图片不能为空！')
        return false;
      }
    }
    if(type==="选择布控目标")
    {
      message.info('请选择布控目标')
      return false;
    }else if(type === "布控库图片"){
      if(namelistid===''){
        message.info('请选择布控人员库！')
        return false;
      }
    }
    if(title===''){
      message.info('布控任务名称不能为空！')
      return false;
    }else if(taskUser===''){
      message.info('布控人员不能为空！')
      return false;
    }else if(tollgatelist.length<=0){
      message.info('布控范围不能为空！')
      return false;
    }else if(startTime === 0||endTime === 0){
      message.info('请选择布控时间范围！')
      return false;
    }else if(similar=== 0){
      message.info('布控相似度不能为空！')
      return false;
    }else{
      const fd = new FormData();
      if(image.length > 0){
        fd.append("dispositiontypeid",'image');
        for(let i=0;i<image.length;i++){
          fd.append("images",image[i]);
        }
      }else{
        const lib = namelistid.split(',,');
        fd.append("idlistlib",lib[0]);
        fd.append("namelistlib",lib[1]);
        fd.append("featurelibid",lib[2]);
        fd.append("dispositiontypeid",'lib');
      }
      fd.append("title",title);
      fd.append("applicantname",taskUser);
      fd.append("vmsIaCodeReqDTOList",JSON.stringify(tollgatelist))
      fd.append("reason",reason);
      fd.append("similaritydegree",similar);
      fd.append("begintime",startTime);
      fd.append("endtime",endTime);
      fd.append("dispositiontype",type);
      fd.append("dispositionarea",dispositionarea);
  
      this.props.dispatch({
        type: 'personnelControl/doAddTask' ,
        payload: fd ,
      })
    }
   
  }

  // 重置弹框内容
  resetModle = () => {
    this.setState({
      treeDow:(<ListTree width="62%" treeData={this.state.treeData} defaultWord="请选择布控范围" isReset={true} getSelectNone={this.getSelectNone} getCheckName={this.getCheckName} />),
      pictureList: [],
      dispositiontype:'选择布控目标',
    })
    document.getElementById('list').style.display="none"
    document.getElementById('namelist').style.display="none"
    $('#taskName').val('')
    $('#taskUser').val('')
    $('#taskRemark').val('')
  }

  searchKey=(e)=>{// 绑定搜索输入值
    const key = e.target.value
    this.setState({searchKey:key},()=>{
      if(key===''){
        this.queryTaskList('','')
      }
    })
    console.log(e.target.value)
  }

  closeSearch=()=>{// 关闭搜索结果
    const _this = this
    this.setState({searchKey: ''},()=>{
      _this.queryTaskList('','')
    })
  }

  showDelMask = (p1) => {
    const c1 = p1;
    this.setState({
      clickdata:c1,
      hasDelMask: true
    })
    // this.refs.del_cancel.style.display = 'block';
    // document.getElementById('delmask').style.display = 'block';
  }

  delKeyDown = (e) => {
    e.stopPropagation();
    // e.preventDefault();
    if (this.state.hasDelMask && e.key === 'Enter') {
      this.deleteTask(this.state.clickdata);
    }
    this.setState({
      hasDelMask: false
    })
  }
  disScroll = (e) => {
    e.stopPropagation();
    e.preventDefault(); 
  }
  delConfirm = () => {
    // this.refs.del_cancel.display = 'none';
    // document.getElementById('delmask').style.display = 'none';
    this.setState({
      hasDelMask: false
    })
    this.deleteTask(this.state.clickdata);
  }

  delCancel = () => {
    this.setState({
      hasDelMask: false
    })
  }

  componentWillReceiveProps(nextProps){// props发生变化的时候执行
    const { nameListLibrary,personnelControl } = nextProps
    if(nameListLibrary.pictureRes !==undefined ){
      if(nameListLibrary.pictureRes.code ===1){
        if(nameListLibrary.pictureRes.data.length>0){
          if(this.state.picturePage ===1){
            pictureData = nameListLibrary.pictureRes.data
            this.imgClick(pictureData[0])
          }else{
            pictureData = [...pictureData, ...nameListLibrary.pictureRes.data]
          }
          $('#pictureModal').show();
          if(pictureData.length>=20){
            $('#pictureMore').show();
          }else{
            $('#pictureMore').hide();
          }
        }else if(this.state.picturePage ===1){
            message.info("暂无图片")
          }else{
            message.info("无更多图片")
          }
       nameListLibrary.pictureRes.code = 111
      }
    }
    // 后台返回搜索返回数据
    // if (personnelControl.tollgateSearclistResult&&personnelControl.tollgateSearclistResult.data) {
    //   console.log(personnelControl.tollgateSearclistResult)
    //   this.setState({
    //     searchListData:personnelControl.tollgateSearclistResult.data,
    //     searchListCount:personnelControl.tollgateSearclistResult.totalCount,
    //     searchListCurrentPage:personnelControl.tollgateSearclistResult.currentPage,
    //   })
    //   personnelControl.tollgateSearclistResult={};
    // }
    
    if(personnelControl.listResult !==undefined ){
      if(personnelControl.listResult.code ===1){
        listCount = personnelControl.listResult.totalCount
        this.setState({
          listCount:personnelControl.listResult.totalCount,
        })
        const page = personnelControl.listResult.currentPage - 1
        this.setState({
          listCount,
        })
        if(personnelControl.listResult.data.length > 0){
          this.setState({
            listData:personnelControl.listResult.data,
          })
          this.initCheckList(personnelControl.listResult.data)
          // this.state.listData.map((item,i) => {
          //   return item.id = page*8 + i + 1
          // })
        }
        personnelControl.listResult={};
      }
    }
      
      if(personnelControl.tollgatelistResult&&personnelControl.tollgatelistResult.data){
        if(personnelControl.tollgatelistResult.code ===1){
          const data = personnelControl.tollgatelistResult.data
          if(data != null){
            this.setState({
              treeData: data,
              treeDow:(<ListTree width="62%" treeData={data} defaultWord="请选择布控范围" getSelectNone={this.getSelectNone} getCheckName={this.getCheckName} />),
            })
          }
          // personnelControl.tollgatelistResult.code=111;
        }
        personnelControl.tollgatelistResult={};
      }

      if(personnelControl.addResult !==undefined ){
        if(personnelControl.addResult.code ===1){
          this.queryTaskList(this.state.orderFiled,this.state.orderRule)
          this.handleCancel('add')
        }else if(personnelControl.addResult.code ===0){
          document.getElementById("addOk").disabled=false;
          message.info(personnelControl.addResult.message)
        }
        personnelControl.addResult={};
      }
      if(personnelControl.deleteResult !==undefined&&personnelControl.deleteResult.code!==undefined){
        if(personnelControl.deleteResult.code ===1){
          message.info('删除成功！')
          this.queryTaskList(this.state.orderFiled,this.state.orderRule)
        }else{
          message.info('删除失败！')
        }
        personnelControl.deleteResult={};
      }
      if(personnelControl.changeResult !==undefined ){
        if(personnelControl.changeResult.code ===1){
          const datas = personnelControl.changeResult.data
          if(datas){
            const play = `#play${  datas.dispositionid}`
            const pause = `#pause${  datas.dispositionid}`
            if(datas.dispositionstatus === 0){
              $(play).show()
              $(pause).hide()
            }else if(datas.dispositionstatus === 1){
              $(pause).show()
              $(play).hide()
            }
          }
          
        }
        personnelControl.changeResult={};
      }
      
      if(nameListLibrary.nameListAll !==undefined ){
        if(nameListLibrary.nameListAll.code ===1){
          if(nameListLibrary.nameListAll.data.length>0){
            nameList= nameListLibrary.nameListAll.data
          }
        }
        nameListLibrary.nameListAll={};
      }
  }

  render() {
    const { hasDelMask, pictureList,dispositiontype,similar,imgAge,imgHeight,imgMask,imgName,imgOrther,imgSex,imgUrl,imgWeight } = this.state
    // let treeDow =(
    //   <ListTree width="62%"  getSelectNone={this.getSelectNone}/>
    // )
    const suffix = this.state.searchKey ? <Icon type="close-circle-o" className={styles.seach_icon} onClick={()=>this.closeSearch()} /> : null;
    
    return (
      <div style={{height:'100%'}}>
        {/* 删除弹窗 */}
        <DeleteTips deleteSure={this.delConfirm} deleteCancel={this.delCancel} deleteStyle={{ display: hasDelMask ? 'block' : 'none' }}/>
        <div style={{ width: '100%',height:'100%' }}>
          <ContentHeader contentTitle='人员布控'/>
          <div className={styles.content_div}>
            <div className={styles.conditiontitle}>
              <div className={styles.blue} />
              <span>布控任务</span>
            </div>
            <div style={{ margin: 10}}>
              <Search
                style={{ marginLeft: 10, width: 240 }}
                placeholder="示例:编号/名称/布控人员"
                onSearch={()=>this.queryTaskList('','')}
                value={this.state.searchKey}
                onChange={(e)=>this.searchKey(e)}
                enterButton
                suffix={suffix}
              />
              <Button type="primary" icon="plus" style={{ float: 'right', marginRight: 10 }} onClick={()=>this.showModal('add')}>新建</Button>
              
              <div id="model">
                <div className={styles.model_mask} />
                <div className={styles.model_wrap}>
                  <div className={styles.model_content} id="model_content">
                    <div className={styles.model_content_i} style={{top: this.state.modalTop, left: this.state.modalLeft}}>
                      <button className={styles.model_close} onClick={()=>this.handleCancel('add')}>
                        <span className={styles.model_close_x} />
                      </button>
                      <div id="model_title" className={styles.model_header}>
                        <div className={styles.model_header_title}>新建布控任务</div>
                      </div>
                      <div className={styles.model_body}>
                        <div style={{padding:20}}>
                          <div style={{ marginBottom: 10, marginTop: 10, height: 35 }}>
                            <div className={styles.div_name}>布控目标<span style={{ color: 'red', marginLeft: 10 }}>*</span></div>
                            <Select id="choicepoint" value={dispositiontype} style={{ width: '62%', float: 'left' }} onChange={this.tpyeOnchange}>
                              <Option key="0">单个目标图片</Option>
                              <Option key="1">布控库的选择</Option>
                            </Select>
                          </div>
                          <div id="list" className={styles.picturelist}>
                            <div className={styles.addImg} id="addImg">
                              <input
                                multiple="multiple"
                                id="addFile"
                                className={styles.inputFile}
                                type="file"
                                onChange={this.addPicture}
                              />
                              <Icon type="plus-square-o" style={{ color: '#2080da', fontSize: 16, margin: 10 }} />
                              <span style={{ color: '#2080da' }}>添加</span>
                            </div>
                            <div className={styles.listpic}>
                              {pictureList.map((item, i) => (
                                <div className={styles.pictures_div}>
                                  <li className={styles.picture_li}>
                                    <img alt="11" src={item.url} className={styles.image} onLoad={(e)=>this.getHeightShow(e,90,60)} /> 
                                  </li>
                                  <Icon type="close-circle" className={styles.image_icon} onClick={item =>this.deletePicture(i)} />  
                                </div>
                              ))}
                            </div>
                          </div>
                          <div id="namelist" className={styles.namelist}>
                            <div className={styles.div_name}>名单库选择<span style={{ color: 'red', marginLeft: 10 }}>*</span></div>
                            <Select showSearch filterOption={this.selectFilter} defaultValue="选择名单库" style={{ width: '62%', float: 'left' }} onChange={this.nameOnchange}>
                              {nameList && nameList.map(item => (
                                <Option key={`${item.idListLib},,${item.nameListLib},,${item.featurelibId}`}>{item.nameListLib}</Option>
                              ))}
                            </Select>
                          </div>
                          <div style={{ marginBottom: 15, marginTop: 15 }}>
                            <div className={styles.div_name}>任务名称<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <Input id="taskName" placeholder="请控制在10字以内" style={{ width: '62%' }} />
                          </div>

                          <div style={{ marginBottom: 15, height: 32 }}>
                            <div className={styles.div_name}>布控范围<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            {this.state.treeDow}
                          </div>
                          <div style={{ marginBottom: 15 }}>
                            <div className={styles.div_name}>时间<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <DateInput
                              defaultEndValue={enddate}
                              defaultStartValue={date}
                              className={styles.carDate}
                              onhandleStartDateChange={this.onhandleDateChange('startValue')}
                              onhandleEndDateChange={this.onhandleDateChange('endValue')}
                            />
                          
                          </div>
                          <div style={{ marginBottom: 5, height: 40 }}>
                            <div className={styles.div_name}>报警相似度<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <Slider className={styles.div_slider} defaultValue={80} tipFormatter={this.formatter} onChange={this.onchangesimilar} />
                            <span style={{position:'relative',top: 4}}>{similar}%</span> 
                          </div>

                          <div style={{ height: 75 }}>
                            <div className={styles.div_name}>布控说明</div>
                            <TextArea id="taskRemark" maxLength="30" placeholder="请控制在30字以内" autosize={{minRows: 3, maxRows: 3}} style={{ float: 'left', width: '62%' }} />
                          </div>

                          <div style={{ height: 40 }}>
                            <div style={{ width: '85%' }}>
                              <Button type="primary" ghost style={{ float: 'right' }} onClick={this.resetModle}>重置</Button>
                              <Button type="primary" id="addOk" style={{ float: 'right', marginRight: 20 }} onClick={this.addControl}>确认</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="pictureModal">
                <div className={styles.model_mask} />
                <div className={styles.model_wrap}>
                  <div className={styles.model_content}>
                    <div className={styles.model_content_i} style={{top: this.state.modalTop, left: this.state.modalLeft,width:755}}>
                      <button className={styles.model_close} onClick={() => this.handleCancel('picture')}>
                        <span className={styles.model_close_x} />
                      </button>
                      <div id="model_title" className={styles.model_header}>
                        <div className={styles.model_header_title}>图片信息</div>
                      </div>
                      <div className={styles.model_body}>
                        <div style={{height: 400}}>                     
                          <div className={styles.picture_div}>
                            {pictureData.map(item => ( 
                              <div style={{display:'inline-block'}}>
                                <li className={styles.img_li} onClick={()=>this.imgClick(item)}>
                                  <img alt=" " src={this.imageUrl +item.imagestorageurl} style={{width:100,height:70,display:'none'}} onLoad={(e)=>this.getHeightShow(e,100,70)} />      
                                </li>
                                {/* <div style={{textAlign:'center'}}>{item.name}</div> */}
                              </div>  
                            ))}
                            <div id="pictureMore" style={{textAlign:'center',color:'#2080da',cursor:'pointer'}}><span onClick={this.getMorePic}>获取更多</span></div>
                          </div>
                          <div className={styles.desc_div}> 
                            <div>
                              <div className={styles.img_big}>
                                <img alt='' src={imgUrl} className={styles.showpic} onLoad={(e)=>this.getHeightShow(e,200,130)} /> 
                              </div>
                              
                            </div>
                            <div style={{paddingLeft:20}}>
                              <div style={{margin:10}}><span style={{color:'#2080da'}}>性别：</span><span>{imgSex}</span> </div>                                                  
                              <div style={{margin:10}}><span style={{color:'#2080da'}}>年龄：</span><span>{imgAge}</span> </div>                                                  
                              <div style={{margin:10}}><span style={{color:'#2080da'}}>胡须：</span><span>{imgWeight}</span> </div>                                                  
                              <div style={{margin:10}}><span style={{color:'#2080da'}}>肤色：</span><span>{imgHeight}</span> </div>                                                  
                              <div style={{margin:10}}><span style={{color:'#2080da'}}>眼镜：</span><span>{imgOrther}</span> </div>                                                  
                              <div style={{margin:10}}><span style={{color:'#2080da'}}>面具：</span><span>{imgMask}</span> </div>                                                  
                            </div>
                          </div>
                        </div>
                      </div>
                 
                    </div>
                  </div>
                </div>
              </div> 
            </div>
           
            <div style={{display:'block',height:'100%'}}>
              <div className={styles.listheight_control}>
                <List
                  header={
                    <div className={styles.listtitle}>
                      <div className={styles.list_line1} style={{ width: '5%' }}>
                        <Checkbox checked={this.state.checkAllState} onChange={(e)=>this.changeCheckAll(e)} />
                        
                      </div>
                      <div className={styles.list_line1} style={{ width: '3%' }}>
                        序号
                      </div>
                      <div className={styles.list_line1} style={{ width: '13%' }}>
                        编号
                      </div>
                      <div className={styles.list_line1} style={{ width: '12%' }}>
                        布控名称
                      </div> 
                      <div className={styles.list_line1} style={{ width: '10%' }}>
                        目标库名称
                      </div>
                      <div className={styles.list_line1} style={{ width: '5%' }}>
                        图片数量
                      </div>
                      <div className={styles.list_line1} style={{ width: '8%' }} id="applicantname" onClick={() => this.doSort('applicantname', this.state.isapplicantnameup ? 'asc' : 'desc')}>
                        布控人员
                        <Icon type="caret-up" id="applicantnameup" style={{display:'none',marginLeft: '3px',fontSize: 12, cursor: 'pointer'}} />
                        <Icon type="caret-down" id="applicantnamedown" style={{marginLeft: '3px',fontSize: 12, cursor: 'pointer'}} />
                      </div>
                
                      <div className={styles.list_line1} style={{ width: '12%' }} id="creattime" onClick={() => this.doSort('creattime', this.state.iscreattimeup ? 'asc' : 'desc')}>
                        布控时间
                        <Icon type="caret-up" id="creattimeup" style={{display:'none',marginLeft: '3px',fontSize: 12, cursor: 'pointer'}} />
                        <Icon type="caret-down" id="creattimedown" style={{marginLeft: '3px',fontSize: 12, cursor: 'pointer'}} />
                      </div>
                      <div className={styles.list_line1} style={{ width: '8%' }}>
                        布控范围
                      </div>
                      <div className={styles.list_line1} style={{ width: '6%' }} id="similaritydegree" onClick={() => this.doSort('similaritydegree', this.state.issimilaritydegreeup ? 'asc' : 'desc')}>
                        相似度
                        <Icon type="caret-up" id="similaritydegreeup" style={{display:'none',marginLeft: '3px',fontSize: 12, cursor: 'pointer'}} />
                        <Icon type="caret-down" id="similaritydegreedown" style={{marginLeft: '3px',fontSize: 12, cursor: 'pointer'}} />
                      </div>
                      <div className={styles.list_line1} style={{ width: '8%' }}>
                        说明
                      </div>
                      <div className={styles.list_line1} style={{ width: '10%' }}>
                        操作
                      </div>
                    </div>}
                  
                  itemLayout="vertical"
                  size="small"
                  dataSource={this.state.listData}
                  renderItem={(item, index)=> (
                    <List.Item key={item.title}>
                      <div className={`${((this.state.listPage-1)*8+index+1)%2 ===0?`${styles.item_div0}`:`${styles.item_div1}`}`}>
                        <div className={styles.list_line} style={{ width: '5%' }}>
                          <Checkbox 
                            checked={this.state.checkList[item.dispositionid] ? this.state.checkList[item.dispositionid].checkState : false}
                            onChange={(e)=>this.changeCheck(e, item.dispositionid)}                           
                          />
                        </div>
                        <div className={styles.list_line} style={{ width: '3%' }}>
                          {(this.state.listPage-1)*8+index+1}
                        </div>
                        <div className={styles.list_line} style={{ width: '13%', color: '#2080da' }}>
                          <span onClick={()=>this.getPictures(item)} style={{textDecoration: 'underline',cursor:'pointer'}}>{item.dispositionid}</span>
                        </div>
                        <div className={styles.list_line} style={{ width: '12%' }}>
                          {item.title}
                        </div>
                        <div className={styles.list_line} style={{ width: '10%' }}>
                          { item.namelistlib}
                        </div>
                        <div className={styles.list_line} style={{ width: '5%' }}>
                          {item.imagecount}
                        </div>
                        <div className={styles.list_line} style={{ width: '8%' }}>
                          {item.applicantname}
                        </div>
                        <div className={styles.list_line} style={{ width: '12%' }}>
                          {item.creattime}
                        </div>
                        <div className={styles.list_line} style={{ width: '8%' }}>
                          {this.showDesc(item.dispositionarea)}
                        </div>
                        <div className={styles.list_line} style={{ width: '6%' }}>
                          {`${Math.round(item.similaritydegree*100)}%`}
                        </div>
                        <div className={styles.list_line} style={{ width: '8%' }}>
                          {this.showDesc(item.reason)}
                        </div>
                        <div className={styles.list_line} style={{ width: '10%'}}>
                          <Popover content="编辑">
                            <Icon type="edit" className={styles.icon_tool} onClick={this.returnback} />
                          </Popover>
                          <Popover content="停止布控">
                            <Icon id={`pause${item.dispositionid}`} type="pause-circle-o" className={styles.icon_tool} style={{display: `${item.dispositionstatus ===0?'none':'' }`}} onClick={(e) =>this.changeStatus(item,0)} />
                          </Popover>
                          <Popover content="启动布控">
                            <Icon id={`play${item.dispositionid}`} type="play-circle-o" className={styles.icon_tool} style={{display: `${item.dispositionstatus ===1?'none':'' }`}} onClick={(e) =>this.changeStatus(item,1)} />
                          </Popover>
                          <Popover content="删除">
                            <Icon type="delete" onClick={(p1) => this.showDelMask(item.dispositionid)} className={styles.icon_tool} />
                          </Popover>
                          <Popover content="详情">
                            <Icon type="profile" className={styles.icon_tool} onClick={()=>this.getPictures(item)} />
                          </Popover>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
              {/* <div style={{ float: 'right',display: 'flex', position: 'relative', marginRight: 20 ,marginBottom:'10px'}}>
                <div className={styles.itemRenderFirst} onClick={this.toFirst} style={{ display: this.state.listCount > 0 ? 'block' : 'none' }}>首页</div>
                <Pagination
                  defaultCurrent={1}
                  defaultPageSize={8}
                  showQuickJumper
                  current={this.state.listPage}
                  total={listCount}
                  onChange={this.listOnChange}
                />
                <div className={styles.itemRenderLast} onClick={this.toLast} style={{ display: this.state.listCount > 0 ? 'block' : 'none' }}>尾页</div>
              </div> */}
              <Pagenation 
              pagStyle={{float: 'right',display: 'flex', position: 'relative', marginRight: 20 ,marginBottom:'10px'}}
              firstStyle={{display: this.state.listCount > 0 ? 'block' : 'none'}}
              toFirst={this.toFirst}
              toLast={this.toLast}
              defaultCurrent={1}
              defaultPageSize={8}
              currentPage={this.state.listPage}
              totlePage={listCount}
              listOnChange={this.listOnChange}
              />
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  showDesc = (desc) => {
    let dow = null
    if(desc){
      if(desc.length>6){
        dow = (
          <Popover content={<div className={styles.desc_pop}>{desc}</div>} trigger="hover">
            <div>
              {`${desc.substring(0,6)}···`}
            </div>
          </Popover>
        )
      }else{
        dow = (<span>{desc}</span>)
      }
      return dow
    }
  }

  toFirst = () => {
    if (this.state.listPage !== 1) {
      this.setState({
        listPage: 1,
      })
      this.listOnChange(1);
    }
  }
  toLast = () => {
    const lastpagenum = Math.ceil(parseInt(this.state.listCount) / 8);
    // console.log(lastpagenum);
    if (this.state.listPage !== lastpagenum) {
      this.setState({
        listPage: lastpagenum,
      })
      this.listOnChange(lastpagenum);
    }
  }

  formatter = (value) => `${value}%`

  // 停止、启动布控（改变布控状态）
  changeStatus = (item,statu) => {
    this.props.dispatch({
      type: 'personnelControl/changeConctolStatus',
      payload: {
        id: item.dispositionid,
        status: statu,
      },
    })
    // const icon= document.getElementById(name)
    // e.target.style.display = 'none'
    // icon.style.display = ''
  }

  doSort = (id,rule) => {
    this.saveCheckData()
    this.setState({
      orderFiled: id,
      orderRule: rule,
    })
    const up = document.getElementById(`${id}up`)
    const down = document.getElementById(`${id}down`)
    if (id === 'applicantname') {
      this.setState((state) => ({
        isapplicantnameup: !state.isapplicantnameup,
      }))
    } else if (id === 'creattime') {
      this.setState((state) => ({
        iscreattimeup: !state.iscreattimeup,
      }))
    } else if (id === 'similaritydegree') {
      this.setState((state) => ({
        issimilaritydegreeup: !state.issimilaritydegreeup,
      }))
    }
    if(rule === 'desc'){
      up.style.display='none'
      down.style.display='inline-block'
    }else{
      down.style.display='none'
      up.style.display='inline-block'
    }
    this.queryTaskList(id,rule)
  }

  listOnChange = current => {
    // this.changeCheckAll()
    this.setState({
      listPage: current,
      checkAllState:false,// 当前版本临时处理，非最终需求
    })
    this.props.dispatch({
      type: 'personnelControl/getTaskList',
      payload: {
        page: current,
        size: 8,
        word: this.state.orderFiled,
        rule: this.state.orderRule,
        key: this.state.searchKey,
        datetime: (new Date()).valueOf(),
      },
    })
  }


  deleteTask = (id) => {
    this.props.dispatch({
      type: 'personnelControl/doDeleteTask',
      payload: {
        id,
      },
    })
  }

  getSelectNone = (nodes) =>{
    this.setState({
      tollgatelist: nodes,
    })
  }

  getCheckName = (name) =>{
    this.setState({
      dispositionarea: name,
    })
  }

  initCheckList = (list) => {
    const {checkAllState,checkedData } = this.state
    const checkList = {}
    if(checkAllState){
      for(const item in list) {
        checkList[list[item].dispositionid] = {checkState: checkAllState}
      }
    }else{
      for(const item in list) {
        checkList[list[item].dispositionid] = {checkState: false}
        for(const id in checkedData ){
          if(id===item.dispositionid){
            checkList[list[item].dispositionid] = {checkState: true}
          }
        }
      }
    }

    this.setState({'checkList' : checkList})
  }

  changeCheck = (e, id) => {
    const checkList = {...this.state.checkList}
    let checkAllState = false
    let i = 0
    checkList[id].checkState = e.target.checked;
    for(const id in checkList){
      if(i == 0) {
        checkAllState = checkList[id].checkState
        i++
      }else if(checkAllState != checkList[id].checkState){
          checkAllState = false
          break;
        }
    }
    this.setState(
      { 
        checkAllState,
        checkList,
      }
    );
  }

  changeCheckAll = (e) => {
    const state = e ? e.target.checked : false
    const checkList = this.state.checkList
    for(const id in checkList){
      checkList[id].checkState = state
    }
    this.setState(
      {'checkList' : checkList,
        'checkAllState' : state,
      }
    );
  }

  imgClick = (item) =>{
    this.setState({
      imgUrl: this.imageUrl + item.imagestorageurl,
      imgName: item.name,
      imgAge: item.age,
      imgSex: item.gender,
      imgWeight: item.beard,
      imgHeight: item.race,
      imgOrther: item.glasses,
      imgMask: item.mask,
    })
  }

  getHeightShow = (e,w,h) =>{
    const image = new Image();
    image.src = e.target.src;
    let reW = 0; let reH = 0
    if (image.width<=w && image.height<=h)
    {
      reW=image.width;
      reH=image.height;
    }
    else
    if (w / h <= image.width / image.height)
        {
          reW=w;
          e.target.style.width = `${w}px`;
          reH=w * (image.height / image.width);
          e.target.style.height = `${reH }px` ;  
        }
        else
        {
          reW=h * (image.width / image.height);
          e.target.style.height= `${h}px`;
          e.target.style.width = `${reW }px` ;  
          reH=h;
        }
    e.target.style.display = 'inline-block';
  }

  getPictures = (item) =>{
    let id = item.dispositionid
    if(item.dispositiontypeid === 'lib'){
      id = item.idlistlib
    }
    this.setState({
      pictureId: id,
      picturePage: 1,
    })
    this.props.dispatch({
      type: 'nameListLibrary/getPictrueLists' ,
      payload: {
        id,
        page: 1,
        size: 20,
      }, 
    })   
  }

   // 获取布控图片信息
  getMorePic = () =>{
    const libPage = this.state.picturePage + 1
    this.setState({
      picturePage: libPage,
    })
    this.props.dispatch({
      type: 'nameListLibrary/getPictrueLists' ,
      payload: {
        id: this.state.pictureId,
        page: libPage,
        size: 20,
      }, 
    }) 
  }

  saveCheckData = () =>{
    const { checkList,checkedData,checkAllState } = this.state
    if(!checkAllState){
      for(const id in checkList){
        if(checkList[id].checkState&&checkedData.indexOf(id)===-1){
          checkedData.push(id)
        }
      }
    }
  }

}
