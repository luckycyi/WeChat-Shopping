import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    isFocus: true,
    goods: [],
  },
  // 防抖功能
  TimeId: -1,
  // 输入框的内容
  handleInput(e) {
    // 获取value内容 检测合理性
    const { value } = e.detail
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: true,
      })
      return
    }
    // 发送获取数据
    this.setData({
      isFocus: false,
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.getGoodsList(value)
    }, 1000)
  },
  // 发送获取数据
  async getGoodsList(query) {
    const res = await request({ url: '/goods/qsearch', data: { query } })
    this.setData({
      goods: res,
    })
  },
  // 点击取消事件
  handleCancel() {
    this.setData({
      inputValue: '',
      isFocus: true,
      goods: [],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
})
