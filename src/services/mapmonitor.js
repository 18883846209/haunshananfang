import { stringify } from 'qs';
import request from '../utils/request'


export async function mapMonitor(params) {
  return request(`/gislayer/listByArea?latTop=${params.latTop}&&latBottom=${params.latBottom}&&lonTop=${params.lonTop}&&lonBottom=${params.lonBottom}&&datetime=${new Date().getTime()}`);
}

export async function searchPoint(params) {
  return request(`/gispoint/findByName?name=${params}`);
}

export async function getAllLayer(params) {
  return request('/gislayer/listLayerAll');
}

export async function addLayer(params) {
  return request('/gislayer/add',{
    method:'POST',
    body:params,
  });
}

export async function addPoint(params) {
  return request('/gispoint/batchAdd',{
    method:'POST',
    body:params,
  });
}
