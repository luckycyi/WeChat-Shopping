// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    // 收藏商品数量
    collectNum: 0,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userinfo = wx.getStorageSync('userinfo') || []
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      userinfo,
      collectNum: collect.length,
    })
  },
})
