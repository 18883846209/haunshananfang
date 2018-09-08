/**
 * @flow
 */

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom'
// import GMap from '@alpha/hgis';
import {Icon, Input, Checkbox,message } from 'antd';
import Hgis from 'Hgis';
import { connect } from 'dva';
import $ from 'jquery'
import styles from './MapMonitor.less';
import { Link } from '../../../node_modules/dva/router';
import video from './img/video.png';
import juhe from './img/bukongBlue.png';
import ContentHeader from 'components/ContentHeader'
// import Deom from 'components/MapTips'
const Search = Input.Search;
const imageUrl = window.SSystem.imageUrl ;
const mapUrl = window.SSystem.mapUrl;
@connect(({ mapMonitor }) => ({
  mapMonitor,
}))
export default class MapMonitor extends PureComponent {
  constructor() {
    super();
    this.state={
      oldView:null,
      oldHover:null,
      layer:[],
      layerName:[],
      checked:[],
      allChecked:true,
      map:null,
      windowUrl:'',
    }
  }
 
  // show=()=>{
  //   console.log(1)
  // }

  componentDidMount(){
    if(Hgis){
    const url = window.location.href;
    const length = url.indexOf('/map');
    this.setState({// 获取地址
      windowUrl:url.substr(0,length),
    })
    const pointdata = {
      lonBottom:105.36091456778317,
      lonTop:110.1509536302832,
      latBottom:28.208401815881416,
      latTop:32.184768945591316,
    }
    this.props.dispatch({// 根据地图范围请求点
      type: 'mapMonitor/searchlist',
      payload:pointdata,
    })
    this.state.map = new Hgis({// 初始化地图
      ReactDOM,
      target:'map',
      center:[106.49993506433275, 29.61604349365581],
      minZoom:6,
      maxZoom:19,
      zoom:16,
      onMouseClick:(e=>{
        // console.log(e);// 点坐标经纬度
      }),
    })
  }
    //  map.selectedFeatures('polygon',(point)=>{//框选或线选
    //   console.log(point);
    // });
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
  }
  
  checkChange=(e,num)=>{// 多选按钮
    console.log(e.target.checked)
    const check = [];
    let count1 = 0;
    for (let i = 0; i < this.state.checked.length; i++) {
      check[i] = this.state.checked[i];
    }
    check[num] = !check[num];
    this.setState({
      checked:check,
    });
    for (let i = 0; i < check.length; i++) {
      if (check[i]===true) {
        count1 +=1;
      }
    }
    if (count1 === check.length) {
      this.setState({
        allChecked:true,
      })
    }else{
      this.setState({
        allChecked:false,
      })
    }
    if (e.target.checked) {
      this.state.layer[num].setVisible(true);
    }else{
      this.state.layer[num].setVisible(false);
    }
  }

  AllcheckChange=(e)=>{// 全选按钮
    const check = [];
    for (let i = 0; i < this.state.layer.length; i++) {
      
      if (e.target.checked) {
        this.state.layer[i].setVisible(true);
        check[i] = true;
      }else{
        this.state.layer[i].setVisible(false);
        check[i] = false;
      }
    }
    this.setState({
      checked:check,
      allChecked:!this.state.allChecked,
    })
  }

  returnback=()=>{
    message.info("开发中，本期暂不提供该功能")
  }

  search = (e)=>{// 地图搜索功能请求
    if (e=='') {
      message.info('搜索内容不能为空！');
    }else{
      this.props.dispatch({// 搜索请求，返回的第一个点位地图中心点
        type: 'mapMonitor/searchpoint',
        payload:e,
      })
    }
  }

  closeMapWindow=()=>{// 关闭地图弹框
    this.state.map.unPopUpWindow(this.state.oldView);
  }

  changeHistory=(str)=>{// 页面跳转
    this.props.history.push(str);
  }

  componentWillReceiveProps(nextProps){// props发生变化的时候执行
    console.log(nextProps.mapMonitor.listResult)
    const map = this.state.map;
    const mapLayer = [];// 地图图层
    const checkStatus = [];
    const str = this.refs.noneTips.innerHTML;
    // const str = `<p onclick=console.log(e)>1</p>`
    const mapLayerName = [];
    const heartMapLayer = [];// 热力图图层
    const _this = this;
    
    if (nextProps.mapMonitor.listResult&&nextProps.mapMonitor.listResult.data) {// 请求返回地图数据
      // console.log(1)
      const mapData = nextProps.mapMonitor.listResult.data;
      for (let i = 0; i < mapData.length; i++) {// 遍历循环图层
        mapLayer[i] = map.addLayer(`layer${[i]}`,100,juhe);// 聚合点 距离 图片
        checkStatus[i] = true;
        heartMapLayer[i] = mapLayer[i].addHeatLayer({// 热力图
          minzoom: 5,
          maxzoom: 10,
          radius: 10,
          blur: 10,
        })
        this.setState({
          checked:checkStatus,
        });
        mapLayerName[i] = mapData[i].name;
        if (mapData[i].gisPointResDTOList!=null) {
          for (let j = 0; j < mapData[i].gisPointResDTOList.length; j++) {// 遍历循环点
            const points = mapLayer[i].addPoint({
              coor:[parseFloat(mapData[i].gisPointResDTOList[j].longitude),parseFloat(mapData[i].gisPointResDTOList[j].latitude)],// 点经纬度
              img:`${mapData[i].imageurl}`,// 点图片，
              imgrealwidth:mapData[i].imageheight,// 实际图片大小
              imgtargetwidth:20,// 地图上图片大小
              // imgsize:[20,20],//设置图片大小
              onClick(e,extraArgs){
                $('.hmap-popup-closer').removeClass('chacha');
                if (_this.state.oldView) {
                  map.unPopUpWindow(_this.state.oldView);// 关闭click弹框
                }
                if (_this.state.oldHover) {
                  map.unPopUpWindow(_this.state.oldHover);// 关闭hover弹框
                }
                _this.state.oldView = map.popUpWindow(points,(
                  <div className={styles.tips}>
                    {/* 弹框内的点击事件都被阻止了 目前只能写鼠标按下事件 */}
                    <Icon type="close-circle-o" className={styles.closeSearch} onMouseUp={()=>_this.closeMapWindow()} />
                    <img src={video} />
                    <div className={styles.bottomlist}>
                      <p className={styles.listButton} onMouseUp={(str)=>_this.changeHistory('/retrieva/personnelRetrieva')}><Icon type="dot-chart" />轨迹搜索</p>
                      <a className={styles.listButton} onMouseUp={(str)=>_this.changeHistory("/execute/personnelControl")}><Icon type="search" />人员布控</a>
                      <a className={styles.listButton} onMouseUp={(str)=>_this.changeHistory("/map/trajectory")}><Icon type="user" />模糊搜索</a>
                      <p className={styles.listButton} style={{border:"none",width:'50px'}}><Icon type="save" />保存</p>
                    </div>
                  </div>
                ));// 打开弹框;
              },
              onHover(e,extraArgs){// 鼠标移动到
                const str2 = `<div class=hoverTips><p>类型：${extraArgs.layerName}</p><p>名称：${extraArgs.pointName}</p></div>`
                _this.state.oldHover = map.popUpWindow(points,str2);// 打开弹框;
                $('.hmap-popup-closer').addClass('chacha');
                // console.log(_this.state.oldHover)
              },
              onMouseOut(extraArgs){// 鼠标移出点
                $('.hmap-popup-closer').removeClass('chacha');
                if (_this.state.oldHover) {
                  map.unPopUpWindow(_this.state.oldHover);
                }
              },
              extraArgs:{// 点带的数据
                lng:parseFloat(mapData[i].gisPointResDTOList[j].longitude),
                lat:parseFloat(mapData[i].gisPointResDTOList[j].latitude),
                layerName:mapData[i].name,
                pointName:mapData[i].gisPointResDTOList[j].name,
                layerId:mapData[i].layersid,
                pointId:mapData[i].gisPointResDTOList[j].pointid,
              },
            })
          }
        }
      }
      this.setState({
        layer:mapLayer,
        layerName:mapLayerName,
      })
      nextProps.mapMonitor.listResult = {};// 清空地图点请求数据，以免其他请求重复执行
    }
    if (nextProps.mapMonitor.searchResult&&nextProps.mapMonitor.searchResult.data&&nextProps.mapMonitor.searchResult.data.length!==0) {// 搜索返回数据
      const lng = nextProps.mapMonitor.searchResult.data[0].longitude;
      const lat = nextProps.mapMonitor.searchResult.data[0].latitude;
      this.state.map.setMapCenter([parseFloat(lng),parseFloat(lat)],1000);// 设置地图中心点
      nextProps.mapMonitor.searchResult = {};// 清空搜索请求数据，以免其他请求重复执行
    }else if (nextProps.mapMonitor.searchResult.data&&nextProps.mapMonitor.searchResult.data.length===0) {
      message.info('没有搜索结果！');
    }
    // this.state.map.setMapCenter([106.49809372784402,29.615297316150873],1000);//设置中心点 有动画
    // this.state.map.setMapCenterWioutAnimation([106.49809372784402,29.615297316150873]);//设置中心点 不带动画
  }

  render() {
    return (
      <div style={{height:'100%'}}>
        <ContentHeader contentTitle='图上监控'/>
        <div className={styles.map} id='map' />
        <div className={styles.mapcheck}>
          <span className={styles.checkName}>资源选择：</span>
          <Checkbox defaultChecked className={styles.checkbox1} checked={this.state.allChecked} onChange={(e)=>this.AllcheckChange(e)}>全选</Checkbox>
          {
            this.state.layerName.map((item,index)=>(
              <Checkbox className={styles.checkbox2} checked={this.state.checked[index]} onChange={(e,num)=>this.checkChange(e,index)}>{item}</Checkbox>
            ))
          }
          <Search className={styles.search} placeholder='示例:西北角摄像头' enterButton onSearch={(e)=>this.search(e)} />
        </div>
        <div className={styles.noneTips} id="noneTips" ref="noneTips">
          <div className={styles.tips}>
            {/* <Icon type="close-circle-o" className={styles.closeSearch}/> */}
            <img src={video} />
            <div className={styles.bottomlist}>
              <Link className={styles.listButton} to="/retrieva/personnelRetrieva"><Icon type="dot-chart" />轨迹搜索</Link>
              <Link className={styles.listButton} to="/execute/personnelControl"><Icon type="search" />人员布控</Link>
              <Link className={styles.listButton} to="/map/trajectory"><Icon type="user" />模糊搜索</Link>
              <p className={styles.listButton} style={{border:"none",width:'50px'}}><Icon type="save" />保存</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
// ReactDOM.render(
//   <div className={style.tips}>
//     <img src='src/routes/Map/img/player.jpg'/>
//     <p class='kou' onClick={this.kou}>抠图</p>
//   </div>,
//   ReactDOM.findDOMNode(this.refs.noneTips)
// )
