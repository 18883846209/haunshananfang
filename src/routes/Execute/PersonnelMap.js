
/**
 * @flow
 */

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom'
import Hgis from 'Hgis';
import { Layout, List, Progress, Pagination,Icon,message,Input,Modal,Popover} from 'antd';
import { connect } from 'dva';
import $ from 'jquery'
import { Link } from 'dva/router';
import styles from './PersonnelMap.less';
import juheImg from './img/bukongBlue.png';
import alarmImg from './img/alarm.png';
import boder3 from './img/boder3.png';
import boder4 from './img/boder4.png';
@connect(({ personnelControl }) => ({
  personnelControl,
}))

export default class PersonnelMap extends React.Component {
  state = {
    oldView:null,
    oldHover:null,
    layer:[],
    layerName:[],
    checked:[],
    allChecked:true,
    map:null,
  }


  componentDidMount () {
    // const pointdata = {
    //   lonBottom:105.36091456778317,
    //   lonTop:110.1509536302832,
    //   latBottom:28.208401815881416,
    //   latTop:32.184768945591316,
    // }
    this.props.dispatch({// 根据地图范围请求点
      type: 'personnelControl/getAlarmMapData',
    })
    this.state.map = new Hgis({// 初始化地图
      ReactDOM,
      target:'map2',
      center:[106.49993506433275, 29.61604349365581],
      minZoom:6,
      maxZoom:19,
      zoom:16,
      onMouseClick:(e=>{
        console.log(e);// 点坐标经纬度
      }),
    })
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
  }

  componentWillReceiveProps(nextProps){// props发生变化的时候执行
    console.log(nextProps)
    const map = this.state.map;
    // const str = this.refs.noneTips.innerHTML;
    const mapLayerName = [];
    const _this = this;
    if (nextProps.personnelControl.alarmMapResult&&nextProps.personnelControl.alarmMapResult.code==1) {
      const mapData = nextProps.personnelControl.alarmMapResult.data;
      const mapLayer = map.addLayer('layer',100,juheImg);// 地图图层 聚合点 距离 图片
      const heartMapLayer = mapLayer.addHeatLayer({// 热力图
        minzoom: 5,
        maxzoom: 10,
        radius: 10,
        blur: 10,
      })
      for (let i = 0; i < mapData.length; i++) {
        const points = mapLayer.addPoint({
          coor:[parseFloat(mapData[i].longitude),parseFloat(mapData[i].latitude)],// 点经纬度
          img:alarmImg,// 点图片
          imgrealwidth:20,// 实际图片大小
          imgtargetwidth:20,// 地图上图片大小
          onHover(e,extraArgs){// 鼠标移动到
             const str2 = `<div class=hoverTips><p>布控名称：${extraArgs.title}</p><p>卡口名称：${extraArgs.vmsdevicename}</p></div>`
             _this.state.oldHover = map.popUpWindow(points,str2);// 打开弹框;
             // console.log(_this.state.oldHover)
           },
           onMouseOut(extraArgs){// 鼠标移出点
             // $('.hmap-popup-closer').removeClass(styles.chacha);
             if (_this.state.oldHover) {
               map.unPopUpWindow(_this.state.oldHover);
             }
           },
           extraArgs:{// 点带的数据
            title:mapData[i].title,
            vmsdevicename:mapData[i].vmsdevicename,
          },
        })
      }
      
      
    }
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <div className={styles.title_div}>
          <Link className={styles.showList} to='/execute/personnelControlShow'><span>列表显示</span></Link>
          {/* <img src={boder3} className={styles.boder}/> */}
          <Link className={styles.showMap} to='/execute/personnelMap'><span>地图显示</span></Link>
          {/* <img src={boder4} className={styles.boder}/> */}
          <div className={styles.goBack} onClick={this.returnback}>
            <i className={styles.return} alt=" " />
            <span>返回上一步</span>
          </div>
        </div>
        <div id="map2" style={{height:'91%',backgroundColor:'#fff' }} />
      </div>
      
    );
  }
}