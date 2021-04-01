const { IncomingWebhook } = require('@slack/webhook');
const giphyConstructor = require('giphy-api');

const url = process.env.PLUGIN_WEBHOOK;
const channel = process.env.PLUGIN_CHANNEL;
const success_template = process.env.PLUGIN_SUCCESS_TEMPLATE;
const failure_template = process.env.PLUGIN_FAILURE_TEMPLATE;
const giphy_api_key = process.env.PLUGIN_GIPHY_API_KEY;

if (!url) {
    throw new Error("Missing webhook setting.");
}

if (!channel) {
    throw new Error("Missing channel setting.");
}

if (!success_template) {
    throw new Error("Missing success template setting.");
}

if (!failure_template) {
    throw new Error("Missing failure template setting.");
}

if (!giphy_api_key) {
    throw new Error("Missing Giphy API key setting.");
}

const giphy = giphyConstructor(giphy_api_key);

const webhook = new IncomingWebhook(url);

// Send the notification if build has a status
if (process.env.DRONE_BUILD_STATUS) {

    const buildStatus = process.env.DRONE_BUILD_STATUS;

    giphy.random({
        tag: buildStatus + " funny",
        rating: 'pg',
        fmt: 'json'
    }, function (err, res) {
        (async () => {
          await webhook.send({
            text: buildStatus === "success" ? success_template : failure_template,
            attachments: [
                {
                    image_url: res.data.image_url          
                }
            ]
          });
        })();
    });

}
