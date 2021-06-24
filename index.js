const express = require("express");
const mailer = require("express-mailer");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
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
