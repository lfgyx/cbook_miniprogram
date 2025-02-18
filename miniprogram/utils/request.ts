// 定义接口返回类型
interface ApiResponse<T = any> {
  code: number; // 后端返回的状态码
  message: string; // 后端返回的消息
  data: T; // 泛型，返回的数据
}

// 定义请求选项的类型
interface RequestOptions {
  url: string; // API 相对路径
  method?: 'GET' | 'POST'; // 请求方法
  data?: Record<string, any>; // 请求体
  header?: Record<string, string>; // 请求头
  showLoading?: boolean; // 是否显示加载提示
}

// 全局常量配置
const BASE_URL = "https://lfgyx.cn:9000"; 
const DEFAULT_TIMEOUT = 10000; // 默认超时时间（毫秒）

/**
 * 封装 wx.request
 * @param options - 请求选项
 * @returns Promise<ApiResponse<T>>
 */
const request = <T = any>(options: RequestOptions): Promise<ApiResponse<T>> => {
  const { url, method = "GET", data = {}, header = {}, showLoading = false } = options;
  if (showLoading) {
    wx.showLoading({ title: "加载中..." });
  }
  return new Promise((resolve, reject) => {
    const app = getApp();
    app.onTokenReady((token: String) => {
      wx.request({
        url: `${BASE_URL}${url}`,
        method: method,
        data,
        header: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // 默认携带 Token
          ...header,
        },
        timeout: DEFAULT_TIMEOUT,
        success: (res) => {
          if (showLoading) wx.hideLoading();
          const { statusCode, data } = res;
          if (statusCode === 200) {
            const apiResponse = data as ApiResponse<T>;  // 类型断言
            if (apiResponse.code === 500) {
              wx.showToast({
                title: apiResponse.message || "请求失败",
                icon: "none",
              });
            }
            resolve(data as ApiResponse<T>);
          } else {
            wx.showToast({
              title: (data as ApiResponse<T>).message || "请求失败",
              icon: "none",
            });
            reject(data);
          }
        },
        fail: (err) => {
          if (showLoading) wx.hideLoading();
          wx.showToast({
            title: "网络错误，请稍后重试",
            icon: "none",
          });
          reject(err);
        },
      });
    }, url === '/auth/login')
  });
};

export default request;
