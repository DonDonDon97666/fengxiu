import { Cart } from "./model/cart"
import {Token} from "./model/token";

//app.js
App({
  onLaunch: function () {
    const cart = new Cart()
    if(!cart.isEmpty()){
      wx.showTabBarRedDot({
        index: 2
      })
    }

    const token = new Token()
    token.verify()

  }
})