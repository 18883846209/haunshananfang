/*
 * @Author: quezhongyou 
 * @Date: 2018-08-08 15:39:33 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-08-27 19:49:23
 * @description 视频巡逻状态管理
 */

import { getResTree } from '../services/videoSystem';

export default {
    namespace: 'videoSystem',
    state: {
        treeResult:[],
        treerelative:{},
        video: null,
        vhelper:null,
        pkVideo:null,
        pkVhelper:null,
    },
    effects:{
        
        /**
         * 
         * @param {*} param0 
         * @param {*} param1 
         * @description 资源树抓取
         */
        *fetchResTree({ payload },{ call , put }){
            const response = yield call(getResTree,payload);
            // id和设备关系
            const treerelative = {}; const treeResult = [response.data];
            function relative(data,tree){
                tree.forEach(item=>{
                    data[item.id] = item.pPid;
                    data[`${item.id}name`] = item.name;
                    if(item.children){
                        relative(data,item.children);
                    }
                })
            };
            relative(treerelative,treeResult);
            
            yield put({
                type:'save',
                padload:{
                    treeResult,
                    treerelative,
                },
            })
        },
        *getVideo({payload},{put}){
            yield put({
                type:'save',
                padload:{
                    video:payload,
                },
            })
        },
        *getVideohelper({payload},{put}){
            yield put({
                type:'save',
                padload:{
                    vhelper:payload,
                },
            })
        },
        *getpkVideo({payload},{put}){
            yield put({
                type:'save',
                padload:{
                    pkVideo:payload,
                },
            })
        },
        *getpkVideohelper({payload},{put}){
            yield put({
                type:'save',
                padload:{
                    pkVhelper:payload,
                },
            })
        },
    },
    reducers:{
        save(state,{ padload }){
            return {
                ...state,
                ...padload,
            }
        },
    },
}