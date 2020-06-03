// 导入发送请求的方法
import { request } from '../../request/index.js'

// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图 数组
    swiperList: [],
    // 导航数组
    cateList: [],
    //主题楼层的数组
    themeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发送异步请求获取轮播图数据
    this.getSwiperList()
    // 发送请求获取导航分类数据
    this.getCateList()
    // 获取主题楼层的数据
    this.getThemeList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: '/home/swiperdata' }).then((result) => {
      this.setData({
        swiperList: result,
      })
    })
  },
  // 获取导航模块数据
  getCateList() {
    22
    request({ url: '/home/catitems' }).then((result) => {
      this.setData({
        cateList: result,
      })
    })
  },
  // 获取主题楼层的数据
  getThemeList() {
    request({ url: '/home/floordata' }).then((result) => {
      this.setData({
        themeList: result,
      })
    })
  },
})
