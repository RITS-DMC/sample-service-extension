Steps to Test SAP DMC API:

1. Clone the  project from the official GitHub repository to your local machine.

2. Navigate to the cloned project directory and run the following command to install required Node.js dependencies:

    npm install

3. Configure API Credentials in test.js
        Open the test.js file and update the following fields with actual values:

        process.env.baseUrl = "<public-api-endpoint>";
        process.env.plant = "<plant-name>";
        process.env.order = "<order-name>";
        process.env.url = "<url>/oauth/token";
        process.env.clientid = "<client-id>";
        process.env.clientsecret = "<client-secret>";
        process.env.grant_type = "client_credentials"; // Do not modify this value

      Tip: You can find these credentials in your RITS DMC SAP BTP Subaccount under the Instances and Subscriptions section. Look for the SAP Digital Manufacturing service and view its service key.

4. Update the Mock Event Payload
        In the same test.js file, modify the mock event JSON with relevant data:

       const mockEvent = {
           data: {
             extensionParameters: {
                  ORDER_NAME: "<Order-Name>",  // Use the same order name as defined above
                  PLANT: "<Plant>"             // Use the same plant as defined above
              },
              identifiers: [
                    "sfc1", "sfc2"               // SFCs that exist under the given order
               ]
            }
         };

5. Run the Test Script
        After updating the file, run the following command to execute the test and make the API call: node test.js
		
6. View the API Response
        Check your terminal or command line console to view the API response returned from SAP DMC.
