const service = require('./index');

process.env.baseUrl = "<public-api-endpoint>";
process.env.plant = "<plant-name>";
process.env.order = "<order-name>";
process.env.url = "<url>/oauth/token";
process.env.clientid = "<client-id>";
process.env.clientsecret = "<client-secret>";
process.env.grant_type = "client_credentials";

const mockEvent = {
  data: {
    extensionParameters: {
      ORDER_NAME: "<Order-Name>",
      PLANT: "<Plant>"
    },
    identifiers: [
      "sfc1", "sfc2"
    ]
  }
};

const context = {};

service.main(mockEvent, context)
  .then(result => {
    console.log("Final Result:\n", JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error("Error occurred:\n", error);
  });
  
