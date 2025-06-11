import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { emailHTMl, VerificationemailHTMl } from './emailhtml.js'
dotenv.config()
const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : process.env.SMTP_PORT,
    secure : process.env.SMTP_PORT == 465,
    auth:{
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    }
})

export const sendEmail = async ({email,FullName,VerifyId,VerificationCode}) =>{
    try {
        const info = await transporter.sendMail({
            from : `Your company ${process.env.EMAIL_USER}`,
            to : email,
            subject : `Event Information`,
            html : emailHTMl({email,VerifyId,VerificationCode})
        })
        console.log(`Email send succesfully MessageID ${info.messageId}`)
        
    } catch (error) {
        console.log("sendEmail error",error)
    }
}


export const sendVerifyEmail = async ({email,FullName}) =>{
    try {
        const info = await transporter.sendMail({
            from : `Your company ${process.env.EMAIL_USER}`,
            to : email,
            subject : `Event Information`,
            html : VerificationemailHTMl({FullName})
        })
        console.log(`Email send succesfully MessageID ${info.messageId}`)
        
    } catch (error) {
        console.log("sendEmail error",error)
    }
}