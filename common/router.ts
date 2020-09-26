import { EventEmitter } from 'events'
import * as restify from 'restify'

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)

    render(response: restify.Response, next: restify.Next) {
        // document é o retorno da promise
        return (document) => {
            if (document) {
                this.emit('beforeRender', document)
                response.json(document)
            } else {
                response.send(404)
            }
            return next()
        }
    }
}