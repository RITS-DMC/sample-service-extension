const service = require('./index');

process.env.baseUrl = "https://api.test.eu20.dmc.cloud.sap";
process.env.plant = "MB01";
process.env.order = "T123";
process.env.url = "https://ritsdmc-az12fc9w.authentication.eu20.hana.ondemand.com/oauth/token";
process.env.clientid = "sb-5a4cc893-075b-4847-aa0c-64ac8e5341eb!b5357|dmc-services-quality!b330";
process.env.clientsecret = "h6fLBaZ8fs1PScAUhpMTlQoG0+8=";
process.env.grant_type = "client_credentials";

const mockEvent = {
  data: {
    extensionParameters: {
      ORDER_NAME: "T123",
      PLANT: "MB01"
    },
    identifiers: [
      "ABC001156", "ABC001157"
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
  
