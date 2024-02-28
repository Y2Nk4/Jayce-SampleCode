<template>
  <div class="image-displayer" :style="`--displayer-size: ${size}px`">
    <div class="image-displayer-thumbnails" ref="thumbnails-container">
      <div class="items" ref="thumbnail-items">
        <div :class="`thumbnail-item${currentCarousel === i ? ' selected' : ''}`" v-for="(image,i) in images" :key="i" @click="changeImage(i)" ref="thumbnail-item">
          <img :src="image.image_link">
        </div>
      </div>
    </div>

    <v-carousel class="image-carousel" :height="size" v-model="currentCarousel" @change="carouselChange" hide-delimiters>
      <v-carousel-item
          v-for="(image,i) in images"
          :key="i"
          :src="image.image_link"
      ></v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: 'ImageDisplayer',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    size: {
      type: Number,
      default: 400
    }
  },
  data: () => ({
    currentCarousel: null
  }),
  methods: {
    carouselChange(index) {
      console.log(index)
      this.changeImage(index)
    },
    changeImage(index) {
      this.currentCarousel = index

      const container = this.$refs['thumbnails-container']
      const item = this.$refs['thumbnail-item'][index]
      const itemsBox = this.$refs['thumbnail-items']

      const containerHeight = container.clientHeight
      let itemY = item.offsetTop
      const itemHeight = item.clientHeight
      const boxOffset = Number(itemsBox.style.getPropertyValue('--offset_val'))

      itemY += boxOffset
      // bottom
      if (itemY > (containerHeight - itemHeight + 5)) {
        const offset = itemY - (containerHeight - itemHeight) - boxOffset + 5
        itemsBox.style.setProperty('--offset', `${-offset}px`)
        itemsBox.style.setProperty('--offset_val', `${-offset}`)

      // top
      } else if (itemY < 0) {
        const offset = itemY - boxOffset
        itemsBox.style.setProperty('--offset', `${-offset}px`)
        itemsBox.style.setProperty('--offset_val', `${-offset}`)
      }
    }
  }
}
</script>

<style lang="less">
.image-displayer{
  display: flex;
  flex-direction: row;

  .image-displayer-thumbnails{
    display: inline-flex;
    flex-direction: column;
    overflow-y: hidden;
    height: var(--displayer-size);
    margin-right: 10px;

    .items{
      --offset: 0;
      transform: translateY(var(--offset));
      transition: all ease-in-out 0.3s;
      position: relative;
    }

    .thumbnail-item{
      position: relative;
      height: 90px;
      width: 90px;
      text-align: center;
      padding: 5px;
      border: solid 2px transparent;

      &.selected{
        border: solid 2px #179ad2;
        border-radius: 7px;
      }

      img{
        height: 100%;
      }
    }
  }
}

.image-carousel{
  height: var(--displayer-size);
  width: var(--displayer-size);
  border: solid 2px #dc9f9f36;

  .v-image__image{
    width: var(--displayer-size);
    height: var(--displayer-size);
    background-size: contain;
  }

  .v-window__prev, .v-window__next{
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
