const express = require("express");
const mailer = require("express-mailer");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const fs = require("fs");

var html2jade = require("html2jade");

var Markdown = require("markdown-to-html").Markdown;
const { getMaxListeners } = require("process");

mailer.extend(app, {
  from: "no-reply@gmail.com",
  host: "smtp.gmail.com",
  secureConnection: true,
  port: 465,
  transportMethod: "SMTP",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});
app.use(cors());
app.use(express.json());
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.get("/sendmail", (req, res) => {
  res.send("hiii");
});

app.post("/admin/sendmail", async (req, res) => {
  var html = req.body.msg;
  html2jade.convertHtml(html, {}, async function (err, jade) {
    fs.writeFile("./views/email.jade", html, (err) => {
      if (err) console.log(err);
      else {
        app.mailer.send(
          "email",
          {
            to: req.body.to,
            subject: "Received a feeback in stopstalk",
          },
          (err) => {
            if (err) res.send({ success: false, err });
            else res.send({ success: true });
          }
        );
      }
    });
  });
});

app.post("/sendmail", async (req, res) => {
  // console.log("entered");
  // console.log(req.body);
  var md = new Markdown();
  md.bufmax = 2048;
  await fs.writeFile("./views/markdown.md", req.body.mail, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
  var filename = "./views/markdown.md";
  await md.render(filename, {}, async function (err, data) {
    if (err) {
      console.error(">>>" + err);
      process.exit();
    }
    var a = md.html;
    console.log(a);

    var html = a;
    html2jade.convertHtml(html, {}, async function (err, jade) {
      await fs.writeFile("./views/email.jade", html, (err) => {
        if (err) console.log(err);
        else {
          app.mailer.send(
            "email",
            {
              to: "pavanteja0902@gmail.com",
              subject: "Received a feeback in stopstalk",
            },
            (err) => {
              if (err) res.send({ success: false, err });
              else res.send({ success: true });
            }
          );
        }
      });
    });
  });
});

app.post("/sendmessage", (req, res) => {
  // console.log(req.body);
  app.mailer.send(
    "email",
    {
      to: "pavanteja0902@gmail.com",
      subject: "Received a feeback in stopstalk",
      name: req.body.name,
      email: req.body.mail,
      message: req.body.textmessage,
    },
    (err) => {
      if (err) res.send({ success: false, err });
      else res.send({ success: true });
    }
  );
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server is listening at http://localhost:${PORT}`)
);
