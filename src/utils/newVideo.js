/*
 * @Author: quezhongyou 
 * @Date: 2018-08-20 10:09:42 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-09-03 17:38:34
 */
import {message} from 'antd';

export default class Video {
  /**
   * 
   * @param {*} ocxUI          UI构建
   * @param {*} ocxContral     操作控制
   */
  constructor(ocxUI, ocxContral,name) {
    this.name = name ;
    this.ocxUI = ocxUI;
    this.ocxContral = ocxContral;
    this.ocxQueue = {};
    this.isLogin = false;
    this.isForkPUList = false;
    this.reLogin = ()=>{};
    this.windowNumber = 0; // 已创建窗口数
    this.PdWndIndex = {}; // 设备id和窗口索引

   /**
   * 
   * @param {*} index 
   */
  this.InstantReplay = (()=>{
    let id,time = 0;
    return (index,callback)=>{
      time = Math.min(time+10,30);
      if(id)clearTimeout(id);
      id = setTimeout(()=>{
        message.info(`及时回放${time}秒。`);
        this.ocxContral.SetInstantReplayDuration(this.ocxUI.GetHWnd(index),time);
        this.ocxContral.InstantReplay(this.ocxUI.GetHWnd(index));
        setTimeout(callback,time*1000);
        time = 0;id = null;
      },500)
    }
  })()
  
}
  registryOcx(id,callback){
    this.ocxQueue[id] = callback;
  }

  /**
   * 
   * @param {*} szIP 
   * @param {*} lPort 
   * @param {*} szUsername 
   * @param {*} szPassword 
   * @description 登录
   */
  Login(szIP, lPort, szUsername, szPassword,callback =()=>{}) {
    this.reLogin = ()=>{
      this.Login(szIP, lPort, szUsername, szPassword,callback);
    }
    const id = this.ocxContral.Login(szIP, lPort, szUsername, szPassword);
    this.registryOcx(id,(result)=>{
      if(result.Error == 0){
        this.isLogin = true;
      };
      callback(result)
    });
  }

  /**
   * @deprecated 退出登录
   */
  Logout() {
    return this.ocxContral.Logout();
  }

  getpuidByindex(index){
    let puid = null;
    for(const key in this.PdWndIndex){
      if(this.PdWndIndex[key] == index){
        puid = key;
      }
    }
    return puid;
  }

  /**
   * @description 创建窗口
   * @param {*} number 
   */
  createWinNum(number) {
    let success = -1;
    const num = Math.ceil(Math.sqrt(number));
    if (number >= 0) {
      success = this.ocxUI.ChangeWndNum(num - 1);
    }
    if (success === 0) {
      this.windowNumber = Math.pow(num, 2);
      return true;
    }
    return false;
  }

  /**
   * 
   * @param {*} pid     设备id
   * @description       删除视频，清除设备id和窗口索引关系。
   */
  _deleteVideo(puid,callback = ()=>{}) {
    const index = this.PdWndIndex[puid];
    let success = false; 
    if (typeof index !== "undefined") {
      const response = this.ocxContral.StopStream(this.ocxUI.GetHWnd(index));
      success = response == 0;
      if (success) {
        delete this.PdWndIndex[puid];
        callback(index);
      }
    }
    return success;
  }

  /**
   * @description   删除所有资源
   */
  deleteAllVideo(){
    for(const key in this.PdWndIndex){
      this._deleteVideo(key);
    }
  }

  /**
   * 
   * @param {*} puid 
   * @param {*} channelIndex 
   * @param {*} streamType 
   * @param {*} index 
   * @description              创建视频，绑定设备id和窗口索引关系。
   */
  _createVideo(puid, channelIndex, streamType, index, callback = ()=>{}) {
    let hwnd = this.ocxUI.GetHWnd(index);
    this.PdWndIndex[puid] = index;
    this.registryOcx(this.ocxContral.ForkOnePU(puid),(result)=>{
      if(result.Error == 0){
        const success = this.ocxContral.StartStream(puid, channelIndex, streamType, hwnd);
        if(success == 0){
        //  this.PdWndIndex[puid] = index;
        }else{
          message.error(`设备ID:${puid}。资源获取失败，请重新尝试！`);
        }
      }else{
          this.reLogin();
          message.error(`构建单一设备失败,请重新尝试！`);
      }
      callback();
    })
  }

  /**
   * 
   * @param {*} puid 
   * @param {*} pszFile 
   * @param {*} index 
   * @param {*} direction 
   * @param {*} startTime 
   * @param {*} duration 
   * @description             创建录像视频，绑定设备id和窗口索引关系。
   */
  _createPKVideo(szid,index,direction,startTime,endTime){
    const hwnd = this.ocxUI.GetHWnd(index);
    this.PdWndIndex[szid] = index;
    return this.ocxContral.OSSVODTime(hwnd, szid, direction, startTime, endTime);
  }

  ForkPUList(offset, count,callback= ()=>{}) {
    if(this.Login){
      this.registryOcx(this.ocxContral.ForkPUList(offset, count),(result)=>{
        if(result.Error == 0){
          this.isForkPUList = true;
        }
        callback(result);
      })
    }
  }

  deleteVideo(pid,callback) {
    return this._deleteVideo(pid,callback);
  }

  /**
   * 
   * @param {*} szPUID 
   * @param {*} channelIndex 
   * @param {*} streamType 
   * @description               强制创建视频
   */
  
  forceCreateRTVideo(szPUID, channelIndex, streamType,callback) {
    if(!this.isLogin || !this.isForkPUList){
      return message.info(`平台可能正在登陆，请稍后重试或刷新页面。`);
     }
    //创建单个视频
    const createOneRTVideo = (szPUID) =>{
      const videoNum = Object.keys(this.PdWndIndex).length;
      let puid = szPUID.splice(0,1)[0];
      if( typeof puid != 'undefined'){
        if (this.windowNumber  > videoNum || this.createWinNum(1 + videoNum)){
          if (typeof this.PdWndIndex[puid] == "undefined" || this._deleteVideo(puid)) {
              let windowValue = 0;
              for(let i=0;this.windowNumber > i;i++){
                 if(!this.getpuidByindex(i)){
                   windowValue = i;
                    break;
                 }
              }
              this._createVideo(puid, channelIndex, streamType, windowValue,()=>{
                createOneRTVideo(szPUID);
              });
          }
        }
      }else{
        callback();
      }
    }
    createOneRTVideo(szPUID);
  }
  /**
   * 
   * @param {*} type   枚举类型
   * @param {*} i      窗口坐标
   * @description      方向控制
   */
  PTZControl(type ,i){
   const index = typeof i !=='undefined'? i : this.ocxUI.GetCurWndIndex(); let puid = null;
   for(const key in this.PdWndIndex){
    if(this.PdWndIndex[key] == index){
      puid = key;
    }
   }
   if(puid){
    this.ocxContral.PTZControl(type, puid, 0, 1);
   }
  }
  
  /**
   * 
   * @param {*} index    标志
   * @param {*} path     路径
   * @description        本地抓图
   */
  CapturePic(index,path){
    this.ocxContral.CapturePic(this.ocxUI.GetHWnd(index), path);
    message.info('抓图成功！');
  }

  /**
   * 
   * @param {*} index       
   * @param {*} path 
   * @param {*} maxFileTime 
   * @description           本地视频下载
   */
  StartRecordLocal(index,path,maxFileTime){
    this.ocxContral.StartRecordLocal(this.ocxUI.GetHWnd(index), path,maxFileTime);
  }
  
  /**
   * 
   * @param {*} index 
   */
  StopRecordLocal(index){
    this.ocxContral.StopRecordLocal(this.ocxUI.GetHWnd(index));
  }

  /**
   * 
   * @param {*} index 
   */
  GetVODProgress(index){
    this.ocxContral.GetVODProgress(this.ocxUI.GetHWnd(index));
  }

  /**
   * 
   * @param {*} bAudioFlag       声音
   * @param {*} bTalkFlag        话筒
   * @param {*} bRecordFlag      录像
   * @param {*} bQuickPlayFlag   即时回放
   * @description                标签状态
   */
  SetButtonStatus(bAudioFlag, bTalkFlag, bRecordFlag,  bQuickPlayFlag){
    this.ocxUI.SetButtonStatus(bAudioFlag, bTalkFlag, bRecordFlag,  bQuickPlayFlag)
  }

  /**
   * 
   * @param {*} boolean 
   * @description        窗口类型切换
   */
  realplay(boolean){
    this.ocxUI.SetRealPlayFlag(boolean);
  }

  FullScreen(){
    this.ocxUI.SetFullScreen();
  }


  /**
   * 
   * @param {*} szPUID 
   * @param {*} pszFile 
   * @param {*} direction 
   * @param {*} startTime 
   * @param {*} duration 
   * @description            视频录像回放
   */
  // OSSVODFile(szid,pszFile,direction,startTime,duration){
  //   const videoNum = Object.keys(this.PdWndIndex).length;
  //   if (this.windowNumber  > videoNum || this.createWinNum(1 + videoNum)){
  //     if (typeof this.PdWndIndex[szid] === "undefined" || this._deleteVideo(szid)) {
  //         const videoNum = Object.keys(this.PdWndIndex).length;
  //         // this._createPKVideo(szid,videoNum,direction,startTime,endTime);
  //         this._createPKVideo(szid,pszFile, videoNum ,direction,startTime,duration)
  //     }
  //   }
  // }
  
  
  OSSVODTime(szid,direction,startTime,endTime){
    if(!this.isLogin || !this.isForkPUList){
      return message.info(`平台可能正在登陆，请稍后重试或手动登陆。`);
    }
    const videoNum = Object.keys(this.PdWndIndex).length;
    if (this.windowNumber  > videoNum || this.createWinNum(1 + videoNum)){
      if (typeof this.PdWndIndex[szid] === "undefined" || this._deleteVideo(szid)) {
          let windowValue = 0;
          for(let i=0;this.windowNumber > i;i++){
            if(!this.getpuidByindex(i)){
              windowValue = i;
                break;
            }
          }
          console.log(this._createPKVideo(szid,windowValue,direction,startTime,endTime));
      }
    }
  }

  /**
   * 
   * @param {*} szPUID 
   * @param {*} channelIndex 
   * @param {*} beginTime 
   * @param {*} endTime 
   * @param {*} type 
   * @param {*} reason 
   * @param {*} offset 
   * @param {*} count 
   * @description  获取录像文件
   */
  OSSQueryFile(szPUID,channelIndex,beginTime,endTime,type,reason,offset,count,callback){
    this.registryOcx(this.ocxContral.ForkOnePU(szPUID),(result)=>{
      if(result.Error == 0){
        this.registryOcx(this.ocxContral.OSSQueryFile(szPUID,channelIndex,beginTime,endTime,type,reason,offset,count),(result)=>{
          callback(result);
        });
      }else{
        this.reLogin();
         message.info(`构建单一设备失败,请重新尝试！`);
      }
    })
  }

  /**
   * 
   * @param {*} i    窗口下标
   * @description    录像暂停
   */
  OSSVODPause(i){
    const index = typeof i !=='undefined'? i : this.ocxUI.GetCurWndIndex();
    this.ocxContral.OSSVODPause(this.ocxUI.GetHWnd(index));
  }

 /**
   * 
   * @param {*} i    窗口下标
   * @description    录像暂停
   */
  OSSVODResume(i){
    const index = typeof i !=='undefined'? i : this.ocxUI.GetCurWndIndex();
    this.ocxContral.OSSVODResume(this.ocxUI.GetHWnd(index));
  }
  
/**
   * 
   * @param {*} i        窗口下标
   * @param {*} number   播放速度2的次方
   * @description        播放速度
   */
  OSSSetSpeed(number,i){
    const index = typeof i !=='undefined'? i : this.ocxUI.GetCurWndIndex(); let puid = null;
    puid = this.getpuidByindex(index);
    if(puid) {
      this.ocxContral.OSSSetSpeed(this.ocxUI.GetHWnd(index),number);
    }
  }
   
  /**
   * 
   * @param {*} i   下标
   * @description   单针播放
   */
  PlayOneByOne(i){
    const index = typeof i !=='undefined'? i : this.ocxUI.GetCurWndIndex();
    //console.log(index,this.ocxUI.GetHWnd(index));
    if(index >=0) this.ocxContral.PlayByFrame(this.ocxUI.GetHWnd(index), 0);
  }

   /**
   * 
   * @param {*} i   下标
   * @description   单针停放
   */
  ResumePlayByFrame(i){
    const index = typeof i !=='undefined'? i : this.ocxUI.GetCurWndIndex();
    if(index >=0) this.ocxContral.ResumePlayByFrame(this.ocxUI.GetHWnd(index));
  }
 
  /**
   * 
   * @param {*} i 
   * @param {*} x 
   * @param {*} y 
   * @param {*} w 
   * @param {*} h 
   * @param {*} order 
   * @description         电子放大
   */
  ZoomInOut(x,y,w,h,order = 1,i){
    const index = typeof i !=='undefined'? i : this.ocxUI.GetCurWndIndex();
    if(index>=0) this.ocxContral.ZoomInOut(this.ocxUI.GetHWnd(index),x,y,w,h,order)
  }

  /**
   * 
   * @param {*} index 
   * @description  对讲
   */
  OpenTalk(index,ocxUI){
    let puid = null;
    for(const key in this.PdWndIndex){
      if(this.PdWndIndex[key] == index){
        puid = key;
      }
     }
     if(puid){
      this.ocxContral.OpenTalk(puid, 0, ocxUI.GetHWnd(index));
     }
  }

  /**
   * 
   * @param {*} index 
   * @description      关闭对讲
   */
  CloseTalk(index,ocxUI){
    this.ocxContral.CloseTalk(ocxUI.GetHWnd(index));
  }

   /**
   * 
   * @param {*} index 
   * @description  声音
   */
  OpenSound(index){
      this.ocxContral.OpenSound(this.ocxUI.GetHWnd(index));
  }

  /**
   * 
   * @param {*} index 
   * @description     关闭声音
   */
  CloseSound(index){
    this.ocxContral.CloseSound(this.ocxUI.GetHWnd(index));
  }

  CloseBtn(index,callback){
    const puid = this.getpuidByindex(index);
    if(puid){
      this.deleteVideo(puid,callback);
    }
  }
}





