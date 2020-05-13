import { accMultiply, accAdd } from "../utils/number"

class Calculator{
    totalSkuPrice = 0
    totalSkuCount = 0
    cartItems = []

    constructor(cartItems){
        this.cartItems = cartItems
    }

    calc(){
        this.cartItems.forEach(item=>{
            this.push(item)
        })
    }

    push(cartItem){
        let partTotalPrice = 0
        if(cartItem.sku.discount_price){
            partTotalPrice = accMultiply(cartItem.count, cartItem.sku.discount_price)
        }else {
            partTotalPrice = accMultiply(cartItem.count, cartItem.sku.price)
        }
        this.totalSkuCount += cartItem.count
        this.totalSkuPrice = accAdd(this.totalSkuPrice, partTotalPrice)
    }
}

export{
    Calculator
}