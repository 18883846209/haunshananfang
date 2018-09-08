import {
  stringify,
} from 'qs';
import request from '../utils/request'

export async function carSearch(body) {

  return request('/viidCar/query', {
    method: 'post',
    body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export async function exportTable(body) {
  return request('/viidCar/export', {
    method: 'post',
    noJson:true,
    body,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then(response=>{
    const url = window.URL.createObjectURL(response.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = "filename.xlsx";
    a.click();
  })
}
