// components/realm/index.js
import {FenceGroup} from "../models/fence-group";
import {Judger} from "../models/judger";
import {Spu} from "../../model/spu";
import {Cell} from "../models/cell";
import {Cart} from "../../model/cart";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        spu: Object,
        orderWay: String
    },

    observers: {
        spu: function (spu) {
            if (!spu) {
                return
            }
            if (Spu.isNoSpec(spu)) {
                this.processNoSpec(spu)
            } else {
                this.processHasSpec(spu)
            }

            this.triggerSpecEvent()
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        judger: Object,
        previewImg: null,
        title: null,
        price: null,
        discountPrice: null,
        stock: null,
        skuIntact: false,
        fences: null,
        noSpec: false,
        currentValues: Array,
        missingKeys: Array,
        outStock: false,
        currentSkuCount: Cart.SKU_MIN_COUNT
    },

    /**
     * 组件的方法列表
     */
    methods: {
        triggerSpecEvent() {
            const noSpec = Spu.isNoSpec(this.properties.spu)
            if (noSpec) {
                this.triggerEvent('specChange', {
                    noSpec: noSpec,
                })
            } else {
                this.triggerEvent('specChange', {
                    noSpec: noSpec,
                    skuIntact: this.data.judger.isSkuIntact(),
                    currentValues: this.data.judger.getCurrentValues(),
                    missingKeys: this.data.judger.getMissingKeys()
                })
            }

        },

        processNoSpec(spu) {
            this.setData({
                noSpec: true
            })
            this.bindSkuData(spu.sku_list[0])
            this.setOutStock(spu.sku_list[0].stock, this.data.currentSkuCount)
        },

        processHasSpec(spu) {
            const fenceGroup = new FenceGroup(spu)
            fenceGroup.initFenceGroup()
            this.data.judger = new Judger(fenceGroup)

            const defaultSku = fenceGroup.getDefaultSku()
            if (defaultSku) {
                this.bindSkuData(defaultSku)
                this.setOutStock(defaultSku.stock, this.data.currentSkuCount)
            } else {
                this.bindSpuData()
            }
            this.bindTipData()
            this.bindFenceGroupData(fenceGroup)
        },

        bindSpuData() {
            const spu = this.properties.spu
            this.setData({
                previewImg: spu.img,
                title: spu.title,
                price: spu.price,
                discountPrice: spu.discount_price,
            })
        },

        bindSkuData(sku) {
            this.setData({
                previewImg: sku.img,
                title: sku.title,
                price: sku.price,
                discountPrice: sku.discount_price,
                stock: sku.stock,
            })
        },

        bindTipData() {
            this.setData({
                skuIntact: this.data.judger.isSkuIntact(),
                currentValues: this.data.judger.getCurrentValues(),
                missingKeys: this.data.judger.getMissingKeys()
            })
        },

        bindFenceGroupData(fenceGroup) {
            this.setData({
                fences: fenceGroup.fences,
            })
        },

        setOutStock(stock, currentStock) {
            this.setData({
                outStock: this.isOutStock(stock, currentStock)
            })
        },


        isOutStock(stock, currentStock) {
            return stock < currentStock
        },

        onCellTap(event) {
            const data = event.detail.cell
            const x = event.detail.x
            const y = event.detail.y

            const cell = new Cell(data.spec)
            cell.status = data.status

            const judger = this.data.judger
            judger.judge(cell, x, y)
            const skuIntact = judger.isSkuIntact()
            if (skuIntact) {
                const sku = judger.getDeterminateSku()
                this.bindSkuData(sku)
                this.setOutStock(sku.stock, this.data.currentSkuCount)
            }
            this.bindTipData()
            this.bindFenceGroupData(this.data.judger.fenceGroup)
            this.triggerSpecEvent()
        },

        onSelectCount(event) {
            const currentSkuCount = event.detail.count
            this.data.currentSkuCount = currentSkuCount

            if (this.data.judger.isSkuIntact()) {
                const sku = this.data.judger.getDeterminateSku()
                this.setOutStock(sku.stock, this.data.currentSkuCount)
            }
        }
    }
})
