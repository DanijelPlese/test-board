const fetch = require("node-fetch");
const fs = require("fs");
const data = require("./data2.json"); // [{"textBody", "url"},{...},{...}]


const z = (async () => {

//console.log(data)

  
  const allData = data.flat().map((i) => {
    return {
      dataPr: i.textBody,
      url: i.url,
    };
  });
  console.log(allData)



})();
