import nodemailer from "nodemailer"
import dotenv from 'dotenv'
import SMTPTransport from "nodemailer/lib/smtp-transport"
dotenv.config()

export const createTransporter = () => {
  let options: SMTPTransport.Options = {
    host: String(process.env.MAIL_HOST),
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
    }
  }
  const transporter = nodemailer.createTransport(options)
  return transporter
}