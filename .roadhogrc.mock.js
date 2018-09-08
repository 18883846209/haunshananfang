// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
const mockApiurl = 'http://192.168.105.203';
// const mockApiurl = 'http://192.168.105.236:3000/mock/18';
export default (noProxy ? {}: {
    'GET /mock/*':'http://192.168.105.236:3000',
    'GET /(.*)': mockApiurl,
    'POST /(.*)': mockApiurl,
});

