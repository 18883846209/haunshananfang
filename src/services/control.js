import { stringify } from 'qs';
import request from '../utils/request'

export async function tollgateinfolink(params) {
    return request('/tollgateinfo/query');
}

export async function getContolList(params) {
    const url = `pageNo=${params.page}&size=${params.size}&orderFiled=${params.word}&orderRule=${params.rule}&keyWord=${params.key}&datetime=${params.datetime}`;
    return request(`/disposition/object/feature/list?${  url}`);
}

export async function addControlTask(params) {
  return request('/disposition/object/feature/add',{
      method: 'POST' ,
      body: params,
  });
}

export async function deleteControlTask(params) {
    return request(`/disposition/object/feature/delete?id=${params.id}`);
  }

export async function queryDispositionResult(params) {
    const url = `pageNo=${params.page}&size=${params.size}&orderFiled=${params.word}&orderRule=${params.rule}&keyWord=${params.key}`;
    return request(`/disposition/result/queryDispositionResult?${url}`);
}
export async function queryNameList(params) {
    return request(`/vms/initedtree?treeType=${params.treeType}&deviceType=${params.deviceType}`);
}
export async function querySearchList(params) {
    return request(`/disposition/object/feature/search?pageNo=${params.pageNo}&size=${params.size}&keyWord=${params.keyWord}&orderFiled=${params.orderFiled}&orderRule=${params.orderRule}`);
}
export async function alarmSearchList(params) {
    return request(`/disposition/result/search?pageNo=${params.pageNo}&size=${params.size}&keyWord=${params.keyWord}&orderFiled=${params.orderFiled}&orderRule=${params.orderRule}`);
}
export async function updateDispositionStatus(params) {
    return request(`/disposition/object/feature/updateDispositionStatus?dispositionID=${params.id}&dispositionStatus=${params.status}`);
}
export async function alarmMap(params) {
    return request('/tollgategis/findAllDispositionGis');
}