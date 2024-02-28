<template>
  <div>
    <v-card color="secondary--text" class="v-sheet--outlined web-container common-header">
      <div class="common-header-row">
        <a href="/Frontend/PetStore-frontend/public" class="secondary--text text--darken-2" style="text-decoration: none;">
          <div class="d-flex align-center mr-18 logo-box">
<!--            <v-img-->
<!--                alt="Vuetify Logo"-->
<!--                class="shrink mr-2"-->
<!--                contain-->
<!--                src="@/assets/images/website_logo.png"-->
<!--                transition="scale-transition"-->
<!--                width="65"-->
<!--            />-->
            <h1 class="logo-title">PawPose</h1>
          </div>
        </a>

        <div class="d-flex align-center">
          <form @submit.prevent="submitSearch">
            <v-text-field
                v-model="searchKeyword"
                label="Search ..."
                class="header-search-bar grey lighten-2"
                solo
                hide-details
                flat
            >
              <button @click="submitSearch" slot="append">
                <v-icon
                    color="primary"
                >
                  mdi-magnify
                </v-icon>
              </button>
            </v-text-field>
          </form>
        </div>

        <div class="header-right-menu">

          <div v-if="!userInfo || !userInfo.id">
            <v-btn
                href="/login"
                text
                large
                class="secondary--text"
            >
              <span>Login</span>
            </v-btn>
          </div>
          <div v-else>
            <v-menu
                v-model="headerRightMenu"
                :close-on-content-click="false"
                content-class="user-dropdown-panel"
                :nudge-width="200"
                offset-y
                open-on-hover
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="secondary--text user-avatar-btn"
                    v-bind="attrs"
                    v-on="on"
                    text
                    large
                >
                  <v-avatar color="secondary" size="30" class="header-avatar">
                    <span class="primary--text" v-if="userInfo && userInfo.firstName">
                      {{ `${userInfo.firstName.slice(0,1).toUpperCase()}${userInfo.lastName.slice(0,1).toUpperCase()}` }}
                    </span>
                  </v-avatar>
                  <template v-if="!$vuetify.breakpoint.mobile">
                    Hi, {{ userInfo.firstName }}
                    <v-icon :class="`${headerRightMenu ? 'show' : 'hide'} menu-icon`">mdi-menu-down</v-icon>
                  </template>
                </v-btn>
              </template>

              <v-card class="header-right-panel">
                <div class="panel-block">
                  <user-dropdown-panel/>
                </div>
              </v-card>
            </v-menu>
          </div>

          <v-btn
              text
              large
              class="secondary--text"
              @click="$router.push({name: 'shopping-cart'})"
          >
            <span class="mr-1" v-if="!$vuetify.breakpoint.mobile">Cart</span>
            <v-badge
                color="green"
                :content="shoppingCartItemsAmount">
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </div>
      </div>
      <div class="common-header-second-row">
        <v-menu
          v-model="headerLeftMenu"
          :close-on-content-click="false"
          content-class="category-panel"
          :nudge-width="50"
          offset-y
          open-on-hover
        >
          <template v-slot:activator="{ on, attrs }">

            <v-btn
              class="primary secondary--text user-avatar-btn"
              v-bind="attrs"
              v-on="on"
              text
              large
              @click.prevent="() => null">
              <template v-if="!$vuetify.breakpoint.mobile">
                Shop By Category
                <v-icon :class="`${headerLeftMenu ? 'show' : 'hide'} menu-icon`">mdi-menu-down</v-icon>
              </template>
              <template v-else>
                <v-icon>mdi-menu</v-icon>
              </template>
            </v-btn>
          </template>

          <v-card class="header-right-panel">
            <div class="panel-block">
              <div class="panel-column">
                <div class="panel-item">
                  <div class="panel-large-links">
                    <h4>Categories</h4>

                    <a class="secondary--text" href="http://localhost:8080/tag/food">
                      <my-icon type="icon-dog_food_bag"/>
                      <span>Food</span>
                    </a>
                    <a class="secondary--text" href="http://localhost:8080/tag/accessories">
                      <my-icon type="icon-dog_food_bowl"/>
                      <span>Accessories</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-menu>

        <v-btn
          class="secondary--text user-avatar-btn"
          text
          large
          @click.prevent="() => null">
          Today's Deal
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UserDropdownPanel from '@/views/common/UserDropdownPanel.vue'

export default {
  name: 'Header',
  components: {
    UserDropdownPanel
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo,
      shoppingCartItemsAmount: (state) => state.shoppingCart.shoppingCartItemsAmount.toString()
    })
  },
  methods: {
    ...mapActions({
      authLogout: 'auth/authLogout',
      getShoppingCartItemsAmount: 'shoppingCart/getItemsAmount'
    }),
    async prepareLogout() {
      const res = await this.$dialog.confirm({
        text: 'Do you really want to Sign out?',
        title: 'Sign out'
      })
      console.log(res)
      if (res) {
        await this.authLogout()
        window.location.href = '/'
      }
    },
    submitSearch() {
      if (this.searchKeyword) {
        this.$router.push({
          name: 'search',
          query: {
            keyword: this.searchKeyword
          }
        })
      }
    }
  },
  data: () => ({
    headerRightMenu: false,
    headerLeftMenu: false,
    searchKeyword: ''
  }),
  mounted() {
    console.log(this.$store.state.auth.userInfo)
    this.getShoppingCartItemsAmount()
  }
}
</script>

<style lang="less">
.common-header{
  display: flex;
  flex-direction: column;
  border-radius: 0!important;
  padding: 0;
  min-height: 80px;

  .user-avatar-btn{
    .menu-icon{
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
      &.show {
        transform: rotateX(180deg);
      }
    }
  }

  .common-header-row{
    padding: 0 7.5em;
    display: inline-flex;
    align-content: center;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
  }

  .common-header-second-row{
    border-top: solid 1px #efefef;
    padding: 10px 7.5em;

    button{
      margin-right: 10px;
    }
  }

  h3.website-title{
    font-weight: 600;
    letter-spacing: 1.5px;
  }
  div.logo-box{
    margin-right: 2em;

    .logo-title{
      line-height: 72px;
      font-size: 20px;
      padding: 0 10px;
    }
  }
  div.header-search-bar{
    width: 30em;

    &  > .v-input__control > .v-input__slot {
      background-color: #f2f2f2 !important;
      border-color: #f2f2f2 !important;
    }

    @media (max-width:1160px){
      width: 20em;
    }
    @media (max-width:959px){
      width: 30em;
    }
    @media (max-width:780px){
      width: auto;
    }
  }
  .v-toolbar__content{
    justify-content: space-between;
  }

  div.header-right-menu{
    display: inline-flex;
  }

  div.header-avatar{
    margin-right: 8px;
    span{
      text-align: center;
      width: 100%;
    }
  }
}
div.header-right-panel{
  padding: 10px 15px;

  .panel-block{
    display: flex;
    flex-direction: row;
    justify-content: center;

    .panel-column{
      flex-direction: column;
      width: 100%;

      .panel-item{
        margin: 5px;
        min-width: 12em;
        text-decoration: none;
        padding: 0 5px 0px 5px;

        &:not(:last-child){
          margin-bottom: 16px;
        }

        h4{
          padding-bottom: .7em;
          margin-bottom: .2em;
          border-bottom: solid 1.5px rgb(92 92 92 / 16%);
        }
        a{
          text-decoration: none;
          display: block;
          padding-left: 3px;
        }

        .panel-large-links{
          a {
            display: block;
            padding: 12px 3px;

            border-bottom: solid 1.5px rgb(92 92 92 / 16%);
            &:last-child{
              border-bottom: none;
            }

            align-items: center;
            & > *{
              vertical-align: middle;
            }

            i.anticon{
              font-size: 22px;
              margin-right: 6px;
              vertical-align: top;
            }
            & > span{
              font-weight: 800;
              color: #464646;
            }
          }
        }
      }
    }
  }
}

.category-panel{
  padding: 2px;

  &::before{
    content: ' ';
    height: 10px;
    display: block;
  }
  box-shadow: none;
  border: none;

  & > .v-card{
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    border-radius: 4px;
  }
}
</style>
