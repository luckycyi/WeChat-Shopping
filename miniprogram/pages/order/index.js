import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true,
      },
      {
        id: 1,
        value: '待付款',
        isActive: false,
      },
      {
        id: 2,
        value: '待发货',
        isActive: false,
      },
      {
        id: 3,
        value: '退货/退款',
        isActive: false,
      },
    ],
    orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // 显示
  onShow(options) {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/page/auth/index',
      })
    }
    // 获取订单数据
    let pages = getCurrentPages()
    let currentPages = pages[pages.length - 1]
    const { type } = currentPages.options
    this.changeTitleByIndex(type - 1)
    this.getOrder(type)
  },
  // 获取订单数据
  async getOrder(type) {
    const res = await request({ url: '/my/orders/all', data: { type } })
    console.log(res)
    this.setData({
      orders: res.orders.map((v) => ({
        ...v,
        create_time_cn: new Date(v.create_time * 1000).toLocaleString(),
      })),
    })
  },
  // 根据标题索引激活选中项
  changeTitleByIndex(index) {
    let { tabs } = this.data
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false)
    })
    this.setData({
      tabs,
    })
  },
  handleTabsItemChange(e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    this.getOrder(index + 1)
  },
})
