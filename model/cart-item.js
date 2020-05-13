class CartItem{
    skuId = null
    count = 0
    sku = null
    checked = true

    constructor(sku, count){
        this.sku = sku
        this.skuId = sku.id
        this.count = count
    }
}

export{
    CartItem
}