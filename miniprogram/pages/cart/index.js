import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
} from '../../utils/asyncWx'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },
  // 点击获取收货地址事件
  async handleChooseAdress() {
    // 获取当前用户的信息
    // cityName: "广州市"
    // countyName: "海珠区"
    // detailInfo: "新港中路397号"
    // errMsg: "chooseAddress:ok"
    // nationalCode: "510000"
    // postalCode: "510000"
    // provinceName: "广东省"
    // telNumber: "020-81167888"
    // userName: "张三"
    try {
      const res = await getSetting()
      const scopeAddress = res.authSetting['scope.address']
      if (scopeAddress === false) {
        await openSetting()
      }
      let address = await chooseAddress()
      address.userName = address.userName
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo
      wx.setStorageSync('address', address)
    } catch (err) {
      console.log(err)
    }
  },
  // 商品是否选中
  handleChangeItem(e) {
    // 获取修改状态的Id
    const goods_id = e.currentTarget.dataset.id
    const { cart } = this.data
    console.log(cart)
    let index = cart.findIndex((v) => v.goods_id === goods_id)
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },
  // 商品全选
  handleItemAllCheck() {
    let { cart, allChecked } = this.data
    console.log(allChecked)
    // 修改全选
    allChecked = !allChecked
    // 循环商品中的选中状态
    cart.forEach((v) => {
      v.checked = allChecked
    })
    this.setCart(cart)
  },
  // 设置购物车的状态栏同时计算底部工具栏数据
  setCart(cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((v) => {
      console.log(v.checked)
      if (v.checked) {
        totalNum += v.num
        totalPrice += v.goods_price * v.num
      } else {
        allChecked = false
      }
    })
    // 如果数组为空
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    })
    wx.setStorageSync('cart', cart)
  },
  // 数量编辑
  async handleCalItem(e) {
    // 获取id operation
    const { id, operation } = e.currentTarget.dataset
    let { cart } = this.data
    // 找到修改商品的index
    const index = cart.findIndex((v) => v.goods_id === id)
    console.log(index)
    // 修改数量
    // p判断是否小于1，小于就删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({
        content: '确定要删除该商品吗?',
      })
      if (res.confirm) {
        cart.splice(index, 1)

        this.setCart(cart)
        console.log(this.data.cart)
      }
    } else {
      // 修改数量
      cart[index].num += operation
      // 设置会缓存和data
      this.setCart(cart)
    }
  },
  // 点击结算跳转
  async handlePay() {
    let { address, totalNum } = this.data
    if (!address.userName) {
      await showToast({
        title: '请选择收货地址',
      })
      return
    }
    // 判断是否选择了商品
    if (totalNum === 0) {
      await showToast({
        title: '您还没有选购商品',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    })
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
    const cart = wx.getStorageSync('cart')
    this.setData({
      address,
    })
    this.setCart(cart)
  },
})
