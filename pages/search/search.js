import { HistoryKeyword } from "../../model/history-keyword"
import { Tag } from "../../model/tag"
import { Search } from "../../model/search"
import { showToast } from "../../utils/ui"

// pages/search/search.js
const history = new HistoryKeyword()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const historyTags = history.get()
    const hotTags = await Tag.getSearchTag()
    this.setData({
      historyTags,
      hotTags
    })
  },

  async onSearch(event){
      this.setData({
        search:true,
        items:[]
      })
      const keyword = event.detail.value || event.detail.name
      if(!keyword){
        showToast('请输入关键词')
        return
      }
      history.save(keyword)
      this.setData({
        historyTags:history.get()
      })

      const page = Search.search(keyword)
      wx.lin.showLoading({
        color: '#157658',
        type: 'flash',
        fullScreen:true
      })
      const data = await page.getMoreData()
      wx.lin.hideLoading()
      this.bindItems(data)
  },

  bindItems(data){
    if (data.calculateItems.length !== 0) {
      this.setData({
          items: data.calculateItems
      })
  }
  },

  onDeleteHistory(event){
      history.clear()
      this.setData({
        historyTags:[]
      })
  },

  onCancel(event){
    this.setData({
      search:false
    })
  }
})