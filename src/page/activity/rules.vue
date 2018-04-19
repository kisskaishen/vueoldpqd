<template>
    <div class="rules">
        <div class="rulesText">
            <h3>活动规则</h3>
            <p class="title">一、活动时间</p>
            <p>五一活动日期：</p>
            <p>2018.4.29 0点至2018.5.3 23:59:59</p>
            <p class="title">二、限时秒杀说明</p>
            <p>1.2018年4月29日 0点至2018年5月3日每天10点准时提供优质秒杀商品，每场秒杀时间持续数个小时，每天至少进行四场秒杀活动；</p>
            <p>2.秒杀时间段的商品价格按照活动价格结算，超过秒杀时间的商品将恢复到原价；</p>
            <p>3.秒杀商品支持设置开团提醒，设置之后用户将在开团前的三分钟收到平台的提示信息；</p>
            <p>4.秒杀商品支持使用优惠券，平台优惠券和商家优惠券在结算的时候可叠加使用；</p>
            <p class="title">三、精品优选说明（出游必备 换季焕新 热卖精品 夏日好货）</p>
            <p> 1.2018年4月29日 0点至2018年5月3日 23:59:59 五一活动正式场活动开始，用户即可购买精品优选的商品；</p>
            <p> 2.精品优选活动开始之前，用户可先挑选自己所喜爱的商品，设置开团提醒，平台将在开团前的三分钟提醒用户购买；</p>
            <p> 3.精品优选商品支持使用优惠券，平台优惠券和商家优惠券在结算的时候可叠加使用；</p>
            <p> 4.精品优选的商品在活动期间，销售价格照活动价格展示，活动结束后，即恢复到原价；</p>
            <p class="title">四、优惠券说明</p>
            <p> 1.优惠券发放时间段：2018年4月29日 0点至2018年5月3日 23:59:59</p>
            <p> 2.平台优惠券仅支持活动商品使用，无门槛（超过红包金额0.01元即可）；</p>
            <p> 3.每个用户每天只能参与一次领取优惠券；</p>
            <p> 4.若需要退货，优惠券金额不予退还；</p>
            <p> 5.平台优惠红包和商家优惠券可叠加使用，且每个类型的优惠券每单只能使用一张；</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "rules"
    }
</script>

<style scoped lang="scss">
    .rules {
        width: 100%;
        background: url("../../assets/images/wuyi/rule-bg.png") no-repeat 0 0 /100%;
        .rulesText {
            width: 508px;
            margin: 0 auto;
            padding: 80px 0 160px;
            h3 {
                font-size: 52px;
                color: #fff;
                text-align: center;
                margin-bottom: 20px;
            }
            p {
                color: #fff;
                font-size: 28px;

            }
            .title {
                margin-top: 40px;
                font-size: 32px;
            }
        }
    }
</style>
