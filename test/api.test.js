const axios = require('axios')
const http = require('http')
const app = require('../api')

let server
const port = 8080
const adresse = 'http://localhost:' + port

beforeAll((fini) => {
  server = http.createServer(app)
  server.listen(port, function () {
    fini()
  })
})

afterAll((fini) => {
  server.close(fini)
})

describe('Les test api blockchain', () => {

  describe('GET /blocks', () => {
    it('sa devrais renvoyer tout les block', async () => {
      const rep = await axios.get(adresse + '/blocks')
      expect(rep.status).toBe(200)
      expect(Array.isArray(rep.data)).toBe(true)
      expect(rep.data.length >= 1).toBe(true)
    })
  })

  describe('POST /mine', () => {
    it('dois ajouer 1 nouveau block', async () => {
      const lesdonner = { data: 'test de data' }
      const rep = await axios.post(adresse + '/mine', lesdonner)
      expect(rep.status).toBe(200)
      expect(rep.data.message).toBeDefined()
      expect(rep.data.block).toBeDefined()
      expect(rep.data.block.data).toBe('test de data')
    })

    it('dois fair une erreur si ya pas de data', async () => {
      try {
        await axios.post(adresse + '/mine', {})
        fail('On devais avoir une erreur 400 mais on la pas')
      } catch (err) {
        expect(err.response.status).toBe(400)
        expect(err.response.data.error).toBeDefined()
      }
    })
  })
})
