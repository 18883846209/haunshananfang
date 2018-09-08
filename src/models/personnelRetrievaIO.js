import { personnelRetrievaSearchlink,
    // tollgateinfolink,
    // tollgateinfolinkline,
     getCardInfo, 
     getTaskList,
      newTask,
       deleteTask } from '../services/personnelRetrieva';

export default {
    namespace: 'personnelRetrievaIO',

    state: {
        listResult:{},
        tollgatelistResult:{},
        tollgatelistlineResult: {},
        cardInfo: {},
        listInfo: {},
        succinfo: {},
        delinfo: {}
    },

    effects: {
        *deletetask({payload},{call,put}){ // 删除任务
            const response = yield call(deleteTask,payload);
            yield put({
                type: 'delTask',
                payload: response,
            });
        },
        
        *createtask({payload},{call,put}){ // 新建任务
            const response = yield call(newTask,payload);
            yield put({
                type: 'createTask',
                payload: response,
            });
        },
        *searchlist({payload},{call,put}){ // 
            const response = yield call(personnelRetrievaSearchlink,payload);
            yield put({
                type: 'list',
                payload: response,
            });
        },
        // *searchtollgatelist({payload},{call,put}){
        //     const response = yield call(tollgateinfolink,payload);
        //     yield put({
        //         type: 'tollgatelist',
        //         payload: response,
        //     });
        // },
        // *searchtollgatelistline({payload},{call,put}){
        //     const response = yield call(tollgateinfolinkline,payload);
        //     yield put({
        //         type: 'tollgatelistline',
        //         payload: response,
        //     });
        // },
        *searchcard({payload}, {call, put}) {
            const response = yield call(getCardInfo, payload);
            yield put({
                type: 'getcard',
                payload: response,
            })
        },
        *searchList({payload}, {call, put}) {
            const response = yield call(getTaskList, payload);
            yield put({
                type: 'getTaskList',
                payload: response,
            })
        },
    },

    reducers: {
        delTask(state, action) {
            return {
                ...state,
                delinfo: action.payload,
            }
        },
        createTask(state, action) {
            return {
                ...state,
                succinfo: action.payload
            }
        },
        getTaskList(state, action) {
            return {
                ...state,
                listInfo: action.payload,
            }
        },
        getcard(state, action) {
            return {
                ...state,
                cardInfo: action.payload,
            }
        },
        list(state,action){
          return {
              ...state,
              listResult: action.payload,
          }
        },
        // tollgatelist(state,action){
        //     return {
        //         ...state,
        //         tollgatelistResult: action.payload,
        //     }
        //   },
        //   tollgatelistline(state,action){
        //     return {
        //         ...state,
        //         tollgatelistlineResult: action.payload,
        //     }
        //   },
    },
}