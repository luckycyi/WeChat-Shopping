import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 传递标签组件的数据数组
    tabs: [
      {
        id: 0,
        value: '综合',
        // 选中标签页
        isActive: true,
      },
      {
        id: 1,
        value: '销量',
        // 选中标签页
        isActive: false,
      },
      {
        id: 2,
        value: '价格',
        // 选中标签页
        isActive: false,
      },
    ],
  },

  // 接受组件传来的值，更改选中标签页
  changeIndexItem(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({
      tabs,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
})
