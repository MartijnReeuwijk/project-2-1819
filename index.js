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
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => {
  request(
    "http://mirabeau.denniswegereef.nl/api/v1/rooms",
    (error, response, body) => {
      const json = JSON.parse(body);
      const data = json.data;
      const time = getTime()
      const filteredData = filterData(data)

      if (response) {
        res.render("pages/index", {
          title: "SADS",
          data: filteredData,
          time: time
        });
      } else {
        res.send(`<p>De server of API waar mijn data wordt verwerkt ligt er uit, check uw internet</p>`);
      }
    }
  );
})

 function filterData(data) {
  return filteredData = data.sort((x, y) => {
        return (x.measurements.occupancy === y.measurements.occupancy)? 0 : x.measurements.occupancy? -1 : 1;
    });
 }




function getTime() {
  const time = new Date()
  const hours = time.getHours();
  const mins = time.getMinutes();
  return hours + ":" + mins
}



function perc2color(perc) {
  var r, g, b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.10 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  // console.log('#' + ('000000' + h.toString(16)).slice(-6));
  return '#' + ('000000' + h.toString(16)).slice(-6);
}



// "data":[
//      {
//         "timestamp":1553765124.19641,
// "hwaddr":"00:0b:57:be:54:0d",
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
