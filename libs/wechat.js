import { getProvider } from "@/utils";

// 支付模块
export const weappPay = (option) => {
  return new Promise((resolve, reject) => {
    // 吊起微信支付
    getProvider().then(provider => {
      let orderInfo = {
        ...option,
        timeStamp: option.timestamp + '',
      }
      console.log({
        provider: provider,
        signType: "MD5",
        timeStamp: orderInfo.timestamp,
        nonceStr: orderInfo.noncestr,
        package: orderInfo.prepayid,
        signType: "MD5",
        paySign: orderInfo.sign,
        orderInfo,
      },'发起支付')
      // 调用登录接口
      uni.requestPayment({
        provider: provider,
        signType: "MD5",
        timeStamp: orderInfo.timeStamp,
        nonceStr: orderInfo.noncestr,
        package: orderInfo.prepayid,
        signType: "MD5",
        paySign: orderInfo.sign,
        orderInfo,
        success: (success) => {
          console.log(error)
          uni.showToast({
            title: '支付成功', icon: 'success', duration: 2000
          });
          resolve(success)
        },
        fail: (error) => {
          console.log(error)
          uni.showToast({ title: '支付失败', icon: 'none', duration: 2000 });
          reject(error)
        }
      })
    })
  })
}
