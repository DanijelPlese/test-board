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

    const data = await response.json();

    const refs = data.map((t) => {
      return {
        contentUrl: t.patch_url,
        url: t.url,
      };
    });

    refs.forEach(async (i) => {
      let uls = i.contentUrl;
      let options = {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3.raw+json",
          Authorization: process.env.AUTH,
        },
      };

      const body = [];

      const result = await fetch(uls, options);

      body.push({
        textBody: await result.text(),
        url: i.contentUrl,
      });

      const allAddedHashtags = await body
        .map((i) => {
          const searchFor = /([+]hashtags: [^\n]*(\n+))/g;
          return {
            hashtags: i.textBody.match(searchFor),
            url: i.url,
          };
        })
        .filter((i) => i.hashtags !== null && i.hashtags.length === 2)
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
            url: i.url,
          };
        })
        .map((i) => {
          return {
            keep: i.edited.filter((x) => !new Set(i.original).has(x)),
            url: i.url,
          };
        }).filter((i) => i.keep.length !== 0)

        
        /*
        .map(({ keep }) => keep)
        .sort()
        .flat();
    */
      const hashtags = [].concat(allAddedHashtags).sort();
    
      const uniqueHashtag = [];
      hashtags.forEach((h) => {
        if (!uniqueHashtag.includes(h)) {
          uniqueHashtag.push(h);
        }
      });
    
      console.log(uniqueHashtag);


      //console.log(allAddedHashtags);
    });
    //fs.appendFileSync("./data1.json", JSON.stringify(refs, null, 2));
  });
})();
