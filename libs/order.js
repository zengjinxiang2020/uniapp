import { cancelOrder, takeOrder, delOrder, payOrder } from "@/api/order";
import dialog from "@/utils/dialog";
import { weappPay } from "@/libs/wechat";

import { _router } from '@/utils'

export function cancelOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: '确认取消该订单?',
      success(res) {
        if (res.confirm) {
          cancelOrder(orderId)
            .then(res => {
              uni.showToast({
                title: '取消成功', icon: 'success', duration: 2000
              });
              resolve(res);
            })
            .catch(err => {
              uni.showToast({
                title: '取消失败', icon: 'none', duration: 2000
              });
              reject(err);
            });
        } else if (res.cancel) {
        }
      }
    })
  });
}

export function takeOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    takeOrder(orderId)
      .then(res => {
        uni.showToast({
          title: '收货成功', icon: 'success', duration: 2000
        });
        resolve(res);
      })
      .catch(err => {
        uni.showToast({
          title: '收货失败', icon: 'none', duration: 2000
        });
        reject(err);
      });
  });
}

export function delOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "确认删除该订单?",
      opts() {
        delOrder(orderId)
          .then(res => {
            uni.showToast({
              title: '删除成功', icon: 'success', duration: 2000
            });
            resolve(res);
          })
          .catch(err => {
            uni.showToast({
              title: '删除失败', icon: 'none', duration: 2000
            });
            reject(err);
          });
      }
    });
  });
}

// 使用订单号进行支付
export function payOrderHandle(orderId, type, from) {
  return new Promise((resolve, reject) => {
    // dialog.loading.open("");
    payOrder(orderId, type, from)
      .then(res => {
        handleOrderPayResults(res.data)
      })
      .catch(err => {
        dialog.loading.close();
        dialog.toast({ mes: err.msg || "订单支付失败" });
      });
  });
}

// 处理调用支付接口的逻辑
// @type create(创建订单)||pay(支付订单)
export function handleOrderPayResults(data, type) {
  switch (data.status) {
    // 订单号已存在
    case "ORDER_EXIST":
    // 取消支付
    case "EXTEND_ORDER":
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
      goOrderDetails(data.result.orderId, type)
      break;
    case "PAY_DEFICIENCY":
      break;
    // 支付出错
    case "PAY_ERROR":
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
      goOrderDetails(data.result.orderId, type)
      break;
    // 未传递支付环境
    case "SUCCESS":
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
      goOrderDetails(data.result.orderId, type)
      break;
    // H5支付
    case "WECHAT_H5_PAY":
      goOrderDetails(data.result.orderId, type)
      console.log(data)
      setTimeout(() => {
        // #ifdef H5
        // "https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx15171343713577e9f3a418b0865ef90000&package=2547890641"
        // location.href = data.result.jsConfig.mweb_url;
        // #endif
      }, 100);
      break;
    // 小程序支付
    case "WECHAT_PAY":
      weappPay(data.result.jsConfig).finally(() => {
        goOrderDetails(data.result.orderId, type)
      });
      break;
    // APP支付
    case "WECHAT_APP_PAY":
      
      weappPay(data.result.jsConfig).finally(() => {
        goOrderDetails(data.result.orderId, type)
      });
      break;
  }
}


export function goOrderDetails(id, type) {
  // 创建订单时跳转到详情
  if (type == 'create') {
    console.log(_router)
    _router.replace({
      path: "/pages/order/OrderDetails/index",
      query: {
        id
      },
    });
  }
}
