import request from "../../utils/request"
const app = getApp()
const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
const yesterday = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() - 1)
const beforeYesterday = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() - 2)

// pages/records/records.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categorySelectShow: false,
    categoryAddShow: false,
    btnDisabled: false,
    query: { ledgerId: '', amount: '0', type: '0', categoryName: "", description: "", recordDate: today },
    time: "",
    dateflag: "0",
    categoryQuery: { name: "" },
    selecteddateButton: 0,
    categoryInfo: [],
    activelLdgersInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const ledger = await app.getLedgers()
    let queryTime = new Date();
    let hours = queryTime.getHours().toString().padStart(2, '0');
    let minutes = queryTime.getMinutes().toString().padStart(2, '0');
    let seconds = queryTime.getSeconds().toString().padStart(2, '0');
    this.setData({
      'query.amount': options.amount || "0",
      time: `${hours}:${minutes}:${seconds}`,
      'query.ledgerId': ledger.filter((v: any) => v.is_active)[0].id,
      btnDisabled: false
    })
    this.getData()
  },
  getData() {
    request({ url: "/categories/getCategories" }).then(({ data }) => {
      this.setData({ categoryInfo: data, "query.categoryName": data[0].name })
    })
  },
  onTypeSelect(event: any) {
    const type = event.currentTarget.dataset.type;
    this.setData({ 'query.type': type })
  },
  onCategorySelect(event: any) {
    const categoryName = event.currentTarget.dataset.categoryname;
    if (categoryName === '-1') {
      this.setData({ 'categorySelectShow': true })
      return
    }
    this.setData({ 'query.categoryName': categoryName })
  },
  onModalCategorySelect(event: any) {
    const categoryName = event.currentTarget.dataset.categoryname;
    const index = event.currentTarget.dataset.c_index
    let _cinfo = [...this.data.categoryInfo]
    const sp_item = _cinfo.splice(index, 1)[0]
    _cinfo.unshift(sp_item)
    this.setData({ 'query.categoryName': categoryName, categoryInfo: _cinfo })
  },
  onModalCategoryAdd() {
    this.setData({ 'categoryAddShow': true })
  },
  onModalCategoryAddClose() {
    this.setData({ 'categoryAddShow': false })
  },
  onModalCategoryAddSubmit() {
    if (!this.data.categoryQuery.name.trim()) {
      wx.showToast({
        title: '分类名称为必填项',  // 弹出的提示文本
        icon: 'none',          // 显示样式：none代表不显示图标
        duration: 1500         // 提示持续时间
      });
      return;
    }
    request({ url: "/categories/addCategory", method: "POST", data: this.data.categoryQuery }).then(({ data, code }) => {
      if (code == 200) {
        wx.showToast({
          title: '添加成功',  // 弹出的提示文本
          icon: 'success',          // 显示样式：none代表不显示图标
          duration: 1500         // 提示持续时间
        });
        this.onModalCategoryAddClose()
        this.setData({ categoryInfo: data })
      }
    })
  },
  modalClose() {
    this.setData({ 'categorySelectShow': false })
  },
  onDateSelect(event: any) {
    const dateflag = event.currentTarget.dataset.dateflag;
    if (dateflag === '3') {
      this.setData({ "query.recordDate": event.detail.value })
    } else {
      this.setData({ "query.recordDate": dateflag == '0' ? today : dateflag == '1' ? yesterday : beforeYesterday })
    }
    this.setData({ dateflag: dateflag })
  },
  onDescriptionChange(e: any) {
    this.setData({
      'query.description': e.detail.value
    });
  },
  onCategoryNameInput(e: any) {
    this.setData({
      'categoryQuery.name': e.detail.value
    });
  },
  onConfirm() {
    this.setData({ btnDisabled: true })
    let data = { ...this.data.query, recordDate: this.data.query.recordDate + ' ' + this.data.time }
    request({ url: "/ledgerEntries/create", method: "POST", data }).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '添加成功',  // 弹出的提示文本
          icon: 'success',          // 显示样式：none代表不显示图标
          duration: 1500         // 提示持续时间
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1  // 默认值是1，表示返回上一级页面
          })
        }, 1000);
      }
    })
  }
})