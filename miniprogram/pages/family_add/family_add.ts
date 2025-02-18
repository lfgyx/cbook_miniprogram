import request from "../../utils/request"
const app = getApp();

// 获取头像
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    data: {
        defaultAvatarUrl,
        familyInfo: {
            family_name: "",
            description1: "",
            description2: "",
        },
        edit: '0',
    },
    onLoad(options) {
        if (options.edit == '1') {
            this.data.edit = options.edit as string
            this.setData({
                familyInfo: { ...app.globalData.familyInfo[0] }
            });
        }
    },
    // 事件处理函数
    createFamily() {
        request({ url: "/users/addOrEditFamily", method: "POST", data: this.data.familyInfo }).then((res) => {
            wx.showToast({
                title: res.message,
                icon: "success",
            });
            app.globalData.familyInfo = [res.data];
            setTimeout(() => {
                wx.navigateBack()
            }, 1000);
        })
    },
    handleInput(e: any) {
        this.setData({
            "familyInfo.family_name": e.detail.value, // 更新数据
        });
    },
    handledesc1(e: any) {
        this.setData({
            "familyInfo.description1": e.detail.value, // 更新数据
        });
    },
    handledesc2(e: any) {
        this.setData({
            "familyInfo.description2": e.detail.value, // 更新数据
        });
    },
})
