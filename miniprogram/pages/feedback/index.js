// pages/feedback/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true,
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false,
      },
    ],
    // 问题种类
    texts: [
      {
        id: 0,
        value: '功能建议',
        isActive: false,
      },
      {
        id: 1,
        value: '购买遇到问题',
        isActive: false,
      },
      {
        id: 2,
        value: '性能问题',
        isActive: false,
      },
      {
        id: 3,
        value: '其他',
        isActive: false,
      },
    ],
    // 输入结果
    valueInput: '',
    // 被选中的图片路径
    chooseItem: [],
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  // 切换标题点击事件
  handleTabsItemChange(e) {
    // 获取标题索引
    const { index } = e.detail
    // 获取tabs
    let { tabs } = this.data
    // 切换选中项
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    // 更新数据
    this.setData({
      tabs,
    })
  },
  // 点击问题种类
  handleTriget(e) {
    const { index } = e.currentTarget.dataset
    // 获取tabs
    let { texts } = this.data
    // 切换选中项
    texts.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    // 更新数据
    this.setData({
      texts,
    })
  },
  // 添加图片
  handleAddImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseItem: [...this.data.chooseItem, ...result.tempFilePaths],
        })
      },
      fail: () => {},
      complete: () => {},
    })
  },
  handleChange(e) {
    const { index } = e.detail
    const { chooseItem } = this.data
    chooseItem.splice(index, 1)
    this.setData({
      chooseItem,
    })
  },
  handleTextInput(e) {
    const { value } = e.detail
    this.setData({
      valueInput: value,
    })
  },
  // 提交
  handleFormSubmit() {
    const { valueInput, chooseItem } = this.data
    if (!valueInput.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      })
      return
    }
    // 上传加载
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    })
    // 判断有没有图片 上传
    if (chooseItem.length !== 0) {
      chooseItem.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/api/upload/upload',
          filePath: v,
          name: 'file',
          formData: {},
          success: (result) => {
            console.log(result)
            if (i === chooseItem.length - 1) {
              wx.hideLoading()
              console.log('把文件和图片上传到后台了')
              this.setData({
                valueInput: '',
                chooseItem: [],
              })
              wx.navigateBack({
                delta: 1,
              })
            }
          },
          fail: () => {},
          complete: () => {},
        })
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '提交了文本信息',
        mask: true,
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})
