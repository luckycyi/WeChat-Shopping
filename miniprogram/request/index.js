let ajaxTime = 0
export const request = (params) => {
  // 先获取传递的请求头参数
  let header = { ...params.header }
  // 若果请求头中没有header并且url中有/my/
  if (params.url.includes('/my/')) {
    header['Authorization'] = wx.getStorageSync('token')
  }
  ajaxTime++
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  // 定义公共的样式
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (res) => {
        resolve(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTime--
        if (ajaxTime === 0) {
          wx.hideLoading()
        }
      },
    })
  })
}
