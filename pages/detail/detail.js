// pages/detail/detail.js
import {Spu} from "../../model/spu";
import {ShoppingWay} from "../../core/enum";
import {SaleExplain} from "../../model/sale-explain";
import {getSystemSize, getWindowHeightRpx} from "../../utils/system";
import {px2rpx} from "../../miniprogram_npm/lin-ui/utils/util";
import { Cart } from "../../model/cart";
import { CartItem } from "../../model/cart-item";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showRealm: false,
        spu: Object,
        orderWay: String,
        explain: Array,
        cartItemCount: 0
    },

    onAddToCart(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.CART
        })
    },

    onBuy(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.BUY
        })
    },

    onGoToHome(event) {
        wx.switchTab({
            url: '/pages/home/home'
        })
    },

    onShopping(event){
        const chosenSku = event.detail.sku
        const skuCount = event.detail.skuCount

        if(event.detail.orderWay === ShoppingWay.CART){
            const cart = new Cart()
            const cartItem = new CartItem(chosenSku, skuCount)
            cart.addItem(cartItem)
            this.updateCartItemCount()
        }

    },

    updateCartItemCount(){
        const cart = new Cart()
        this.setData({
            cartItemCount: cart.getCartItemCount(),
            showRealm: false
        })
    },

    onGoToCart(event) {
        wx.switchTab({
            url: '/pages/cart/cart'
        })
    },

    onSpecChange(event) {
        this.setData({
            specs: event.detail
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const pid = options.pid
        const spu = await Spu.getDetail(pid)
        const explain = await SaleExplain.getFixed()

        const h = await getWindowHeightRpx() - 100
        this.setData({
            spu,
            explain,
            h
        })

        this.updateCartItemCount()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})