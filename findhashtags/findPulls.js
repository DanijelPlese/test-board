const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();
const http = require("http");
var fileUrl = require("file-url");

const x = (async () => {
  let lastPullRequestUrl =
    "https://api.github.com/repos/crocoder-dev/monorepo/pulls?state=all&page=1&per_page=100";
  let optionsOfLast = {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3.raw+json",
      Authorization: process.env.AUTH,
    },
  };

  const responseOfLast = await fetch(lastPullRequestUrl, optionsOfLast);
  //console.log(responseOfLast)
  const dataOfLast = await responseOfLast.json();
  //console.log(dataOfLast)
  const lastPullRequests = await dataOfLast.map((i) => i.number);
  //console.log(lastPullRequests)
  const lastPrNumber = await lastPullRequests.slice(0, 1);
  //console.log(lastPrNumber)
  const pages = Array.from(
    { length: Math.ceil(lastPrNumber / 100) },
    (_, n) => n + 1
  );
  //console.log(pages)
  const arrayToIterate = [];

  for (i = 0; i < pages.length; i++) {
    arrayToIterate.push({
      url: `https://api.github.com/repos/crocoder-dev/monorepo/pulls?state=all&page=${pages[i]}&per_page=100`,
    });
  }
  //console.log(arrayToIterate)
  arrayToIterate.forEach(async (i) => {
    let ul = i.url;
    let options = {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3.raw+json",
        Authorization: process.env.AUTH,
      },
    };

    const response = await fetch(ul, options);
    //console.log(response)
    const data = await response.json();
    //console.log(data) //gets patch_url and url

    const refs = data.map((t) => {
      return {
        contentUrl: t.patch_url, //primjer: https://patch-diff.githubusercontent.com/raw/crocoder-dev/monorepo/pull/861.patch
        url: t.url, //primjer: https://api.github.com/repos/crocoder-dev/monorepo/pulls/861
      };
    });

    console.log(refs) // [{}...100...{}][{}...100...{}][{}...75...{}]


    //console.log(uniRefs)

    //console.log(refs)
    refs.forEach(async (i) => {
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
      //const responses = await fetch((uls, options));
      /*
      body.push({
        textBody: await responses.text(),
        url: i.contentUrl,
      })
*/
      //console.log(body);
      const matchFor = /([+-]?hashtags: [^\n]*(\n+))/g; //nalazi "+hashtags:" i "-hashtags:" - uz ostatak reda

      //fs.appendFile("./file.json", JSON.stringify(body.flat(), null, 2));

      //console.log(body)
    });

    /*//v2 
    const refs = await data.forEach(async (t) => {
      let uls = t.patch_url;
      let options = {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3.raw+json",
          Authorization: process.env.AUTH,
        },
      };
      //console.log(uls) //prints all patch_url
      const responses = await fetch(uls, options);
      //console.log(responses); //prints response {...}, {...}....
      const body = await responses.text();
      //console.log(body); //prints all text from patch_url
      return {
        contentUrl: t.patch_url,
        url: t.url,

      }
    });
*/
    //console.log(refs); //prints undefined ???
  });
})();
