// import {recordVideoAdErrorApi} from "../service";

import Taro from '@tarojs/taro'
declare const qq

// 定义单独一个页面内通用的激励视频广告对象
let videoAd: any = null

let watchAdCompleteCallback = (res: boolean): any => {
  return res
}

const onCloseCallback = (res) => {
  console.log('视频回调')
  if (res && res.isEnded) {
    watchAdCompleteCallback(true)
  } else {
    watchAdCompleteCallback(false)
  }
}

let onErrorCallback = () => {
  Taro.showToast({
    title: '视频加载失败',
    icon: 'none'
  })
  // recordVideoAdErrorApi(
  //   {errLog: JSON.stringify(err)}
  // )
}


export const adUnitIds = {
  sign: '8f2a8c433a9e6646a4b026f0de8f7d1a',
  answer: '80c11f53c8259098c91aff0ad33a6fda',
  knife: 'df2f586e5cd23c55da0b763580708fd8',
  pk: '96fb5e4fdc5901999e7a1fcd96714b1f',
  getInviteAwards: '75148271e2c3a8adecc92197603bdda2'
}


export const loadVideoAd = (successCallback, errorCallback: Function, adUnitId: string = adUnitIds.answer) => {
  console.log(adUnitId)
  if (!qq.createRewardedVideoAd) {
    Taro.showToast({
      icon: 'none',
      title: '版本过低，无法观看视频广告~'
    })
    return false
  }
  videoAd = qq.createRewardedVideoAd({
    adUnitId: adUnitId || adUnitIds.answer
  })
  console.log('尝试加载广告')
  watchAdCompleteCallback = successCallback
  if (errorCallback) {
    onErrorCallback = () => {
      console.log('视频播放失败回调')
      // Taro.showToast({
      //   title: '视频加载失败',
      //   icon: 'none'
      // })
      errorCallback()
    }
  }
  videoAd.onClose((res) => {
    onCloseCallback(res)
    videoAd.offClose()
  })
  videoAd.onError(() => {
    Taro.hideLoading()
    onErrorCallback()
    videoAd.offError()
  })
  videoAd.show()
    .catch(() => {
      console.log('没有拉取过视频，开始尝试拉取')
      videoAd.load()
        .then(() => {
            console.log('拉取视频成功，尝试播放')
            videoAd.show()
              .then(() => {
                console.log('播放成功')
                Taro.hideLoading()
              })
              .catch((err) => {
                console.log('播放失败', err)
                Taro.hideLoading()
              })
          }
        )
        .catch(err => {
          console.log(err)
          console.log('激励视频 广告拉取失败')
        })
    })
}

export const loadVideoAdPromise = (adUnitId: string = adUnitIds.answer) => {
  return new Promise((resolve) => {
    loadVideoAd(
      (res) => {
        resolve(res)
      },
      () => {
        resolve(true)
      },
      adUnitId
    )
  })
}
