const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

if ("./arrObj.json" === true) {
  const content = require("./arrObj.json");
}

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

    const results = await response.json();

    //console.log(data);

    function getData(ref) {
      return {
        contentUrl: ref.patch_url,
        url: ref.url
      }
    }
    const dataArray = results.map(getData);

    //console.log(dataArray)
    

  fs.appendFileSync("./array.json", JSON.stringify(dataArray, null, 2));





  });

  //console.log(arrayToIterate)


})();
