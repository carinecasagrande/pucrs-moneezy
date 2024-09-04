const nodemailer = require("nodemailer");
const config = require("../config/config");
const path = require("path");
const fs = require("fs");

/**
 * Send an email
 */
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: config.nodemailer.service,
    auth: {
      user: config.nodemailer.user,
      pass: config.nodemailer.password,
    },
  });

  await transporter.sendMail({
    from: config.nodemailer.user,
    to,
    subject,
    html,
  });
};

/**
 * Loads the HTML of an email based on a template
 */
const loadEmailTemplate = (templateName, locale, variables) => {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(
      __dirname,
      "../emails",
      locale,
      `${templateName}.html`
    );

    fs.readFile(templatePath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }

      let html = data;

      // Replace placeholders in HTML with variables
      for (const [key, value] of Object.entries(variables)) {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
      }

      resolve(html);
    });
  });
};

module.exports = {
  sendEmail,
  loadEmailTemplate,
};
