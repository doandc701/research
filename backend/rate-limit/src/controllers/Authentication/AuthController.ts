import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { client } from "../../services/redis.service";
import { ObjectDatabase } from "../../models/auth";
import { TOKEN_SECRET } from "../../config/auth";
import { getRedis, setRedis } from "../../utils/redis";
import {
  checkLoginAttempts,
  setLoginAttempts,
} from "../../middlewares/loginAccountLimiter";
const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;
const SignUp = async (req: Request, res: Response) => {
  const checkUserName = await USER.findOne({ username: req.body.username });
  if (checkUserName)
    return res.status(422).send("Failed! Username is already in use");
  const checkMailExits = await USER.findOne({ email: req.body.email });
  if (checkMailExits)
    return res.status(422).send("Failed! Email  is already in use!");

  const user = new USER({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  user
    .save()
    .then((user) => {
      console.log("user", user);
      const RqRoles = req.body.roles;
      if (RqRoles) {
        ROLES.find({ name: { $in: RqRoles } })
          .then((roles) => {
            console.log("roles", roles);
            user.roles = roles.map((role) => role._id);
            user
              .save()
              .then(() => {
                res.send({ message: "User was registered successfully!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        ROLES.findOne({ name: "user" })
          .then((role1) => {
            // Error, role1._id may be null or undefined
            console.log("ObjectId+++++++", role1);
            user.roles = [role1!._id];
            user
              .save()
              .then(() => {
                res.send({ message: "User was registered successfully!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

const SignIn = async (req: Request, res: Response) => {
  let checkRedis = await checkLoginAttempts(req.body.username);
  console.log("checkRedis1111111111111111", checkRedis);
  if (checkRedis?.pass) {
    USER.findOne({ username: req.body.username })
      .populate("roles", "-__v")
      .then(async (user: any) => {
        if (!user) {
          return res
            .status(404)
            .send({ message: "Username or Password not correct." });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          checkRedis = await setLoginAttempts(req.body.username);
          const remaining = 3 - parseInt(checkRedis.data.count);
          console.log("checkRedis2222222222", checkRedis);
          return res.status(404).send({
            message: `Bạn còn ${remaining ? remaining : "3"} lần nhập`,
          });
        }
        await client.expire(`ll:${req.body.username}`, 0);
        const token = jwt.sign({ id: user.id }, TOKEN_SECRET, {
          expiresIn: 86400, // 24 hours
        });
        let authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err });
        return;
      });
  }
  if (!checkRedis?.pass && checkRedis?.data) {
    const resultWait = checkRedis.wait;
    console.log(resultWait);
    const remaining = 3 - parseInt(checkRedis.data.count);
    if (remaining <= 0) {
      return res.status(404).send({
        message: `Tài khoản của bạn đã bị khóa, vui lòng thử lại sau ${resultWait} giây.`,
      });
    }
  }
};
export { SignIn, SignUp };
