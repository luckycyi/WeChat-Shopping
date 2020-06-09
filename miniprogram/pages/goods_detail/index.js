import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情对象数据
    goodsPro: {},
    // 判断是否收藏
    isCollect: false,
  },
  // 商品对象
  goodsObj: {},
  // 监听页面加载
  onShow: function () {},
  /**
   * 获取商品详情页面数据
   */
  async getDetailGoods(goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } })
    // 将获取的数据赋值给对象
    this.goodsObj = res
    // 获取缓存中的收藏数组
    let collect = wx.getStorageSync('collect') || []
    // 判断是否收藏了该商品
    let isCollect = collect.some((v) => v.goods_id === this.goodsObj.goods_id)
    this.setData({
      goodsPro: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        goods_introduce: res.goods_introduce,
        pics: res.pics,
      },
      isCollect,
    })
  },
  // 点击轮播图图片全屏显示
  handlePrevewImage(e) {
    const current = e.currentTarget.dataset.url
    const urls = this.goodsObj.pics.map((v) => v.pics_mid)
    // 全屏显示
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接列表
    })
  },
  // 商品收藏点击事件
  handleCollect() {
    let isCollect = false
    /**
     * 1 先获取缓存中的商品收藏数组
     * 2 判断目标商品是否被收藏过
     * 3 如果收藏过取消收藏 没有收藏过就加入收藏 在缓存数组
     */
    // 获取本地缓存中的收藏数组
    let collect = wx.getStorageSync('collect') || []
    // 判断是否被收藏过
    let index = collect.findIndex((v) => v.goods_id === this.goodsObj.goods_id)
    // 当index ！== -1 表示收藏过
    if (index !== -1) {
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消收藏',
        mask: true,
      })
    } else {
      // 没有收藏过
      collect.push(this.goodsObj)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        mask: true,
      })
    }
    wx.setStorageSync('collect', collect)
    console.log(isCollect)
    // 设置data中的选中数据
    this.setData({
      isCollect,
    })
  },
  // 添加进购物车
  addShoppingCar() {
    /**
     * 1 获取缓存中的购物车数组
     * 2 判断目标商品是否已经添加到缓存数组
     *   1 没有push进去
     *   2 已经有该商品
     *     对数量进行更改
     */
    // 获取缓存数组
    let cart = wx.getStorageSync('cart') || []
    // 查询目标商品
    let index = cart.findIndex((v) => v.goods_id === this.goodsObj.goods_id)
    // 根据存在与否进行添加
    if (index === -1) {
      // 不存在
      this.goodsObj.num = 1
      this.goodsObj.checked = true
      cart.push(this.goodsObj)
    } else {
      // 存在
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let options = currentPage.options
    const { goods_id } = options
    this.getDetailGoods(options.goods_id)
  },
})
