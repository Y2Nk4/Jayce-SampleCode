import { Service } from 'egg'
import * as USPS from 'usps-webtools'
import { promisify } from 'util'

export const EAddressVerificationResult = {
  RevisionRequired: 0,
  Acceptable: 1,
  Good: 2,
}

export default class USPSService extends Service {
  async validateAddress(address) {
    console.log(USPS)
    console.log(this.config.usps)
    const usps = new USPS({
      server: 'https://production.shippingapis.com/ShippingAPI.dll',
      userId: this.config.usps.user,
      ttl: 10000
    })

    const returnResult = {
      result: EAddressVerificationResult.RevisionRequired,
      description: '',
      recommendedAddress: {}
    }

    const verify = promisify(usps.verify).bind(usps)
    try {
      const result = await verify({
        street1: address.address1,
        street2: address.address2,
        city: address.city,
        state: address.state,
        zip: address.zipCode,
      })
      returnResult.recommendedAddress = {
        address1: result.street1,
        address2: result.street2,
        zipCode: result.zip + '-' + result.zip4,
        state: result.state,
        city: result.city
      }

      console.log(result)

      if (result.dpv_confirmation === 'Y') {
        returnResult.result = EAddressVerificationResult.Good
      } else if ([ 'D', 'S' ].includes(result.dpv_confirmation)) {
        returnResult.result = EAddressVerificationResult.Acceptable
        returnResult.description = 'Adding/Correcting your secondary number information (ex. apartment number) will help our carrier bring the package to you quickly and easily.'
      } else {
        returnResult.result = EAddressVerificationResult.RevisionRequired
        returnResult.description = 'We are not able to confirm your address, please check the address you give us.'

        const issues: string[] = []
        if (result.footnote) {
          if (result.footnote.includes('B')) {
            issues.push('Invalid City / State / Zip')
          }
          if (result.footnote.includes('F')) {
            issues.push('Address Could Not Be Found')
          }
          if (result.footnote.includes('H')) {
            issues.push('Missing Secondary Number')
          }
          if (result.footnote.includes('J')) {
            issues.push('Dual Address')
          }
          if (result.footnote.includes('I')) {
            issues.push('Insufficient / Incorrect Address Data')
          }
          if (result.footnote.includes('S')) {
            issues.push('Incorrect Secondary Address')
          }
          if (result.footnote.includes('V')) {
            issues.push('Unverifiable City / State')
          }
          if (result.footnote.includes('W')) {
            issues.push('Invalid Delivery Address')
          }
        } else if (result.dpv_footnotes) {
          if (result.dpv_footnotes.includes('M3') ||
              result.dpv_footnotes.includes('F1') ||
              result.dpv_footnotes.includes('M1')) {
            issues.push('Invalid Address')
          } else if (
            result.dpv_footnotes.includes('CC') ||
            result.dpv_footnotes.includes('N1')
          ) {
            issues.push('Missing Secondary Number')
          }
        }

        returnResult.description += `(${issues.join(',')})`
      }
    } catch (e) {
      returnResult.description = e.Description
    }

    return returnResult
  }
}
