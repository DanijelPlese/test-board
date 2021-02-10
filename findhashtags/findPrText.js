const fetch = require("node-fetch");
const fs = require("fs");
const { get } = require("http");
require("dotenv").config();
const pull = require("./pulls");

const y = (async () => {
  const urlPull = pull.flat().map((i) => {
    return {
      contentUrl: i.contentUrl,
      url: i.url,
    };
  });

  urlPull.forEach(async (i) => {
    let url = i.contentUrl;
    let options = {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3.raw+json",
        Authorization: process.env.AUTH,
      },
    };

    const body = [];

    const result = await fetch(url, options);
    //console.log(result)
    body.push({
      textBody: await result.text(),
      url: i.contentUrl,
    });

    console.log(body);
    fs.appendFileSync("./data2.json", JSON.stringify(body.flat(), null, 2));
  });
})();
