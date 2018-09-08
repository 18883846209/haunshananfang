/*
 * @Author: quezhongyou 
 * @Date: 2018-08-03 16:52:50 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-09-05 14:31:18
 */

import React , {Component} from 'react';
import { Tabs, Icon, message ,Modal , Slider ,Popover } from 'antd';
import { connect } from 'dva';
import Videohelper from 'utils/newVideo.js'; 
import DateInput from 'components/DateInput'
import styles from './index.less';
import Yun from './Yun.js';
import Tree from './Tree.js';

const videoLogin =  window.SSystem.videoLogin ;
const ocxUrl = window.SSystem.ocxUrl ;
const TabPane = Tabs.TabPane;
let first = true;
/**
 * 
 * @param {*} userAgent 
 * @description 检测IE
 */
function IETester(userAgent){
    const UA =  userAgent || navigator.userAgent;
    if(/msie/i.test(UA)){
        return UA.match(/msie (\d+\.\d+)/i)[1];
    }else if(~UA.toLowerCase().indexOf('trident') && ~UA.indexOf('rv')){
        return UA.match(/rv:(\d+\.\d+)/)[1];
    }
    return false;
}


/**
 * @description 视频播放
 */
export class Video extends Component {
    state = {
        spend:{},
        pause:{},
        selected:0,
        slideVal: 0,
        begintime: 0,
        visible:false,
        number:0,
        frame:{}
    }

  
    /**
     * @description 创建视频容器
     */
    createVideo =(targetStr , type , container) =>{
        const video = this.props[targetStr];
        const videoEle = video || document.getElementById(targetStr);
        if(!video){
            this.props.getVideo(type,videoEle);
        }
        container.appendChild(videoEle);
        videoEle.style.display = 'block';
    }
  
    /**
     * 
     * @param {*} vh 
     * @description   登录
     */
    login(vh){
        try{
            console.log(videoLogin.ip, videoLogin.port, videoLogin.number, videoLogin.password); 
            const rt = vh.Login(videoLogin.ip, videoLogin.port, videoLogin.number, videoLogin.password,(result)=>{
                if(result.Error==-1){
                    message.error('载入失败，请刷新页面。');
                }else{ 
                    console.log('login success');
                    vh.ForkPUList(0,100);
                }
            });
        }catch(e){
            if(!IETester(window.navigator.userAgent)){
                message.info('视频无法播放,请使用IE10以上版本浏览器!');
            }
        }
    }



    componentDidMount(){
        const { getVideohelper , vhelper , videonumber } = this.props;

        message.config({
            top: 50,
            duration: 2,
            maxCount: 3,
          });

        // 创建实时视频
        const container = document.getElementById('videoContainer');
        this.createVideo('video' , 'videoSystem/getVideo' , container);
        const WebPlayWnd = document.getElementById('WebPlayWnd');
        const WebIC = document.getElementById('WebIC');
        const vh = vhelper ||  new Videohelper(WebPlayWnd,WebIC,'video');
        if(!vhelper){ 
            getVideohelper('videoSystem/getVideohelper',vh);
            window.vh = vh;
            this.login(vh);
            this.handleCloseFactory(vh,'videonumber');
        }
        if(!videonumber){
            message.info('请选择左边栏中实时视频！'); 
        }
    }
    
    pkCreate = false

    handleChange = (e)=>{
       const { getVideohelper  , pkvideoNumber , pkVhelper ,treeChange} = this.props;
       // 改变资源树
       treeChange(e);
        if(!pkvideoNumber){
            message.info('请选择左边栏中回放录像！'); 
        }
       if(e==2){
           // 初次执行
           if(!this.pkCreate){
           this.pkCreate = true;
           setTimeout(() =>{
                // 创建回放视频
                const pkvideoContainer = document.getElementById('pkvideoContainer');   
                this.createVideo('pkVideo' , 'videoSystem/getpkVideo' , pkvideoContainer);
                const pkWebPlayWnd = document.getElementById('pkWebPlayWnd');
                // const pkWebIC = document.getElementById('pkWebIC');
                const pkWebIC = document.getElementById('WebIC');
                const pkvh = pkVhelper ||  new Videohelper(pkWebPlayWnd,pkWebIC,'pk');
                    if(!pkVhelper){ 
                        getVideohelper('videoSystem/getpkVideohelper',pkvh);
                        window.pkvh = pkvh;
                        this.login(pkvh);
                        this.handleCloseFactory(pkvh,'pkvideoNumber');
                        // 状态监控
                        this.createWinIndexState(pkvh);
                    }
            },0)
            }
        }else{
            const { pkVhelper } = this.props;
            let pause = {};
            for(let key in pkVhelper.PdWndIndex){
                let index = pkVhelper.PdWndIndex[key];
                pause[index]=true;
                pkVhelper.OSSVODPause(index);
            }
            this.setState({pause:{...this.state.pause,...pause}});
        }
    }   

    /**
     * 
     * @description 当前被选择的窗口
     */
    createWinIndexState(pkVhelper){
        pkVhelper.changeWinIndexState = (index)=>{
            this.setState({selected:index});
        }
    }

    /**
     * 
     * @param {*} vh 
     * @param {*} state 
     * @description       关闭按钮窗口触发事件
     */
    handleCloseFactory(vh,stateName){
        const { setVideoNumber } =this.props;
        vh.handleClose = () =>{
            const len = Object.keys(vh.PdWndIndex).length;
            setVideoNumber(stateName,len);
        }
    }

    changeWindowNumber = (number,helper) =>()=>{
        this.hide();
        this.setState({number});
        helper.createWinNum(number);
    }

    FullScreen = (helper) => ()=>{
        helper.FullScreen();
    }
    
    onDragOver(event){
        event.preventDefault();
    }

    onDrop = ()=>{

      this.props.onDrop();
    }

    hide = () => {// 分屏
        this.setState({
          visible: false,
        });
      }
    
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    tip = () => {
        message.info("开发中，本期暂不提供该功能")
    }


    OSSVODPause = ()=> {
        const { pkVhelper } = this.props;
        const {pause , selected } = this.state;
        if(selected != -1){
          this.setState({pause:{...pause,[selected]:true}});
          pkVhelper.OSSVODPause(selected);
        }
    }
    
    OSSVODResume =()=>{
        const {pause , selected } = this.state;
        if(selected != -1){
            this.setState({pause:{...pause,[selected]:false}});
            this.props.pkVhelper.OSSVODResume(selected);
        }
    }

    OSSSetSpeed = ()=>{
        const { spend , selected} = this.state;
        if(selected != -1){
            let sp = spend[selected] || 0;
            sp = (sp+1)%5;
            this.setState({spend:{...spend,[selected]:sp}});
            this.props.pkVhelper.OSSSetSpeed(sp);
        }
    }

    PlayOneByOne = ()=>{
        const {selected,frame} = this.state;
        if(!frame[selected]){
            this.setState({frame:{...frame,[selected]:true}});
        }
        this.props.pkVhelper.PlayOneByOne();
    }
    ResumePlayByFrame =()=>{
        const {selected,frame} = this.state;
        this.setState({frame:{...frame,[selected]:false}});
        this.props.pkVhelper.ResumePlayByFrame();
    }

    ZoomInOut = (i,helper) =>() =>{
        helper.ZoomInOut(300,400,960,640,i);
    }

    GetVODProgress = (i,helper) =>() =>{
        helper.GetVODProgress(300,400,960,640,i);
    }

    sectotime = (s) => { // 秒转化为时分秒格式
        let t;
        if (s > -1) {
          const hour = Math.floor(s / 3600);
          const min = Math.floor(s / 60) % 60;
          const sec = s % 60;
          if (hour < 10) {
            t = `0${  hour  }:`;
          } else {
            t = `${hour  }:`;
          }
          if (min < 10) {
            t += '0';
          }
          t += `${min  }:`;
          if (sec < 10) {
            t += '0';
          }
          // t += sec.toFixed(2);
          t += sec;
        }
        return t;
      }

     timetosec = (time) => { // 时分秒格式转化为秒
        let s = '';
        const hour = time.split(':')[0];
        const min = time.split(':')[1];
        const sec = time.split(':')[2];
        s = Number(hour * 3600) + Number(min * 60) + Number(sec);
        return s;
      }

      gettime = () => {
          return 90
      }

    slideChangeEnd = (val) => {
        this.setState((prev) => ({
            begintime: prev.slideVal,
        }))
    }

    slideChange = (val) => {
        this.setState({
            slideVal: val,
        })
    }

    render(){
            const {vhelper,pkVhelper ,videonumber, pkvideoNumber} =this.props;
            const {pause , selected, begintime, slideVal,frame} =this.state;
           
           return (
             <Tabs onChange={this.handleChange} animated={false}>
            
               <TabPane tab={<span><Icon type="video-camera" />实况</span>} key="1">
                 <div className={styles.video}>
                   <div
                     id='videoContainer'
                     style={{height: videonumber ==0 ? '0px':'auto',overflow:'hidden'}}  
                     onDragOver={this.onDragOver}
                     onDrop={this.onDrop}
                   />
                   <div className={styles.loadingPage} style={{display: videonumber == 0 ? 'block':'none'}}>
                     <div className={styles.loadimg} />
                   </div>
                   <div className={styles.tool}> 
                     <div className={styles.toolbar} style={{lineHeight:'60px',marginTop:'-6px'}}>
                       <div /><div />
                       <div className={styles.bar}>
                         <i title='全屏' className={styles.fullScreen} onClick={this.FullScreen(vhelper)} />
                         <i title='缩小' className={styles.in} onClick={this.ZoomInOut(-1,vhelper)} />
                         <i title='放大' className={styles.magnifier} onClick={this.ZoomInOut(1,vhelper)} />
                         <Popover
                           content={
                             <div className={styles.fpbox}>
                               <span className={`${this.state.number == 1 ? styles.active:'' }`} onClick={this.changeWindowNumber(1,vhelper)}>1P</span>
                               <span className={`${this.state.number == 4 ? styles.active:'' }`} onClick={this.changeWindowNumber(4,vhelper)}>4P</span>
                               <span className={`${this.state.number == 9 ? styles.active:'' }`} onClick={this.changeWindowNumber(9,vhelper)}>9P</span>
                               <span className={`${this.state.number == 16 ? styles.active:'' }`} onClick={this.changeWindowNumber(16,vhelper)}>16P</span>
                             </div>
                            }
                           trigger='click'
                          // visible={this.state.visible}
                           arrowPointAtCenter
                           placement="left" 
                        //   onVisibleChange={this.handleVisibleChange}
                         >
                           <i title='分屏' className={styles.fp} />
                         </Popover>
                       </div>
                       {/* <div className={styles.bar}>
                    <button  onClick={this.realplay(true)}>实时</button>
                    <button  onClick={this.realplay(false)}>回放</button>
                    </div> */}
                     </div>
                   </div>
                 </div>
               </TabPane>

               <TabPane tab={<span><Icon type="retweet" />回放</span>} key="2">
                 <div id='pkvideoContainer' style={{height: pkvideoNumber ==0 ? '0px':'auto',overflow:'hidden'}} />
                 {/* 加载页 */}
                 <div className={styles.loadingPage} style={{display: pkvideoNumber == 0 ? 'block':'none'}}>
                   <div className={styles.loadimg} />
                 </div>
                 <div className={styles.tool}> 
                   <div className={styles.slider}>
                     <div className={styles.begintime}>{ this.sectotime(begintime) }</div>
                     <Slider 
                       className={styles.sliderbox} 
                       value={slideVal} 
                       max="1000" 
                       tipFormatter={null}
                       onAfterChange={this.slideChangeEnd}
                       onChange={this.slideChange}
                     />
                     <div className={styles.endtime}>00:16:40</div>
                   </div>

                   <div className={styles.toolbar}>
                     <div />
                     <div className={styles.retweet_process}>
                       <i title='单帧后退' className={styles.dzzf} onClick={this.tip} />
                       <i title='后退' className={styles.backward} onClick={this.tip} />
                       {
                           frame[selected] ==true? <i title='播放' className={styles.play} onClick={this.ResumePlayByFrame} />:
                           pause[selected] == true ?<i title='播放' className={styles.play} onClick={this.OSSVODResume} />:
                           <i title='暂停' className={styles.pause} onClick={this.OSSVODPause} />
                       }
                       <i title='快进' className={styles.forward} onClick={this.OSSSetSpeed} />
                       <i title='单帧快进' className={styles.dzxh} onClick={this.PlayOneByOne} />
                       {this.state.spend[selected] && this.state.spend[selected] != 0 ?
                         <span className={styles.spend}><Icon type="close" />{this.state.spend[selected]*this.state.spend[selected]}.0</span>:''   
                            }
                     </div>
                     <div className={styles.bar}>
                       <i title='全屏' className={styles.fullScreen} onClick={this.FullScreen(pkVhelper)} />
                       <i title='缩小' className={styles.in} onClick={this.ZoomInOut(-1,pkVhelper)} />
                       <i title='放大' className={styles.magnifier} onClick={this.ZoomInOut(1,pkVhelper)} />
                       <Popover
                         content={
                           <div className={styles.fpbox}>
                             <span className={`${this.state.number == 1 ? styles.active:'' }`} onClick={this.changeWindowNumber(1,pkVhelper)}>1P</span>
                             <span className={`${this.state.number == 4 ? styles.active:'' }`} onClick={this.changeWindowNumber(4,pkVhelper)}>4P</span>
                             <span className={`${this.state.number == 9 ? styles.active:'' }`} onClick={this.changeWindowNumber(9,pkVhelper)}>9P</span>
                             <span className={`${this.state.number == 16 ? styles.active:'' }`} onClick={this.changeWindowNumber(16,pkVhelper)}>16P</span>
                           </div>
                                }
                         trigger='click'
                         visible={this.state.visible}
                         arrowPointAtCenter
                         placement="left" 
                         onVisibleChange={this.handleVisibleChange}
                       >
                         <i title='分屏' className={styles.fp} />
                       </Popover>
                     </div>
                   </div>                
                 </div>

               </TabPane>
             </Tabs>
             )
    }
}







/**
 * @description  视频巡逻页
 */
@connect(({videoSystem}) =>({
    treeResult:videoSystem.treeResult || [],
    treerelative:videoSystem.treerelative,
    video: videoSystem.video,
    vhelper:videoSystem.vhelper,
    pkVhelper:videoSystem.pkVhelper,
    pkVideo:videoSystem.pkVideo,
}))
export default class VideoSytem extends Component {
    state = {
        treekey:1,
        visible:false,
        title:'',
        id:null,
        files:[],
        checkedid:null,   //选择id
        dcheckedid:null, //取消选择id
        startValue:null,
        endValue:null,
        selectedFiles:null,
        videonumber:0,
        pkvideoNumber:0,
        loading:false
    }



    setVideoNumber = (state,value)=>{
        this.setState({[state]:value});
    }

    componentWillMount(){
        window.document.title = '视频巡逻';
        //刷新页面
        if(!first)return window.location.reload();
        first = false;
        
        this.props.dispatch({
            type: 'videoSystem/fetchResTree',
            payload:{treeType:'0,1'},
          })
    }
    
    getVideo = (type = 'videoSystem/getVideo',video) =>{
        this.props.dispatch({
            type,
            payload:video,
          })
    }

    getVideohelper = (type = 'videoSystem/getVideohelper',vh) =>{
        this.props.dispatch({
            type ,
            payload:vh,
          })
    }
    
    nextPuid = [];

    /**
     * @description   实时录像调用
     */
    onCheck = (puid , helper)=> {
        const { treerelative } = this.props;
        if(IETester(window.navigator.userAgent)){
            // 增加视频
            if(puid.length > this.nextPuid.length){
                const addPuid = puid.filter(item =>{
                    return this.nextPuid.indexOf(item) == -1
                });
                this._addRTVideo(addPuid ,treerelative,helper);
            }

            // 删除视频
            if(puid.length  < this.nextPuid.length){
               const delPuid = this.nextPuid.filter(item =>{
                    return puid.indexOf(item) == -1
                })
                this._deleteRTVideo(delPuid, treerelative , helper);
            }
            this.nextPuid = [...puid];
        }
    }

    _addRTVideo = ( puid, treerelative , helper) =>{
        const pids = [];
        puid.forEach((item,index)=>{
            if(treerelative[item]){
               pids.push(treerelative[item]);
              // pids.push("1000000");
            }
        })
        helper.forceCreateRTVideo(pids , 0 , 0,()=>{
            this.setState({videonumber:Object.keys(helper.PdWndIndex).length});
        });
    }

    _deleteRTVideo = (puid, treerelative , helper) =>{
        puid.forEach((item,index)=>{
            if(treerelative[item]){
                helper.deleteVideo(treerelative[item],(index) => {
                   window.bpBtn.state.video[index] = [false, false, false, false]
                });
                this.setState({videonumber:Object.keys(helper.PdWndIndex).length});
            }
        })
    }

    nextpkPuid = [];

    modelVal = [];

    /**
     * 
     * @param {*} puid 
     * @param {*} helper 
     * @description      视频回放
     */
    onCheckpk = (puid , helper) =>{
        const { treerelative } = this.props;
        if(IETester(window.navigator.userAgent)){
            if(puid.length > this.nextpkPuid.length){
                const addPuid = puid.filter(item =>{
                    return this.nextpkPuid.indexOf(item) == -1
                });
                addPuid.forEach((item,index)=>{
                    if(treerelative[item]){
                        this.modelVal.push({
                            id: treerelative[item],//"1000000",
                            checkedid:item,
                            name:treerelative[`${item}name`],
                        });
                    }
                });
                const val = this.modelVal.splice(0,1);
                if(val.length>0){
                    this.setState({
                        title:val[0].name,
                        id:val[0].id,
                        checkedid:val[0].checkedid,
                        visible:true,
                        dcheckedid:null
                    })
                }
            }else{
                const removePuid = this.nextpkPuid.filter(item =>{
                    return puid.indexOf(item) == -1
                });
               // helper.deleteVideo('1000000');
                removePuid.forEach((item,index)=>{
                    if(treerelative[item]){
                      helper.deleteVideo(treerelative[item],(index) => {
                        window.bpBtn.state.pkvideo[index] = [false, false, false, false]
                     });
                     this.setState({pkvideoNumber:Object.keys(helper.PdWndIndex).length});
                    }
                })
            }
            this.nextpkPuid = [...puid];
        }
    }
    
    treeChange = (treekey)=>{
        this.setState({treekey});
    }

    handleCancel = () =>{
        this.setState({
            visible:false,
            title:'',
            id:null,
            files:[],
            checkedid:null,
            selectedFiles:null,
            startValue:null,
            endValue:null,
            loading:false,
            dcheckedid:this.state.checkedid
        });
        const val = this.modelVal.splice(0,1);
            if(val.length>0){
                this.setState({
                    title:val[0].name,
                    id:val[0].id,
                    visible:true,
                    checkedid:val[0].checkedid
            })
        }
    }

    getVideos = () =>{ 
        const {id,files} = this.state;
        const { pkVhelper } =this.props;
        if(files[0] && files[files.length-1]){
            pkVhelper.OSSVODTime(id,0,files[0].BeginTime,files[files.length-1].EndTime);
            this.setState({pkvideoNumber:Object.keys(pkVhelper.PdWndIndex).length});
        }else{
            message.info(`${this.state.title} 在您选择的时间段没有视频录像，请您重新选择。`);
        }
    }

    handleOK = () =>{
        this.queryFiles(()=>{
            this.getVideos();
            this.setState({
                visible:false,
                title:'',
                id:null,
                files:[],
                selectedFiles:null,
                startValue:null,
                endValue:null,
                loading:false
            });
            const val = this.modelVal.splice(0,1);
                if(val.length>0){
                    this.setState({
                        title:val[0].name,
                        id:val[0].id,
                        visible:true,
                })
            }
        })
    }
    
    queryFiles = (callback)=>{
        const {startValue,endValue,id} = this.state;
        if(!startValue || !endValue){
           return message.info('请选择录像资源时间段！');
        }
        this.setState({loading:true});
        const beginTime = parseInt(startValue/1000); const endTime = parseInt(endValue/1000);
        this.props.pkVhelper.OSSQueryFile(id,0,beginTime,endTime,0, "", 0, 10,(result)=>{
            if(result.Error == 0 ){
                this.setState({files:result.File},callback);
            }else{
                message.error('录像资源获取失败！请重新尝试');
                this.setState({loading:false});
            }
        })
    }

    onhandleDateChange = (stateName)=>(e)=>{
        this.setState({[stateName]:e});
    }
    
    downLoadOcx = ()=>{
        if(IETester(window.navigator.userAgent)){
            const WebPlayWnd = document.getElementById('WebPlayWnd');
            try{
                WebPlayWnd.ChangeWndNum(0);
            }catch(e){
                console.log(e);
                return <p style={{color:'#000',lineHeight:'100px',fontSize:'18px',marginLeft:'40px'}}>请先下载再安装视频播放控件，<a href={ocxUrl+"/video/ocx.exe"}>点击下载</a>!</p>
            }
        }
    }

    render(){
        let html = this.downLoadOcx();
        if(html) return html;
        this.downLoadOcx =()=>{};
        const { treeResult ,video, vhelper ,treerelative ,pkVhelper,pkVideo } = this.props;
        const height = window.innerHeight-70;
        const {loading} = this.state;
        
        return (
          <div className={styles.videoSystem} style={{height:`${height}px`}}>
            <div className={styles.sidebar}>
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab={<span>资源树</span>} key="1">
                  <div className={`${this.state.treekey != 1 ? 'hide':styles.contant}`}>
                    <Tree
                      jheight={-404}
                      treeResult={treeResult}
                      treerelative={treerelative}
                      onCheck={this.onCheck}
                      helper={this.props.vhelper}
                    />
                    <div className={styles.yunContral}>
                      <Yun  
                        helper={this.props.vhelper}
                      />
                    </div>
                  </div>
                  <div className={this.state.treekey != 2 ? 'hide':''}>
                    <Tree
                      jheight={-164}
                      treeResult={treeResult} 
                      treerelative={treerelative}
                      onCheck={this.onCheckpk}
                      helper={this.props.pkVhelper}
                      dcheckedid ={this.state.dcheckedid}
                    />
                  </div>
                </TabPane>
                <TabPane tab={<span>收藏</span>} key="2">
                    开发中
                </TabPane>
              </Tabs>
            </div>
              
            {IETester(window.navigator.userAgent)? (
              <div
                className={styles.videoContainer} 
                style={{display: this.state.visible? 'none':''}}
              >
                <Video 
                  treeChange={this.treeChange}
                  getVideo={this.getVideo}
                  getVideohelper={this.getVideohelper}
                  pkVhelper={pkVhelper}
                  pkVideo={pkVideo}
                  video={video}
                  vhelper={vhelper}
                  onDrop={this.onDrop}
                  setVideoNumber={this.setVideoNumber}
                  videonumber={this.state.videonumber}
                  pkvideoNumber={this.state.pkvideoNumber}
                />
              </div>
            ):message.error('当前浏览器不支持视频播放，请您使用10及以上版本的IE浏览器!')}
            <Modal
              wrapClassName={styles.videoWrap}
              width="540px"
              destroyOnClose
              title={this.state.title}
              centered 
              visible={this.state.visible}
              onOk={this.handleOK}
              onCancel={this.handleCancel}
            >
              <div className='clearfix'>
                <span style={{float: 'left',lineHeight: '29px'}}>播放时段
                  <span style={{color: "red", marginLeft: "5px",marginRight:'5px'}}>*</span>
                </span>
                <DateInput
                  className={styles.datainput}
                  onhandleStartDateChange={this.onhandleDateChange('startValue')}
                  onhandleEndDateChange={this.onhandleDateChange('endValue')}
                />
                {loading ? <Icon type="loading" style={{ fontSize: 24 ,color:'#1890ff',marginLeft:'10px'}} spin />:''}
              </div>
            </Modal>
          </div>
)
    }
}

