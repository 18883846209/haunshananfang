// import { stringify } from 'qs';
import request from '../utils/request';

// export async function tollgateinfo(params) {
//   return request('/tollgateinfo/query');
// }
// 直接获取名单库所有名单
export async function getNameListAll(params) {
  return request(`/list_lib_info/idList`);
}