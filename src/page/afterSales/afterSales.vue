<template>
    <div id="afterSales">
        <div class="goodsItems">
            <div class="goodsItem" v-for="(item,index) in goodsItems" v-if="item.goodsInfo"
                 onclick="window.webview.isScrollEnabled(false)">
                <div class="header">
                    <div class="storeInfo">
              <span class="storeImg">
                <img src="../../assets/images/refund_icon_store@2x.png" alt="">
              </span>
                        <span>{{item.goodsInfo.store.store_name}}</span>
                    </div>
                    <span class="orderStatus">{{item.annotation}}</span>
                </div>
                <div class="goodsInfo">
                    <div class="goodsImg">
                        <img :src="item.goodsInfo.original" alt="">
                    </div>
                    <div class="goodsMsg">
                        <p class="goodsTitle">
                            {{item.goodsInfo.goods_name}}
                        </p>
                        <p class="goodsPrice">
                <span>
                  <span class="price">￥{{item.goodsInfo.prom_price}}</span><span class="promPrice">￥{{item.goodsInfo.shop_price}}</span>
                </span>
                            <span>
                  X{{item.num}}
                </span>
                        </p>
                    </div>
                </div>
                <div class="orderInfo">
                    共计{{item.num}}件商品&nbsp;&nbsp;合计:&nbsp;&nbsp; <span class="redColor">￥{{item.order_amount}}</span>（含运费￥0）
                </div>
                <span></span>
                <div class="cancelBtn">
                    <router-link :to="{path:'/refundDetail',query:{orderId:item.order_id}}">退款详情</router-link>
                </div>
            </div>
            <div class="loadingMore" v-if="loadingMoreCtr&&page<=totalPage">
                <img src="../../assets/images/loading@2x.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
    import {getCookie} from '../../config/mUtils'

    export default {
        name: 'afterSales',
        data() {
            return {
                userId: getCookie('user_id'),
                goodsItems: [],
                page: '',
                totalPage: '',
                loadingMoreCtr: false,
                scrollEnabled: true,
                rem: document.querySelector('html').style.fontSize
            }
        },
        mounted() {
            let self_ = this
            this.getReturnList()
            document.querySelector('body').onscroll = function (event) {
                self_.loadingMore(event)
            }
        },
        methods: {
            getReturnList: function () {
                let self_ = this
                this.http('get', 'user/return_goods_list', {
                    user_id: self_.userId,
                    page: self_.page,
                }, function (data) {
                    self_.goodsItems = self_.goodsItems.concat(data.result.items)
                    self_.scrollEnabled = true
                    self_.loadingMoreCtr = false
                    self_.page = data.result.currentpage + 1
                    self_.totalPage = data.result.totalpage
                    console.log(self_.goodsItems);
                    self_.goodsItems.forEach(function (item, index) {
                        console.log(item.goodsInfo.store.store_name);
                    })
                })
            },
            loadingMore: function (event) {//加载更多
                this.loadingMoreCtr = true;
                if (parseInt(document.querySelectorAll('.goodsItem')[this.goodsItems.length - 1].getBoundingClientRect().bottom) < parseInt(document.querySelector('body').clientHeight) + 2 * parseInt(this.rem) && this.scrollEnabled && this.totalPage >= this.page) {
                    this.scrollEnabled = false
                    this.getReturnList();
                }
            },
        }
    }
</script>

<style lang='scss' scoped>
    @import "../../style/common";

    #afterSales {
        .goodsItems {
            .goodsItem {
                display: flex;
                flex-direction: column;
                height: 4.85rem;
                margin-bottom: .2rem;
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: .84rem;
                    background-color: #fff;
                    padding: 0 .2rem;
                    .storeInfo {
                        display: flex;
                        align-items: center;
                        .storeImg {
                            height: .3rem;
                            width: .3rem;
                            margin-right: .1rem;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        span {
                            font-family: "Microsoft Yahei";
                            font-size: .26rem;
                            color: #333;
                        }
                    }
                    .orderStatus {
                        font-family: "Microsoft Yahei";
                        color: #f61027;
                        font-size: .26rem;
                    }
                }
                .goodsInfo {
                    display: flex;
                    justify-content: space-between;
                    padding: .1rem .2rem;
                    height: 2.2rem;
                    .goodsImg {
                        width: 2rem;
                        height: 2rem;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .goodsMsg {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: 4.9rem;
                        padding: .1rem 0;
                        margin-left: .2rem;
                        .goodsTitle {
                            font-family: "Microsoft Yahei";
                            font-size: .3rem;
                            color: #333;
                        }
                        .goodsPrice {
                            display: flex;
                            justify-content: space-between;
                            span {
                                font-size: .24rem;
                                color: #ccc;
                                .price {
                                    font-size: .26rem;
                                    color: #333;
                                    margin-right: .18rem;
                                }
                                .promPrice {
                                    text-decoration: line-through;
                                    font-size: .22rem;
                                }
                            }

                        }
                    }
                }
                .orderInfo {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: .9rem;
                    background-color: #fff;
                    padding: 0 .2rem;
                    font-size: .26rem;
                    color: #999;
                    .redColor {
                        color: #f61027;
                        font-size: .26rem;
                    }
                }
                .cancelBtn {
                    height: .9rem;
                    background-color: #fff;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding: 0 .2rem;
                    border-top: .01rem solid #eee;
                    a {
                        width: 1.4rem;
                        height: .5rem;
                        text-align: center;
                        line-height: .5rem;
                        background-color: #fff;
                        font-size: .24rem;
                        color: #666;
                        border: .02rem solid #666;
                        border-radius: .08rem;
                    }
                }
            }
            .loadingMore {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 1rem;
                padding-top: .2rem;
                img {
                    height: .4rem;
                    width: .4rem;
                    animation: rotation 1s linear infinite reverse;
                }
                @keyframes rotation {
                    0% {
                        transform: rotate(360deg);
                    }
                    100% {
                        transform: rotate(0deg);
                    }
                }
                span {
                    color: #ccc;
                    font-size: .24rem;
                }
            }
        }
    }
</style>
