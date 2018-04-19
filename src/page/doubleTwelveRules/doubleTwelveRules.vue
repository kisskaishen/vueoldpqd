<template>
  <div class="doubleTwelveRules">
    <div class="rules">
      <h1>活动规则</h1>
      <h3>一、活动时间</h3>
      <div class="rule">
        圣诞活动日期：2017.12.21 0点至2017.12.26  23:59:59
      </div>
      <div class="rule">
        元旦活动日期：2017.12.27 0点至2018.1.10  23:59:59
      </div>
      <!-- <div class="rule last">
        双十二返场活动日期：2017.12.14 0点至2017.12.20  23:59:59
      </div> -->

      <h3>二、限时秒杀说明</h3>
      <div class="rule">
        1.2017年12月21日 0点至2018年1月10日每天10点准时提供优质秒杀商品，每场秒杀时间持续1个小时，每天至少进行一场秒杀活动；
      </div>
      <div class="rule">
        2. 秒杀时间段的商品价格按照活动价格结算，超过秒杀时间的商品将恢复到原价；
      </div>
      <div class="rule">
        3. 秒杀商品支持设置开团提醒，设置之后用户将在开团前的三分钟收到平台的提示信息；
      </div>
      <div class="rule last">
        4. 秒杀商品支持使用优惠券，平台优惠券和商家优惠券在结算的时候可叠加使用；
      </div>

      <h3>三、精品优选说明</h3>
      <div class="rule">
        1. 2017年12月21日 0点至2018年1月10日 23:59:59  双旦正式场活动开始，用户即可购买精品优选的商品；
      </div>
      <div class="rule">
        2. 精品优选活动开始之前，用户可先挑选自己所喜爱的商品，设置开团提醒，平台将在开团前的三分钟提醒用户购买；
      </div>
      <div class="rule">
        3. 精品优选商品支持使用优惠券，平台优惠券和商家优惠券在结算的时候可叠加使用；
      </div>
      <div class="rule last">
        4. 精品优选的商品在活动期间，销售价格照活动价格展示，活动结束后，恢复到原价；库存按照活动库存显示，活动结束之后，恢复到原有库存；
      </div>

      <h3>四、九宫格抽奖说明</h3>
      <div class="rule">
        1.抽奖时间为2017年12月21日 0点至2018年1月10日 23:59:59；
      </div>
      <div class="rule">
        2. 用户每天有5次抽奖的机会，当日机会未用完，则次日重新按照5次计算；
      </div>
      <div class="rule">
        3. 用户奖品为满减优惠券，无门槛优惠券，免单券，再来一次的抽奖机会；
      </div>
      <div class="rule">
        4. 用户中奖的奖品存放在个人优惠券列表（再来一次抽奖机会增加到当天的抽奖次数之中去）；
      </div>
      <div class="rule last">
        5. 用户所中奖品，仅能通过抽奖账号进行使用；
      </div>

      <h3>五、优惠券说明</h3>
      <div class="rule">
        1. 平台优惠券和商家优惠券可叠加使用，且每个类型的优惠券每单只能使用一张；
      </div>
      <div class="rule">
        2. 优惠券使用之后，若需要退货，则优惠券不会返还；
      </div>
      <div class="rule">
        3. 优惠券过期之后不能使用；
      </div>

    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  .doubleTwelveRules{
    width: 100%;
    height: auto;
    overflow: hidden;
    background: url('../../assets/images/rules_bg.png') no-repeat;
    background-size: 100%;

    padding-bottom: .99rem;
    div,h1,h3{
      color: #fff;
      font-weight: normal;
      font-family: PingFang;
    }
    .rules{
      width: 5.02rem;
      height: 21.91rem;
      margin:0 auto;
      padding-top: .9rem;
      //padding-bottom: 1rem;
      h1{
        text-align: center;
        font-size: .5rem;
        margin-bottom: .1rem;//HiraginoSansGB-W6
        font-family: HiraginoSansGB;
      }
      h3,.rule{
        font-size: .26rem;
      }
      .rule{
        text-indent: .26rem;
      }
      .last{
        margin-bottom: .3rem;
      }
    }
  }
</style>
