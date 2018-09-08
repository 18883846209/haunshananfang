import { carSearch , exportTable} from '../services/carsearch';

export default {
    namespace: 'carSearch',

    state: {
        searchResult:{},
    },

    effects: {
        *search({payload},{call,put}){
            const response = yield call(carSearch,payload);
            yield put({
                type: 'searchRul',
                payload: response,
            });
        },
        *exportTable({payload},{call,put}){
            const response = yield call(exportTable,payload);
        },
    },

    reducers: {
        searchRul(state,action){
        return {
            ...state,
            searchResult: action.payload,
        }
      },
    },
}