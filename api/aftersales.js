import request from '@/utils/request'

// 提交售后
/**
 * 
 订单号 orderCode;
 服务类型 0仅退款1退货退款 serviceType;
 申请原因 reasonForApplication;
 申请说明 applicationInstructions;
 申请说明图片 applicationDescriptionPicture;
 商品数据 productParamList;
 */
export function submitAfterSealsOrder(data) {
  return request.post(`/applyForAfterSales`, data, {
	  login: true
  });
}

// 售后订单列表
export function getAfterSealsList (params) {
	return request.get('/storeAfterSales/list', params, {
	  login: true,
	});
}

// 售后详情
export function getAfterSalesDeatail(key) {
  return request.get(`/applyForAfterSales/${key}`);
}

// 查询订单
export function getAfterSealsDetail (key, id) {
  return request.get(`/api/store/detail/${key}/${id}`)
}

// 搜索
export function searchAfterSealsDetail (key) {
  return request.get(`/api/store/detail/${key}`)
}

// 撤销售后订单
export function rebackAfterSeals (key, id) {
  return request.get(`/api/revoke/revoke/${key}/${id}`)
}

// 获取物流信息
export function getExpressData () {
  return request.get('/api/yxExpress')
  
}

// 添加快递单号
export function addExpressData (params) {
  return request.post('/api/addLogisticsInformation', params, {
	  login: true
  })
}

// 删除售后订单
export function deleteAfterSeals (params) {
  return request.delete('/api/deleteAfterSalesOrder', params, {
	  login: true
  })
}
