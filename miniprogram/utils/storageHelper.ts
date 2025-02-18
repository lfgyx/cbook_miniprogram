/**
 * 带过期时间的本地存储封装 (TypeScript)
 * 使用 wx.setStorageSync 和 wx.getStorageSync 实现
 */

interface StorageData<T> {
    value: T;          // 存储的值
    expireTime: number; // 过期时间戳（毫秒）
}

/**
 * 设置本地存储数据，带过期时间
 * @param key - 存储的键
 * @param value - 存储的值
 * @param ttl - 有效期（秒）
 */
export const setStorageWithExpire = <T>(key: string, value: T, ttl: number): void => {
    const now = Date.now(); // 当前时间戳（毫秒）
    const expireTime = now + ttl * 1000; // 将秒转换为毫秒
    const data: StorageData<T> = {
        value,
        expireTime,
    };
    wx.setStorageSync(key, data);
};

/**
 * 获取本地存储数据，自动校验是否过期
 * @param key - 存储的键
 * @returns 存储的值，如果过期或不存在返回 null
 */
export const getStorageWithExpire = <T>(key: string): T | null => {
    const data: StorageData<T> | null = wx.getStorageSync(key) || null;
    if (!data) {
        return null; // 数据不存在
    }

    const now = Date.now(); // 当前时间戳（毫秒）
    if (data.expireTime && now > data.expireTime) {
        wx.removeStorageSync(key); // 数据过期，清理存储
        return null;
    }

    return data.value; // 返回有效数据
};
