const fs = require("fs");
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
        original: i.hashtags[0]
          .replace(/[+]hashtags: "/g, "")
          .replace(/"\n/g, "")
          .split(",")
          .sort(),
        edited: i.hashtags[1]
          .replace(/[+]hashtags: "/g, "")
          .replace(/"\n/g, "")
          .split(",")
          .sort(),
        url: i.url,
      };
    }); //343 pulls

  const originalTags = allDataPR.map((i) => i.original);
  const editedTags = allDataPR.map((i) => i.edited);

  allDataPR.forEach((i) => {
    let oriArr = i.original;
    let ediArr = i.edited;
    let url = i.url;

    const myKeep = ediArr;
    const toRemove = new Set(oriArr);

    const difference = myKeep.filter((x) => !toRemove.has(x));

    if(difference.length > 0) {
      console.log(difference)
    }

    //console.log(difference);
  });

  //console.log(allDataPR);
})();
