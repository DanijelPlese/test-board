const content = require("./hashtagLines.json");


// all added hashtags
const allKeywords = content
  .map(({ keep }) => keep)
  .sort()
  .flat();
//console.log(allKeywords)


// count unique hashtags
const sumHashtag = content
  .map(({ keep }) => keep)
  .sort()
  .flat();

const countTags = sumHashtag.reduce((allTags, keep) => {
  if (keep in allTags) {
    allTags[keep]++;
  } else {
    allTags[keep] = 1;
  }
  return allTags;
}, {});
//console.log(countTags);


const fileOfTag = sumHashtag.reduce((allTags, keep) => {
  if (keep in allTags) {
    allTags[keep]++;
  } else {
    allTags[keep] = 1;
  }
  return allTags;
}, {});
console.log(fileOfTag);


// all unique hashtags
const uniqueHashtag = [];
allKeywords.forEach((h) => {
  if (!uniqueHashtag.includes(h)) {
    uniqueHashtag.push(h);
  }
});
//console.log(uniqueHashtag);
