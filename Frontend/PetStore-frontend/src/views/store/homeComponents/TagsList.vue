<template>
  <div class="home-page-section home-tag-list web-container">
    <section-title>{{ title }}</section-title>

    <v-row no-gutters>
      <v-col
          v-for="(tag, index) in tags"
          :key="index"
          class="tag-item-card-col"
          col="4" lg="2">
        <a @click="$router.push({ name: 'tagPage', params: { tagId: tag.id } })">
          <v-card class="tag-item-card">
            <div>
              <img class="tag-thumbnail" :src="tag.thumbnail" alt="">
            </div>
            <div>
              <h3 class="tag-title">{{ tag.name }}</h3>
            </div>
          </v-card>
        </a>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionTitle from './SectionTitle.vue'

export default {
  name: 'TagsList',
  components: { SectionTitle },
  props: {
    title: {
      default: ''
    }
  },
  data: () => ({
    tags: [
      {
        id: 3,
        name: 'Cat Tree',
        thumbnail: 'https://cms-www.chewy.com/contentAsset/raw-data/c1d0efdf-0633-4dd1-8202-06ab9bc13429/itemImage/CustomerFavorites_CatTrees_1x.jpg'
      },
      {
        id: 1,
        name: 'food',
        thumbnail: 'https://cms-www.chewy.com/contentAsset/raw-data/9ce05a6d-1753-47f9-ab08-4e0a122aa42d/itemImage/CustomerFavorites_DogTreats_1x.jpg'
      }
    ]
  })
}
</script>

<style scoped lang="less">
.home-tag-list{
  .tag-item-card-col{
    margin: 10px;

    .tag-item-card{
      text-align: center;

      .tag-thumbnail{
        max-width: 100%;
      }

      .tag-title{
        padding: 25px 0;
      }
    }
  }
}
</style>
