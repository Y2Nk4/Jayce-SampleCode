// import * as assert from 'assert'
import * as flatted from 'flatted'

class Struct {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

describe('test/app/lib/CheckoutCart/Flatted.test.js', () => {
  const model = new Struct('sad')
  const string = flatted.stringify(model)
  console.log('flatted', string)
  console.log('json', JSON.stringify(model))
  console.log(flatted.parse(string))
})
