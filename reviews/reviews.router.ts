import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { Review } from './reviews.model'
import * as mongoose from 'mongoose'

class ReviewsRouter extends ModelRouter<Review>{
    constructor() {
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query
            .populate('restaurant', 'name')
            .populate('user', 'name')
    }

    /*findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('restaurant', 'name')
            .populate('user', 'name')
            .then(this.render(resp, next))
            .catch(next)
    }*/

    applyRoutes(application: restify.Server) {

        application.get('/reviews', this.findAll)

        application.get('/reviews/:id', [this.validateId, this.findById])

        application.post('/reviews', this.save)

        application.del('/reviews/:id', [this.validateId, this.delete])
    }
}

export const reviewsRouter = new ReviewsRouter()