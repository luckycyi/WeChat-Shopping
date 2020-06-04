import { request } from '../../request/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧分类数组
    catesLeftList: [],
    // 右侧菜单显示数组
    catesRightList: [],
    // 右侧菜单栏所有数据数组
    catesAll: [],
    // 选中的菜单栏
    currentIndex: 0,
    // 切换菜单选项置顶
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 设置缓存效果，降低请求次数
     * 1 判断本地存储是否有缓存数据
     * 2 没有就发送新请求
     * 3 有本地数据，但是还需判断是否已经过期
     */
    // 获取本地缓存数据
    const Cates = wx.getStorageSync('cates')
    // 判断本地缓存数据是否存在
    if (!Cates) {
      // 没有缓存 获取菜单数组
      this.getCatesList()
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        // 缓存过期 获取菜单数组
        this.getCatesList()
      } else {
        // 有缓存数据
        this.data.catesAll = Cates.data
        let catesLeftList = this.data.catesAll.map((v) => v.cat_name)
        let catesRightList = this.data.catesAll[0].children
        this.setData({
          catesLeftList,
          catesRightList,
        })
      }
    }
  },
  /**
   * 获取菜单分类数据
   * */

  async getCatesList() {
    const res = await request({ url: '/categories' })
    let catesLeftList = res.map((v) => v.cat_name)
    let catesAll = res
    let catesRightList = res[0].children
    // 将数据进行缓存
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: catesAll,
    })
    this.setData({
      catesLeftList,
      catesRightList,
      catesAll,
    })
  },
  /**
   * 左侧菜单栏点击事件
   */
  handleTap(e) {
    const { index } = e.currentTarget.dataset
    const catesRightList = this.data.catesAll[index].children
    this.setData({
      currentIndex: index,
      catesRightList,
      scrollTop: 0,
    })
  },
})
