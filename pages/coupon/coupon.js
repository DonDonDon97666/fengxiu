// pages/coupon/coupon.js
import {Activity} from "../../model/activity";
import {CouponCenterType} from "../../core/enum";

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
    const aName = options.name
    const type = options.type

    let coupons

    if (type === CouponCenterType.ACTIVITY) {
      const activity = await Activity.getActivityWithCoupon(aName)
      coupons = activity.coupons
    }

    console.log(coupons)

  },

  
})