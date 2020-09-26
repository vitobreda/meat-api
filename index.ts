import * as restify from 'restify'

const server = restify.createServer({
    name: 'api raids cascavel',
    version: '1.0.0'
})

server.get('/', (req, resp, next) => {
    resp.json({message: 'hellow'})
})

server.listen(3000, () => {
    console.log('API is running on http://localhost:3000')
})