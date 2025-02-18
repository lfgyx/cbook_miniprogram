Component({
  data: {
    selected: 0,
    tabbarShow: true,
    color: "#171717",
    selectedColor: "#e9823d",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [{
      "pagePath": "/pages/home/home",
      "text": "首页",
      "iconPath": "/images/home.png",
      "selectedIconPath": "/images/home2.png"
    },
    {
      "pagePath": "add",
      "text": "add",
      "iconPath": ""
    },
    {
      "pagePath": "/pages/mine/mine",
      "text": "我的",
      "iconPath": "/images/mine.png",
      "selectedIconPath": "/images/mine2.png"
    }
    ],
    number_keybord_show: false,
    number_keybord_position: -650,
    modalTran: 0
  },
  ready() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1]; // 获取栈顶的页面
    const currentPath = '/' + currentPage.route; // 获取当前页面的路径
    this.setData({ selected: this.data.list.findIndex(v => v.pagePath === currentPath) })
  },
  methods: {
    switchTab(e: any) {
      const data = e.currentTarget.dataset
      const url = data.path
      if (url == 'add') {
        const kp = this.selectComponent('#numKeyPad')
        kp.openKeyPad()
        return
      }
      wx.switchTab({
        url
      })
    },
    switchActive(activeIndex: number) {
      this.setData({ selected: activeIndex, tabbarShow: false })
    }
  }
})