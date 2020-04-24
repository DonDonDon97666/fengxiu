// pages/home/home.js
import {Theme} from "../../model/theme";
import {Banner} from "../../model/banner";
import {Category} from "../../model/category";
import {Activity} from "../../model/activity";
import {SpuPage} from "../../model/spu-page";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeA:null,
    themeE:null,
    themeESpuList:null,
    bannerB:null,
    grid:[],
    activityD:null,
    themeF:null,
    bannerG:null,
    spuPage:null,
    loading: 'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.initAllData();
    this.initBottomSpuList()
  },

  async initBottomSpuList(){
    const spuPage = SpuPage.getLastestPage();
    this.data.spuPage = spuPage
    const data = await spuPage.getMoreData();
    if(!data){
      return
    }
    wx.lin.renderWaterFlow(data.items)
  },

  async initAllData(){

    //加载主题
    const theme = new Theme();
    await theme.getHomeThemes();
    const themeA = theme.getHomeLocationA();
    const themeE = theme.getHomeLocationE();
    let themeESpuList = [];
    if(themeE.online){
      const data = await Theme.getHomeLocationESpu();
      if(data){
        themeESpuList = data.spu_list.slice(0,8);
      }
    }

    const themeF = theme.getHomeLocationF();

    const themeH = theme.getHomeLocationH();

    //加载Banner
    const bannerB = await Banner.getHomeLocationB();
    //加载六宫格
    const grid = await Category.getGridCategory();
    //获取优惠券入口
    const activity = await Activity.getHomeLocationD();

    //加载bannerG
    const bannerG = await Banner.getHomeLocationG();

    this.setData({
      themeA,
      themeE,
      themeESpuList,
      bannerB:bannerB,
      grid:grid,
      activityD:activity,
      themeF,
      bannerG,
      themeH
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    const data = await this.data.spuPage.getMoreData();
    if(!data){
      return
    }
    wx.lin.renderWaterFlow(data.items)
    if(!data.hasMoreData){
      this.setData({
        loading : 'end'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})