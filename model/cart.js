/**
 * @作者 吴延昭
 * @创建时间 2020/3/24 14:16
 */
import {Sku} from "./sku";

class Cart{
    static SKU_MIN_COUNT = 1
    static SKU_MAX_COUNT = 77
    static CART_ITEM_MAX_COUNT = 77
    static STORAGE_KEY = 'cart'

    //代理模式，代理小程序缓存
    _cartData = null

    constructor(){
        if(typeof Cart.instance === 'object'){
            return Cart.instance
        }
        Cart.instance = this
        return this
    }

    getSkuCountBySkuId(skuId) {
        const cartData = this._getCartData()
        const item = cartData.items.find(item => item.skuId === skuId)
        if (!item) {
            console.error('在订单里寻找CartItem时不应当出现找不到的情况')
        }
        return item.count
    }

    getCheckedSkuIds() {
        const cartData = this._getCartData()
        if (cartData.items.length === 0) {
            return []
        }
        const skuIds = []
        cartData.items.forEach(item => {
            if (item.checked) {
                skuIds.push(item.sku.id)
            }
        })
        return skuIds
    }

    async getAllSkuFromServer(){
        const cartData = this._getCartData();
        if (cartData.items.length === 0) {
            return cartData
        }
        const skuIds = this.getSkuIds()
        const serverData = await Sku.getSkusByIds(skuIds)
        this._refreshByServerData(serverData)
        this._refreshStorage()
        return this._getCartData()
    }

    _refreshByServerData(serverData) {
        const cartData = this._getCartData()
        cartData.items.forEach(item => {
            this._setLatestCartItem(item, serverData)
        })
    }

    _setLatestCartItem(item, serverData) {
        let removed = true
        for (let sku of serverData) {
            if (sku.id === item.skuId) {
                removed = false
                item.sku = sku
                break
            }
        }
        if (removed) {
            item.sku.online = false
        }
    }

    getSkuIds() {
        const cartData = this._getCartData()
        if (cartData.items.length === 0) {
            return []
        }
        return cartData.items.map(item => item.skuId)
    }

    addItem(newItem){
        if(this._beyondMaxCartItemCount()){
            throw new Error('超过购物车最大数量')
        }
        this._pushItem(newItem)
        this._refreshStorage()
    }

    removeItem(skuId){
        const oldItemIndex = this._findEqualItemIndex(skuId)
        const cartData = this._getCartData()
        cartData.items.splice(oldItemIndex, 1)
        this._refreshStorage()
    }

    _findEqualItemIndex(skuId) {
        const cartData = this._getCartData()
        return cartData.items.findIndex(item => {
            return item.skuId === skuId
        })
    }

    isAllChecked() {
        let allChecked = true
        const cartItems = this._getCartData().items
        for (let item of cartItems) {
            if (!item.checked) {
                allChecked = false
                break
            }
        }
        return allChecked
    }

    _refreshStorage(){
        wx.setStorageSync(Cart.STORAGE_KEY, this._cartData)
    }

    _pushItem(newItem){
        const cartData = this._getCartData()

        const oldItem = this.findEqualItem(newItem.skuId)
        if(!oldItem){
            cartData.items.unshift(newItem)
        }else {
            this._combineItems(oldItem, newItem)
        }
    }

    findEqualItem(skuId){
        const cartData = this._getCartData()
        let oldItem = null

        for(let item of cartData.items){
            if(item.skuId === skuId){
                oldItem = item
                break
            }
        }

        return oldItem;
    }

    getCartItemCount() {
        return this._getCartData().items.length
    }

    _combineItems(oldItem, newItem){
        this._plusCount(oldItem, newItem.count)
    }

    checkAll(checked) {
        const cartData = this._getCartData()
        cartData.items.forEach(item => {
            item.checked = checked
        })
        this._refreshStorage()
    }

    checkItem(skuId) {
        const oldItem = this.findEqualItem(skuId)
        oldItem.checked = !oldItem.checked
        this._refreshStorage()
    }

    _plusCount(oldItem, count){
        oldItem.count += count
        if(oldItem.count >= Cart.SKU_MAX_COUNT){
            item.count = Cart.SKU_MAX_COUNT
        }
    }

    static isSoldOut(item) {
        return item.sku.stock === 0
    }

    static isOnline(item) {
        return item.sku.online
    }

    _beyondMaxCartItemCount(){
        const cartData = this._getCartData()
        return cartData.items.length >= Cart.CART_ITEM_MAX_COUNT
    }

    getAllCartItemsFromLocal(){
        return this._getCartData()
    }

    isEmpty(){
        return this._getCartData().items.length === 0
    }

    getCheckedItems(){
        const allCartItems = this._getCartData().items
        const checkedCartItems = []
        allCartItems.forEach(item=>{
            if(item.checked){
                checkedCartItems.push(item)
            }
        })
        return checkedCartItems
    }

    replaceItemCount(skuId, newCount){
        const oldItem = this.findEqualItem(skuId)
        if(!oldItem){
            console.error('异常情况，更新sku数量不应该找不到sku')
            return
        }
        if(newCount<1){
            console.error('异常情况，sku的数量不可能小于1')
            return
        }
        oldItem.count = newCount
        if(oldItem.count > Cart.SKU_MAX_COUNT){
            oldItem.count = Cart.SKU_MAX_COUNT
        }
        this._refreshStorage()
    }


    _getCartData(){
        if(this._cartData != null){
            return this._cartData
        }

        let cartData = wx.getStorageSync(Cart.STORAGE_KEY)
        if(!cartData){
            cartData = this._initCartDataStorage()
        }
        this._cartData = cartData
        return cartData
    }

    _initCartDataStorage(){
        const cartData = {
            items: []
        }
        wx.setStorageSync(Cart.STORAGE_KEY, cartData)
        return cartData
    }
}

export {
    Cart
}