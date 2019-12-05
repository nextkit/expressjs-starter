import fs from 'fs';
import nodemailer from 'nodemailer';

import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { InternalServerErrorException } from '../exceptions';
import logger from '../util/logger';

const transporter = nodemailer.createTransport(
  `smtps://${process.env.EMAIL_AUTH_USER}:${process.env.EMAIL_AUTH_PASSWORD}@${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}/?pool=true`,
);

/**
 * Class EmailAction
 */
export default class EmailAction {
  /**
   * Sends a code to the user so that the user can complete his registration.
   *
   * @param {string} username
   * @param {string} emailAddress
   * @param {string} verificationCode
   *
   * @throws InternalServerException if an unexpected error occurs
   */
  public static async sendAccountVerification(
    username: string,
    emailAddress: string,
    verificationCode: string,
  ): Promise<void> {
    let template = await fs.readFileSync(`./src/assets/templates/email/verify-email.template.html`, 'utf8');

    template = template.replace(/\[URL\]/g, `<backend-url>/${username}/${verificationCode}`);
    template = template.replace(/\[USERNAME\]/g, username);
    template = template.replace(/\[EMAIL\]/g, emailAddress);

    // Setup email data with unicode symbols.
    const mailOptions: MailOptions = {
      from: `"Me" <${process.env.EMAIL}>`, // sender address
      html: template,
      subject: '[Me] Please verify your email address.', // Subject line
      to: emailAddress, // list of receivers
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error): void => {
      if (error) {
        logger.error(`Failed to send Email: ${error}`);
        throw new InternalServerErrorException();
      }
    });
  }
}
