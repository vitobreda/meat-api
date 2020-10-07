import * as restify from "restify";
import { NotAuthorizedError } from "restify-errors";
import * as jwt from "jsonwebtoken";
import { environment } from "../common/environment";
import { User } from "../users/users.model";

export const authenticate: restify.RequestHandler = (req, resp, next) => {
  const { email, password } = req.body;

  User.findByEmail(email, "+password")
    .then((user) => {
      console.log("enter function");
      if (user && user.matches(password)) {
        const token = jwt.sign(
          { sub: user.email, iss: "meat-api" },
          environment.security.apiSecret
        );
        resp.json({ name: user.name, email: user.email, accessToken: token });
        return next(false);
      } else {
        console.log("pass do not match");
        return next(new NotAuthorizedError("Invalid Credentials"));
      }
    })
    .catch(next);
};
