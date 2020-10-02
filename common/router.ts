import { EventEmitter } from "events";
import * as restify from "restify";
import { NotFoundError } from "restify-errors";

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server);

  envelope(document: any): any {
    return document;
  }

  envelopeAll(documents: any[], options: any): any {
    return documents;
  }

  render(response: restify.Response, next: restify.Next) {
    // document é o retorno da promise
    return (document: any) => {
      if (document) {
        this.emit("beforeRender", document);
        response.json(this.envelope(document));
      } else {
        throw new NotFoundError();
      }
      return next();
    };
  }

  renderAll(response: restify.Response, next: restify.Next, options: any = {}) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, index, array) => {
          this.emit("beforeRender", document);
          array[index] = this.envelope(document);
        });

        response.json(this.envelopeAll(documents, options));
      } else {
        response.json(this.envelopeAll([], options));
      }
      return next();
    };
  }
}
