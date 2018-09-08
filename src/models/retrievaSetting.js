import { personnelRetrievaSearchlink,tollgateinfolink,tollgateinfolinkline } from '../services/personnelRetrieva';

export default {
    namespace: 'retrievaSetting',

    state: {
        listResult:{},
        tollgatelistResult:{},
        tollgatelistlineResult: {},
    },

    effects: {
        *searchlist({payload},{call,put}){
            const response = yield call(personnelRetrievaSearchlink,payload);
            yield put({
                type: 'list',
                payload: response,
            });
        },
        *searchtollgatelist({payload},{call,put}){
            const response = yield call(tollgateinfolink,payload);
            yield put({
                type: 'tollgatelist',
                payload: response,
            });
        },
        *searchtollgatelistline({payload},{call,put}){
            const response = yield call(tollgateinfolinkline,payload);
            yield put({
                type: 'tollgatelistline',
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
        tollgatelist(state,action){
            return {
                ...state,
                tollgatelistResult: action.payload,
            }
          },
          tollgatelistline(state,action){
            return {
                ...state,
                tollgatelistlineResult: action.payload,
            }
          },
    },
}