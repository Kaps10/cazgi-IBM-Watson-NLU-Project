const express = require("express");
const app = new express();
const dotenv = require("dotenv");
dotenv.config();

function getNLUInstance() {
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;

  const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
  const { IamAuthenticator } = require("ibm-watson/auth");

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: "2021-03-25",
    authenticator: new IamAuthenticator({
      apiKey: api_key,
    }),
    apiUrl: api_url,
  });
  return naturalLanguageUnderstanding;
}

function getNluResult(param, res) {
  return getNLUInstance()
    .analyze(param)
    .then((analysisResult) => {
      res.send(JSON.stringify(analysisResult.result.keywords[0], null, 2));
    })
    .catch((err) => {
      res.send({ error: err });
    });
}

app.use(express.static("client"));

const cors_app = require("cors");
app.use(cors_app());

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/url/emotion", (req, res) => {
  return getNluResult(
    {
      features: {
        keywords: {
          emotion: true,
          limit: 1,
        },
      },
      url: req.query.url,
    },
    res
  );
});

app.get("/url/sentiment", (req, res) => {
  return getNluResult(
    {
      features: {
        keywords: {
          sentiment: true,
          limit: 1,
        },
      },
      url: req.query.url,
    },
    res
  );
});

app.get("/text/emotion", (req, res) => {
  return getNluResult(
    {
      features: {
        keywords: {
          emotion: true,
          limit: 1,
        },
      },
      text: req.query.text,
    },
    res
  );
});

app.get("/text/sentiment", (req, res) => {
  return getNluResult(
    {
      features: {
        keywords: {
          sentiment: true,
          limit: 1,
        },
      },
      text: req.query.text,
    },
    res
  );
});

let server = app.listen(8080, () => {
  console.log("Listening", server.address().port);
});
