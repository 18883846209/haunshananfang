
/**
 * @flow
 */

import React from 'react';
import { Layout, List, Progress, Pagination,Icon,message,Input,Modal,Popover} from 'antd';
import { connect } from 'dva';
import $ from 'jquery'
import { Link } from 'dva/router';
import styles from './PersonnelControlShow.less';
import Pagenation from 'components/Pagenation';

const Search = Input.Search
let listCount = 4
// let listData = []
// for (let i = 0; i < 3; i++) {
//   listData.push({
//     targetimageuri: '',
//     capturedimageuri: '',
//     capturedimagesimscore: 0.8,
//     title: '123',
//     alarmtime: '2018-08-01 10:00:00',
//     applicantname: '123',
//     capturedimagecamaraid: '123',
//   });
// }

@connect(({ personnelControl, loading }) => ({
  personnelControl,
  loading: loading.models.personnelControl,
}))

export default class PersonnelControlShow extends React.Component {
  state = {
    targetImg: '',
    takeImg: '',
    similar: 80,
    name: '',
    time: '',
    camaraid: '',
    orderFiled: '',
    orderRule: '',
    listPage: 1,
    iscapturedimagesimscoreup: false,
    isalarmtimeup: false,
    iscapturedimagecamaraidup: false,
    listData:[],
    searchKey:'',
    visible: false,
    imgfile: '',
    isFirst: true,
  }

  imageUrl = window.SSystem.imageUrl || '';

  componentDidMount () {
    this.queryDispositionList('','');
    $('#list').show();
    $('#map').hide();
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
  }

  queryDispositionList = (word,rule) => {
    this.props.dispatch({
      type: 'personnelControl/getDispositionList',
      payload: {
        page: this.state.listPage,
        size: 4,
        word,
        rule,
        key: this.state.searchKey,
      },
    })
  }
  searchDispositionList = () => {
    this.props.dispatch({
      type: 'personnelControl/getDispositionList',
      payload: {
        page: 1,
        size: 4,
        word: '',
        rule: '',
        key: this.state.searchKey,
      },
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

  returnback=()=>{
    message.info("开发中，本期暂不提供该功能")
  }

  tabshow=(e)=>{
    if(e==='list'){
      $('#list').show();
      $('#map').hide();
    }else if(e==='map'){
      $('#list').hide();
      $('#map').show();
    }
  }
 
  searchKey=(e)=>{// 绑定搜索值
    const key = e.target.value
    this.setState({searchKey:key},()=>{
      if(key===''){
        this.queryDispositionList('','')
      }
    })
    console.log(e.target.value)
  }

  closeSearch=()=>{// 关闭搜索结果
    const _this = this
    this.setState({searchKey: ''},()=>{
      _this.queryDispositionList('','')
    })

  }
  
  componentWillReceiveProps(nextProps){// props发生变化的时候执行
    // 后台返回搜索数据
    // if (nextProps.personnelControl.getAlarmResult&&nextProps.personnelControl.getAlarmResult.data) {
    //   this.setState({
    //     searchListDate:nextProps.personnelControl.getAlarmResult.data,
    //     searchListCount:nextProps.personnelControl.getAlarmResult.totalCount,
    //     searchListCurrentPage:nextProps.personnelControl.getAlarmResult.currentPage,
    //   })
    //   nextProps.personnelControl.getAlarmResult=[];
    // }

    if(nextProps.personnelControl.dispositionResult !==undefined ){
      if(nextProps.personnelControl.dispositionResult.code ===1){
        listCount = nextProps.personnelControl.dispositionResult.totalCount
        this.setState({
          listCount,
        })
        if(nextProps.personnelControl.dispositionResult.data.length > 0){
          if(this.state.isFirst){
            this.onItemClick(nextProps.personnelControl.dispositionResult.data[0])
          }
          this.setState({
            listData:nextProps.personnelControl.dispositionResult.data,
            isFirst: false,
          })
        }
        nextProps.personnelControl.dispositionResult=[];
      }
    }
  }

  render() {
    const { similar, targetImg, takeImg, name, time, camaraid,imgfile,visible } = this.state
    
    const suffix = this.state.searchKey ? <Icon type="close-circle-o" className={styles.seach_icon} onClick={()=>this.closeSearch()} /> : null
    return (
      <div style={{ height: '100%' }}>
        <Layout style={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%',position:'relative'  }}>
            {/* <div className={styles.title_div}>
              <div className={styles.title_r} onClick={()=>this.tabshow('list')}>列表显示</div>
              <div className={styles.title_l} onClick={()=>this.tabshow('map')}>地图显示</div>
            </div> */}
            <div className={styles.content_div} id="list">
              <div className={styles.conditiontitle}>
                <Link className={styles.showList} to='/execute/personnelControlShow'><span>列表显示</span></Link>
                {/* <img className={styles.boder} src={boder}/> */}
                <Link className={styles.showMap} to='/execute/personnelMap'><span>地图显示</span></Link>
                {/* <img src={boder2} className={styles.boder}/> */}
              </div>
              <div className={styles.goBack} onClick={this.returnback}>
                <i className={styles.return} alt=" " />
                <span>返回上一步</span>
              </div>
              <div style={{ margin: 10,height:'170px',position:'relative',backgroundColor:'#fff' }}>
                <div style={{paddingTop:10,backgroundColor:'#fff',height:170}}>
                  <div className={styles.show_l}>
                    <Progress type="circle" percent={similar} width={100} style={{ margin: 10 }} />
                    <div style={{ marginTop: 10 }}>报警相似度</div>
                  </div>
                  <div className={styles.show_c}>
                    <div style={{ display: "inline-block", marginRight: '5%'}}>
                      <div style={{ display: "inline-block", background: "#d9d9d9",width:'180px',height:'120px' }}>
                        <img src={targetImg} alt=" " className={styles.showpic} onLoad={(e)=>this.getHeightShow(e,180,120)} />
                      </div>
                      <div style={{ marginTop: 10 }}>布控目标图片</div>
                    </div>
                    <div style={{ display: "inline-block"}}>
                      <div style={{ display: "inline-block", background: "#d9d9d9",width:'180px',height:'120px'  }}>
                        <img src={takeImg} alt=" " className={styles.showpic} onLoad={(e)=>this.getHeightShow(e,180,120)} />
                      </div>
                      <div style={{ marginTop: 10 }}>布控抓拍图片</div>
                    </div>
                  </div>
                  <div className={styles.show_r}>
                    <div className={styles.showinfo}>
                      <Icon type='idcard' className={styles.deIcon} />
                      <span>任务名称：</span>
                      <span style={{color: '#000'}}>{name}</span>
                    </div>
                    <div className={styles.showinfo}>
                      <Icon type='clock-circle-o' className={styles.deIcon} />
                      <span>报警时间：</span>
                      <span style={{color: '#000'}}>{time}</span>
                    </div>
                    <div className={styles.showinfo}>
                      <Icon type='environment-o' className={styles.deIcon} />
                      <span>布控范围：</span>
                      <span style={{color: '#000'}}>{camaraid}</span>                      
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.results}>
                <div className={styles.searchTitle}>
                  <div style={{borderBottom:'1px solid #e6d8d8'}}>
                    <div className={styles.blue} />
                    <span>布控结果显示</span>
                  </div>
                </div>
                <div className={styles.search}>
                  <Search
                    style={{ marginLeft: 10, width: 240 }}
                    onSearch={this.searchDispositionList}
                    value={this.state.searchKey}
                    onChange={(e)=>this.searchKey(e)}
                    placeholder='示例:相似度/名称/布控人员'
                    enterButton
                    suffix={suffix}
                  />
                </div> 
                  
                <div>
                  <div className={styles.listheight_controlshow}>
                    <List
                      header={
                        <div className={styles.listtitle}>
                          <div className={styles.listline} style={{ width: '12%' }}>
                              布控目标
                          </div>
                          <div className={styles.listline} style={{ width: '12%' }}>
                              布控抓拍
                          </div>
                          <div className={styles.listline} style={{ width: '10%' }} id="capturedimagesimscore" onClick={() => this.doSort('capturedimagesimscore', this.state.iscapturedimagesimscoreup ? 'desc' : 'asc')}>
                              报警相似度
                            <Icon type="caret-up" id="capturedimagesimscoreup" style={{display:'none',marginLeft: '3px', fontSize: 12, cursor: 'pointer'}} />
                            <Icon type="caret-down" id="capturedimagesimscoredown" style={{marginLeft: '3px', fontSize: 12, cursor: 'pointer'}} />
                          </div>
                          <div className={styles.listline} style={{ width: '12%' }}>
                              布控任务名称
                          </div>
                          <div className={styles.listline} style={{ width: '12%' }}>
                              布控库名称
                          </div>
                          <div className={styles.listline} style={{ width: '16%' }} id="alarmtime" onClick={() => this.doSort('alarmtime', this.state.isalarmtimeup ? 'desc' : 'asc')}>
                              报警时间
                            <Icon type="caret-up" id="alarmtimeup" style={{display:'none',marginLeft: '3px', fontSize: 12, cursor: 'pointer'}} />
                            <Icon type="caret-down" id="alarmtimedown" style={{marginLeft: '3px', fontSize: 12, cursor: 'pointer'}} />
                          </div>
                          <div className={styles.listline} style={{ width: '16%' }} id="capturedimagecamaraid" onClick={() => this.doSort('capturedimagecamaraid', this.state.iscapturedimagecamaraidup ? 'desc' : 'asc')}>
                              布控范围
                            <Icon type="caret-up" id="capturedimagecamaraidup" style={{display:'none',marginLeft: '3px', fontSize: 12, cursor: 'pointer'}} />
                            <Icon type="caret-down" id="capturedimagecamaraiddown" style={{marginLeft: '3px', fontSize: 12, cursor: 'pointer'}} />
                          </div>
                          <div className={styles.listline} style={{ width: '10%' }}>
                              布控人员
                          </div>
                          <div style={{clear:'both'}} />
                        </div>}
                        
                      itemLayout="vertical"
                      size="large"
                      dataSource={this.state.listData}
                      renderItem={item => (
                        <List.Item key={item.title} id={item.id} onClick={() => this.onItemClick(item)}>
                          
                          <div className={styles.listline} style={{ width: '12%', paddingLeft:'3%',height:48 }}>
                            <div className={styles.image_list}>
                              <img src={this.imageUrl+item.targetimageuri} alt=" " style={{display:'none'}} onLoad={(e)=>this.getHeightShow(e,69,47)} />
                            </div>
                          </div>
                          <div className={styles.listline} style={{ width: '12%', paddingLeft:'3%',height:48 }}>
                            <div className={styles.image_list}>
                              <img src={this.imageUrl+item.capturedimageuri} alt=" " style={{display:'none'}} onLoad={(e)=>this.getHeightShow(e,69,47)} onClick={this.imgchlick} />
                            </div>
                          </div>
                          <div className={styles.listline} style={{ width: '10%',height:48 }}>
                            {`${Math.round(item.capturedimagesimscore*100)  }%`}
                          </div>
                          <div className={styles.listline} style={{ width: '12%',height:48  }}>
                            {item.title}
                          </div>
                          <div className={styles.listline} style={{ width: '12%',height:48  }}>
                            {item.namelistlib}
                          </div>
                          <div className={styles.listline} style={{ width: '16%',height:48  }}>
                            {item.alarmtime}
                          </div>
                          <div className={styles.listline} style={{ width: '16%',height:48 }}>
                            {this.showDesc(item.dispositionarea)}
                          </div>
                          <div className={styles.listline} style={{ width: '10%',height:48  }}>
                            {item.applicantname}
                          </div>
                          <div style={{clear:'both'}} />
                        </List.Item>
                        )}
                    />
                  </div>      
                  {/* 分页插件*/}
                  <Pagenation 
                  pagStyle={{float: 'right',display: 'flex', position: 'relative', marginRight: 20 ,bottom:30}}
                  firstStyle={{display: this.state.listCount > 0 ? 'block' : 'none'}}
                  toFirst={this.toFirst}
                  toLast={this.toLast}
                  defaultCurrent={1}
                  defaultPageSize={4}
                  currentPage={this.state.listPage}
                  totlePage={listCount}
                  listOnChange={this.listOnChange}
                  />
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
            <div className={styles.content_div} id="map">
              <span style={{color:'gray'}}>开发中，本期暂不提供该功能</span>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  doSort = (id,rule) => {
    this.setState({
      orderFiled: id,
      orderRule: rule,
    })
    const up = document.getElementById(`${id}up`)
    const down = document.getElementById(`${id}down`)
    if(rule === 'desc'){
      up.style.display='none'
      down.style.display='inline-block'
    }else{
      down.style.display='none'
      up.style.display='inline-block'
    }
    this.queryDispositionList(id,rule)
    if (id === 'capturedimagesimscore') {
      this.setState((state) => ({
        iscapturedimagesimscoreup: !state.iscapturedimagesimscoreup,
      }))
    } else if (id === 'alarmtime') {
      this.setState((state) => ({
        isalarmtimeup: !state.isalarmtimeup,
      }))
    } else if (id === 'capturedimagecamaraid') {
      this.setState((state) => ({
        iscapturedimagecamaraidup: !state.iscapturedimagecamaraidup,
      }))
      // console.log(this.state.iscapturedimagecamaraidup, 'iscapturedimagecamaraidup');
    }
  }

  onItemClick = (item) => {
    this.setState({
      targetImg:this.imageUrl+item.targetimageuri,
      takeImg: this.imageUrl+item.capturedimageuri,
      similar: Math.round(item.capturedimagesimscore*100),
      name: item.title,
      time: item.alarmtime,
      camaraid: item.dispositionarea,
    })
    this.state.listData.map(index => {
      const e = document.getElementById(index.id)
      if(e != null){
        if(item.id===index.id){
          e.style.background = '#e4f0fb';
        }else{
          e.style.background = '#fff'
        }
      }
    })
  }

  listOnChange = current => {
    this.setState({
      listPage: current,
    })
    this.props.dispatch({
      type: 'personnelControl/getDispositionList',
      payload: {
        page: current,
        size: 4,
        word: this.state.orderFiled,
        rule: this.state.orderRule,
        key: this.state.searchKey,
      },
    })
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
    const lastpagenum = Math.ceil(parseInt(this.state.listCount) / 4);
    // console.log(lastpagenum);
    if (this.state.listPage !== lastpagenum) {
      this.setState({
        listPage: lastpagenum,
      })
      this.listOnChange(lastpagenum);
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

}
