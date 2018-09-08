import React, { PureComponent } from 'react';
import {Row,Col  , Icon, Button, Input, Select, List, Checkbox, Pagination ,Dropdown  ,Radio, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import $ from 'jquery'; 
import DateInput from 'components/DateInput';
import ListTree from 'components/ListTree'
import style from './CarSearch.less';
import ContentHeader from 'components/ContentHeader'

const Search = Input.Search
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
let listCount = 3;
let currentPage = 1;

@connect(({ carSearch }) => ({
  carSearch,
}))
@connect(({ personnelControl, loading }) => ({
  personnelControl,
  loading: loading.models.personnelControl,
}))
export default class CarSearch extends PureComponent {
  constructor() {
    super();
    this.state = {
        carNum:'',
        carTime:[],
        carArea:null,
        endValue: new Date().getTime(),
        startValue: new Date().getTime()-3600*1000*24,
        wrongLicense:{
          opacity: 0,
        },
        showMore:{
          display:'none',
        },
        groupDis:false,
        resultType:[
          {label:'车辆标志',value:'motorvehicleid'},
          {label:'近景照片',value:'storageurlcloseshot'},
          {label:'远景照片',value:'storageurldistantshot'},
          {label:'车牌号',value:'plateno'},
          {label:'摄像头名称',value:'vmsdevicename'},
          {label:'车辆型号',value:'vehiclemodel'},
          {label:'车身颜色',value:'vehiclecolor'},
          {label:'经过时刻',value:'passtime',icon:'caret-down'},
          {label:'行驶速度',value:'speed'},
          {label:'车牌颜色',value:'platecolor'},
          {label:'设备编码',value:'deviceid'},
          {label:'车牌照片',value:'storageurlplate'},
          {label:'合成图',value:'storageurlcompound'},
          {label:'缩略图',value:'storageurlbreviary'},
          {label:'车道号',value:'laneno'},
          {label:'有无车牌',value:'hasplate'},
          {label:'号牌种类',value:'plateclass'},
          {label:'行驶方向',value:'direction'},
          {label:'行驶状态',value:'drivingstatuscode'},
          {label:'车辆类型',value:'vehicleclass'},
          {label:'车辆品牌',value:'vehiclebrand'},
          {label:'车辆年款',value:'vehiclestyles'},
          {label:'颜色深浅',value:'vehiclecolordepth'},
          {label:'号牌识别可信度',value:'platereliability'},
          {label:'每位号牌码可信度',value:'platecharreliability'},
          {label:'品牌标志识别可信度',value:'brandreliability',icon:'caret-down'},
        ],
        showType:[
          'motorvehicleid',
          'storageurlcloseshot',
          'storageurldistantshot',
          'plateno',
          'vmsdevicename',
          'vehiclemodel',
          'vehiclecolor',
          'passtime',
        ],
        resultlist:[],
        page:1,
        sort:{name:'passtime',value:'asc'},
        visible:false,
        listCount:'',
        filterVisible:false,
        positionRight:0,
        tollgatelist: [],
        checkList: {},
        checkedArr:[],
        checkAllState: false,
        fullTextSearch:'',
        radioVlaue:'',
    }
    this.state.tabelShowType = [...this.state.showType];
  }

  imageUrl = window.SSystem.imageUrl ||  '';

  pageSize = 6;
  
  search = () => {// 搜索按钮点击事件
      if(this.state.carNum.length === 0 ){message.info('输入车牌有误');return ;}
      this.setState({page:1, tabelShowType:[...this.state.showType], sort:{name:'passtime',value:'asc'}},()=>{
      this.pageChange(this.state.page,this.pageSize);
    });
  }

  // 日期选择
  onhandleDateChange = (state)=>(e)=>{
   if(e){
    this.setState({[state]:e})
   }
  }

  componentDidMount(){
    window.document.title ='车辆检索';
    this.setState({
      resultlist:[]
    })
    const self=this;
    if(this.refs.list){
      $(`.${this.refs.list.props.className}`).on('scroll',function(){
        self.setState({positionRight:-$(this).scrollLeft()})
      })
    }
    this.props.dispatch({
      type: 'personnelControl/queryTollgateList',
      payload: {
        treeType: '0,1',
        deviceType: '5',
      },
    })
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
  }
  
//   componentWillUnmount(){
//     if(this.refs.list){
//       $('.'+this.refs.list.props.className).unbind('scroll');
//     }
//   }

// componentWillUpdate(){
//   if(this.refs.list){
//     $('.'+this.refs.list.props.className).unbind('scroll');
//   }
// }

  componentDidUpdate(){
    const self=this;
    if(this.refs.list){
      $(`.${this.refs.list.props.className}`).on('scroll',function(){
        self.setState({positionRight:-$(this).scrollLeft()})
      })
    }
  }

  pageChange = (page,pageSize) =>{// 改变页码
    this.setState(
      { page,
        checkAllState:false,// 当前版本临时处理，非最终需求
      }
    );
    const tollgatelist = this.state.tollgatelist
    if(tollgatelist.length<=0){
      return message.info('请选择过车区域！');
    }
    const payload = {
      plateno:this.state.carNum,
      starttime:this.state.startValue ||  new Date(new Date().getTime()-365*24*3600*1000).getTime(),
      endtime: this.state.endValue || null,
      region: this.state.tollgatelist,
      page,
      size:pageSize,
      sort:this.state.sort,
      groups:this.state.showType,
      fullTextSearch:this.state.fullTextSearch,
    }

    this.props.dispatch({
      type: 'carSearch/search' ,
      payload:JSON.stringify(payload),
    })
  }

  getSelectNone = (nodes) =>{
    this.setState({
      tollgatelist: nodes,
    })
  }

  getCheckName = (name) =>{
    // console.log(name)
  }

  toFirst = () => {
    if (this.state.page !== 1) {
      this.setState({
        page: 1,
      })
      this.pageChange(1, 6);
    }
  }

  toLast = () => {
    console.log(this.state.listCount, 'listcount');
    const lastpagenum = Math.ceil(parseInt(this.state.listCount) / 6);
    if (this.state.page !== lastpagenum) {
      this.setState({
        page: lastpagenum,
      })
      this.pageChange(lastpagenum, 6);
    }
  }

  clickMore = () =>{
    if(this.state.showMore.display==='none'){
      this.setState({
        showMore:{
          display:'block',
        },
      })
    }else{
      this.setState({
        showMore:{
          display:'none',
        },
      })
    }
  }

  License  = (str) => {// 判断车牌号的正则
    return str.length !== 0 && /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{0,1}[A-Z]{0,1}[A-Z0-9]{0,7}$)/.test(str);
  }

  handleChange = (value) =>{
  
    if (this.License(value)) {
      this.setState({
        wrongLicense:{
          opacity:0,
        },
        carNum:value,
      })
     }else{
    //  message.info('输入车牌有误');
      this.setState({
        wrongLicense:{
          opacity:1,
        },
        carNum:'',
      })
    }
  }

  timeSelectChange = (value,dateString) =>{
    // console.log(moment(dateString[0]).valueOf())
    this.setState({
      carTime:[
        moment(dateString[0]).valueOf(),
        moment(dateString[1]).valueOf(),
      ],
    })
  }

  areaSelectChange = (e) =>{
    this.setState({
        carArea: e,
    })
  }

  checkedType = (e) =>{
    this.setState({
      showType: e,
      page:1,
    })
    setTimeout(()=>{
      console.log(this.state.showType)
    },100)
  }

  showType =(str) =>{
    for(let i = 0; i < this.state.tabelShowType.length; i ++){
      if (str == this.state.tabelShowType[i]) {
        return true
      }
    }
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
 
  onhandleVisibleChange = (e)=>{
    console.log(e)
    this.setState({visible:e})
  }

  onhandlefilterVisibleChange = (e)=>{
    this.setState({filterVisible:e})
  }

  // 排序
  onhandleSortChange = (item) =>(e)=>{
    const newItem = {...item};
    const {resultType} = this.state;
    newItem.icon = item.icon == 'caret-up'?'caret-down':'caret-up';
    this.setState({
      resultType:resultType.map(i=>i==item?newItem:i),
      sort:{name:item.value,value: item.icon == 'caret-up'?'desc':'asc'},
      page:1,
    },function(){
      this.pageChange(1,this.pageSize);
    });

  }

  // returnback=()=>{
  //   message.info("开发中，本期暂不提供该功能")
  // }

  onhandleRadioChange =(e)=>{
     const val = e.target.value ;
     const {resultType ,  showType} = this.state;
     this.setState({
      radioVlaue:val
     })
      if(val==1){
         this.setState({showType:resultType.map(item=>item.value)});
      }
      if(val==2){
        this.setState({showType:resultType.map(item=>item.value).filter(item=>!~showType.indexOf(item))});
      }
  }

  push=()=>{
    const payload = JSON.stringify({
      title:['车辆标志','近景照片'],
    //  rows: ['motorvehicleid','storageurlcloseshot'],
      fileName:'123',
      viidCarReqDTO:{
        plateno:this.state.carNum,
        endtime:this.state.endValue ,
        starttime:this.state.startValue,
        region:this.state.tollgatelist,
        sort:this.state.sort,
        groups:this.state.showType,
        fullTextSearch:this.state.fullTextSearch,
      },
    })
    this.props.dispatch({
      type: 'carSearch/exportTable',
      payload,
    })
    message.info("开发中，本期暂不提供该功能")
  }

  initCheckList = (list) => {
    const checkList = {}
    list.forEach((item,index) => {
      checkList[item.recordid] = {checkState: false}
    });
    return checkList ;
   // this.setState({'checkList' : checkList})
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
    const checkList = {...this.state.checkList}
    for(const id in checkList){
      checkList[id].checkState = state
    }
    this.setState(
      {'checkList' : checkList,
        'checkAllState' : state,
      }
    );
  }

  componentWillReceiveProps(nextProps){
    const {carSearch,personnelControl} = nextProps;
    let totalCount; let checkList ;
    console.log(this.props);
    if(carSearch.searchResult && carSearch.searchResult.totalCount){
      totalCount = carSearch.searchResult.totalCount;
      if(carSearch.searchResult.data){
        checkList =  this.initCheckList(JSON.parse(carSearch.searchResult.data));
      }
      this.setState({
        listCount:totalCount,
        checkList,
      })
    }
    if(personnelControl.tollgatelistResult !==undefined ){
      if(personnelControl.tollgatelistResult.code ===1){
        const data = personnelControl.tollgatelistResult.data
        if(data != null){
          this.setState({
            treeDow :(<ListTree style={{marginTop:10}} width="300px" defaultWord="请选择过车区域" treeData={data} getSelectNone={this.getSelectNone} getCheckName={this.getCheckName} />)
          })
          
        }
        nextProps.personnelControl.tollgatelistResult=[];
      }
    }
    let data2;
    if(carSearch&&carSearch.searchResult!=undefined){
      if(carSearch.searchResult.code ===1){
        listCount = carSearch.searchResult.totalCount;
        currentPage = carSearch.searchResult.currentPage;
        console.log(listCount, 'listc');
      }
      if(carSearch.searchResult.data){
       // this.initCheckList(carSearch.searchResult.data)
        try{
          data2 = JSON.parse(carSearch.searchResult.data );
          this.setState({
            resultlist:data2
          })
        }catch(e){
          
        }
      }
    }
  }

  render() {
    const {resultlist, carNum, carTime, sort ,  startValue, endValue} = this.state;
    const {carSearch, personnelControl} = this.props;
    const width = window.innerWidth -40;
    
    
    const showPanel = (
      <div className={style.panel}>
        <div className={style.select}>
          <span className={style.title}>选择条件</span>  
          {/* <RadioGroup className='fr' value={this.state.radioVlaue} onChange={this.onhandleRadioChange}>
            <Radio value={1}>全选</Radio>
            <Radio value={2}>反选</Radio>
          </RadioGroup> */}
        </div>
        <div className={style.typeList}>
          <CheckboxGroup 
            className={style.showMore}
            options={this.state.resultType}   
            value={this.state.showType}
            onChange={(e)=>this.checkedType(e)}
            disabled={this.state.groupDis}
          />
        </div>
      </div>
);

    const filterPannel = (
      <div className={style.filterPanel} style={{width:`${width}px`}}>
        {/* <Row>
          <Col span={11}>
            <Row gutter={16}>
              <Col span={5}>车身颜色：</Col>
              <Col span={6}>红</Col>
              <Col span={6}>黄</Col>
              <Col span={6}>南</Col>
            </Row>
          </Col>
          <Col span={11} offset={2}>
            <Row gutter={16}>
              <Col span={5}>车辆类型：</Col>
              <Col span={6}>轿车</Col>
              <Col span={6}>SUV</Col>
              <Col span={6}>面包车</Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Row gutter={16}>
              <Col span={5}>车身颜色：</Col>
              <Col span={6}>红</Col>
              <Col span={6}>黄</Col>
              <Col span={6}>南</Col>
            </Row>
          </Col>
          <Col span={11} offset={2}>
            <Row gutter={16}>
              <Col span={5}>车辆类型：</Col>
              <Col span={6}>轿车</Col>
              <Col span={6}>SUV</Col>
              <Col span={6}>面包车</Col>
            </Row>
          </Col>
        </Row> */}
        <span style={{color:'gray'}}>开发中，本期暂不提供该功能</span>
      </div>
)

    return (
      <div style={{height: '100%'}}>
        <ContentHeader contentTitle='车辆检索'/>
        <div className={style.searchCondition}>
          <div className={style.searchCondition_title}>
            <div className={style.blue} />
            <span>检索条件</span>
          </div>
          <div className={style.searchCondition_content}>
            <div className={style.carNum}>
              <span>车牌号</span><span style={{color:'red',marginLeft:5}}>*</span>
              <Input 
                className={style.antinput} 
                required 
                placeholder="示例:渝A00001" 
                onBlur={(e)=>this.handleChange(e.target.value)}
              />
            </div>
            <div className={style.carTime}>
              <span>过车时段</span><span style={{color:'red',marginLeft:5}}>*</span>
              <DateInput
                className={style.carDate}
                defaultStartValue={new Date(startValue)}
                defaultEndValue={new Date(endValue)}
                onhandleStartDateChange={this.onhandleDateChange('startValue')}
                onhandleEndDateChange={this.onhandleDateChange('endValue')}
                maxDate={new Date(endValue)}
                minDate={new Date(startValue)}
              />
            </div>
            <div className={style.carArea}>
              <div style={{float:'left',marginRight:20}}>
                <span>过车区域</span><span style={{color:'red',marginLeft:5}}>*</span>
              </div>
              {this.state.treeDow}
            </div>
            <Dropdown 
              visible={this.state.visible} 
              overlay={showPanel} 
              className={style.selectinfo} 
              trigger={['click']} 
              placement='bottomCenter'
              onVisibleChange={this.onhandleVisibleChange}
            >
              <a href="javascript:void(0)">
                显示信息选择 <Icon type="plus-square-o" />
              </a>
            </Dropdown>
            <div className={style.carSearch}>
              <Button className={style.searchbtn} onClick={this.search}><Icon type="search" />搜索</Button>
            </div>
          </div>
          <Row>
            <Col offset={10} span={4} className={style.heightFilter}>
              <Dropdown 
                visible={this.state.filterVisible} 
                className={style.filterDropdown} 
                overlay={filterPannel} 
                trigger={['click']}
                placement='bottomCenter'
                onVisibleChange={this.onhandlefilterVisibleChange}
              >
                <a href="javascript:void(0)">
                高级检索条件 <Icon type="down" />
                </a>
              </Dropdown>
            </Col>
          </Row>
        </div>
        <div className={style.result}>
          <div className={style.searchCondition_title}>
            <div className={style.blue} />
            <span>检索结果</span>
          </div>
          <div className={style.iconButton}>
            <div className={style.iconActive}><Icon type="bars" className={style.icontype} style={{fontSize:'24px'}} /></div>
            <div className={style.iconNoActive}><Icon type="appstore-o" className={style.icontype} style={{fontSize:'24px'}} onClick={this.push} /></div>
            <Button type="primary" className={style.download} onClick={this.push}> 
              <Icon type="download" />
              <span className={style.trailspan}>导出</span>
            </Button>
            <Search
              style={{ marginRight: 10, width: 240 ,float:'right'}}
              placeholder="示例:车牌号/车辆型号"
              onChange={(e) =>{this.setState({fullTextSearch:e.target.value})}}
              onSearch={this.search}
              enterButton
            />
          </div>
          <div className={style.listheight_car}>
            <List
              header={
                <div className={style.listtitle}>
                  <span className={style.listline1} style={{ width: '100px'}}>
                    <Checkbox checked={this.state.checkAllState} onChange={(e)=>this.changeCheckAll(e)} />
                    
                  </span>
                  <span className={style.listline1} style={{ width: '108px'}}>序号</span>
                  {
                      this.state.resultType.map(item=>(
                        this.showType(item.value)? (
                          <span
                            className={style.listline1} 
                            onClick={item.icon ?this.onhandleSortChange(item):null} 
                        // style={{ width: '10%',color:sort.name == item.value?'#2080da':'' }}>
                            style={{ width: '180PX'}}
                          >
                            {item.label}{item.icon? <Icon type={item.icon} style={{fontSize: 12}} />:''}
                          </span>
):''
                      ))
                    }
                </div>
            } 
              className={style.boxList} 
              ref='list'
              style={{ overflowX: 'scroll',width:'100%',height:'100%',overflowY:'hidden'}}
              itemLayout="vertical"
              size="small"
              dataSource={this.state.resultlist}
              renderItem={(item,index) => (
                <List.Item
                  className={style.list}
                  key={item.id++}
                >
                  <div className={style.listDate} style={{ width: '100px',display:'inline-block'}}>
                    <Checkbox 
                      checked={this.state.checkList[item.recordid] ? this.state.checkList[item.recordid].checkState : false}
                      onChange={(e)=>this.changeCheck(e, item.recordid)}
                    />
                  </div>
                  <div className={style.listDate} style={{ width: '108px',display:'inline-block'}}>
                    {(this.state.page-1)*6+index+1}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('motorvehicleid')?'inline-block':'none' }}>
                    {item.motorvehicleid || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('storageurlcloseshot')?'inline-block':'none' }}>
                    <img src={this.imageUrl+item.storageurlcloseshot} alt=" " className="image" />
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('storageurldistantshot')?'inline-block':'none' }}>
                    <img src={this.imageUrl+item.storageurldistantshot} alt=" " className="image" />
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('plateno')?'inline-block':'none' }}>
                    {item.plateno || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('vmsdevicename')?'inline-block':'none' }}>
                    {item.vmsdevicename || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('vehiclemodel')?'inline-block':'none' }}>
                    {item.vehiclemodel || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('vehiclecolor')?'inline-block':'none' }}>
                    {item.vehiclecolor || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('passtime')?'inline-block':'none' }}>
                    {moment(item.passtime).format('YYYY-MM-DD HH:mm:ss ')}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('speed')?'inline-block':'none' }}>
                    {item.speed || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('platecolor')?'inline-block':'none' }}>
                    {item.platecolor || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('deviceid')?'inline-block':'none' }}>
                    {item.deviceid || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('storageurlplate')?'inline-block':'none' }}>
                    <img src={item.storageurlplate} alt=" " className="image" />
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('storageurlcompound')?'inline-block':'none' }}>
                    <img src={item.storageurlcompound} alt=" " className="image" />
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('storageurlbreviary')?'inline-block':'none' }}>
                    <img src={item.storageurlbreviary} alt=" " className="image" />
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('laneno')?'inline-block':'none'}}>
                    {item.laneno || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('hasplate')?'inline-block':'none' }}>
                    {item.hasplate || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('plateclass')?'inline-block':'none' }}>
                    {item.plateclass || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('direction')?'inline-block':'none'}}>
                    {item.direction || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('drivingstatuscode')?'inline-block':'none' }}>
                    {item.drivingstatuscode || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('vehicleclass')?'inline-block':'none' }}>
                    {item.vehicleclass || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('vehiclebrand')?'inline-block':'none' }}>
                    {item.vehiclebrand || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('vehiclestyles')?'inline-block':'none' }}>
                    {item.vehiclestyles || <span>&nbsp;</span>}
                  </div>

                  <div className={style.listDate} style={{ width: '180px',display:this.showType('vehiclecolordepth')?'inline-block':'none' }}>
                    {item.vehiclecolordepth || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('platereliability')?'inline-block':'none' }}>
                    {item.platereliability || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('platecharreliability')?'inline-block':'none' }}>
                    {item.platecharreliability || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('brandreliability')?'inline-block':'none' }}>
                    {item.brandreliability || <span>&nbsp;</span>}
                  </div>
                  <div className={style.listDate} style={{ width: '180px',display:this.showType('tollgatename')?'inline-block':'none' }}>
                    {item.tollgate && item.tollgate.name}
                  </div>
                </List.Item>
                )}
            />
          </div>
          <div style={{ right: `${this.state.positionRight}px`,display: 'flex',marginRight: 20,    float: 'right'}}>
            <div className={style.itemRenderFirst} onClick={this.toFirst} style={{ display: this.state.listCount > 6 ? 'block' : 'none' }}>首页</div>
            <Pagination
              style={{right:'30px'}}
              defaultCurrent={currentPage}
              current={this.state.page}
              defaultPageSize={6}
              showQuickJumper
              total={listCount}
              hideOnSinglePage
              pageSize={6}
              onChange={(page,pageSize)=>{this.pageChange(page,pageSize)}}
            />
            <div className={style.itemRenderLast} onClick={this.toLast} style={{ display: this.state.listCount > 6 ? 'block' : 'none' }}>尾页</div>
          </div>
        </div>
      </div>
    )
  }

}