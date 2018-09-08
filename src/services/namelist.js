import { stringify } from 'qs';
import request from '../utils/request'

export async function getNameListLibrary(params) {
    return request(`/list_lib_info/list?searchKey=${params.searchKey}&page=${params.page}&size=${params.size}&order=${params.order}&desc=${params.desc}&datetime=${params.datetime}`);
}

// 直接获取名单库所有名单
export async function getNameListAll(params) {
    return request(`/list_lib_info/idList`);
}

export async function getNameType(params) {
    return request('/list_lib_type/list');
}

export async function queryPictrueLists(params) {
    return request(`/image_storage_path/imglist?idListLib=${params.id}&page=${params.page}&size=${params.size}`);
}

export async function doDeleteLibList(params) {
    return request(`/list_lib_info/delete?idListLib=${params.id}&featurelibId=${params.fId}`);
}

export async function createNewNameList(params) {
    return request('/list_lib_info/add',{
        method: 'POST',
        body: params,
    });
}

export async function importPicture(params) {
    return request('/list_lib_info/import',{
        method: 'POST',
        body: params,
    });
}


