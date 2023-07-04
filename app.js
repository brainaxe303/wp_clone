/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

// "use strict";

// // Access token for your app
// // (copy token from DevX getting started page
// // and save it as environment variable into the .env file)
// const token = "EAAQ3WlXJ4ocBAC6MtZCZCfM6LUzaz5TZBRUTQeGIxbZAlSWZBjloatRyBwAq3SU5a779EGWEBr0qixTm5NN3kt1K45JZAcLY8UApLZCp4hiQpTlOd1CMH8IwGjKkZCduAl996KmQBZA3vvrnd0vBK5FJYV3ZC1OTxl4q22MW7OCNYPuPmwTNgeJaVFPkGDeKnWrZCTT5fpOuqtprrVYvkRttSZBw" //process.env.WHATSAPP_TOKEN;

// // Imports dependencies and set up http server
// const request = require("request"),
//     express = require("express"),
//     body_parser = require("body-parser"),
//     axios = require("axios").default,
//     app = express().use(body_parser.json()); // creates express http server

// // Sets server port and logs message on success
// app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// // Accepts POST requests at /webhook endpoint
// app.post("/webhook", (req, res) => {
//     // Parse the request body from the POST
//     let body = req.body;

//     // Check the Incoming webhook message
//     console.log(JSON.stringify(req.body, null, 2));

//     // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
//     if (req.body.object) {
//         if (
//             req.body.entry &&
//             req.body.entry[0].changes &&
//             req.body.entry[0].changes[0] &&
//             req.body.entry[0].changes[0].value.messages &&
//             req.body.entry[0].changes[0].value.messages[0]
//         ) {
//             let media_id = req.body.entry[0].changes[0].value.messages[0].document.id;
//             console.log("media_id: " + media_id);
//         }
//         res.sendStatus(200);
//     } else {
//         // Return a '404 Not Found' if event is not from a WhatsApp API
//         res.sendStatus(404);
//     }
// });

// // Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// // info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
// app.get("/webhook", (req, res) => {
//     /**
//      * UPDATE YOUR VERIFY TOKEN
//      *This will be the Verify Token value when you set up webhook
//     **/
//     const verify_token = "asdf" // process.env.VERIFY_TOKEN;
//     console.log("verify_token: " + verify_token);

//     // Parse params from the webhook verification request
//     let mode = req.query["hub.mode"];
//     let token = req.query["hub.verify_token"];
//     let challenge = req.query["hub.challenge"];

//     // Check if a token and mode were sent
//     if (mode && token) {
//         // Check the mode and token sent are correct
//         if (mode === "subscribe" && token === verify_token) {
//             // Respond with 200 OK and challenge token from the request
//             console.log("WEBHOOK_VERIFIED");
//             res.status(200).send(challenge);
//         } else {
//             // Responds with '403 Forbidden' if verify tokens do not match
//             res.sendStatus(403);
//         }
//     }
// });

// //const SftpClient = require('ssh2-sftp-client');

// async function saveFileToServer(localFilePath, fileName, serverConfig) {
//   if (!serverConfig || !serverConfig.host || !serverConfig.username || !serverConfig.password) {
//     throw new Error('Incomplete server configuration.');
//   }

//   const sftp = new SftpClient();

//   try {
//     await sftp.connect(serverConfig);

//     const serverPath = `${serverConfig.remotePath || ''}/${fileName}`;
//     await sftp.put(localFilePath, serverPath);

//     // Logging (you can customize this part based on your logging requirements)
//     const loggerData = {
//       loginStatus: 'SUCCESS',
//       serverIP: serverConfig.host,
//       userName: serverConfig.username,
//       password: serverConfig.password,
//       serverPath: serverConfig.remotePath,
//       type: 'PUT',
//       fileName: fileName,
//     };
//     console.log(JSON.stringify(loggerData));

//     return { response: true, nwcServerPath: serverPath, fileName: fileName };
//   } catch (err) {
//     // Error Logging (you can customize this part based on your logging requirements)
//     const loggerData = {
//       loginStatus: 'FAILED',
//       serverIP: serverConfig.host,
//       userName: serverConfig.username,
//       password: serverConfig.password,
//       serverPath: serverConfig.remotePath,
//       type: 'PUT',
//       fileName: fileName,
//       error: err.message || 'Unknown error occurred.',
//     };
//     console.error(JSON.stringify(loggerData));

//     return { response: false, nwcServerPath: '', fileName: fileName, error: err.message || 'Unknown error occurred.' };
//   } finally {
//     sftp.end();
//   }
// }

// // Usage example:
// const serverConfig = {
//   host: 'your_sftp_server_ip',
//   username: 'your_sftp_username',
//   password: 'your_sftp_password',
//   remotePath: '/path/to/remote/directory', // Optional
// };

// const localFilePath = '/path/to/local/file.txt';
// const fileName = 'file.txt';

// saveFileToServer(localFilePath, fileName, serverConfig)
//   .then((result) => {
//     console.log('Upload result:', result);
//   })
//   .catch((error) => {
//     console.error('Error occurred during upload:', error);
//   });
// //


const fs = require('fs');
const path = require('path');
const SftpClient = require('ssh2-sftp-client');

async function saveFileToServer(localFilePath, fileName, serverConfig) {
    if (!serverConfig || !serverConfig.host || !serverConfig.username || !serverConfig.password) {
        throw new Error('Incomplete server configuration.');
    }

    const sftp = new SftpClient();

    try {
        await sftp.connect(serverConfig);
        const files = await getFilesInFolder(localFolderPath);
        const uploadPromises = files.map(async (file) => {
            const localFilePath = path.join(localFolderPath, file);
            const serverPath = `${serverConfig.remotePath || ''}/${file}`;
        await sftp.fastput(localFilePath, serverPath);

       
        const loggerData = {
            loginStatus: 'SUCCESS',
            serverIP: serverConfig.host,
            userName: serverConfig.username,
            password: serverConfig.password,
            serverPath: serverConfig.remotePath,
            type: 'PUT',
            fileName: fileName,
        };
        console.log(JSON.stringify(loggerData));

        return { response: true, nwcServerPath: serverPath, fileName: file };
    });
        const results = await Promise.all(uploadPromises);

        return results;

    } catch (err) {
       
        const loggerData = {
            loginStatus: 'FAILED',
            serverIP: serverConfig.host,
            userName: serverConfig.username,
            password: serverConfig.password,
            serverPath: serverConfig.remotePath,
            type: 'PUT',
            fileName: fileName,
            error: err.message || 'Unknown error occurred.',
        };
        console.error(JSON.stringify(loggerData));

        return { response: false, nwcServerPath: '', fileName: fileName, error: err.message || 'Unknown error occurred.' };
    } finally {
        sftp.end();
    }
}


const serverConfig = {
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    remotePath: '', // Optional
};
const localFolderPath = 'D:/web-development/wp_clone';

// const localFilePath = 'D:\web-development\wp_clone';
// const fileName = 'test.txt';

function getFilesInFolder(localFolderPath) {
    return fs.promises.readdir(localFolderPath);
}

(async () => {
    try {
        const results = await saveFileToServer(localFolderPath, serverConfig);
        console.log('Upload results:', results);
    } catch (error) {
        console.error('Error occurred during upload:', error);
    }
})();


