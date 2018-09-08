/*
 * @Author: quezhongyou 
 * @Date: 2018-08-10 15:18:08 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-08-20 10:10:07
 */



export default class Video {
    constructor(ocxUI,ocxContral){
        this.ocxUI =ocxUI;
        this.ocxContral = ocxContral;
        this.windowKeys = [];
        this.windowNumber = 0;
        this.idhwen = {};
    }

    /**
     * 
     * @param {*} szIP 
     * @param {*} lPort 
     * @param {*} szUsername 
     * @param {*} szPassword 
     * @description 登录
     */
    Login(szIP,lPort,szUsername,szPassword){
      return this.ocxContral.Login(szIP,lPort,szUsername,szPassword);
    }
    
    /**
     * @deprecated 退出登录
     */
    Logout(){
        return this.ocxContral.Logout();
    }

    /**
     * @description 创建窗口句柄 ,窗口句柄不能大于窗口数
     */
    _createWindowkey(index){
        return this.ocxUI.GetHWnd(index);
    }

    /**
     * @description 创建窗口
     * @param {*} number 
     */
    createWinNum(number){
        let success =-1; const num = Math.ceil(Math.sqrt(number));
        if(number>= 0){
            success = this.ocxUI.ChangeWndNum(num-1);
        }
        if(success === 0){
            this.windowNumber = num;
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {*} index        窗口索引0-3
     * @param {*} callback 
     * @description            视频必须小于窗口数,执行callback创建视频
     */
    _createVideo(index,callback){
        // 如果窗口数小于index，将执行失败
        if(this.windowNumber <= index){
            return false;
        }
        // 如果没有窗口句柄，创建
        let windowkey = this.windowKeys[index];
        if(!windowkey){
            windowkey = this._createWindowkey(index);
            this.windowKeys[index] = windowkey;
        }
        return callback(windowkey);
    }

    /**
     * 
     * @param {*} szPUID 
     * @param {*} lChannelIndex 
     * @param {*} lStreamType 
     * @param {*} index 
     * @description 强制创建视频
     */
    _forceCreateVideo(index,callback){
        let isCreateVideo = true;
        if(this.windowNumber*this.windowNumber <= index){
            isCreateVideo = this.createWinNum(index);
        }
        if(isCreateVideo){
          return this._createVideo(index,callback);
        }else{
            return false;
        }
    }
    
      /**
     * 
     * @param {*} szPUID 
     * @param {*} lChannelIndex 
     * @param {*} lStreamType 
     * @param {*} index 
     * @description 强制创建视频
     */
    _newforceCreateVideo(index,callback){
        let isCreateVideo = true;
        if( this.windowNumber*this.windowNumber <= index){
            isCreateVideo = this.createWinNum(index);
        }
        if(isCreateVideo){
          return callback()
        }else{
            return false;
        }
    }

   /**
    * 
    * @param {*} szPUID 
    * @param {*} ChannelIndex 
    * @param {*} BeginTime 
    * @param {*} EndTime 
    * @param {*} szReason 
    * @param {*} Count 
    * @param {*} Offset 
    * @description        录制视频播放
    */
    createVOD(szPUID,ChannelIndex,BeginTime,EndTime,szReason,Count,Offset,Duration){
       const VODList = this.ocxContral.OSSQueryFile(szPUID,ChannelIndex,BeginTime,EndTime,szReason,Offset = 0,Count); const self = this;
       VODList.forEach(( item , index )=>{
            self._forceCreateVideo(index,(windowkey)=>{
                self.ocxContral.OSSVODFile(item.szID,item.szFile,BeginTime,Duration,windowkey);
            })
       })
    }

    /**
     * 
     * @param {*} szPUID            设备ID 
     * @param {*} ChannelIndex      通道索引
     * @param {*} StreamType        码流类型 
     * @param {*} index             窗口索引0-3
     * @description                 创建实时视频
     */
    createRealTimeVideo(szPUID,ChannelIndex,StreamType,index = this.windowKeys.length){
       return this._createVideo(index,(windowkey)=>{
            this.ocxContral.ForkOnePU(szPUID);
            return this.ocxContral.StartStream(windowkey,szPUID,ChannelIndex,StreamType) == 0;
        })
    }

    /**
     * 
     * @param {*} szPUID            设备ID 
     * @param {*} ChannelIndex     通道索引
     * @param {*} StreamType       码流类型 
     * @param {*} index             窗口索引0-3
     * @description                 创建实时视频
     */
    forceCreateRealTimeVideo(szPUID , ChannelIndex , StreamType , index = this.windowKeys.length){
        return this._forceCreateVideo(index,(windowkey)=>{
            this.ocxContral.ForkOnePU(szPUID);
            alert(this.windowNumber);
           return this.ocxContral.StartStream(szPUID,ChannelIndex,StreamType,windowkey) == 0;
        })
    }

    ForkPUList(offset,count){
        return  this.ocxContral.ForkPUList(offset,count);
    }

    /**
     * 
     * @param {*} pid     设备id
     * @description       删除视频
     */
    deleteVideo(pid){
        const index = this.idhwen[pid];
        if(typeof index !== "undefined"){
           return this.ocxContral.StopStream(this.ocxUI.GetHWnd(index)) == 0;
        }
        return false;
    }
    
    /**
     * @description 全屏
     */
    FullScreen(){
       return this.ocxContral.FullScreen();
    }

    newforceCreateRealTimeVideo(szPUID , ChannelIndex , StreamType){
        const len = szPUID.length; const self=this;
         this._newforceCreateVideo(len,()=>{
            szPUID.forEach((item,index)=>{
                self.idhwen[item] = index;
                self.deleteVideo(item);
                self.ocxContral.ForkOnePU(item);
                self.ocxContral.StartStream(item,ChannelIndex,StreamType,self.ocxUI.GetHWnd(index)) == 0;
            });
        })
    }

}