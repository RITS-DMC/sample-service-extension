'use strict';
const request = require("request");

function getEnvParams() {
  return {
    baseUrl: process.env.baseUrl,
    plant: process.env.plant,
    order: process.env.order
  };
}

function getAuthConfig() {
  return {
    url: process.env.url,
    clientid: process.env.clientid,
    clientsecret: process.env.clientsecret,
    grant_type: process.env.grant_type
  };
}

// -------------------- Auth Service --------------------
const authService = {
  getOauthToken: function () {
    const auth_config = getAuthConfig();
    const AUTHORIZATION = 'Basic ' + Buffer.from(auth_config.clientid + ':' + auth_config.clientsecret).toString('base64');
    let formData = {
      clientid: auth_config.clientid,
      grant_type: auth_config.grant_type
    };
    return new Promise((resolve, reject) => {
      request.post({
        url: auth_config.url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": AUTHORIZATION
        },
        form: formData
      }, (err, httpResponse, body) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(body));
      });
    });
  }
};

// -------------------- HTTP Service --------------------
const httpService = {
  get: function (options, callback) {
    authService.getOauthToken().then((result) => {
      console.log("AUTHTOKEN - GET SUCCESSFUL");
      options = Object.assign({}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + result.access_token
        }
      }, options);
      request.get(options, callback);
    }).catch((err) => {
      console.error("Failed to get OAuth token", err);
    });
  }
};

// -------------------- DMC Service --------------------
const dmcService = {
  getOrderDetail: function (plant, order) {
    const params = getEnvParams();
    const fullUrl = params.baseUrl + "/order/v1/orders?order=" + order + "&plant=" + plant;
    console.log("URL ---" + fullUrl);

    return new Promise((resolve, reject) => {
      httpService.get({
        url: fullUrl
      }, (err, httpResponse, body) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(body);
      });
    });
  }
};

// -------------------- Main Function --------------------
module.exports = {
  main: function (event, context) {
    let plantValue, orderValue, orderdetails, identifiers, finalresult = {};

    const params = getEnvParams();

    if (event.data !== undefined) {
      console.log("Input parameters: " + JSON.stringify(event.data));
      identifiers = event.data.identifiers;
      console.log("old SFC identifiers: " + identifiers);

      orderValue = event.data.extensionParameters.ORDER_NAME;
      plantValue = event.data.extensionParameters.PLANT;
      console.log("Order Value: " + orderValue);
      console.log("Plant Value: " + plantValue);
      finalresult = event.data;

    } else {
      orderValue = params.order;
      plantValue = params.plant;
    }

    return new Promise((resolve, reject) => {
      dmcService.getOrderDetail(plantValue, orderValue).then((result) => {
        try {
          orderdetails = JSON.parse(result);
        } catch (e) {
          return reject("Failed to parse order detail response: " + e);
        }

        console.log("Full Order Details Response:\n", JSON.stringify(orderdetails, null, 2));

        let customdata = "CD_NOT_FOUND";

        if (Array.isArray(orderdetails.customValues)) {
          for (let i = 0; i < orderdetails.customValues.length; i++) {
            if (orderdetails.customValues[i].attribute === "CD_SALES_ORDER_ID") {
              customdata = orderdetails.customValues[i].value;
              break;
            }
          }
        } else {
          console.warn("customValues not found in response.");
        }

        console.log("Sales Order: " + customdata);

        let array = [];
        for (let iter = 0; iter < identifiers.length; iter++) {
          const suffix = identifiers[iter].slice(-4);
          const newSeq = customdata + suffix;
          console.log("new SFC identifiers: " + newSeq);
          array.push(newSeq);
        }

        finalresult.identifiers = array;
        resolve(finalresult);

      }).catch((err) => {
        reject(err);
      });
    });
  }
};
