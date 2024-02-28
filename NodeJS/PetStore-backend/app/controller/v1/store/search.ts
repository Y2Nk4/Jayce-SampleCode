import { Controller } from 'egg'
import { Op } from 'sequelize'
import EContentTypes from '../../../enum/EContentTypes'

export default class SearchController extends Controller {
  async searchProducts() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      keywords: {
        type: 'string',
        required: true,
      }
    }, ctx.request.body, 'rule')
    if (!valid) return

    const keywords = ctx.request.body.keywords.split(' ')

    const result = await app.model.Product.findAll({
      where: {
        [Op.or]: keywords.map((keyword) => ({
          title: {
            [Op.like]: `%${keyword}%`
          }
        }))
      },
      include: [
        'variants', {
          model: app.model.ProductImage,
          as: 'product_image', foreignKey: 'content_id',
          scope: {
            content_type: EContentTypes.product,
          },
        }
      ]
    })

    return ctx.success(
      app.resource.productResource(result)
    )
  }
}
