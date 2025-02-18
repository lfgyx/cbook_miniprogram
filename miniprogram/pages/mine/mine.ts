import request from "../../utils/request";

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: { nickname: "", avatarurl: "" },
    familyInfo: [],
    inviteCode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.init()
  },
  onShareAppMessage() {
    return {
      title: '快来加入我的家庭',  // 分享的标题
      path: '/pages/family_member/family_member?inviteCode=' + this.data.inviteCode  // 分享的页面路径（可以带参数）
    };
  },
  init() {
    this.initPage()
    this.getPageInfo()
  },
  // 初始化页面：上菜单高度/tab页面
  initPage() {
    const { statusBarHeight } = wx.getWindowInfo()
    this.setData({
      statusBarHeight: statusBarHeight
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().switchActive(2)
    }
  },
  async getPageInfo() {
    this.setData({
      familyInfo: await app.getFamily(),
      userInfo: await app.getUser(),
    })
    // let res = await request({ url: "/family/generateInviteCode" })
    // this.data.inviteCode = res.data.inviteCode;
  },
  invite(){
    wx.showToast({
      title: '暂未开放邀请功能',  // 弹出的提示文本
      icon: 'none',          // 显示样式：none代表不显示图标
      duration: 1500         // 提示持续时间
    });
  },
  // 获取family
  createFamily() {
    wx.navigateTo({
      url: '/pages/family_add/family_add?edit=0'
    })
  },
  editFamily() {
    wx.navigateTo({
      url: '/pages/family_add/family_add?edit=1'
    })
  },
  editFamilyMember() {
    wx.navigateTo({
      url: '/pages/family_member/family_member'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/info_add/info_add'
    })
  },
  goPath(e: any) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path
    })
  },

})
