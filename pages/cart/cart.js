import { Cart } from "../../model/cart"
import { Calculator } from "../../model/calculator"

// pages/cart/cart.js
const cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems: [],
    isEmpty: false,
    allChecked: false,
    totalPrice: 0,
    totalSkuCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const cartData = await cart.getAllSkuFromServer()
    this.setData({
      cartItems: cartData.items
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const cartItems = cart.getAllCartItemsFromLocal().items
    if(cart.isEmpty()){
      this.empty()
      return
    }

    this.setData({
      cartItems: cartItems
    })
    this.notEmpty()
    this.isAllChecked()
    this.refreshCartData()
  },

  isAllChecked(){
    let allChecked = cart.isAllChecked()
    this.setData({
      allChecked
    })
  },

  onDeleteItem(){
    this.isAllChecked()
    this.refreshCartData()
  },

  onSingleCheck(){
    this.isAllChecked()
    this.refreshCartData()
  },

  refreshCartData(){
    const checkedItems = cart.getCheckedItems()
    const calculator = new Calculator(checkedItems)
    calculator.calc()
    this.setCalcData(calculator)
  },

  setCalcData(calculator){
    const totalPrice = calculator.totalSkuPrice
    const totalSkuCount = calculator.totalSkuCount
    this.setData({
      totalPrice,
      totalSkuCount
    })
  },

  onSettle(event){
    if (this.data.totalSkuCount <= 0) {
      return
    }
    wx.navigateTo({
        url: `/pages/order/order`
    })
  },

  onCheckAll(event){
    const checked = event.detail.checked
    cart.checkAll(checked)
    this.setData({
      cartItems: this.data.cartItems
    })
    this.refreshCartData()
  },

  onCountFloat(event){
    this.refreshCartData()
  },

  empty(){
    this.setData({
      isEmpty: true
    })
    wx.hideTabBarRedDot({
      index: 2
    })
  },

  notEmpty(){
    this.setData({
      isEmpty: false
    })
    wx.showTabBarRedDot({
      index: 2
    })
  }
})