/*
 * @Author: quezhongyou 
 * @Date: 2018-08-08 15:42:03 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-09-05 13:44:44
 */
import { stringify } from 'qs';
import request from '../utils/request';

const host = window.SSystem.tree ;

/**
 * 
 * @param {*} params 
 * @description 资源树
 */
export async function getResTree(params) {
    return request(`${host}/vms/restree?${stringify(params)}`,{origin:true});
}
