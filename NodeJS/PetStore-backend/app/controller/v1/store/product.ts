import { Controller, IModel } from 'egg'
import SimpleTypeResource from '../../../resource/SimpleTypeResource'
import SimpleTagResource from '../../../resource/SimpleTagResource'
import ProductResource from '../../../resource/ProductResource'
import EProductStatus from '../../../enum/EProductStatus'
import { Op } from 'sequelize'

class ProductController extends Controller {
  async getProductDetail() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      productId: { type: 'integer', required: true, transform: val => Number(val) },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const product = await app.model.Product.findById(ctx.request.query.productId, true, {
      status: {
        [Op.notIn]: [ EProductStatus.Draft, EProductStatus.Unavailable ],
      },
    }, app.model.ProductVariant.scope('validVariant'))

    if (!product) {
      return ctx.error('Product Not Found', 404)
    }
    product.type = product.type ? SimpleTypeResource(product.type) : undefined
    return ctx.success(ProductResource(product))

  }

  async getProductTags() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      productId: { type: 'integer', required: true, transform: val => Number(val) },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const { productId } = ctx.request.query

    const tags = await app.model.Tag.scope('simple').findAll({
      include: [
        {
          model: app.model.Product.scope('tagSearch'),
          as: 'products',
          through: {
            tableName: 'product_tags',
            timestamps: false,
            scope: {
              visible: true,
            },
          },
          where: {
            id: productId,
          },
        },
      ],
    })
    return ctx.success(SimpleTagResource(tags))
  }

  async getImages() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      productIds: {
        type: 'array',
        fields: {
          0: {
            type: 'integer',
            required: true,
          },
        },
        transform: val => (!val ? undefined : val.split(',').map(Number)),
      },
      variantIds: {
        type: 'array',
        fields: {
          0: {
            type: 'integer',
            required: true,
          },
        },
        transform: val => (!val ? undefined : val.split(',').map(Number)),
      },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const { productIds, variantIds } = ctx.request.query

    let productImages: IModel['ProductImage'] = []
    let variantImages: IModel['ProductImage'] = []

    if (productIds) {
      productImages = await app.model.ProductImage.findAll({
        where: {
          content_type: app.enum.eContentTypes.product,
          content_id: {
            [Op.in]: productIds.split(',').map(Number)
          }
        }
      })
    }

    if (variantIds) {
      variantImages = await app.model.ProductImage.findAll({
        where: {
          content_type: app.enum.eContentTypes.variant,
          content_id: {
            [Op.in]: variantIds.split(',').map(Number)
          }
        }
      })
    }

    ctx.success({
      productImages,
      variantImages
    })
  }

  async getProductByTag() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      size: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 20) },
      page: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 1) },
      tagId: { required: true },
    }, ctx.request.query, 'rule')
    if (!valid) return

    let { size = 2, page = 1, tagId } = ctx.request.query
    size = Number(size)
    page = Number(page)

    const tag = await app.model.Tag.findOne({
      where: {
        [Op.or]: [
          { id: tagId },
          { custom_link: tagId }
        ]
      }
    })

    if (!tag) return ctx.error('Tag Not Found', 404)

    const products = await tag.getProducts({
      limit: size,
      offset: (page - 1) * size,
      include: [
        'variants', 'product_image'
      ]
    })
    const productCount = await tag.countProducts()

    ctx.success({
      tagInfo: app.resource.tagResource(tag),
      dataRows: app.resource.productResource(products),
      pagination: {
        total: productCount,
        page,
        size
      }
    })
  }
}

export default ProductController
