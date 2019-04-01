// const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const request = require("request");
const ejsLint = require("ejs-lint");
const compression = require("compression");
const minifyHTML = require("express-minify-html");

const baseDir = "static/";
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  res.append("Cache-Control", "max-age=" + 365 * 24 * 60 * 60);
  next();
});

app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  })
);

app.use(compression());
app.set("view engine", "ejs");
app.use(express.static("static"));

app.get('/', (req, res) => {
  request(
    "http://mirabeau.denniswegereef.nl/api/v1/rooms",
    (error, response, body) => {
      const json = JSON.parse(body);
      const data = json.data;
      const buttons = [];
      Object.entries(data[0].measurements).map(function(key) {
        buttons.push(key);
        });


      if (response) {
        res.render("pages/index", {
          title: "SADS",
          data: data,
          button: buttons
        });
      } else {
        res.send(`<p>De server of API waar mijn data wordt verwerkt ligt er uit, check uw internet</p>`);
      }
    }
  );
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// "data":[
//      {
//         "timestamp":1553765124.19641,
//         "hwaddr":"00:0b:57:be:54:0d",
//         "room_name":"Lippershey",
//         "measurements":{
//            "bapLevel":1149336846,
//            "temperature":20691,
//            "batt":100,
//            "mic_level":2567,
//            "ambient_light":12568,
//            "humidity":21511,
//            "co2":491,
//            "occupancy":false,
//            "uv_index":0,
//            "voc":3328
//         }
//      },
