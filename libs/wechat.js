import { getProvider } from "@/utils";

// 支付模块
export const weappPay = (option) => {
  return new Promise((resolve, reject) => {
    // 吊起微信支付
    // getProvider('payment').then(provider => {
    let orderInfo = {
      appid: option.appid,
      noncestr: option.noncestr,
      package: option.package,
      partnerid: option.partnerid,
      prepayid: option.prepayid,
      sign: option.sign,
      timestamp: option.timestamp + '',
    }
    // 调用登录接口
    uni.requestPayment({
      provider: 'wxpay',
      ...option,
      timestamp: orderInfo.timestamp,
      orderInfo,
      success: (success) => {
        console.log(success)
        uni.showToast({
          title: '支付成功', icon: 'success', duration: 5000
        });
        resolve(success)
      },
      fail: (error) => {
        console.log(error)
        if (error.errMsg == 'requestPayment:fail cancel') {
          uni.showToast({ title: '已取消支付', icon: 'none', duration: 5000 });
        }
        reject(error)
      }
    })
    // })
  })
}
