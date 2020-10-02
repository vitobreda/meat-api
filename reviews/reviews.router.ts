import { ModelRouter } from "../common/model-router";
import * as restify from "restify";
import { Review } from "./reviews.model";
import * as mongoose from "mongoose";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  envelope(document) {
    let resource = super.envelope(document);

    const restId = document.restaurant._id
      ? document.restaurant._id
      : document.restaurant;

    const userId = document.user._id ? document.user._id : document.user;

    resource._links.restaurant = `/restaurants/${restId}`;
    resource._links.user = `/users/${userId}`;

    return resource;
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<Review, Review>
  ): mongoose.DocumentQuery<Review, Review> {
    return query.populate("restaurant", "name").populate("user", "name");
  }

  /*findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('restaurant', 'name')
            .populate('user', 'name')
            .then(this.render(resp, next))
            .catch(next)
    }*/

  applyRoutes(application: restify.Server) {
    application.get({ path: `${this.basePath}` }, this.findAll);

    application.get({ path: `${this.basePath}/:id` }, [
      this.validateId,
      this.findById,
    ]);

    application.post({ path: `${this.basePath}` }, this.save);

    application.del({ path: `${this.basePath}/:id` }, [
      this.validateId,
      this.delete,
    ]);
  }
}

export const reviewsRouter = new ReviewsRouter();
