// app.ts
import request from "./utils/request";  // 导入请求工具
import { getStorageWithExpire, setStorageWithExpire } from "./utils/storageHelper"; // 导入存储工具

// 定义小程序应用实例
App<IAppOption>({
  // 全局属性
  request, 
  globalData: { view: {} },  // 存储全局的视图数据
  tokenReadyCallbacks: [],  // 存储 Token 准备好的回调函数队列

  // 小程序启动时执行
  onLaunch() {
    this.checkLoginStatus(); // 启动时检查登录状态
  },

  // 检查登录状态
  async checkLoginStatus() {
    try {
      // 调用 wx.login 获取登录凭证
      const loginCode = await wx.login();
      
      // 使用请求获取 Token
      const getToken = await request({
        url: "/auth/login", 
        data: { code: loginCode.code }
      });

      // 存储 Token 到本地存储
      setStorageWithExpire('token', getToken.data.token, getToken.data.expiresIn);

      // Token 准备好后执行回调
      this.tokenReadyCallbacks.forEach(cb => {
        cb(getToken.data.token);
      });

      // 清空回调队列
      this.tokenReadyCallbacks = [];
    } catch (error) {
      console.error('登录状态检查失败:', error);  // 捕获错误并打印
    }
  },

  // 用于监听 Token 准备就绪的回调
  onTokenReady(callback: Function, noNeedTokenReady: Boolean) {
    if (noNeedTokenReady) {
      return callback(true); // 如果不需要等待 Token，直接调用回调
    }

    // 检查是否已经有 Token 存储
    const token = getStorageWithExpire('token');
    if (token) {
      // 如果 Token 已经获取到，直接执行回调
      callback(token);
    } else {
      // 否则将回调加入队列，等待 Token 准备好
      this.tokenReadyCallbacks.push(callback);
    }
  },

  // 获取家庭信息
  getFamily: async function () {
    if (!this.globalData.familyInfo) {
      // 如果没有缓存家庭信息，则请求并存储
      const familyInfo = await request({ url: "/users/getUserFamily" });
      this.globalData.familyInfo = familyInfo.data;
    }
    return this.globalData.familyInfo;
  },

  // 获取用户信息
  getUser: async function () {
    if (!this.globalData.userInfo) {
      // 如果没有缓存用户信息，则请求并存储
      const userInfo = await request({ url: "/users/getUserInfo" });
      this.globalData.userInfo = userInfo.data;
    }
    return this.globalData.userInfo;
  },

  // 获取账本信息
  getLedgers: async function () {
    const ledgerInfo = await request({ url: "/ledgers/getUserLedger" });
    return ledgerInfo.data;
  },
});
