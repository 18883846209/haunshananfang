
/**
 * @flow
 */

import React, { PureComponent } from 'react';
import { List, Icon, Button, Input,Popover, Select,Checkbox, Slider, Pagination,Dropdown, Modal, Radio,Tabs, InputNumber,message } from 'antd';
import $ from 'jquery';
import DateInput from 'components/DateInput'
import ListTree from 'components/ListTree'
import { connect } from 'dva';
import moment from 'moment'; 
import styles from './PersonnelRetrieva.less';
import ContentHeader from 'components/ContentHeader';
import Pagenation from 'components/Pagenation';

const TabPane = Tabs.TabPane;
const Item=List.Item;
const Option = Select.Option;
function formatter(value) {
  return `${value}%`;
}
let listData = [];
let listCount = 3;
let treeDow =(
  <Select placeholder="请选择卡口" style={{ width: '26%',position:'relative',top:'-15px'}} />
)
const mapObj = new Map()
mapObj.set('500108','南岸区');
mapObj.set('500112','渝北区');
mapObj.set('500103','渝中区');
const enddate = new Date();
const date = new Date();
date.setDate(date.getDate() - 1);

@connect(({ personnelRetrievaIO, loading }) => ({
  personnelRetrievaIO,
  loading: loading.models.personnelRetrievaIO,
}))

@connect(({ personnelControl, loading }) => ({
  personnelControl,
  loading: loading.models.personnelControl,
}))

export default class PersonnelRetrieva extends PureComponent {
  constructor() {
    
    super();
    this.state = {
      sorttype:'score',
      isascendingorder:false,
      isSearch:false,
      startValue: date.getTime(),
      endValue: enddate.getTime(),
      visible:false,
      imgfile: '',
      tollGateId: 500112,
      cameraIds: 10,
      similar: 80,
      listPage:1,
      tolllist: [],
      pagesize:12,
      defaultpage: 1,
      tolltwolist: [],
      pictureList: [],
      filterVisible:false,
      issimilardown: true,
      istimedown: true,
      tollgatelist: [],
      dayRadio:'a',
      checkList:{},
      checkAllState:false,
      modalsStatus:false,
      indexInfo:{},
    }
    this.changeSort = this.changeSort.bind(this);
  }

  imageUrl = window.SSystem.imageUrl || '';

  componentDidMount(){
    console.log(this.state.startValue)
    this.props.dispatch({
      type: 'personnelRetrievaIO/searchtollgatelist' ,
    })
    this.props.dispatch({
      type: 'personnelRetrievaIO/searchtollgatelistline' ,
      payload: 500112 ,
    })
    this.props.dispatch({
      type: 'personnelControl/queryTollgateList',
      payload: {
        treeType: '0,1',
        deviceType: '5',
      },
    })
    listData = [];
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
    // console.log(listData)
  }
 
  // 日期选择
  onhandleDateChange = (e,state)=>{
    if(e){
     this.setState({
       [state]:e,
       dayRadio:'',
      })
    }
  }

  initCheckList = (list) => {
    const checkList = {}
    for(const item in list) {
      checkList[list[item].ide] = {checkState: false}
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
 
  search = () => { 
    const {pictureList} =this.state;
    const startTime1 =  Date.parse(new Date(this.state.startValue));
    const endTime1 =  Date.parse(new Date(this.state.endValue));
    const tollGateId1 = this.state.tollGateId;
    const  minScore1 = this.state.similar/100;
    const topK1 = $.trim(document.getElementById('topk').value);
    const parrtern = /^[0-9]*$/;
    let image1='';
    if(pictureList.length !== 0){
      image1 = this.state.pictureList[0].url;
    }  
    const cameraIds1 = this.state.cameraIds;
    const tollgatelist = this.state.tollgatelist;
    // if(pictureList.length === 0){
    //   message.info('请上传图片');
    //   return false;
    // }else 
    if (pictureList.length !== 0) {
      if(minScore1 === 0){
        message.info('请选择相似度');
        return false;
      }else if(!topK1 || !parrtern.test(topK1) || topK1 > 10000 || topK1==="0"){
        message.info('请填写正确的TOPK（1—10000）');
        return false;
      }
    }
    if(startTime1 === 0){
      message.info('请选择开始时间');
      return false;
    }else  if(endTime1 === 0){
      message.info('请选择结束时间');
      return false;
    }else if(tollgatelist.length <= 0){
      message.info('请选择卡口区域');
      return false;
    }
    // else  if(cameraIds1 === ""){
    //   message.info('请选择摄像头');
    //   return false;
    // }
    const list = {
      startTime: startTime1,
      endTime: endTime1,
      minScore: minScore1,
      topK: topK1,
      tollGateId: 12,
      image: image1,
      vmsIaCodeReqDTOList: tollgatelist,
      page:0,
      size:this.state.pagesize,
      sortType:this.state.sorttype,
      ascendingOrder:this.state.isascendingorder,
    }
    listData = [];
    this.props.dispatch({
      type: 'personnelRetrievaIO/searchlist' ,
      payload: list ,
      datetime: (new Date()).valueOf(),
    })
    this.setState({ defaultpage:1,isSearch:true })
  }

  tab =(e)=>{
    if(e==="1")
    {
      this.setState({ pagesize: 12 },
        ()=>{ if(this.state.isSearch===true){
              this.search();
      }}) 
    }else{
      this.setState({ pagesize: 4 },
        ()=>{ if(this.state.isSearch===true){
              this.search();
      }}) 
    }
 
  }

  listOnChange = current => {
    this.setState(
      { defaultpage:current,
        checkAllState:false,// 当前版本临时处理，非最终需求
      }
    )
    console.log(current);
    const {pictureList} =this.state;
    const startTime1 =  Date.parse(new Date(this.state.startValue));
    const endTime1 =  Date.parse(new Date(this.state.endValue));
    const tollGateId1 = this.state.tollGateId;
    const  minScore1 = this.state.similar/100;
    const topK1 = $.trim(document.getElementById('topk').value);
    const tollgatelist = this.state.tollgatelist;
    let image1='';
    if(pictureList.length !== 0){
      image1 = this.state.pictureList[0].url;
    } 
  
    const cameraIds1 = this.state.cameraIds;
    const list = {
      startTime: startTime1,
      endTime: endTime1,
      minScore: minScore1,
      topK: topK1,
      tollGateId: 12,
      image: image1,
      vmsIaCodeReqDTOList: tollgatelist,
      page:current-1,
      size:this.state.pagesize,
      sortType:this.state.sorttype,
      ascendingOrder:this.state.isascendingorder,
    }
    this.props.dispatch({
      type: 'personnelRetrievaIO/searchlist',
      payload:list,
      datetime: (new Date()).valueOf(),
    })

  }

  toFirst = () => {
    if (this.state.listPage !== 1) {
      this.setState({
        defaultpage: 1,
      })
      this.listOnChange(1);
    }
  }

  toLast = (_pagesize) => {
    if (_pagesize === 12) {
      const lastpagenum = Math.ceil(parseInt(this.state.listCount) / 12);
      // console.log(lastpagenum);
      if (this.state.listPage !== lastpagenum) {
        this.setState({
          defaultpage: lastpagenum,
        })
        this.listOnChange(lastpagenum);
      }
    } else {
      const lastpagenum = Math.ceil(parseInt(this.state.listCount) / 4);
      // console.log(lastpagenum);
      if (this.state.listPage !== lastpagenum) {
        this.setState({
          defaultpage: lastpagenum,
        })
        this.listOnChange(lastpagenum);
      }
    }
  }

  onchangesimilar = (value) => {
    this.setState({ similar: value })
  }

  changeone = (item) => {
    this.setState({ tollGateId: item });
    this.props.dispatch({
      type: 'personnelRetrievaIO/searchtollgatelistline' ,
      payload: item ,
    })
  }

  changetwo = (item) => {
    this.setState({
      cameraIds: item,
    });
  }

  Upload = (e) => {
    const _this = this
    const filetypes =["image/jpeg","image/png"]
    const filemaxsize = 1024*1;
    const {pictureList}=this.state
    let isSame=true
    let isError=true
    let isOver=true
    const files = e.currentTarget.files
    for(let i=0;i<files.length;i++){
      if(filetypes.indexOf(files[i].type)<0)
      {
        if(isError===true){
          message.info("图片格式错误，请重新选择。");
          isError=false
        }
        $("#upload").val("");
        return false;  
      }
    }
    for(let i=0;i<files.length;i++){
      if(files[i].size/1024>filemaxsize){
        if(isOver===true){
          message.info("所选择的图片超过1M,请重新选择。");
          isOver=false
        }
        $("#upload").val("");
        return false;
      }
      const reader = new FileReader()
      const file = files[i]
      reader.readAsDataURL(file)
      reader.onload = function (event) {
        const url = event.target.result
        file.url = url
        if(pictureList!==[]){
          for(let m=0;m<pictureList.length;m++)
          {
            if(file.name===pictureList[m].name){
              if(isSame===true){
                message.info("已选择该图片。");
                 isSame=false
              }
              return false
            }
          }
        }
        _this.setState(({ pictureList }) => ({
          pictureList: [...pictureList, file],
        }))
      }
    }
    $("#upload").val("");
  }

  deletePicture = (i) => {
    this.setState(({ pictureList }) => {
      // const index = pictureList.indexOf(file);
      const newFileList = pictureList.slice();
      newFileList.splice(i, 1);
      return {
        pictureList: newFileList,
      };
    });
  }

  getHeightShow = (e) =>{
    const image = new Image();
    image.src = e.target.src;
    const w = 90;const h = 60;
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
          e.target.style.width ='90px';
          reH=w * (image.height / image.width);
          e.target.style.height = `${reH }px` ;  
        }
        else
        {
          reW=h * (image.width / image.height);
          e.target.style.height='60px';
          e.target.style.width = `${reW }px` ;  
          reH=h;
        }
    e.target.style.display = 'inline-block';
  }

  similarstyle =(similar,e)=>{
      if(similar>=0.9){
       return styles.similarstyle_r;
      }else if(similar<=0.8){
        return styles.similarstyle_b;
      }else{
        return styles.similarstyle_y;
      }
  }

  imgchlick=(img)=>{
    this.setState({
      visible:true,
      imgfile: img.target.src,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    },()=>{
      $("#picture_b").src="";
   });
  
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    },()=>{
       $("#picture_b").src="";
    });
   
  }

  changeSort = (e) => {
    // console.log(e.target)
    if (e.target.id === 'similar') {
      this.setState((state) => ({
        issimilardown: !state.issimilardown,
      }))
      console.log(this.state.issimilardown);
      this.state.issimilardown ? this.downsimilar() : this.upsimilar()
    } else if (e.target.id === '_time') {
      this.setState((state) => ({
        istimedown: !state.istimedown,
      }))
      this.state.istimedown ? this.downtime() : this.uptime()
    }
  }

  upsimilar=()=>{
    // 隐藏升序按钮显示降序按钮，降序排列
    this.setState({
      sorttype: 'score',
      isascendingorder:false,
    },()=>{
      this.search();
    });
    const down=document.getElementById('down1');
    const up=document.getElementById('up1');
    up.style.display='none';
    down.style.display='inline-block';
  }

  downsimilar=()=>{
    // 隐藏降序按钮，显示升序按钮，升序排列
    this.setState({
      sorttype: 'score',
      isascendingorder:true,
    },()=>{
      this.search();
    });
    const down=document.getElementById('down1');
    const up=document.getElementById('up1');
    down.style.display='none';
    up.style.display='inline-block';
  }

  uptime=()=>{
    const down=document.getElementById('down2');
    const up=document.getElementById('up2');
    up.style.display='none';
    down.style.display='inline-block';
    this.setState({
      sorttype: 'capturedTime',
      isascendingorder:false,
    },()=>{
      this.search();
    });
  }

  downtime=()=>{
    const down=document.getElementById('down2');
    const up=document.getElementById('up2');
    down.style.display='none';
    up.style.display='inline-block';
    this.setState({
      sorttype: 'capturedTime',
      isascendingorder:true,
    },()=>{
      this.search();
    });
  }

  selecttime=(e)=>{
    // console.log(e.target.value)
    const myDate = new Date();
    const start = new Date();
    let endtime =0;
    const starttime=0;
    if(e.target.value==='a'){
       endtime =myDate;
       start.setDate(start.getDate()-1)
       this.setState({
        startValue:start.getTime(),
        endValue:endtime.getTime(),
        dayRadio:'a',
      });

    }else if(e.target.value==='b'){
      endtime =myDate;
       start.setDate(start.getDate()-7)
       this.setState({
        startValue:start.getTime(),
        endValue:endtime.getTime(),
        dayRadio:'b',
     });
    }else if(e.target.value==='c'){
      endtime =myDate;
       start.setDate(start.getDate()-30)
       this.setState({
        startValue:start.getTime(),
        endValue:endtime.getTime(),
        dayRadio:'c',
       });
    }
    setTimeout(()=>{
    console.log(moment(this.state.startValue).format())
    },100)
  }

  onhandlefilterVisibleChange = (e)=>{
    this.setState({filterVisible:e})
  }

  getSelectNone = (nodes) =>{
    this.setState({
      tollgatelist: nodes,
    })
  }

  getCheckName = (name) =>{
    console.log(name)
  }

  returnback=()=>{
    message.info("开发中，本期暂不提供该功能")
  }

  trail=()=>{
    message.info("开发中，本期暂不提供该功能")
  }

  push=()=>{
    message.info("开发中，本期暂不提供该功能")
  }

  videoshow=(obj)=>{
    // message.info("开发中，本期暂不提供该功能")
    console.log(obj)
    const json = {};
    json.imgsrc = obj.image;
    
    this.setState({
      modalsStatus:true,
      indexInfo:json,
    })
  }

  closeModal=()=>{
    this.setState({
      modalsStatus:false,
    })
  }

  componentWillReceiveProps(nextProps){
    const {pagesize} = this.state;
    const { personnelRetrievaIO, personnelControl } = nextProps;
    if(personnelRetrievaIO && personnelRetrievaIO.listResult !==undefined ){
      if(personnelRetrievaIO.listResult.code ===1){
        listCount=personnelRetrievaIO.listResult.totalCount;
        const page = personnelRetrievaIO.listResult.currentPage-1
        this.setState({
          listCount,
          listPage:personnelRetrievaIO.listResult.listPage,
        });
        if(personnelRetrievaIO.listResult.data){
          listData=personnelRetrievaIO.listResult.data;
          listData.map((item,i) => {
            return item.ide= page * pagesize + i + 1
          })
          this.initCheckList(listData)
        }else{
          message.info("输入条件内无数据，请重新确认！")
        }
        personnelRetrievaIO.listResult={}
        //listData=[];
      }else if(personnelRetrievaIO.listResult.code ===0){
        listData=[];
        listCount=0;
        message.info("输入条件内无数据，请重新确认！")
        personnelRetrievaIO.listResult={}
      }
    }
    // if(personnelRetrievaIO && personnelRetrievaIO.tollgatelistResult !==undefined ){
    //   if(personnelRetrievaIO.tollgatelistResult.code ===1 ){
    //     for(let i=0;i<personnelRetrievaIO.tollgatelistResult.data.length;i++){
    //         const toll=mapObj.get(personnelRetrievaIO.tollgatelistResult.data[i]);
    //         const tollkey=personnelRetrievaIO.tollgatelistResult.data[i];
    //         const list=[{tollkey,toll}]
    //         this.setState(({ tolllist }) => ({
    //           tolllist: [...tolllist,...list],
    //         }))
    //       }
    //     } 
    //   personnelRetrievaIO.tollgatelistResul = {}
    //   }
      // if(personnelRetrievaIO && personnelRetrievaIO.tollgatelistlineResult !==undefined ){
      //   if(personnelRetrievaIO.tollgatelistlineResult.code ===1 ){
      //     this.setState({
      //       tolltwolist: [...personnelRetrievaIO.tollgatelistlineResult.data],
      //     })
      //   } 
      //   personnelRetrievaIO.tollgatelistlineResult = {}
      // }

      
      if(personnelControl.tollgatelistResult !==undefined ){
        if(personnelControl.tollgatelistResult.code ===1){
          const data = personnelControl.tollgatelistResult.data
          if(data != null){
            treeDow = (<ListTree defaultWord="请选择卡口" width="26%" treeData={data} getSelectNone={this.getSelectNone} getCheckName={this.getCheckName} />)
          }
        }
        personnelControl.tollgatelistResult = {}
      }
  }

  render() {
    const {startValue,endValue, pictureList,visible,similar,imgfile,defaultpage,listPage} = this.state;
    const width = window.innerWidth -234;
    const filterPannel = (
      <div className={styles.filterPanel} style={{marginLeft:'-12px',width:`${width}px`}}>
        <span style={{color:'gray'}}>开发中，本期暂不提供该功能</span>
      </div>)
    const operations =  ( 
      <div>
        <Button className={styles.trailbtn} onClick={this.trail}> 
          <i className={styles.trail} alt=" " />
          <span className={styles.trailspan}>轨迹</span>
        </Button> 
        <Button className={styles.trailbtn} onClick={this.push}> 
          <Icon type="download" />
          <span className={styles.trailspan}>导出</span>
        </Button>
      </div>
                        );
    const tab2=  <Icon type="bars" style={{fontSize:16}} />
    const tab1=  <Icon type="appstore-o" style={{fontSize:16}} />
    return (
      <div style={{ background:'#f0f2f5',height:'96%'}}>
        <ContentHeader contentTitle='以脸搜脸'/>
        <div className={styles.searchcondition}>
          <div className={styles.content}>
            <div className={styles.conditiontitle}>
              <div className={styles.blue} />
              <span>检索条件</span>
            </div>
            <div style={{ width: '100%' }}>
              <div className={styles.addbtn}>
                <div style={{display:'inline-block',position:'relative',top:'-30px'}}>
                  <span className={styles.uploadtext}>图片选择 </span>
                  {/* <span className={styles.spanline_redl}>*</span> */}
                  <div style={{color:'red',fontSize:12}}>(大小不超过1M)</div>
                </div>
                <div className={styles.imageflow}> 
                  {pictureList.map((item,i) => (
                    <div className={styles.picturebox}>
                      <li className={styles.picture_li}>
                        <img alt="11" id={item.name} style={{display:'none'}} src={item.url} className={styles.image} onLoad={this.getHeightShow} />      
                      </li>
                      <Icon type="close-circle" className={styles.image_icon} onClick={item =>this.deletePicture(i)} />  
                    </div>  
                  ))
                  }
                </div>
                <div style={{display:'inline-block'}}>
                  <input
                    className={styles.input}
                    multiple="multiple"
                    type="file"
                    id="upload"
                    onChange={this.Upload}
                  /> <Icon className={styles.add} type="plus-square-o" />
                </div>
                <div className={styles.option}>
                  <Button className={styles.searchbtn} onClick={this.search}><Icon type="search" />搜索</Button>
                </div>
              </div>
              <div className={styles.search}>
                <div style={{ marginBottom: '20px' }}>
                  <div>              
                    <span className={styles.spanline}>时间</span>
                    <span className={styles.spanline_redl}>*</span>
                    <div style={{  marginLeft:'35PX',display:'inline-block'}}>
                      <Radio.Group defaultValue={this.state.dayRadio} buttonStyle="solid" style={{display:'inline-bl'}} value={this.state.dayRadio} onChange={(e)=>this.selecttime(e)}>
                        <Radio.Button value="a">近1天</Radio.Button>
                        <Radio.Button value="b">近7天</Radio.Button>
                        <Radio.Button value="c">近30天</Radio.Button>
                      </Radio.Group>
                      <DateInput
                        maxDate={new Date(this.state.endValue)}
                        minDate={new Date(this.state.startValue)}
                        endValue={new Date(this.state.endValue)}
                        startValue={new Date(this.state.startValue)}
                        defaultEndValue={new Date(endValue)}
                        defaultStartValue={new Date(startValue)}
                        className={styles.carDate}
                        onhandleStartDateChange={(e,state)=>this.onhandleDateChange(e,'startValue')}
                        onhandleEndDateChange={(e,state)=>this.onhandleDateChange(e,'endValue')}
                      />
                    </div>
                    <div style={{height:45,marginTop:20}}>
                      <div style={{marginRight:35,float:'left',position:'relative',top:7,display:'inline-block'}}>
                        <span className={styles.spanline}>卡口</span>
                        <span className={styles.spanline_redl}>*</span>
                      </div>
                      {treeDow}
                      <div style={{display:'inline-block', width: '65%',position: 'relative',top: '-12px'}}>
                        <span className={styles.spanline} style={pictureList.length===0?{color:"#bfbfbf",marginLeft:50}:{color:"black",marginLeft:50}}>结果数量</span>
                        <span style={pictureList.length===0? {display:'none'}:{display:'inline-block'}} className={styles.spanline_redl}>*</span>
                        <Input className={styles.inputPic} placeholder="图片数量上限10000" style={pictureList.length===0? {marginLeft:'36px'}:{marginLeft:'30px'}} disabled={pictureList.length===0} defaultValue={pictureList.length !=0 ? 20:''} id="topk"  />
                        <span className={styles.spanline} style={pictureList.length===0?{color:"#bfbfbf",marginLeft:50}:{color:"black",marginLeft:50}}>相似度</span>
                        <span style={pictureList.length===0? {display:'none'}:{display:'inline-block'}} className={styles.spanline_redl}>*</span>
                        <Slider style={pictureList.length===0? {marginLeft:'36px'}:{marginLeft:'30px'}} value={pictureList.length===0?0:similar} disabled={pictureList.length===0} className={styles.slider} onmouseover={formatter} tipFormatter={formatter} onChange={this.onchangesimilar} />
                        <span style={{position:'relative', left:"10px"}}>{pictureList.length===0?0:similar}%</span> 
                      </div>
                    </div>
                    <div style={{marginLeft:'45%'}}>                    
                      <Dropdown 
                        visible={this.state.filterVisible} 
                        className={styles.filterDropdown} 
                        overlay={filterPannel} 
                        trigger={['click']}
                        placement='bottomCenter'
                        onVisibleChange={this.onhandlefilterVisibleChange}
                      >
                        <a href="javascript:void(0)">
                          高级检索条件 <Icon type="down" />
                        </a>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.searchresult}>
          <div className={styles.content}>
            <div className={styles.conditiontitle}>
              <div className={styles.blue} />
              <span>检索结果</span>
            </div>
            <div className={styles.resultlist}>
              <Tabs onTabClick={this.tab} tabBarExtraContent={operations} type="card" tabBarStyle={{height:'40px'}}>
                <TabPane tab={tab1} key="1">
                  <List
                    style={{ margin: '0px 10px',height:'88%',minHeight:366 }}
                    grid={{ gutter: 20, column: 4}}
                    dataSource={listData}
                    renderItem={(item,index) => (
                      <Item key={item.ide} className={styles.item_div0} style={{ border: '1px solid #d9d9d9', borderRadius: '4px', margin: '4px 4px 0 4px',padding: 0 }}>
                        <span className={styles.span_id}>{index+1+(defaultpage-1)*12}</span>
                        <img alt="example" src={this.imageUrl+item.image} style={{float: 'left', height: 105, width: 130, margin: 5 }} />
                        <div style={{ float: 'left', margin: 5,fontSize:'12px',width:'50%' }}>
                          <div style={{ marginBottom: 5 }}>相似度：<span style={{ color: 'red' }}>{`${Number(item.score*100).toFixed(2)}%`}</span></div>
                          <div style={{ marginBottom: 5 }}>摄像头：<span>  {item.vmsdevicename}</span></div>
                          <div style={{ marginBottom: 5 }}>抓拍时间：<span> {moment(item.capturedTime).format("YYYY-MM-DD HH:mm:ss")}</span></div>
                          <div>详情：
                            <Popover content={
                              <div className={styles.tipsContent}>
                                <div><span style={{color:'#2080da',paddingLeft:10}}>性别：</span>{item.faceAttributes.gender}</div>
                                <div><span style={{color:'#2080da',paddingLeft:10}}>年龄：</span>{item.faceAttributes.age}</div>
                                <div><span style={{color:'#2080da',paddingLeft:10}}>胡须：</span>{item.faceAttributes.beard}</div>
                                <div><span style={{color:'#2080da',paddingLeft:10}}>肤色：</span>{item.faceAttributes.race}</div>
                                <div><span style={{color:'#2080da',paddingLeft:10}}>眼镜：</span>{item.faceAttributes.glasses}</div>
                                <div><span style={{color:'#2080da',paddingLeft:10}}>面具：</span>{item.faceAttributes.mask}</div>
                              </div>
                            }
                            >
                              <Icon type="wallet" style={{ fontSize: 16, color: '#2080da',cursor:'pointer' }} onClick={(obj)=>this.videoshow(item)} />
                            </Popover>
                          </div>
                        </div>            
                      </Item>
                      )}
                  />
                  {/* <div style={{ position: 'relative', display: 'flex', float:'right',margin:'10px 0' }}>
                    <div className={styles.itemRenderFirst} onClick={this.toFirst} style={{ display: this.state.listCount > 12 ? 'block' : 'none' }}>首页</div>
                    <Pagination
                      defaultCurrent={1}
                      defaultPageSize={12}
                      current={defaultpage}
                      showQuickJumper
                      hideOnSinglePage
                      total={this.state.listCount}
                      onChange={this.listOnChange}
                    />
                    <div className={styles.itemRenderLast} onClick={() => this.toLast(12)} style={{ display: this.state.listCount > 12 ? 'block' : 'none' }}>尾页</div>
                  </div>          */}
                  <Pagenation 
                    pagStyle={{float: 'right',display: 'flex', position: 'relative', margin:'10px 0'}}
                    firstStyle={{display: this.state.listCount > 12 ? 'block' : 'none'}}
                    toFirst={this.toFirst}
                    toLast={()=>this.toLast(12)}
                    defaultCurrent={1}
                    defaultPageSize={12}
                    currentPage={defaultpage}
                    totlePage={this.state.listCount}
                    listOnChange={this.listOnChange}
                  />
                </TabPane>
                <TabPane tab={tab2} key="2">     
                  <div className={styles.listheight_retrieva} style={{ margin: '0px 10px',height:'88%',minHeight:366 }}>
                    <List 
                      header={
                        <div className={styles.listtitle}>
                          <div className={styles.listline} style={{ width: '10%' }}>
                            <Checkbox checked={this.state.checkAllState} onChange={(e)=>this.changeCheckAll(e)} />
                          </div>
                          <div className={styles.listline} style={{ width: '10%' }}>
                        序号 
                          </div>
                          <div className={styles.listline} style={{ width: '15%' }}>
                        结果图片
                          </div>
                          <div className={styles.listline} style={{ width: '15%' }} id="similar" onClick={this.changeSort}>
                        相似度
                            <Icon type="caret-up" id="up1" ref="up1" style={{display: 'none',marginLeft: '5px',fontSize: 12, cursor: 'pointer'}} />
                            <Icon type="caret-down" id="down1" ref="down1" style={{marginLeft: '5px',fontSize: 12, cursor: 'pointer'}} />
                          </div>
                          <div className={styles.listline} style={{ width: '20%' }}>
                        摄像头
                          </div>
                          <div className={styles.listline} style={{ width: '20%' }} id="_time" onClick={this.changeSort}>
                        抓拍时间
                            <Icon type="caret-up" id="up2" style={{display:'none',marginLeft: '5px',fontSize: 12, cursor: 'pointer'}} />
                            <Icon type="caret-down" id="down2" style={{marginLeft: '5px',fontSize: 12, cursor: 'pointer'}} />
                          </div>
                          <div className={styles.listline} style={{ width: '10%' }}>
                        来源视频
                          </div>
                        </div>}
                      itemLayout="vertical"
                      size="small"
                      dataSource={listData}
                      renderItem={item => (
                        <List.Item
                          key={item.ide}
                        >
                          <div className={`${item.ide%2 ===0?`${styles.item_div0}`:`${styles.item_div1}`}`}>
                            <div className={styles.listline2} style={{ width: '10%' }}>
                              <Checkbox 
                                checked={this.state.checkList[item.ide] ? this.state.checkList[item.ide].checkState : false}
                                onChange={(e)=>this.changeCheck(e, item.ide)}
                              />
                            </div>
                            <div className={styles.listline2} style={{ width: '10%' }}>
                              {item.ide}
                            </div>
                            <div className={styles.listline2} style={{ width: '15%' }}>
                              <img src={this.imageUrl+item.image} alt=" " onClick={item=>this.imgchlick(item)} className={styles.image1} />
                            </div>
                            <div className={styles.listline2} style={{ width: '15%' }}>
                              <div className={this.similarstyle(item.score)}><span>{`${Number(item.score*100).toFixed(2)}%`}</span></div>
                            </div>
                            <div className={styles.listline2} style={{ width: '20%' }}>
                              {item.vmsdevicename}
                            </div>
                            <div className={styles.listline2} style={{ width: '20%' }}>
                              {moment(item.capturedTime).format("YYYY-MM-DD HH:mm:ss")}
                            </div>
                            <div className={styles.listline2} style={{ width: '10%' }}>
                              <i className={styles.video} alt=" " onClick={this.videoshow} /> 
                            </div>
                          </div>
                        </List.Item>
                    )}
                    />
                  </div> 
                  {/* <div style={{ position: 'relative', display: 'flex', float:'right',margin:'10px 0' }}>
                    <div className={styles.itemRenderFirst} onClick={this.toFirst} style={{ display: this.state.listCount > 4 ? 'block' : 'none' }}>首页</div>
                    <Pagination
                      defaultCurrent={1}
                      defaultPageSize={4}
                      hideOnSinglePage
                      current={defaultpage}
                      showQuickJumper
                      total={this.state.listCount}
                      onChange={this.listOnChange}
                    />
                    <div className={styles.itemRenderLast} onClick={() => this.toLast(4)} style={{ display: this.state.listCount > 4 ? 'block' : 'none' }}>尾页</div>
                  </div>                          */}
                  <Pagenation 
                    pagStyle={{float: 'right',display: 'flex', position: 'relative', margin:'10px 0'}}
                    firstStyle={{display: this.state.listCount > 4 ? 'block' : 'none'}}
                    toFirst={this.toFirst}
                    toLast={()=>this.toLast(4)}
                    defaultCurrent={1}
                    defaultPageSize={4}
                    currentPage={defaultpage}
                    totlePage={this.state.listCount}
                    listOnChange={this.listOnChange}
                  />
                </TabPane>
              </Tabs>
            </div>
            <Modal
              title="图片"
              visible={visible}
              onOk={this.handleOk}
              destroyOnClose
              onCancel={this.handleCancel}
            >
              <img id="picture_b" src={imgfile} style={{width:'470px'}} alt=" " />
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}
