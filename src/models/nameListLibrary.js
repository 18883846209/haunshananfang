import { getNameListLibrary,getNameListAll,getNameType,createNewNameList,importPicture,queryPictrueLists,doDeleteLibList } from '../services/namelist';

export default {
    namespace: 'nameListLibrary',

    state: {
        namelistResult:{},
        nameListAll:{},
        typeList:{},
        addlist:{},
        importRes:{},
        pictureRes:{},
        deleteRes:{},
    },

    effects: {
        *getnamelist({payload},{call,put}){
            const response = yield call(getNameListLibrary,payload);
            yield put({
                type: 'getlist',
                payload: response,
            });
        },
        *getnamelistall({payload},{call,put}){
            const response = yield call(getNameListAll,payload);
            yield put({
                type: 'getlistAll',
                payload: response,
            });
        },
        *getnametype({payload},{call,put}){
            const response = yield call(getNameType,payload);
            yield put({
                type: 'gettype',
                payload: response,
            });
        },
        *creatNewList({payload},{call,put}){
            const response = yield call(createNewNameList,payload);
            yield put({
                type: 'creatlist',
                payload: response,
            });
        },
        *importPic({payload},{call,put}){
            const response = yield call(importPicture,payload);
            yield put({
                type: 'importPicRes',
                payload: response,
            });
        },
        *getPictrueLists({payload},{call,put}){
            const response = yield call(queryPictrueLists,payload);
            yield put({
                type: 'getPictures',
                payload: response,
            });
        },
        *doDeleteLib({payload},{call,put}){
            const response = yield call(doDeleteLibList,payload);
            yield put({
                type: 'deleteLib',
                payload: response,
            });
        },
    },

    reducers: {
        getlist(state,action){
        return {
            ...state,
            namelistResult: action.payload,
        }
      },
        getlistAll(state,action){
        return {
            ...state,
            nameListAll: action.payload,
        }
      },
      gettype(state,action){
        return {
            ...state,
            typeList: action.payload,
        }
      },
      creatlist(state,action){
        return {
            ...state,
            addlist: action.payload,
        }
      },
      importPicRes(state,action){
        return {
            ...state,
            importRes: action.payload,
        }
      },
      getPictures(state,action){
        return {
            ...state,
            pictureRes: action.payload,
        }
      },
      deleteLib(state,action){
        return {
            ...state,
            deleteRes: action.payload,
        }
      },
    },
}