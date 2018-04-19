<template>
    <div class="moreList">
        <div class="banner">
            <img src="" alt="banner图">
        </div>
        <div class="swiper">
            <ul>
                <li v-for="item,index in swiper" :class="index == currentIndex?'active':''" @click="indexChange(index)">{{item}}</li>
            </ul>
        </div>
        <div class="choose">
            <ul>
                <li>综合</li>
                <li>销量</li>
                <li>价格</li>
            </ul>
        </div>
        <div class="goodsList">
            <ul>
                <li v-for="item in 9">
                    <router-link to="">
                        <img src="" alt="">
                        <p>
                            <label>商品名称</label>
                        </p>
                        <p>
                            <b>¥99.0</b>
                            <span>2人团</span>
                        </p>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "more-list",
        data() {
            return {
                swiper:['全部','必备年货','年货大礼包','零食','水果'],
                currentIndex:'0',
            }
        },
        mounted() {
            document.title = '动态设置title'
        },
        methods:{
            indexChange(val) {
                this.currentIndex = val
            }
        }
    }
</script>

<style scoped lang="scss">
    .moreList {
        width: 100%;
        > div {
            width: 100%;
        }
        .banner {
            img {
                display: block;
                width: 100%;
                height: 312px;
                border-bottom:1px solid red;
            }
        }
        .swiper {
            ul {
                width: 100%;
                height: 88px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                align-content: center;
                overflow-x: scroll;
                background-color: #fff;
                li {
                    padding: 0 24px;
                    color: #333;
                    font-size: 32px;

                }
                .active {
                    color: #d90c0c;
                    font-size: 36px;
                }
            }
        }
        .choose {
            background-color: #df262c;
            ul {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                align-content: center;
                height: 88px;
                li {
                    flex: 1;
                    padding: 0 24px;
                    color: #fff;
                    font-size: 32px;
                    text-align: center;
                }
            }
        }
        .goodsList {
            padding-bottom: 40px;
            ul {
                display: flex;
                flex-flow: wrap;
                justify-content: space-around;
                li {
                    margin-top: 20px;
                    a {
                        display: block;
                        width: 232px;
                        background-color: #fff;
                        img {
                            display: block;
                            width: 232px;
                            height: 232px;
                            border:1px solid red;
                            box-sizing: border-box;
                        }
                        p {
                            display: flex;
                            justify-content: space-between;
                            width: 220px;
                            margin: 0 auto;
                            label {
                                width: 220px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 28px;
                                color: #333;
                            }
                            b {
                                font-size: 28px;
                                color: #f61027;
                            }
                            span {
                                font-size: 24px;
                                color: #ccc;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
