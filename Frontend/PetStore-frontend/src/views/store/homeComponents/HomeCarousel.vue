<template>
  <v-carousel  v-model="carousel" hide-delimiters>
    <v-carousel-item>
      <v-sheet
          height="100%"
          tile
          style="background: url('https://images.unsplash.com/photo-1589924648735-e4ddb20adeee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')"
      >
        <v-row
            class="fill-height"
            align="center"
            justify="center"
        >
          <v-col>
            <div class="home-left-text">
<!--              <h3>High-quality pet Drinking Fountain</h3>-->
<!--              <p>Looking for a drinking fountain for your pet?</p>-->
<!--              <v-btn color="orange lighten-1 white&#45;&#45;text">View Products</v-btn>-->
            </div>
          </v-col>
          <v-col>
            <div class="home-img">
            </div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet
          height="100%"
          tile
          style="background: url('https://s2.loli.net/2022/11/07/vUhQGYEmWICF1iy.png')"
      >
        <v-row
            class="fill-height"
            align="center"
            justify="center"
        >
          <v-col>
            <div class="home-left-text">
              <h3>Who are we?</h3>
              <p>We are a small business based in Buffalo New York. And Drew is our cat!</p>
<!--              <v-btn color="orange lighten-1 white&#45;&#45;text">Shop Today!</v-btn>-->
            </div>
          </v-col>
          <v-col>
<!--            <div class="home-img">-->
<!--              <img-->
<!--                  style="height: 350px;"-->
<!--                  src="@/assets/images/undraw_logistics_x4dc.svg" alt="">-->
<!--            </div>-->
          </v-col>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  name: 'HomeCarousel',
  data: () => ({
    carousel: null
  })
}
</script>

<style scoped lang="less">
.home-img{
  text-align: center;

  img{
    height: 450px;
  }
}
.home-left-text{
  text-align: left;
  font-size: 36px;
  width: 15em;
  margin-left: auto;

  @media (max-width:960px){
    padding: 0 20px;
  }
  @media (max-width:1030px){
    margin: auto;
  }

  p{
    font-size: 20px;
  }
}
</style>
