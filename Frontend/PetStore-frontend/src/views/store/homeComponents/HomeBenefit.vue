<template>
  <div class="home-benefit-section web-container">
    <v-row>
      <v-col class="benefit-col d-flex flex-row" cols="6" md="3">
        <div class="benefit-icon">
          <v-icon>mdi-truck</v-icon>
        </div>
        <div class="benefit-text">
          <p>Free Delivery</p>
          <p>Start From $49</p>
        </div>
      </v-col>
      <v-col class="benefit-col d-flex flex-row" cols="6" md="3">
        <div class="benefit-icon">
          <v-icon>mdi-thumb-up</v-icon>
        </div>
        <div class="benefit-text">
          <p>Good Quality</p>
        </div>
      </v-col>
      <v-col class="benefit-col d-flex flex-row" cols="6" md="3">
        <div class="benefit-icon">
          <v-icon>mdi-credit-card</v-icon>
        </div>
        <div class="benefit-text">
          <p>Easy & Safe Payment</p>
          <p>Via Stripe™</p>
        </div>
      </v-col>
      <v-col class="benefit-col d-flex flex-row" cols="6" md="3">
        <div class="benefit-icon">
          <v-icon>mdi-thumb-up</v-icon>
        </div>
        <div class="benefit-text">
          <p>Easy Return</p>
          <p>Print a Label, then Ship it</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'HomeBenefit'
}
</script>

<style scoped lang="less">
.home-benefit-section{
  border-bottom: solid 2px #828282;

  .benefit-col{
    padding: 12px 12px 24px;

    .benefit-icon{
      width: 60px;
      height: 60px;
      text-align: center;
      align-items: center;
      position: relative;
      justify-content: center;
      display: inline-flex;
    }

    .benefit-text{
      min-height: 60px;
      justify-content: center;
      display: inline-flex;
      flex-direction: column;

      p{
        margin: 0;
        display:block;
      }
    }
  }
}
</style>
