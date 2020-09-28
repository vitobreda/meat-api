import { Console } from 'console'
import * as restify from 'restify'

export const handleError = (req: restify.Request, res: restify.Response, err: any, callback: any) => {

    //here where i can handle errors

    return callback()
    
}