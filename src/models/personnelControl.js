import { 
    tollgateinfolink,
    getContolList, 
    addControlTask,
    deleteControlTask, 
    queryDispositionResult, 
    queryNameList,
    querySearchList,
    alarmSearchList,
    alarmMap, 
    updateDispositionStatus, 
} from '../services/control';

export default {
    namespace: 'personnelControl',

    state: {
        addResult:{},
        deleteResult:{},
        tollgatelistResult:{},
        listResult:{},
        dispositionResult:{},
        tollgateSearclistResult:{},
        getAlarmResult:{},
        changeResult: {},
        alarmMapResult:{},
    },

    effects: {
        *doAddTask({payload},{call,put}){
            const response = yield call(addControlTask,payload);
            yield put({
                type: 'addTask',
                payload: response,
            });
        },
        *doDeleteTask({payload},{call,put}){
          const response = yield call(deleteControlTask,payload);
          yield put({
              type: 'deleteTask',
              payload: response,
          });
        },
        *queryTollgateList({payload},{call,put}){
            const response = yield call(queryNameList,payload);
            yield put({
                type: 'tollgatelist',
                payload: response,
            });
        },
        *queryAllSearchList({payload},{call,put}){
            const response = yield call(querySearchList,payload);
            yield put({
                type: 'tollgateSearclist',
                payload: response,
            });
        },
        *queryAlarmSearchList({payload},{call,put}){
            const response = yield call(alarmSearchList,payload);
            yield put({
                type: 'getAlarm',
                payload: response,
            });
        },
        *getTaskList({payload},{call,put}){
          const response = yield call(getContolList,payload);
          yield put({
              type: 'getList',
              payload: response,
          });
        },
        *getDispositionList({payload},{call,put}){
          const response = yield call(queryDispositionResult,payload);
          yield put({
              type: 'getDisposition',
              payload: response,
          });
        },
        *changeConctolStatus({payload},{call,put}){
          const response = yield call(updateDispositionStatus,payload);
          yield put({
              type: 'changeStatus',
              payload: response,
          });
        },
        *getAlarmMapData({payload},{call,put}){
            const response = yield call(alarmMap,payload);
            yield put({
                type: 'alarmMapData',
                payload: response,
            });
        },
    },

    reducers: {
      addTask(state,action){
        return {
            ...state,
            addResult: action.payload,
        }
      },
      deleteTask(state,action){
        return {
            ...state,
            deleteResult: action.payload,
        }
      },
      tollgatelist(state,action){
        return {
            ...state,
            tollgatelistResult: action.payload,
        }
      },
      getList(state,action){
        return {
            ...state,
            listResult: action.payload,
        }
      },
      getDisposition(state,action){
        return {
            ...state,
            dispositionResult: action.payload,
        }
      },
      tollgateSearclist(state,action){
        return {
            ...state,
            tollgateSearclistResult: action.payload,
        }
      },
      getAlarm(state,action){
        return {
            ...state,
            getAlarmResult: action.payload,
        }
      },
      changeStatus(state,action){
        return {
            ...state,
            changeResult: action.payload,
        }
      },
      alarmMapData(state,action){
        return {
            ...state,
            alarmMapResult: action.payload,
        }
      },
    },
}