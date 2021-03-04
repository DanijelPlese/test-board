const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();


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

  const allPrNumbers = Array.from(
    { length: Math.ceil(lastPrNumber) },
    (_, n) => n + 1
  );

  const prUrls = [];

  for (i = 0; i < allPrNumbers.length; i++) {
    prUrls.push({
      contentUrl: `https://github.com/crocoder-dev/monorepo/pull/${allPrNumbers[i]}.patch`,
      url: `https://api.github.com/repos/crocoder-dev/monorepo/pulls/${allPrNumbers[i]}'`,
    });
  }
  //fs.writeFileSync("./prUrls.json", JSON.stringify(prUrls, null, 2));

  const body = [];

  prUrls.forEach(async (el) => {
    let ul = el.contentUrl;
    let options = {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3.raw+json",
        Authorization: process.env.AUTH,
      },
    };
    const results = await fetch(ul, options);

    body.push({
      textBody: await results.text(),
      url: el.contentUrl,
    });

    const allDataPR = body
      .map((i) => {
        const searchForTags = /([+]hashtags: [^\n]*(\n+))/g;
        const searchForFile = /(diff [^\n]*(\n+))/g;
        return {
          hashtags: i.textBody.match(searchForTags),
          url: i.textBody.match(searchForFile),
        };
      })
      .filter((i) => i.hashtags !== null && i.hashtags.length === 2);

    const hashtagLines = allDataPR
      .map((i) => {
        return {
          original: i.hashtags[0]
            .replace(/[+]hashtags: "/g, "")
            .replace(/"\n/g, "")
            .split(",")
            .sort(),
          edited: i.hashtags[1]
            .replace(/[+]hashtags: "/g, "")
            .replace(/"\n/g, "")
            .replace(/\n/g, "")
            .replace(/##/g, "#")
            .replace(/ #/g, "#")
            .replace(/"#/g, "#")
            .replace(/\"/g, "")
            .split(",")
            .sort(),
          file: i.url[0].split("/").slice(-1).pop().replace(/\n/g, ""),
        };
      })
      .map((i) => {
        return {
          keep: i.edited.filter((x) => !new Set(i.original).has(x)),
          file: i.file,
        };
      })
      .filter((i) => i.keep.length > 0);

    console.log(hashtagLines);

    //fs.writeFileSync("./hashtagLines.json", JSON.stringify(hashtagLines, null, 2));

  });

})();
