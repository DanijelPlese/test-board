const content = require("./hashtagLines.json");

//console.log(content)

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

const uniqueTags = [];

for ( i of sumHashtag ) {
  if ( uniqueTags.indexOf(i) === -1 ) {
    uniqueTags.push(i);
  }
  //console.log(uniqueTags)
}

for ( n of uniqueTags ) {
  let acc = 0;
  for ( p of uniqueTags ) {
    if ( n === p ) {
      acc ++;
    }
  }
  //console.log(`${p} = ${acc}`)
}

//console.log(`${n} = ${acc}`)



  //console.log(sumHashtag)

// all unique hashtags
const uniqueHashtag = [];
allKeywords.forEach((h) => {
  if (!uniqueHashtag.includes(h)) {
    uniqueHashtag.push(h);
  }
});

//console.log(uniqueHashtag);

