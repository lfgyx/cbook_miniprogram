import request from "../../utils/request";
Page({
  data: {
    familyInfo: [],
    showModal: false,
    query: { name: "", icon: "book" }
  },
  onLoad() {
    this.getData()
  },
  getData() {
    request({ url: "/family/getFamilyMembers" }).then(({ data }) => {
      this.setData({ familyInfo: data })
    })
  },
  add_cate_btn_click() {
    // this.setData({ showModal: true })
    wx.showToast({
      title: '暂未开放邀请功能',  // 弹出的提示文本
      icon: 'none',          // 显示样式：none代表不显示图标
      duration: 1500         // 提示持续时间
    });
  },
  onNameInput(e: any) {
    this.setData({
      'query.name': e.detail.value
    });
  },
  add_category() {
    if (!this.data.query.name.trim()) {
      wx.showToast({
        title: '分类名称为必填项',  // 弹出的提示文本
        icon: 'none',          // 显示样式：none代表不显示图标
        duration: 1500         // 提示持续时间
      });
      return;
    }
    request({ url: "/categories/addCategory", method: "POST", data: this.data.query }).then(({ data, code }) => {
      if (code == 200) {
        wx.showToast({
          title: '添加成功',  // 弹出的提示文本
          icon: 'success',          // 显示样式：none代表不显示图标
          duration: 1500         // 提示持续时间
        });
        this.closeModal()
        this.setData({ familyInfo: data })
      }
    })
  },
  closeModal() {
    this.setData({ showModal: false })
  },
  delete_btn(e: any) {
    let _this = this
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除这个分类吗？',
      showCancel: true, // 是否显示取消按钮
      cancelText: '取消', // 取消按钮的文字
      cancelColor: '#666', // 取消按钮的颜色
      confirmText: '确认', // 确认按钮的文字
      confirmColor: '#FF6B6B', // 确认按钮的颜色，淡红色
      success(res) {
        if (res.confirm) {
          // 用户点击了确认按钮
          request({ url: "/categories/deleteCategory", data: { categoryId: e.currentTarget.dataset.id } }).then(({ data, code }) => {
            console.log(data, code)
            _this.setData({ familyInfo: data })
          })
          // 执行删除操作
        }
      }
    });
  }
})
