import { NextFunction, Request, Response } from "express";
import { createTransporter } from "../config/nodemailer";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client"
import { sign } from "../utils/jwt";

const client = new PrismaClient()

export class AuthController{
    static async SendCode(req: Request, res: Response, next: NextFunction){
        let { email } = req.body
        let redis = createClient()
        await redis.connect()

        let transporter = createTransporter()
        let code = Math.floor(Math.random() * 1000000)

        redis.setEx(email, 60, JSON.stringify(code))

        transporter.sendMail({
            from: process.env.MAIL_EMAIL,
            to: email,
            subject: "Confirmation code",
            html: `<b>${code}</b>` 
        })
        res.send({
            success: true,
            message: "Your confirmation code sent"
        })
    }

    static async VerifyCode(req: Request, res: Response, next: NextFunction){
        let { email, code, fullName } = req.body
        let redis = createClient()
        await redis.connect()

        let redisCode = await redis.get(email)
        if(!redisCode === code){
            res.status(403).send({
                success: true,
                message: "Code error or expired"
            })
            return
        }

        let [ user ] = await client.user.findMany({where: {email}})
        if(user){
          let access_token = sign({id: user.id}, 120)
          let refresh_token = sign({id: user.id}, "2h")
          res.status(200).send({
            success: false,
            message: "Successfully login",
            data: {
                access_token,
                refresh_token,
                expiresIn: 120
            }
        })
        } else {
          let user = await client.user.create({data: {email, fullName, token: ""}})

          let access_token = sign({id: user.id}, 120)
          let refresh_token = sign({id: user.id}, "2h")

          await client.user.update({data: {
            token: access_token
          }, 
        where: {id: user.id}
        })

          res.status(200).send({
            success: false,
            message: "Successfully",
            data: {
                access_token,
                refresh_token,
                expiresIn: 120
            }
        })
        }

    }
}