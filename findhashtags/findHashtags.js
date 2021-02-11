const fs = require("fs");
const { ContextReplacementPlugin } = require("webpack");
const data = require("./data1.json"); // [{"textBody", "url"},{...},{...}]

const z = (async () => {
  const allDataPR = data
    .flat()
    .map((i) => {
      const searchFor = /([+]hashtags: [^\n]*(\n+))/g;
      return {
        hashtags: i.textBody.match(searchFor),
        url: i.url,
      };
    })
    .filter((i) => i.hashtags !== null)
    .filter((i) => i.hashtags.length === 2)
    .map((i) => {
      return {
        original: i.hashtags[0].replace(/[+]hashtags: "/g, '').replace(/"\n/g, '').split(','),
        edited: i.hashtags[1].replace(/[+]hashtags: "/g, '').replace(/"\n/g, '').split(','),
        url: i.url,
      };
    }); //343 pulls

    


  console.log(originals);

})();
