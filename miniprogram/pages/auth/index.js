import { login } from '../../utils/asyncWx'
import { request } from '../../request/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  async hanleGetUserInfo(e) {
    try {
      // 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 获取小程序登录成功后的code
      const { code } = await login()
      const loginParams = { encryptedData, rawData, iv, signature, code }
      // 发送请求获取token
      let res = await request({
        url: '/users/wxlogin',
        data: loginParams,
        method: 'post',
      })
      res = {
        token:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo',
      }
      console.log(res.token)
      wx.setStorageSync('token', res.token)
      wx.navigateBack({
        delta: 1,
      })
    } catch (err) {
      console.log(err)
    }
  },
})
