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

    //console.log(refs) // [{}...100...{}][{}...100...{}][{}...75...{}]

    console.log(refs)
    
  });
})();
