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
    console.log({
      provider: 'wxpay',
      // signType: "MD5",
      // timeStamp: orderInfo.timeStamp,
      // nonceStr: orderInfo.noncestr,
      // package: orderInfo.prepayid,
      // signType: "MD5",
      // paySign: orderInfo.sign,
      orderInfo,
    }, '发起支付')
    // 调用登录接口
    uni.requestPayment({
      provider: 'wxpay',
      ...option,
      timestamp: orderInfo.timestamp,
      orderInfo,
      success: (success) => {
        console.log(success)
        uni.showToast({
          title: JSON.stringify(success), icon: 'success', duration: 5000
        });
        resolve(success)
      },
      fail: (error) => {
        console.log(error)
        uni.showToast({ title: JSON.stringify(error), icon: 'none', duration: 5000 });
        reject(error)
      }
    })
    // })
  })
}
