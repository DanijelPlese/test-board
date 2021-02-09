const fetch = require("node-fetch");
const fs = require("fs");
const { get } = require("http");
require("dotenv").config();
const pull = require("./pulls")


const y = (async () => {

  const urlPull = pull.flat().map(i => {
    return {
      contentUrl: i.contentUrl,
      url: i.url
    }
  })

  console.log(urlPull);

  urlPull.forEach(async (i) => {
    let url = i.contentUrl;
    let options = {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3.raw+json",
        Authorization: process.env.AUTH,
      },
    }

    const body = [];

    const result = await fetch(url, options);
    //console.log(result)
    body.push({
      textBody: await result.text(),
      url: i.contentUrl,
    })

    console.log(body)

  })

  
  //.log(pull.contentUrl)

  /*
  pull.forEach(async (i) => {
    let uls = i.contentUrl;
    let options = {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3.raw+json",
        Authorization: process.env.AUTH,
      },
    };

    //console.log(uls)
    const body = [];
    //const response = await fetch(uls, options);

    //console.log(response)

    /*
    body.push({
      textBody: await responses.text(),
      url: i.contentUrl,
    })

    //console.log(body);
    const matchFor = /([+-]?hashtags: [^\n]*(\n+))/g; //nalazi "+hashtags:" i "-hashtags:" - uz ostatak reda

    //fs.appendFile("./file.json", JSON.stringify(body.flat(), null, 2));

    //console.log(body)
  });

*/
})();
