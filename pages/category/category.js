// pages/category/category.js
import {getSystemSize} from "../../utils/system";
import {px2rpx} from "../../miniprogram_npm/lin-ui/utils/util";
import {Categories} from "../../model/categories";
import {SpuListType} from "../../core/enum";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultRootID: 2
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.initCategoryData()
        this.setDynamicSegmentHeight()
    },

    async initCategoryData() {
        const categories = new Categories()
        this.data.categories = categories

        await categories.getAll()
        const roots = categories.getRoots()
        const defaultRoot = this.getDefaultRoot(roots)
        const currentSubs = categories.getSubs(defaultRoot.id)
        this.setData({
            roots,
            currentSubs,
            currentBannerImg: defaultRoot.img,
            defaultRootID: defaultRoot.id
        })
    },

    getDefaultRoot(roots) {
        let defaultRoot = roots.find(r => r.id === this.data.defaultRootID)
        if (!defaultRoot) {
            defaultRoot = roots[0]
        }
        return defaultRoot
    },

    async setDynamicSegmentHeight() {
        const res = await getSystemSize()
        const windowHeightRpx = px2rpx(res.windowHeight)
        const h = windowHeightRpx - 60 - 20 - 2
        this.setData({
            segHeight: h
        })
    },

    onSegChange(event) {
        const rootID = event.detail.activeKey
        const currentRoot = this.data.categories.getRoot(rootID)
        const currentSubs = this.data.categories.getSubs(rootID)
        this.setData({
            currentSubs,
            currentBannerImg: currentRoot.img
        })
    },

    onJumpToSpuList(event){
        const cid = event.detail.cid
        
        wx.navigateTo({
          url: `/pages/spu-list/spu-list?cid=${cid}&type=${SpuListType.SUB_CATEGORY}`
        })
    },

    onGoToSearch(event) {
        wx.navigateTo({
            url: '/pages/search/search'
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})