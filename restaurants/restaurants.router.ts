import { ModelRouter } from "../common/model-router";
import * as restify from "restify";
import { NotFoundError } from "restify-errors";
import { Restaurant } from "./restaurants.model";

class RestaurantsRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant);
  }

  envelope(document) {
    let resource = super.envelope(document);

    resource._links.menu = `${this.basePath}/${resource._id}/menu`;

    return resource;
  }

  findMenu = (
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) => {
    Restaurant.findById(req.params.id, "+menu")
      .then((rest) => {
        if (!rest) {
          throw new NotFoundError("Restaurant not found");
        } else {
          res.json(rest.menu);
          return next;
        }
      })
      .catch(next);
  };

  replaceMenu = (
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) => {
    Restaurant.findById(req.params.id)
      .then((rest) => {
        if (!rest) {
          throw new NotFoundError("Restaurant not found");
        } else {
          rest.menu = req.body; // array de MenuItem
          return rest.save();
        }
      })
      .then((rest) => {
        res.json(rest.menu);
        return next;
      })
      .catch(next);
  };

  applyRoutes(application: restify.Server) {
    application.get({ path: `${this.basePath}` }, this.findAll);

    application.get({ path: `${this.basePath}/:id` }, [
      this.validateId,
      this.findById,
    ]);

    application.post({ path: `${this.basePath}` }, this.save);

    application.put({ path: `${this.basePath}/:id` }, [
      this.validateId,
      this.replace,
    ]);

    application.patch({ path: `${this.basePath}/:id` }, [
      this.validateId,
      this.update,
    ]);

    application.del({ path: `${this.basePath}/:id` }, [
      this.validateId,
      this.delete,
    ]);

    application.get({ path: `${this.basePath}/:id/menu` }, [
      this.validateId,
      this.findMenu,
    ]);

    application.put({ path: `${this.basePath}/:id/menu` }, [
      this.validateId,
      this.replaceMenu,
    ]);
  }
}

export const restaurantsRouter = new RestaurantsRouter();
