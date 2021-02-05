const fetch = require("node-fetch");
const fs = require("fs");

const x = (async () => {
  let lastPullRequestUrl =
    "https://api.github.com/repos/crocoder-dev/monorepo/pulls?state=all&page=1&per_page=100";
  let optionsOfLast = {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.VERSION.raw+json",
      Authorization: process.env.AUTH_TOKEN,
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
//console.log(pages, 'p')
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
        Authorization: process.env.AUTH_TOKEN,
      },
    };

    const response = await fetch(ul, options);

    const data = await response.json();
    const refs = await data
      .map((t) => t.head.ref)
      //.filter((i) => i.includes("jobpost/"));
    //;
    //console.log(refs, "t");
    const prHashList = [];

    await refs.forEach(({ prNumber, url }) => {
      try {
        const hashText = fs.readFileSync(prNumber, "utf8");
      } catch (err) {}
    });

    /*
    const mdNames = await refs.map(i => i.replace(/^[\s\S]*\//g, '')+'.md')
    
    fs.appendFileSync('./mdnames.json', JSON.stringify(mdNames, null, 2))
*/
    console.log(refs);
  });

  //console.log(result, "c");
})();
