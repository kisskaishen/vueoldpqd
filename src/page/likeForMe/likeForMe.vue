<template lang="html">
    <div id="likeForMe">
        <div class="header">
            <div class="goodsInfo">
        <span>
            <img src="./images/goodsPic.jpg" alt="" v-if="!goodsInfo.list_img">
            <img :src="goodsInfo.list_img" alt="" v-else>
        </span>
                <div class="">
                    <p>{{goodsInfo.goods_name}}</p>
                    <div class="goodsInfoBottom">
                        <div class="left">
                            <span>{{goodsInfo.market_price}}</span>
                            <span>¥<span>0</span>.00</span>
                        </div>
                        <div class="right">
                            <span>助力人数：{{goodsInfo.users_required}}人</span>
                            <span>剩余{{chaNum}}人</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="headerBottom">
                <div class="prograss">
                    <span>助力进度</span>
                    <span>
            <span></span>
          </span>
                </div>
                <span>已有{{goodsInfo.user_paied}}位小伙伴助力</span>
            </div>
        </div>
        <div class="title">
              <span>
                <img src="./images/助力伙伴.png" alt="">
              </span>
            </div>
            <ul class="userInfo">
                <li v-for="item,index in goodsInfo.user_list">
                    <span>
                      <img :src="item.headimg" :alt="item.nickname">
                    </span>
                    <span>
                      <span>{{item.nickname}}</span>
                      <span>{{item.timestamp | formatDate}}</span>
                    </span>
                </li>

        </ul>
        <div class="button">
            <button type="button" name="button"><a href="https://wx.pinquduo.cn" style="color: #fff;">回首页</a></button>
        </div>
        <div class="rules">
            <h3>活动说明</h3>
            <p>1.邀请好友助力，邀请人数满足助力条件，则获得免单商品；</p>
            <p>2.若平台发现用户刷单等欺骗行为，平台有权利终止其获取的免单商品；</p>
            <p>3.助力免单商品详情见个人中心为我助力；</p>
            <p>4.用户助力若未完全完成，平台视完成的进度未用户提供一份奖励；</p>
            <p>5.活动的最终解释权（法律范围之内）归拼趣多所有；</p>
        </div>
    </div>
</template>

<script>
    import cookie from '../../config/cookie'
    import {formatDate} from '../../config/formatData'

    export default {
        data() {
            return {
                goodsInfo: '',
                chaNum:0,
            }
        },
        created() {
            var _this = this;
            this.http('get', 'raisepic/detail', {
                order_id: this.$route.query.order,
                user_id: cookie.get('user_id')
            }, function (data) {
                console.log(data)
                if (data.status == '1') {
                    _this.goodsInfo = data.data
                    _this.chaNum = parseInt(data.data.users_required)-parseInt(data.data.user_paied)
                } else {
                    console.log(3333)
                }
            })
        },
        filters: {
            formatDate(time) {
                var date = new Date(time*1000);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        }
    }
</script>

<style lang="scss">
    #likeForMe {
        padding: .15rem;
        .header {
            padding: .2rem .28rem 0 .28rem;
            background-color: #fff;
            border-radius: .1rem;
            height: 3.85rem;
            .goodsInfo {
                height: 2.6rem;
                padding: .2rem 0 .26rem 0;
                border-bottom: .01rem solid #f1f1f1;
                display: flex;
                justify-content: space-between;
                > span {
                    height: 2.1rem;
                    width: 2.1rem;
                    img {
                        width: 100%;
                    }
                }
                > div {
                    width: 4.4rem;
                    height: 100%;
                    overflow: hidden;
                    padding-top: .2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    p {
                        font-size: .26rem;
                        color: #1b1b1f;
                        height: .72rem;
                        overflow: hidden;
                    }
                    .goodsInfoBottom {
                        height: .9rem;
                        display: flex;
                        justify-content: space-between;
                        .left {
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            > span:first-child {
                                font-size: .24rem;
                                color: #a2a2a2;
                                line-height: .24rem;
                                text-decoration: line-through;
                            }
                            > span:last-child {
                                color: #EF394A;
                                font-size: .35rem;
                                line-height: .35rem;
                                margin-top: .14rem;
                                font-weight: bold;
                                span {
                                    font-size: .55rem;
                                    color: #EF394A;
                                }
                            }
                        }
                        .right {
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-end;
                            align-items: flex-end;
                            span:first-child {
                                font-size: .19rem;
                                color: #EF394A;
                                line-height: .19rem;
                            }
                            span:last-child {
                                background-image: url('./images/助力.png');
                                background-size: 100% 100%;
                                height: .45rem;
                                padding: 0 .1rem;
                                font-size: .21rem;
                                color: #fff;
                                margin-top: .23rem;
                                line-height: .45rem;
                            }
                        }
                    }
                }
            }
            > .headerBottom {
                padding: .14rem .4rem 0 .2rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .prograss {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    > span:first-child {
                        font-size: .24rem;
                        color: #FE2D2D;
                        line-height: .24rem;
                    }
                    > span:last-child {
                        width: 5rem;
                        height: .1rem;
                        border: .01rem solid #FFAFAF;
                        border-radius: .05rem;
                        position: relative;
                        span {
                            position: absolute;
                            width: 60%;
                            height: .1rem;
                            top: -.01rem;
                            border-radius: .05rem;
                            background: linear-gradient(to right, #FF8383, #FE2D2D);
                            &::after {
                                content: '';
                                position: absolute;
                                height: .05rem;
                                width: .05rem;
                                border-radius: .025rem;
                                background-color: #fff;
                                right: .025rem;
                                top: .02rem;
                            }
                        }

                    }
                }
                > span {
                    height: .4rem;
                    width: 2.1rem;
                    background: linear-gradient(to right, #FF8383, #FE2D2D);
                    border-radius: .05rem;
                    font-size: .2rem;
                    color: #fff;
                    line-height: .4rem;
                    text-align: center;
                    display: inline-block;
                    margin-top: .13rem;
                    margin-left: 2.67rem;
                }
            }
        }
        .title {
            height: .88rem;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                position: relative;
                height: .34rem;
                img {
                    height: .34rem;
                    width: 1.5rem;

                }
                &::after {
                    content: '';
                    width: 1.95rem;
                    height: .01rem;
                    background-color: #FE2F2F;
                    position: absolute;
                    top: 50%;
                    margin-left: .3rem;
                }
                &::before {
                    content: '';
                    width: 1.95rem;
                    height: .01rem;
                    background-color: #FE2F2F;
                    position: absolute;
                    top: 50%;
                    left: -2.25rem;
                }
            }
        }
        .userInfo {
            padding: 0 .3rem;
            background-color: #fff;
            border-radius: .1rem;
            > li + li {
                border-bottom: .01rem solid #f1f1f1;
            }
            > li {
                display: flex;
                height: 1.56rem;
                align-items: center;
                > span:first-child {
                    height: .95rem;
                    width: .95rem;
                    overflow: hidden;
                    margin-right: .2rem;
                    img {
                        width: 100%;
                    }
                }
                > span:last-child {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    span:first-child {
                        color: #474747;
                        font-size: .26rem;
                        line-height: .26rem;
                    }
                    span:last-child {
                        font-size: .24rem;
                        color: #808080;
                        line-height: .24rem;
                        margin-top: .1rem;
                    }
                }
            }
        }
        .button {
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            button {
                background-color: #EF394A;
                width: 5.53rem;
                height: .88rem;
                border-radius: .44rem;
                color: #fff;
                font-size: .3rem;
            }
        }
        .rules {
            height: 4rem;
            border-radius: .1rem;
            background-color: #fff;
            padding: .37rem .3rem 0 .31rem;
            h3 {
                font-size: .3rem;
                color: #EF394A;
            }
            p {
                font-size: .24rem;
                color: #EF394A;
                padding: .04rem 0;
            }
        }
    }
</style>
