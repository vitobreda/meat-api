import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import * as restify from "restify";
import { environment } from "../common/environment";

export interface User extends mongoose.Document {
  name: String;
  email: String;
  password: String;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    MaxLength: 80,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female"],
  },
});

const hashPassword = (obj: any, next: restify.Next) => {
  bcrypt
    .hash(obj.password, environment.security.saltRounds)
    .then((hash) => {
      obj.password = hash;
      next();
    })
    .catch(next);
};

const saveMiddleware = function (next: restify.Next) {
  const user: User = <User>this;

  if (!user.isModified("password")) {
    next();
  } else {
    hashPassword(user, next);
  }
};

const updateMiddleware = function (next: restify.Next) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassword(this.getupdate(), next);
  }
};

userSchema.pre("save", saveMiddleware);

userSchema.pre("findOneAndUpdate", updateMiddleware);

userSchema.pre("update", updateMiddleware);

export const User = mongoose.model<User>("User", userSchema);
