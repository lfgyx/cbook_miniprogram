/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    familyInfo?: AnyArray,
    view?: any
  }
  tokenReadyCallbacks: AnyArray,
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  request?: any,
  checkLoginStatus: Function,
  getFamily: Function,
  getUser: Function,
  getLedgers: Function,
  onTokenReady: Function,
}