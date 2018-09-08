import React, { PureComponent } from 'react';
import { Icon, Button, Input, Select, message,Popover} from 'antd';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import { connect } from 'dva';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import moment from 'moment';
import style from './addLayer.less';

const Option = Select.Option;
const imageUrl = window.SSystem.imageUrl;
@connect(({ mapMonitor }) => ({
    mapMonitor,
  }))
export default class addLayer extends PureComponent {
    constructor() {
      super();
      this.state={
        addLayerShow:true,
        layerId:'',
        layerUrl:'',
        fileimg:null,
        typeDate:[],
        layerName:'',
        pointName:'',
        lng:'',
        lat:'',
        inputUrl:'',
        wetherAdd:false,
        oldLayerName:'选择图层',
        hours:{
            display:'none',
        },
        visible:false,
        noFiles:{
            display:'none',
        },
        beginHour:'',
        beginMin:'',
        beginSecond:'',
        beginTime:'',
        beginDate:'',
      }
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps.mapMonitor.addPointResult)
        if (nextProps.mapMonitor.getLayerResult&&nextProps.mapMonitor.getLayerResult.data) {// 请求已有图层返回数据
            this.setState({
                typeDate:nextProps.mapMonitor.getLayerResult.data,
            })
            nextProps.mapMonitor.getLayerResult={}
        }
        // if (this.props.mapMonitor.addPointResult&&this.props.mapMonitor.addPointResult.success) {
        //     message.info('新增点成功！');
        //     nextProps.mapMonitor.addPointResult={}
        // }else{
        //     message.info('新增点失败！');
        // }
        // if (this.props.mapMonitor.addLayerResult&&this.props.mapMonitor.addLayerResult.success) {
        //     message.info('新增图层成功！');
        // }else{
        //     message.info('新增图层失败！');
        // }
    }

    componentDidMount(){
        message.config({
            top: 300,
            duration: 2,
            maxCount: 3,
          });
        this.props.dispatch({// 请求已有的图层
            type: 'mapMonitor/getlayer',
        })
    //     const _this = this;
    //     const date = new Date();
    //    this.setState({
    //        beginHour:date.getHours(),//日历时
    //        beginMin:date.getMinutes(),//日历分
    //        beginSecond:date.getSeconds(),//日历秒
    //        beginTime:`${moment(date).format('l')}   ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    //    })
        
        // $(document).click((e) => {//点击非日历框，让他消失
        //     const _con = $('.myList');
        //     const _cos = $('#time');
        //     const _can = $(".rc-calendar")
        //     if (!_con.is(e.target)&&_con.has(e.target).length === 0
        //     &&!_cos.is(e.target)&&_cos.has(e.target).length === 0
        //     &&!_can.is(e.target)&&_can.has(e.target).length === 0
        //     ) {
        //         // console.log(1)
        //         _this.setState({
        //             hours:{
        //                 display:'none',
        //             },
        //         })
        //     }
        // })
    }   

    layerNameChange=(e)=>{// 新增图层名称
        this.setState({
            layerName:e.target.value,
        })
    }

    layerSelectChange=(value,img)=>{// 选择已有的图层
        // console.log(img)
        this.setState({
            layerUrl:`${imageUrl}${img.props.img}`,
            layerName:value,
            addLayerShow:true,
            oldLayerName:value,
            layerId:img.props.layersid,
            noFiles:{
                display:'block',
            },
        })
    }

    addNewLayer=(e)=>{// 新增图层按钮
        if (this.state.typeDate.length<=10) {
            this.setState({
                addLayerShow:false,
                oldLayerName:'选择图层',
                layerUrl:'',
                noFiles:{
                    display:'none',
                },
                visible:e
            })
        }else{
            message.info('图层最多10个,当前已有'+this.state.typeDate.length+'个图层。')
        }
    }

    pointNameChange=(e)=>{// 点名称
        this.setState({
            pointName:e.target.value,
        })
    }
    
    lngChange=(e)=>{// 经度值
        this.setState({
            lng:e.target.value,
        })
    }

    latChange=(e)=>{// 维度值
        this.setState({
            lat:e.target.value,
        })
    }

    addImg=(e)=>{// 上次图片file
        const file = e.currentTarget.files[0];
        const reader = new FileReader();
        const that = this;
        reader.readAsDataURL(file);
        reader.onload=function(event){// 文件读取成功事件
            const url = event.target.result;
            file.url = url;
            that.setState({
                layerUrl:url,
                inputUrl:url,
                fileimg:file,
            })
        }
        e.target.value = '';
    }

    changeImg=(e)=>{// 选择图层改变图层图片
        // console.log(1)
        this.setState({
            layerUrl:this.inputUrl,
        }) 
    }

    reset=()=>{// 重置按钮
        this.props.dispatch({
            type: 'mapMonitor/getlayer',
        })
        this.setState({
            oldLayerName:'选择图层',
            addLayerShow:true,
            pointName:null,
            lng:null,
            lat:null,
            layerUrl:'',
        })
    }

    judgelng=(str)=>{// 经度正则
        const pointdata = {
            lonBottom:105.36091456778317,
            lonTop:110.1509536302832,
            latBottom:28.208401815881416,
            latTop:32.184768945591316,
        }
        str = parseFloat(str);
        // const exp = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,14})?)|180(([.][0]{1,15})?))$/ 
        // return exp.test(str)
        if (str>=pointdata.lonBottom&&str<=pointdata.lonTop) {
            return true
        }else{
            return false
        }
    }

    judgelat=(str)=>{// 维度正则
        // const exp =  /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,14})?)|180(([.][0]{1,15})?))$/
        // return exp.test(str)
        const pointdata = {
            lonBottom:105.36091456778317,
            lonTop:110.1509536302832,
            latBottom:28.208401815881416,
            latTop:32.184768945591316,
        }
        str = parseFloat(str);
        console.log(str)
        if (str>=pointdata.latBottom) {
            return true
        }else{
            return false
        }
    }

    sureAdd=()=>{// 点击确认按钮
        const regu = "^[ ]+$";
        const re = new RegExp(regu);
        if (this.state.addLayerShow) {// 在原图层上新增点
            const data = [
                {
                    layersid:this.state.layerId,
                    longitude:this.state.lng,
                    latitude:this.state.lat,
                    name:this.state.pointName,
                },
            ]
        
            if (this.state.layerId=='') {
                message.info('请选择图层');
                return
            }else if(this.state.pointName==""){
                message.info('请输入设备名称');
                return
            }else if(re.test(this.state.pointName)){
                message.info('设备名称不能为空格');
                return
            }if(re.test(this.state.lng)){
                message.info('输入经度不能为空格');
                return
            }if(re.test(this.state.lat)){
                message.info('输入纬度不能为空格');
                
            }else if (this.state.lng=="") {
                message.info('请输入经度');
                
            }else if(this.judgelng(this.state.lng)==false){
                message.info('输入经度有误');
                
            }else if (this.state.lat=="") {
                message.info('请输入纬度');
                
            }else if(this.judgelat(this.state.lat)==false){
                message.info('输入纬度有误');
                
            }else{
                this.props.dispatch({
                    type: 'mapMonitor/addpoint',
                    payload:data,
                })
                setTimeout(()=>{
                    // console.log(this.props)
                    if (this.props.mapMonitor.addPointResult&&this.props.mapMonitor.addPointResult.success) {
                        message.info('新增点成功！');
                    }else{
                        message.info('新增点失败！');
                    }
                },1000)
            }
            
        }else{// 新增图层新增点
            const data = {
                image:this.state.layerUrl,
                name:this.state.layerName,
                listPoint:[
                    {
                        latitude:this.state.lat,
                        longitude:this.state.lng,
                        name:this.state.pointName,
                    },
                ],
            }
            
            console.log(this.state.pointName)
            console.log(this.refs.type.naturalHeight)
            const img = new Image();
            img.src = this.state.layerUrl
            const formDate = new FormData();
            formDate.append('image',this.state.fileimg);
            formDate.append('name',data.name);
            formDate.append('pointReqDTOList', JSON.stringify(data.listPoint));
            formDate.append('imageheight',this.refs.type.naturalHeight);
            // console.log(this.judgelng(this.state.lng)==false)
            // console.log(this.state.lng)
            if (this.state.layerName=="") {
                message.info('请输入图层名称');
                
            }else if(re.test(this.state.layerName)){
                message.info('图层名称不能为空格');
                
            }else if(this.state.pointName==""){
                message.info('请输入设备名称');
                
            }else if(re.test(this.state.pointName)){
                message.info('设备名称不能为空格');
                
            }else if (this.state.lng=="") {
                message.info('请输入经度');
                
            }else if(this.judgelng(this.state.lng)==false){
                message.info('输入经度有误');
                
            }else if (this.state.lat=="") {
                message.info('请输入经度');
                
            }else if(this.judgelat(this.state.lat)==false){
                message.info('输入纬度有误');
                // console.log(this.judgelng(this.state.lat))
                // console.log(this.state.lat)
                
            }else if (this.state.layerUrl=="") {
                message.info('请上传图片');
                
            }else{
                this.props.dispatch({
                    type: 'mapMonitor/addlayer',
                    payload:formDate,
                })
                setTimeout(()=>{
                    if (this.props.mapMonitor.addLayerResult&&this.props.mapMonitor.addLayerResult.success) {
                        message.info('新增图层成功！');
                    }else{
                        message.info('新增图层失败！');
                    }
                },1000)
            }
            
        }
    }

    // hour =()=>{//日历显示
    //     this.setState({
    //         hours:{
    //             display:'block',
    //         },
    //     })
    // }

    // calender=(e)=>{//日历
    //     // console.log(e)
    //     const time = `${this.state.beginHour}:${this.state.beginMin}:${this.state.beginSecond}`
    //     // console.log(time)
    //     moment(e).hours(this.state.beginHour);
    //     moment(e).minutes(this.state.beginMin);
    //     moment(e).seconds(this.state.beginSecond);
    //     this.setState({
    //         beginDate:moment(e).format('l'),
    //         beginTime:`${moment(e).format('l')}   ${time}`,
    //     })
    // }

    render() {
        // const hourStyles={
        //     width: '30px',
        //     border: '1px solid #2080da',
        //     margin: '0 20px',
        //     height: '25px',
        //     paddingLeft:'6px',
        // }
        // const _this = this;
        // const beginHour=function time(e){
        //     if (e.target.value<24) {
        //         const time = `${e.target.value}:${_this.state.beginMin}:${_this.state.beginSecond}`;
        //         _this.setState({
        //             beginHour:e.target.value,
        //             beginTime:`${_this.state.beginDate}  ${time}`,
        //         })
        //     }
        // }
        // const beginMin=function time(e){
        //     if (e.target.value<60) {
        //         const time = `${_this.state.beginHour}:${e.target.value}:${_this.state.beginSecond}`;
        //         _this.setState({
        //             beginMin:e.target.value,
        //             beginTime:`${_this.state.beginDate}  ${time}`,
        //         })
        //     }
        // }
        // const beginSecond=function time(e){
        //     if (e.target.value<60) {
        //         const time = `${_this.state.beginHour}:${e.target.value}:${e.target.value}`
        //         _this.setState({
        //             beginSecond:e.target.value,
        //             beginTime:`${_this.state.beginDate}  ${time}`,
        //         })
        //     }
            
        // }
        // const hours  = React.createElement(

        //     'div', {
        
        //         className: 'myList',
        
        //     },
        
        //         React.createElement('input', {className: 'li1',style:hourStyles,onChange:beginHour,value:this.state.beginHour,maxlength:2}),
        //         React.createElement('span', {id: 'li1'},':'),
        //         React.createElement('input', {className: 'li2',style:hourStyles,onChange:beginMin,value:this.state.beginMin,maxlength:2}),
        //         React.createElement('span', {id: 'li2'},':'),
        //         React.createElement('input', {className: 'li3',style:hourStyles,onChange:beginSecond,value:this.state.beginSecond,maxlength:2})
        
        // );
        
        return (
          <div>
            {/* <Input id="time" style={{width:'200px'}} value={this.state.beginTime} onClick={()=>this.hour()}/>
              <Calendar style={this.state.hours} onChange={(e)=>this.calender(e)} showToday={false} showDateInput={false} renderFooter={()=>hours}  /> */}
            <div className={style.layerIput}>
              <span>图层选择</span><span style={{color:'red'}}>*</span>
              <Select className={style.antselect} value={this.state.oldLayerName} placeholder="选择已有图层" onSelect={(value,img)=>this.layerSelectChange(value,img)}>
                {
                            this.state.typeDate?this.state.typeDate.map(item=>(
                              <Option value={item.name} key={item} img={item.imageurl} layersid={item.layersid}>{item.name}</Option>
                            )):''
                        }
              </Select>
              <Popover onVisibleChange={(e)=>this.addNewLayer(e)} className={style.addNew}
                content={<div>请输入图层名称</div>}
                trigger="click"
                visible={this.state.visible}>
                 <Icon className={style.add} type="plus-square-o" style={{fontSize:'20px',color:'#2180da',lineHeight:'24px'}} />
                 <span className={style.newLayer}>新建图层</span>   
              </Popover>   
            </div>
            <div className={style.layerIput}>
              <span style={this.state.addLayerShow?{lineHeight:'32px',color:'#bfbfbf'}:{lineHeight:'32px',color:'black'}}>图层名称</span>
              <Input placeholder="图层名称" style={{marginLeft:31}} disabled={this.state.addLayerShow} onChange={(e)=>this.layerNameChange(e)} className={style.layerName} />
              
            </div>
            <div className={style.layerIput}>
              <span style={{lineHeight:'32px'}}>设备名称</span><span style={{color:'red'}}>*</span>
              <Input placeholder="设备名称" className={style.pointName} value={this.state.pointName} onChange={(e)=>this.pointNameChange(e)} />
            </div>
            <div className={style.layerIput}>
              <span style={{lineHeight:'32px'}}>经纬度</span><span style={{color:'red'}}>*</span>
              <Input placeholder="经度(105.36091456778317-110.1509536302832)" value={this.state.lng} className={style.lng} onChange={(e)=>this.lngChange(e)} />
              <Input placeholder="纬度(28.208401815881416-32.184768945591316)" value={this.state.lat} className={style.lat} onChange={(e)=>this.latChange(e)} />
            </div>
            <div className={style.layerIput}>
              <span>类型</span><span style={{color:'red'}}>*</span>
              <img src={this.state.layerUrl?this.state.layerUrl:''} className={style.layerTypeImg} />
              <img ref='type' src={this.state.layerUrl?this.state.layerUrl:''} style={{display:'none'}} /> 
              <div className={style.addnewImg}>
                <input type="file" id='file' className={style.file} onChange={(e)=>this.addImg(e)} /> 
                <label htmlFor="file" className={style.label}><Icon className={style.new} type="plus-square-o" /></label>
              </div>
              <div className={style.noFile} style={this.state.noFiles} />
            </div>  
            <div className={style.button}>
              <Button type="primary" onClick={()=>this.sureAdd()} className={style.sureButton}>确认</Button>
              <Button type='default' onClick={()=>this.reset()} className={style.resetButton}>重置</Button>
            </div>
          </div>
        )
    }
}