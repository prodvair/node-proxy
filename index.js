const express = require("express");
const setCookie = require("set-cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config.json");
const { default: axios } = require("axios");

const app = express();

app.use(bodyParser());
app.use(cors());

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.all(
  "/*",
  asyncMiddleware(async (req, res, next) => {
    var data = null;
    var params = null;
    if (req.params) {
      params = req.params;
    }
    if (req.body) {
      data = req.body;
    }

    const $axios = axios.create({
      withCredentials: true,
      baseURL: `${config.base_url}${req.originalUrl}`,
      method: req.method,
      // params: req.params || {},
      data: req.body,
      headers: {
        cookie: req.headers.cookie,
        accept: "application/json",
      },
    });

    const response = await $axios.request({ params, data }).catch((err) => {
      return err.response;
    });

    var cookies = setCookie.parse(response, {
      decodeValues: true, // default: true
    });
    res.contentType(response.headers.getContentType());
    console.log(cookies);

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      res.cookie(cookie.name, cookie.value, {
        path: cookie.path,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
      });
    }

    res.statusCode = response.status;
    res.send(response.data);
  })
);

app.listen(config.port, () => {
  console.log(`App start | http://localhost:${config.port}`);
});
