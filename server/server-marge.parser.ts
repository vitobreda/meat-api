import { nextTick } from 'process'
import * as restify from 'restify'
import {BadRequestError} from 'restify-errors'

const mpContentType = 'application/marge-patch+json'

export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    if (req.contentType() === mpContentType && req.method === 'PATCH') {
        (<any>req).rawBody = req.body
        try{
            req.body = JSON.parse(req.body)
        } catch(e) {
            return next(new BadRequestError(`Invalid content: ${e.message}`))
        }
    }
    return next()
}