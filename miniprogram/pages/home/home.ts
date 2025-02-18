import request from "../../utils/request";

let chartData: [{ date: String, value: Number }] = [
  { date: '2024-01-01', value: 485 },
]
Page({
  data: {
    openRecordsSwitch: false,
    openRecordsSwitchDelay: false,
    ledgers: [],
    activeLedger: {},
    ledgerEntries: [],
    totalMonthlyExpenses: '',
    totalMonthlyIncome: '',
    onInitChart(F2: any, config: Object) {
      const chart = new F2.Chart({ ...config, height: 85 });
      const data = chartData;
      chart.axis(false);
      chart.legend(false);
      chart.source(data);
      // 配置 tooltip 格式
      // 配置 tooltip
      chart.tooltip({
        showCrosshairs: true, // 显示十字准线
        onChange: (obj: { items: any }) => {
          const { items } = obj;
          if (items.length) {
            const { date, value } = items[0].origin; // 获取日期和对应的值
            items[0].name = ` ${date}`;  // 修改 tooltip 显示的内容
            items[0].value = value;  // 保持原有的值
          }
        },
        // 自定义 tooltip 内容
        formatter: (val: { date: string, value: number }) => {
          return {
            name: `${val.date}`, // 显示日期
            value: val.value // 显示值
          };
        }
      });
      chart.line().position('date*value').color('#FF4C4C').shape('smooth');
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
    }
  },
  onLoad() { },
  onShow() {
    this.setData({ chartShow: false })
    // 初始化页面
    this.initPage()
    // 获取信息
    this.getInfo()
  },
  // 初始化页面
  initPage() {
    const { statusBarHeight } = wx.getWindowInfo()
    this.setData({
      statusBarHeight: statusBarHeight
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().switchActive(0)
    }
  },
  async getInfo() {
    const app = getApp()
    this.data.ledgers = await app.getLedgers();
    this.setData({
      activeLedger: this.data.ledgers.filter((v: any) => v.is_active)[0]
    })
    request({ url: "/ledgerEntries/getLedgerEntries" }).then(({ data }) => {
      console.log(data)
      this.setData({
        ledgerEntries: data.entries,
        totalMonthlyExpenses: data.totalMonthlyExpenses,
        totalMonthlyIncome: data.totalMonthlyIncome
      })
    })
    request({ url: "/ledgerEntries/getMonthlyExpenses" }).then(({ data }) => {
      chartData = data
      this.setData({ chartShow: true })
    })
  },
  openRecords() {
    this.setData({ openRecordsSwitch: true })
    setTimeout(() => {
      this.setData({ openRecordsSwitchDelay: true })
    }, 800);
  },
  closeRecords() {
    this.setData({ openRecordsSwitchDelay: false })
    this.setData({ openRecordsSwitch: false })
  },
  getStatusBarHeight() {
    const { statusBarHeight } = wx.getWindowInfo()
    this.setData({
      statusBarHeight: statusBarHeight
    });
    setTimeout(() => {
    }, 1000);
  },
  goPath(e: any) {
    if (this.data.ledgers.length == 0) {
      wx.showToast({
        title: '请先登陆，并创建家庭',  // 弹出的提示文本
        icon: 'none',          // 显示样式：none代表不显示图标
        duration: 1500         // 提示持续时间
      });
      return
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.path
    })
  }
});
