const Client = require('../')

const client = new Client()

const services = [
  // 'saveig.org',
  // 'instagram.com'
]
const serviceManager = client.serviceManager(services)

serviceManager
  .get('noey.bnk48office')
  .then((data) => {
    console.log('data', data)
  })
  .catch(console.error)
