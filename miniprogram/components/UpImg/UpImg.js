// components/UpImg/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: '',
    },
    num: {
      type: Number,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    handleTap(e) {
      const { index } = e.currentTarget.dataset
      // 触发父组件自定义事件
      this.triggerEvent('upImgTab', { index })
    },
  },
})
