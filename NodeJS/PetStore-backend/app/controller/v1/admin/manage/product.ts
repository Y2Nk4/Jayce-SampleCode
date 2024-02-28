import { Controller } from 'egg'
import { Op } from 'sequelize'
import * as _ from 'lodash'

export default class ProductController extends Controller {
  async getProductList() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      size: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 20) },
      page: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 1) }
    }, ctx.request.query, 'rule')
    if (!valid) return

    let { size = 2, page = 1 } = ctx.request.query
    size = Number(size)
    page = Number(page)

    const productResult = await app.model.Product.findAndCountAll({
      limit: size,
      offset: (page - 1) * size,
      include: [
        'product_image', {
          model: app.model.ProductVariant.scope('simpleInfo'),
          as: 'variants'
        }
      ]
    })

    return ctx.success({
      dataRows: app.resource.admin.product.productSimpleInfoResource(productResult.rows),
      pagination: {
        total: productResult.count,
        page,
        size
      }
    })
  }

  async getProductDetail() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      productId: { type: 'integer', required: false, transform: Number }
    }, ctx.request.query, 'rule')
    if (!valid) return

    const { productId } = ctx.request.query

    const product = await app.model.Product.findOne({
      where: {
        id: productId
      },
      include: [
        'variants', 'images'
      ]
    })

    console.log(productId, product)
    if (!product) {
      return ctx.error('Product Not Found', 404)
    }

    return ctx.success(app.resource.admin.product.productDetailResource(product))
  }

  async updateProductDetail() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      productId: { type: 'integer', required: false, transform: Number }
    }, ctx.request.body, 'rule')
    if (!valid) return
    const { productId, title, description, status } = ctx.request.body

    const product = await app.model.Product.findOne({
      where: {
        id: productId
      }
    })
    if (!product) return ctx.error('Product not found', 404)

    if (title) product.title = title
    if (description) product.description = description
    if (ctx.request.body.hasOwnProperty('status')) product.status = Number(status)

    await product.save()

    return ctx.success()
  }

  async directAddImageFromUrl() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      productId: { type: 'integer', required: false, transform: Number }
    }, ctx.request.body, 'rule')
    if (!valid) return
    const { productId, imageLink, title } = ctx.request.body

    const product = await app.model.Product.findOne({
      attributes: [ 'id' ],
      where: {
        id: productId
      }
    })
    if (!product) return ctx.error('Product not found', 404)

    await app.model.ProductImage.create({
      content_type: app.enum.eContentTypes.product,
      content_id: product.id,
      image_link: imageLink,
      title
    })
    return ctx.success()
  }

  async deleteImgAssets() {
    const { ctx, app } = this

    console.log('ctx.request.body', ctx.request.body)

    const valid = await ctx.validate({
      imageId: {
        type: 'array',
        required: false,
        transform: (val) => {
          console.log(val)
          return val.split(',').map(Number)
        },
        fields: {
          0: {
            type: 'integer',
            required: true,
          },
        }
      }
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { imageId } = ctx.request.body
    const imageIds = imageId.split(',').map(Number)

    await app.model.ProductImage.destroy({
      where: {
        id: {
          [Op.in]: imageIds
        }
      }
    })

    return ctx.success()
  }

  async addNewVariant() {
    const { app, ctx } = this
    const valid = await ctx.validate({
      productId: { required: true, type: 'integer', transform: Number },
      skuName: { required: true },
      price: { required: true, type: 'integer', transform: Number },
      normalPrice: { type: 'integer', transform: (val) => val ? Number(val) : undefined },
      stockQuantity: { type: 'integer', transform: (val) => val ? Number(val) : undefined },
    }, ctx.request.body, 'rule')
    if (!valid) return

    console.log(ctx.request.body)

    const product = await app.model.Product.findById(ctx.request.body.productId)
    if (!product) return ctx.error('Product does not exist', 404)

    await app.model.ProductVariant.create({
      // basic
      product_id: product.id,
      sku_name: ctx.request.body.skuName,
      barcode: ctx.request.body.barcode,
      status: 0,

      // stock control
      is_track_quantity: ctx.request.body.isTrackQuantity === 'true',
      stock_quantity: ctx.request.body.stockQuantity,

      // price control
      price: ctx.request.body.price,
      has_discount: ctx.request.body.hasDiscount === 'true',
      normal_price: ctx.request.body.normalPrice
    })

    return ctx.success()
  }

  async getVariantDetail() {
    const { app, ctx } = this
    const valid = await ctx.validate({
      variantId: { required: true, type: 'integer', transform: Number }
    }, ctx.request.query, 'rule')
    if (!valid) return

    const variant = await app.model.ProductVariant.findById(ctx.request.query.variantId)
    if (!variant) return ctx.error('Variant does not exist', 404)

    return ctx.success(app.resource.common.camelCaseResource(variant, {
      ignore: [ 'created_at', 'updated_at', 'deleted_at' ]
    }))
  }

  async updateVariant() {
    const { app, ctx } = this
    const valid = await ctx.validate({
      variantId: { required: true, type: 'integer', transform: Number },
      status: { type: 'integer', transform: (val) => (val !== undefined ? Number(val) : val) },
      isTrackQuantity: { type: 'boolean', transform: (val) => (val === 'true') },
      hasDiscount: { type: 'boolean', transform: (val) => (val === 'true') }
    }, ctx.request.body, 'rule')
    if (!valid) return

    const variant = await app.model.ProductVariant.findById(ctx.request.body.variantId)
    if (!variant) return ctx.error('CVariant does not exist', 404)

    let updateForm = _.pick(ctx.request.body, [
      'status', 'skuName', 'barcode', 'price', 'isTrackQuantity', 'stockQuantity', 'hasDiscount', 'normalPrice'
    ])
    updateForm.hasDiscount = updateForm.hasDiscount === undefined ? undefined : updateForm.hasDiscount === 'true'
    updateForm.isTrackQuantity = updateForm.isTrackQuantity === undefined ? undefined : updateForm.isTrackQuantity === 'true'
    updateForm = app.resource.common.snakeCaseResource(updateForm)

    console.log('update form', updateForm)

    await variant.update(updateForm)

    return ctx.success()
  }

  async deleteVariant() {
    const { app, ctx } = this
    const valid = await ctx.validate({
      variantId: { required: true, type: 'integer', transform: Number }
    }, ctx.request.body, 'rule')
    if (!valid) return

    const variant = await app.model.ProductVariant.findById(ctx.request.body.variantId)
    if (!variant) return ctx.error('CVariant does not exist', 404)

    await variant.update({
      deleted_at: new Date()
    })

    return ctx.success()
  }

  async addProduct() {
    const { app, ctx } = this
    const valid = await ctx.validate({
      status: { required: true, type: 'integer', transform: Number },
      title: { required: true, type: 'string' }
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { title, description, status } = ctx.request.body
    const result = await app.model.Product.create({
      title,
      description,
      status
    })
    const product = await app.model.Product.findOne({
      where: {
        id: result.id
      }
    })

    return ctx.success(app.resource.admin.product.productSimpleInfoResource(product))
  }
}
