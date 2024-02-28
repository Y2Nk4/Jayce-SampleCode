<template>
  <div>
    <v-card class="address-card">
      <h3>{{ address.firstName }} {{ address.lastName }}</h3>
      <p>{{ address.company }}</p>
      <p>{{ address.phone }}</p>
      <p>{{ address.address1 }}</p>
      <p>{{ address.address2 }}</p>
      <p>{{ address.city }} {{address.zipCode}}, {{address.state}}</p>

      <div class="address-control">
        <a @click="editAddress">Edit</a>
        <a @click="deleteAddress">Delete</a>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AddressCard',
  props: {
    address: {
      type: Object,
      required: true
    }
  },
  methods: {
    editAddress() {
      this.$emit('edit', this.address)
    },
    deleteAddress() {
      this.$emit('delete', this.address)
    }
  }
}
</script>

<style lang="less" scoped>
.address-card{
  padding: 15px 20px;
  margin: 8px 8px;

  & > p{
    margin: 0;
  }

  .address-control{
    margin-top: 10px;
  }

  .address-control{
    a {
      margin: 0 3px;
      &:first-child{
        margin-left: 0;
      }
    }
  }
}
</style>
