import { stringify } from 'qs';
import request from '../utils/request'

export async function personnelRetrievaSearchlink(params) {
    return request('/image/searchFaceByOne',{
        method: 'POST' ,
        body: params,
    });
}

export async function tollgateinfolink(params) {
    return request('/tollgateinfo/query');
}

export async function tollgateinfolinkline(params) {
    return request(`/tollgateinfo/query?placecode=${params}`);
}

export async function getCardInfo(params) { // 获取卡口信息
    return request(`/vms/freshtree/?treeType=0,1&category=${params}&t=${new Date().getTime()}`);
}
export async function getTaskList(params) { // 获取任务列表
    return request(`/task/list?searchKey=${params.key}&page=${params.page}&size=${params.size}&order=${params.order}&sort=${params.sort}&t=${new Date().getTime()}`);
}

export async function newTask(params) { // 新建任务
    return request(`/task/newTask`, {
        method: 'POST',
        body: params,
    });
}

export async function deleteTask(params) { // 删除任务
    return request(`/task/delete?vmsdeviceid=${params.Vmsdeviceid}&capturetype=${params.capturetype}&t=${new Date().getTime()}`);
}