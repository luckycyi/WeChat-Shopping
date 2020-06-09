import { showToast, requestPayment } from '../../utils/asyncWx'
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  // 点击支付
  async handlePay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync('token')
      if (!token) {
        // 跳转到授权页面
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return
      }
      // 请求头参数
      const header = { Authorization: token }
      // 创建订单
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      let goods = []
      cart.forEach((v) =>
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price,
        })
      )
      // 整合请求提参数
      const orderParans = { order_price, consignee_addr, goods }
      // 创建订单编号
      const { order_number } = await request({
        url: '/my/orders/create',
        data: orderParans,
        method: 'POST',
      })
      //  发起预支付接口
      const { pay } = await request({
        url: '/my/orders/req_unifiedorder',
        data: { order_number },
        method: 'POST',
      })
      // // 调用微信支付接口
      await requestPayment(pay)
      // 查询后台订单
      const res = await request({
        url: '/my/orders/chkOrder',
        data: { order_number },
        method: 'POST',
      })
      await showToast({
        title: '支付成功',
      })
      // 清楚已经支付的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter((v) => v.checked === false)
      wx.setStorageSync('cart', newCart)
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (err) {
      await showToast({
        title: '支付失败',
      })
      // 清楚已经支付的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter((v) => v.checked === false)
      wx.setStorageSync('cart', newCart)
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index?type=1',
      })
      console.log(err)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1 获取缓存数据
    const address = wx.getStorageSync('address')
    // 2 获取购物车缓存数据
    let cart = wx.getStorageSync('cart') || []
    // 获取过滤后的cart
    cart = cart.filter((v) => v.checked)
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((v) => {
      totalNum += v.num
      totalPrice += v.goods_price * v.num
    })
    // 如果数组为空
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    })
  },
})
