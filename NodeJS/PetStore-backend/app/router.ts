import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  // user authentication
  router.post('/auth/register', controller.v1.user.auth.register)
  router.post('/auth/login', controller.v1.user.auth.login)
  router.post('/auth/forgetPassword', controller.v1.user.auth.forgetPassword)
  router.get('/auth/userInfo',
    app.middleware.auth(app), controller.v1.user.auth.userInfo)

  // products display
  router.get('/products/detail', controller.v1.store.product.getProductDetail)
  router.get('/products/tags', controller.v1.store.product.getProductTags)
  router.get('/products/getImages', controller.v1.store.product.getImages)

  router.get('/products/getProductByType', controller.v1.store.product.getProductByTag)

  // shipping rates
  router.get('/shipping/getShippingRates', controller.v1.store.shipping.getShippingRates)

  // shopping cart
  router.post('/shoppingCart/addToCart', app.middleware.auth(app, { allowPassthrough: true }), controller.v1.user.shoppingCart.addToCart)
  router.post('/shoppingCart/saveForLater', app.middleware.auth(app, { allowPassthrough: true }), controller.v1.user.shoppingCart.saveForLater)
  router.post('/shoppingCart/removeFromCart', app.middleware.auth(app, { allowPassthrough: true }), controller.v1.user.shoppingCart.removeFromCart)
  router.post('/shoppingCart/moveToCart', app.middleware.auth(app, { allowPassthrough: true }), controller.v1.user.shoppingCart.moveToCart)
  router.post('/shoppingCart/changeItemAmount', app.middleware.auth(app, { allowPassthrough: true }), controller.v1.user.shoppingCart.changeItemAmount)
  router.get('/shoppingCart/getShippingCart',
    app.middleware.auth(app, { allowPassthrough: true }), controller.v1.user.shoppingCart.getShippingCart)
  router.get('/shoppingCart/getItemsAmount',
    app.middleware.auth(app, { allowPassthrough: true }), controller.v1.user.shoppingCart.getItemsAmount)

  // user edit info
  router.put('/user/edit/address', app.middleware.auth(app), controller.v1.user.address.addAddress)
  router.post('/user/edit/address', app.middleware.auth(app), controller.v1.user.address.editAddress)
  router.delete('/user/edit/address', app.middleware.auth(app), controller.v1.user.address.deleteAddress)
  router.get('/user/addresses', app.middleware.auth(app), controller.v1.user.address.getUserAddresses)
  router.post('/address/validate', app.middleware.auth(app), controller.v1.user.address.validateAddress)

  // update password
  router.post('/user/settings/updatePassword', app.middleware.auth(app), controller.v1.user.settings.addAddress)

  // checkout process
  router.post('/checkout/initCheckout', app.middleware.auth(app, { allowPassthrough: true }), controller.v1.checkout.checkout.initCheckout)
  router.post('/checkout/addDiscount', app.middleware.auth(app), controller.v1.checkout.checkout.addDiscount)
  router.post('/checkout/removeDiscount', app.middleware.auth(app), controller.v1.checkout.checkout.removeDiscount)
  router.post('/checkout/updateShippingAddress', app.middleware.auth(app), controller.v1.checkout.checkout.updateShippingAddress)
  router.post('/checkout/updateBillingAddress', app.middleware.auth(app), controller.v1.checkout.checkout.updateBillingAddress)
  router.post('/checkout/initPayment', app.middleware.auth(app), controller.v1.checkout.checkout.initPayment)
  router.post('/checkout/submitPayment', app.middleware.auth(app), controller.v1.checkout.checkout.submitPayment)
  // router.post('/checkout/getPaymentMethods', app.middleware.auth(app), controller.v1.checkout.checkout.getPaymentMethods)
  router.get('/checkout/getCheckoutCartDetailSubtotal', app.middleware.auth(app), controller.v1.checkout.checkout.getCheckoutCartDetailSubtotal)
  router.post('/checkout/selectShippingRate', app.middleware.auth(app), controller.v1.checkout.checkout.selectShippingRate)
  router.post('/checkout/cancelPayment', app.middleware.auth(app), controller.v1.checkout.checkout.cancelPayment)
  router.post('/checkout/fetchPaymentResult', app.middleware.auth(app), controller.v1.checkout.checkout.fetchPaymentResult)

  // Stripe Webhook
  router.post('/api/stripeWebhook/', controller.v1.api.stripeWebhook.webhook)

  // order
  router.get('/user/order/orderList', app.middleware.auth(app), controller.v1.user.order.getOrderList)
  router.get('/user/order/orderDetail', app.middleware.auth(app), controller.v1.user.order.getOrderDetail)
  router.get('/user/order/getOrderAddresses', app.middleware.auth(app), controller.v1.user.order.getOrderAddresses)
  router.get('/user/order/getOrderPaymentDetail', app.middleware.auth(app), controller.v1.user.order.getOrderPaymentDetail)

  // search
  router.post('/searchProducts', controller.v1.store.search.searchProducts)

  // admin api
  router.post('/admin/auth/login', controller.v1.admin.auth.login)
  router.group({ middlewares: [ app.middleware.adminAuth(app) ] }, (router) => {

    // users related
    router.get('/admin/manage/user/userList', controller.v1.admin.manage.user.getUserList)
    router.get('/admin/manage/user/userDetail', controller.v1.admin.manage.user.getUserDetail)
    router.get('/admin/manage/user/userAddresses', controller.v1.admin.manage.user.getUserAddresses)

    // orders related
    router.get('/admin/manage/order/orderList', controller.v1.admin.manage.order.getOrderList)
    router.get('/admin/manage/order/orderDetail', controller.v1.admin.manage.order.getOrderDetail)

    // products
    router.get('/admin/manage/product/productList', controller.v1.admin.manage.product.getProductList)
    router.get('/admin/manage/product/productDetail', controller.v1.admin.manage.product.getProductDetail)
    router.post('/admin/manage/product/updateProductDetail', controller.v1.admin.manage.product.updateProductDetail)
    router.post('/admin/manage/product/directAddImageFromUrl', controller.v1.admin.manage.product.directAddImageFromUrl)
    router.post('/admin/manage/product/deleteImgAssets', controller.v1.admin.manage.product.deleteImgAssets)
    router.post('/admin/manage/product/addNewVariant', controller.v1.admin.manage.product.addNewVariant)
    router.post('/admin/manage/product/updateVariant', controller.v1.admin.manage.product.updateVariant)
    router.post('/admin/manage/product/deleteVariant', controller.v1.admin.manage.product.deleteVariant)
    router.post('/admin/manage/product/addProduct', controller.v1.admin.manage.product.addProduct)
    router.get('/admin/manage/product/variantDetail', controller.v1.admin.manage.product.getVariantDetail)

    // payment
    router.get('/admin/manage/payment/paymentList', controller.v1.admin.manage.payment.getPaymentList)
    router.get('/admin/manage/payment/paymentMethods', controller.v1.admin.manage.payment.getAllPaymentMethods)
    router.get('/admin/manage/payment/getPaymentDetail', controller.v1.admin.manage.payment.getPaymentDetail)

    router.post('/admin/manage/assets/uploadFile', controller.v1.admin.manage.fileAsset.uploadFile)
  })
}
