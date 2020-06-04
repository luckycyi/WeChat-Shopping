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
    // 商品的数据
    goodsList: [],
  },
  // 接口参数
  queryParmas: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10,
  },
  // 总页数
  totalPage: 1,
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
   * 获取商品列表数据
   */
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.queryParmas })
    console.log(res)
    // 商品总条数
    const total = res.total
    // 计算总页码
    this.totalPage = Math.ceil(total / this.queryParmas.pagesize)
    // 将数据存入数组并且要衔接
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods],
    })
    // h获取数据并且设置成功后，关闭刷新窗口
    wx.stopPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 获取对应ID的商品列表
    this.queryParmas.cid = options.cid || ''
    // 搜索关键字
    this.queryParmas.query = options.query || ''
    // 商品列表数据
    this.getGoodsList()
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    // 判断是否还有下一页
    if (this.queryParmas.pagenum >= this.totalPage) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据了',
      })
    } else {
      this.queryParmas.pagenum++
      this.getGoodsList()
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 重置数组和页面
    this.setData({
      goodsList: [],
    })
    this.queryParmas.pagenum = 1
    // 重新获取列表数据
    this.getGoodsList()
  },
})
