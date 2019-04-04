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

      if (response.status !== 200) {
        res.render("pages/index", {
          title: "Room app",
          data: filteredData,
          time: time
        });
      } else{
        app.get("/Offline", (req, res) => {
          res.render("pages/offline", {
            title: "Offline"
          })
        })
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
