const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();
const http = require("http");
var fileUrl = require("file-url");

/*
console.log("prije");

const content =  fs.readFileSync('./newFile.txt', "utf8");

console.log(content)

console.log("poslije");
*/

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

  const dataOfLast = await responseOfLast.json();

  const lastPullRequests = await dataOfLast.map((i) => i.number);

  const lastPrNumber = await lastPullRequests.slice(0, 1);

  const pages = Array.from(
    { length: Math.ceil(lastPrNumber / 100) },
    (_, n) => n + 1
  );

  const arrayToIterate = [];

  for (i = 0; i < pages.length; i++) {
    arrayToIterate.push({
      url: `https://api.github.com/repos/crocoder-dev/monorepo/pulls?state=all&page=${pages[i]}&per_page=100`,
      page: pages[i],
    });
  }

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

    const data = await response.json();
    const refs = await data.map((t) => {
      return {
        contentUrl: t.patch_url,
        url: t.url,
      };
    });

    //console.log(refs);
    const changedHashtags = [];

    refs.forEach(async (i) => {
      let uls = i.contentUrl;
      let options = {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3.raw+json",
          Authorization: process.env.AUTH,
        },
      };
      const responses = await fetch(uls, options);
      const body = await responses.text();

      console.log(body)

    });


  });
  
})();
