const fetch = require("node-fetch");
const fs = require("fs");
const data = require("./data1.json"); // [{"textBody", "url"},{...},{...}]


const z = (async () => {
  
  const allData = data.flat().map((i) => {
    
    return {
      dataPr: i.textBody,
      url: i.url,
    };
  }).filter(t => {
    const searchFor = /([+-]?hashtags: [^\n]*(\n+))/g;
    const textBody = t.dataPr;

    const match = textBody.match(searchFor)
    console.log(match)


  });

  //console.log(allData)


  const searchFor = /([+-]?hashtags: [^\n]*(\n+))/g;




})();
