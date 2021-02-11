const fs = require("fs");
const data = require("./data1.json"); // [{"textBody", "url"},{...},{...}]

const z = (async () => {
  const allDataPR = data
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
      };
    })
    .filter((i) => i.keep.length > 0);

  const result = allDataPR
    .map(({ keep }) => keep)
    .sort()
    .flat();

  const hashtags = [].concat(result).sort();

  const uniqueHashtag = [];
  hashtags.forEach((h) => {
    if (!uniqueHashtag.includes(h)) {
      uniqueHashtag.push(h);
    }
  });

  console.log(uniqueHashtag);

  fs.appendFileSync("./allAdded.txt", JSON.stringify(uniqueHashtag, null, 2));
})();
