import request from "../../utils/request"
const app = getApp();

// 获取头像
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    defaultAvatarUrl,
    userInfo: {
      avatar_url: defaultAvatarUrl,
      nick_name: '',
    },
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  created() {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  methods: {
    // 事件处理函数
    updateProfile() {
      request({ url: "/users/updateProfile", method: "POST", data: this.data.userInfo }).then((data) => {
        wx.showToast({
          title: data.message,
          icon: "success",
        });
        app.globalData.userInfo = data.data;
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      })
    },
    onChooseAvatar(e: any) {
      console.log(e.detail.avatarUrl)
      this.setData({
        "userInfo.avatar_url": e.detail.avatarUrl,
      })
    },
    handleInput(e: any) {
      this.setData({
        "userInfo.nick_name": e.detail.value, // 更新数据
      });
    }
  },
})
