import { mapMonitor,addLayer,addPoint,getAllLayer,searchPoint} from '../services/mapmonitor';

export default {
    namespace: 'mapMonitor',

    state: {
        listResult:{},
        addLayerResult:{},
        addPointResult:{},
        getLayerResult:{},
        searchResult:{},
    },

    effects: {
        *searchlist({payload},{call,put}){
            const response = yield call(mapMonitor,payload);
            yield put({
                type: 'list',
                payload: response,
            });
        },
        *addlayer({payload},{call,put}){
            const response = yield call(addLayer,payload);
            yield put({
                type: 'layer',
                payload: response,
            });
        },
        *addpoint({payload},{call,put}){
            const response = yield call(addPoint,payload);
            yield put({
                type: 'point',
                payload: response,
            });
        },
        *getlayer({payload},{call,put}){
            const response = yield call(getAllLayer,payload);
            yield put({
                type: 'layerlist',
                payload: response,
            });
        },
        *searchpoint({payload},{call,put}){
            const response = yield call(searchPoint,payload);
            yield put({
                type: 'listsearch',
                payload: response,
            });
        },
    },

    reducers: {
        list(state,action){
          return {
              ...state,
              listResult: action.payload,
          }
        },
        layer(state,action){
            return {
                ...state,
                addLayerResult: action.payload,
            }
        },
        point(state,action){
            return {
                ...state,
                addPointResult: action.payload,
            }
        },
        layerlist(state,action){
            return {
                ...state,
                getLayerResult: action.payload,
            }
        },
        listsearch(state,action){
            return {
                ...state,
                searchResult: action.payload,
            }
        },
    },
}