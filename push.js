const nodemailer = require('nodemailer')
const config = require('./config')

const transporter = nodemailer.createTransport({
  host : config.smtp,
  secureConnection: true,
  port: 465,
  auth : {
      user : config.user,
      pass : config.pass
  }
})

module.exports = (path, mail) => {
  return new Promise((resolve, reject) => {
    console.log(path)
      var target = config.kindle;
    if(mail && mail.indexOf("@") > 0) {
        target = mail;
    }
    transporter.sendMail({
      from: 'noreply  <' + config.user + '>',
      to: target,
      subject: 'Convert',
      text: 'Pushing to kindle from ' + path,
      attachments: [{ 
        path,
        encoding: 'base64',
        contentType: 'application/x-mobipocket-ebook'
      }]
    }, (err, info) => {
      if (err) reject(err)
      else resolve()
    })
  })
}