import request from "../../utils/request";

// pages/account_book/account_book.ts
Page({
    data: {
        ledgers: [],
        showModal: false,
        query: { name: "" }
    },
    onLoad() {
        request({ url: "/ledgers/getUserLedger" }).then(({ data, code }) => {
            if (code != 200) {
                this.setData({ ledgers: [] })
                wx.showToast({
                    title: '请先登陆，并创建家庭',  // 弹出的提示文本
                    icon: 'none',          // 显示样式：none代表不显示图标
                    duration: 1500         // 提示持续时间
                });
                return
            }
            this.setData({ ledgers: data })
        })
    },
    onShow() {
    },
    onNameInput(e: any) {
        this.setData({
            'query.name': e.detail.value
        });
    },
    add_ledgers_btn_click() {
        this.setData({ showModal: true })
    },
    add_ledgers() {
        // 如果 name 为空，提示必填项
        if (!this.data.query.name.trim()) {
            wx.showToast({
                title: '分类名称为必填项',  // 弹出的提示文本
                icon: 'none',          // 显示样式：none代表不显示图标
                duration: 1500         // 提示持续时间
            });
            return;
        }
        request({ url: "/ledgers/addLedger", method: "POST", data: this.data.query }).then(({ data, code }) => {
            if (code == 200) {
                wx.showToast({
                    title: '添加成功',  // 弹出的提示文本
                    icon: 'success',          // 显示样式：none代表不显示图标
                    duration: 1500         // 提示持续时间
                });
                this.closeModal()
                this.setData({ ledgers: data })
            }
        })
    },
    closeModal() {
        this.setData({ showModal: false })
    },
    delete_btn(e: any) {
        if (this.data.ledgers.length <= 1) {
            wx.showToast({
                title: '至少有一个账本',  // 弹出的提示文本
                icon: 'none',          // 显示样式：none代表不显示图标
                duration: 1500         // 提示持续时间
            });
            return
        }
        let _this = this
        wx.showModal({
            title: '确认删除',
            content: '您确定要删除这个账本吗？',
            showCancel: true, // 是否显示取消按钮
            cancelText: '取消', // 取消按钮的文字
            cancelColor: '#666', // 取消按钮的颜色
            confirmText: '确认', // 确认按钮的文字
            confirmColor: '#FF6B6B', // 确认按钮的颜色，淡红色
            success(res) {
                if (res.confirm) {
                    // 用户点击了确认按钮
                    request({ url: "/ledgers/deleteLedger", data: { ledgerId: e.currentTarget.dataset.id } }).then(({ data, code }) => {
                        console.log(data, code)
                        _this.setData({ ledgers: data })
                    })
                    // 执行删除操作
                }
            }
        });
    },
    switchLedger(e: any) {
        request({ url: "/ledgers/updateLedgerStatus", method: "POST", data: { ledgerId: e.currentTarget.dataset.id, isActive: true } }).then(({ data, code }) => {
            if (code == 200) {
                this.setData({ ledgers: data })
            }
        })
    }
})