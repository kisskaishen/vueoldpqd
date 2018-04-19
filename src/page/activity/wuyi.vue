<template>
    <div class="wuyi">
        <div class="bg"></div>
        <div class="content">
            <div class="countDown">
                <span>距离活动开始还有：</span>
                <div>
                    <span>1</span>天
                    <span>59</span>时
                    <span>59</span>分
                    <span>59</span>秒
                </div>
            </div>
            <div class="ruleDiv"><router-link to="/activity/rules">活动规则</router-link></div>
            <div class="redDiv">
                <div class="goBtn" @click="goRed"></div>
            </div>
            <div class="timeSaleDiv">
                <div class="title">
                    <!--限时秒杀-->
                    <div class="titleCenter">
                        <hr>
                        <img src="../../assets/images/wuyi/xianshi.png" alt="">
                        <hr>
                    </div>
                    <!--<div>-->
                    <router-link to="/seckill"  class="titleMore">更多秒杀</router-link>
                    <!--</div>-->
                </div>
                <div class="sale">
                    <div class="saleTitle">
                        <ul>
                            <li v-for="item,index in 10" :class="index == currentIndex ?'saleTitleActive':''" @click="indexChange(item)">
                                <b>10:00</b>
                                <span v-if="index == '0'">抢购中</span>
                                <span v-else>即将开抢</span>
                            </li>
                        </ul>
                    </div>
                    <div class="saleList">
                        <ul>
                            <li v-for="item in 10">
                                <a href="../goods_detail.html?goods_id=229753">
                                    <img src="" alt="">
                                    <b>产品名称</b>
                                    <p>
                                        <b>¥366</b>
                                        <span>¥666</span>
                                    </p>
                                </a>
                            </li>
                        </ul>
                        <div class="shadowSale"></div>
                    </div>
                </div>
            </div>
            <div class="goodsDiv" v-for="item in 3">
                <div class="goodsList">
                    <div class="goods" v-for="item,index in 11">
                        <router-link :to="index == '0'?'moreList':''" v-if="index == '0'">
                            <img src="" alt="">
                            <p>
                                <b>¥56</b>
                                <span>¥99</span>
                            </p>
                        </router-link>
                        <a href="../goods_detail.html?goods_id=229753" v-if="index>0">
                            <img src="" alt="">
                            <p>
                                <b>¥56</b>
                                <span>¥99</span>
                            </p>
                        </a>
                    </div>
                </div>
            </div>
            <div class="redShowBg" v-if="showRedDiv || openRedShow"></div>
            <div class="redShowDiv" >
                <div :class="['redPic',rotateClass?'rotation':'']" v-if="showRedDiv" @click="openRed"></div>
                <div class="redShowPic" v-if="openRedShow">
                    <div class="redContBg"></div>
                    <div class="redCont">
                        <b>恭喜您获得3个红包</b>
                        <p>红包已放入"我的-优惠券"</p>
                        <div class="couponDiv">
                            <div class="couponList" v-for="item in 3">
                                <div class="coupon">
                                    <img src="" alt="">
                                    <div>
                                        <p>有效期至2018.05.03</p>
                                        <span>无门槛，可叠加</span>
                                    </div>
                                    <b><span>¥</span>10</b>
                                </div>
                                <div class="couponTip">
                                    <span>剩余7天</span>
                                    <span>全场通用券-平台</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="redBottom">
                        <i @click="redUse">立即使用</i>
                    </div>
                    <div class="redLittle">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                    </div>
                </div>
                <div class="close" @click="closeRedShow" v-if="showRedDiv || openRedShow"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                showRedDiv:false,       // 控制红包的隐藏显示
                openRedShow:false,      // 打开红包的隐藏显示
                rotateClass:false,

                currentIndex:'0',       // 点击时间选择得到当前点击的index

            }
        },
        mounted() {

        },
        methods:{
            // 显示领取红包弹框
            goRed() {
                this.showRedDiv = true
            },
            // 关闭红包弹框
            closeRedShow() {
                this.showRedDiv = false
                this.openRedShow = false
            },
            // 开红包
            openRed() {
                this.rotateClass = true
                setTimeout(()=>{
                    this.showRedDiv = false
                this.openRedShow = true
                this.rotateClass = false
            },1000)
            },
            // 使用红包
            redUse() {
                this.openRedShow = false
            },
            // 限时抢购时间选择
            indexChange(val) {
                this.currentIndex = val - 1
            }
        }
    }
</script>

<style scoped lang="scss">
    .wuyi {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: scroll;
        background-color: #270156;
        .bg {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            /*width: 100%;*/
            /*height: 100%;*/
            background: url("../../assets/images/wuyi/huichangbg.png") no-repeat 0 0 /100%;
        }
        .content {
            position: relative;
            width: 100%;
            height: 100%;
            .countDown {
                width: 100%;
                height: 60px;
                display: flex;
                padding: 0 20px;
                justify-content: space-between;
                align-items: center;
                background: transparent;
                span {
                    color: #FFAEAE;
                    font-size: 26px;
                }
                div {
                    color: #FFAEAE;
                    font-size: 24px;
                    text-align: center;

                    span {
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        color: #fff;
                        margin: 0 8px 0 4px;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        background-color: #4E0EA3;
                    }
                }
            }
            .ruleDiv {
                position: absolute;
                right: 0;
                top: 156px;
                a {
                    display: block;
                    width: 128px;
                    height: 44px;
                    line-height: 44px;
                    font-size: 24px;
                    color: #fff;
                    text-align: center;

                    background-color: #BB85FF;
                    -webkit-border-radius: 44px 0 0 44px;
                    -moz-border-radius: 44px 0 0 44px;
                    border-radius: 44px 0 0 44px;
                }

            }
            .redDiv {
                position: relative;
                margin: 600px auto 0;
                width: 576px;
                height: 108px;
                background: url("../../assets/images/wuyi/goRedBtn.png") no-repeat center /100%;
                .goBtn {
                    position: absolute;
                    right: 16px;
                    top: 10px;
                    width: 76px;
                    height: 76px;
                    background: url("../../assets/images/wuyi/activity_go.gif") no-repeat center /100%;
                }
            }
            .timeSaleDiv {
                position: relative;
                width: 710px;
                margin: 40px auto;
                .title {
                    width: 100%;
                    height: 80px;
                    background-color: #4E07A9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .titleCenter {
                        display: flex;
                        align-items: center;
                        width: 308px;
                        margin: 0 auto;
                        hr {
                            margin: 0;
                            width: 28px;
                            border: 1px solid #FFD540;
                        }
                        img {
                            width: 160px;
                            height: 40px;
                            margin: 0 40px;
                        }
                    }
                }
                .titleMore {
                    position: absolute;
                    right: 36px;
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 20px;
                    color: #FFD540;
                    font-size: 24px;
                    text-align: center;
                    background-color: #7139BA;
                }
            }
            .sale {
                width: 100%;
                .saleTitle {
                    ul {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        overflow: scroll;
                        width: 100%;
                        background-color: #7A21EB;
                        li {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            min-width: 142px;
                            height: 84px;
                            b {
                                font-size: 36px;
                                color: #fff;
                            }
                            span {
                                color: #4E07A9;
                                font-size: 20px;
                            }
                        }
                        .saleTitleActive {
                            background-color: #8C32FF;
                            span {
                                color: #FF651A;
                                font-size: 20px;
                                line-height: 24px;
                                padding: 0 8px;
                                background-color: #FFD540;
                                -webkit-border-radius: 12px;
                                -moz-border-radius: 12px;
                                border-radius: 12px;
                            }
                        }
                    }
                }
                .saleList {
                    position: relative;
                    background-color: #8C32FF;
                    width: 100%;
                    ul {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        overflow: scroll;
                        width: 670px;
                        padding: 20px 0;
                        margin: 0 auto;
                        li {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            margin-right: 20px;
                            a {
                                width: 188px;
                                height: 272px;
                                background-color: #fff;
                                border: 4px solid #FF6D66;
                                img {
                                    display: block;
                                    width: 180px;
                                    height: 180px;
                                }
                                > b {
                                    width: 180px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 26px;
                                    padding-left: 8px;

                                }
                                p {
                                    display: flex;
                                    align-items: center;
                                    justify-content: flex-start;

                                    b {
                                        color: #FF4E00;
                                        margin-right: 16px;
                                        padding-left: 8px;
                                        font-size: 20px;

                                    }
                                    span {
                                        text-decoration: line-through;
                                        color: #999;
                                        font-size: 20px;
                                    }
                                }
                            }
                        }
                    }
                    .shadowSale {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 60px;
                        height: 100%;
                        background: url("../../assets/images/wuyi/activity_shadow@2x.png") no-repeat center /100%;
                        z-index: 9;
                    }
                }
            }
            .goodsDiv {
                width: 710px;
                /*height: 355px;*/
                margin: 20px auto 40px;
                background-color: #fff;
                .goodsList {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    align-content: center;
                    .goods:first-child {
                        width: 468px;
                        background-color: red;
                        p {
                            display: none;
                        }
                    }
                    .goods {
                        width: 220px;
                        height: 220px;
                        margin-bottom: 20px;
                        background-color: #fafafa;
                        img {
                            display: block;
                            width: 136px;
                            height: 136px;
                            margin: 20px auto;
                        }
                        p {
                            text-align: center;
                            b {
                                font-size: 28px;
                                color: #F91258;
                            }
                            span {
                                font-size: 20px;
                                text-decoration: line-through;
                            }
                        }
                    }
                }
            }
            .redShowDiv {
                position: fixed;
                left: 50%;
                width: 500px;
                margin-left: -250px;
                top: 20%;
                .redPic {
                    width: 500px;
                    height: 628px;
                    margin: 0 auto;
                    background: url("../../assets/images/wuyi/redpacket@2x.png") no-repeat center /100%;
                }
                .close {
                    width: 60px;
                    height: 60px;
                    margin: 60px auto;
                    background: url("../../assets/images/wuyi/redpacket_delete@2x.png") no-repeat center /100%;
                }
                .redShowPic {
                    position: relative;
                    width: 500px;
                    height: 628px;
                    margin: 0 auto;
                    .redCont {
                        position: absolute;
                        width: 432px;
                        left: 50%;
                        bottom: 140px;
                        margin-left: -216px;
                        background-color: #f5f5f5;
                        text-align: center;
                        border-radius: 12px;
                        padding-top: 12px;
                        padding-bottom: 60px;
                        b {
                            font-size: 36px;
                        }
                        p {
                            font-size: 24px;
                            color: #ccc;
                        }
                        .couponDiv {
                            .couponList {
                                width: 400px;
                                margin: 8px auto;
                                background-color: #fff;
                                .coupon {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 8px 4px;
                                    img {
                                        display: block;
                                        width: 56px;
                                        height: 56px;
                                        border:1px solid red;
                                    }
                                    > div {
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        align-items: flex-start;
                                        p {
                                            color: #333;
                                            font-size: 26px;
                                        }
                                        span {
                                            color: #666;
                                            font-size: 24px;
                                        }
                                    }
                                    b {
                                        color: #f71a27;
                                        font-size: 60px;
                                        span {
                                            color: #f71a27;
                                            font-size: 28px;
                                        }
                                    }
                                }
                                .couponTip {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    span {
                                        color: #ccc;
                                        font-size: 24px;
                                    }
                                }
                            }
                        }
                    }
                    .redContBg {
                        position: absolute;
                        width: 468px;
                        height: 200px;
                        left: 50%;
                        bottom: 108px;
                        margin-left: -234px;
                        background: url("../../assets/images/wuyi/redpacket_back@2x.png") no-repeat center /100%;

                    }
                    .redBottom {
                        position: absolute;
                        bottom: 0;
                        width: 500px;
                        height: 220px;
                        background: url("../../assets/images/wuyi/redpacket_before@2x.png") no-repeat center /100%;
                        i {
                            position: absolute;
                            display: block;
                            width: 300px;
                            height: 60px;
                            line-height: 60px;
                            text-align: center;
                            color: #fff;
                            left: 50%;
                            margin-left: -150px;
                            bottom: 36px;
                            background: url("../../assets/images/wuyi/reapacket_button@2x.png") no-repeat center /100%;
                            z-index: 9;
                        }
                    }
                    .redLittle {
                        position: absolute;
                        width: 500px;
                        margin-left: -250px;
                        left: 50%;
                        height: 100%;
                        i {
                            position: absolute;
                            display: block;
                            &:nth-child(1) {
                                width: 52px;
                                height: 48px;
                                right: -20px;
                                bottom: 220px;
                                background: url("../../assets/images/wuyi/redpacket_goldone@2x.png") no-repeat center /100%;
                            }
                            &:nth-child(2) {
                                width: 68px;
                                height: 68px;
                                right: 0;
                                top: 32px;
                                background: url("../../assets/images/wuyi/redpacket_goldthree@2x.png") no-repeat center /100%;
                            }
                            &:nth-child(3) {
                                width: 60px;
                                height: 60px;
                                right: 60px;
                                bottom: -24px;
                                background: url("../../assets/images/wuyi/redpacket_redpacket@2x.png") no-repeat center /100%;
                            }
                            &:nth-child(4) {
                                width: 64px;
                                height: 64px;
                                left: -40px;
                                top: 200px;
                                background: url("../../assets/images/wuyi/redpacket_goldtwo@2x.png") no-repeat center /100%;
                            }
                        }
                    }
                }
                .rotation {
                    animation: rotation 1s linear 1;
                    -o-animation: rotation 1s linear 1;
                    -webkit-animation: rotation 1s linear 1;
                    -ms-animation: rotation 1s linear 1;
                    -moz-animation: rotation 1s linear 1;
                }
            }
            .redShowBg {
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: rgba(0,0,0,.4);
            }
        }
    }
    @keyframes rotation {
        from {
            transform: rotateY(0);
            -moz-transform: rotateY(0);
            -o-transform: rotateY(0);
            -webkit-transform: rotateY(0);
            -ms-transform: rotateY(0);
        }

        to {
            transform: rotateY(360deg);
            -moz-transform: rotateY(360deg);
            -o-transform: rotateY(360deg);
            -webkit-transform: rotateY(360deg);
            -ms-transform: rotateY(360deg);
        }
    }


</style>
