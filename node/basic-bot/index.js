/**
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const PORT = process.env.PORT || 9000;

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.post('/', (req, res) => {
  let text = '';
  // Case 1: When BOT was added to the ROOM
  if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
    text = `Thanks for adding me to ${req.body.space.displayName}`;
  // Case 2: When BOT was added to a DM
  } else if (req.body.type === 'ADDED_TO_SPACE' &&
      req.body.space.type === 'DM') {
    text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;
  // Case 3: Texting the BOT
  } else if (req.body.type === 'MESSAGE') {
      // if (req.body.message.text === "btn"){
      // const json = createOwnerCard(["company-name", "name", "location", "email"])
      // return res.json(json);
      // }
      // text = `Your message : ${req.body.message.text}`;
      // text = `g http://www.google.com`;
      text = "<https://example.com/foo|my link text>"
  } if (req.body.type == "CARD_CLICKED") {

    // Update the card in place when the "UPVOTE" button is clicked.
    if (req.body.action.actionMethodName == "cheet") {
        const data = parseInt(req.body.action.parameters[0].value);
        text = `extract data from button payload ${data}`
    } else {
        text = `I don't know your message type ${req.body.action.actionMethodName}`
    }
  }
  return res.json({text});
});

function createOwnerCard(data) {
  const company = data[0];
  const name = data[1];
  const location = data[2];
  const email = data[3];

  const cardHeader = {
    title: company + ' Account Owner',
    subtitle: name,
      imageUrl: "https://lh6.googleusercontent.com/proxy/gpp_zxQ_-VCZPYrP1fGANctbkMB2dZ5i1R-asUkyFRo5etQ4qA4huyBmi5NF_FZt70x6WQVPhx2U0qTLkJjW_K_7CM4BNXrUTFHhQg",
    imageStyle: 'IMAGE',
  };

  const emailWidget = {
    keyValue: {
      content: 'Email',
      bottomLabel: email,
    },
  };

  const locationWidget = {
    keyValue: {
      content: 'Location',
      bottomLabel: location,
    },
  };

    const buttons = [
        {
            "textButton": {
                "text": "open google",
                "onClick": {
                    "openLink": {
                        "url": "https://www.google.com"
                    }
                }
            }
        },

        {
            "textButton": {
                "text": "cheet",
                "onClick": {
                    "action": {
                        "actionMethodName": "cheet",
                        "parameters": [
                            {
                                "key": "time",
                                "value": "1 day"
                            },
                            {
                                "key": "id",
                                "value": "123456"
                            }
                        ]
                    }
                }
            }
        },

    ]

    const infoSection = {widgets: [emailWidget, locationWidget, {buttons}]};

  const cards = [{
    name: 'Status Card',
    header: cardHeader,
    sections: [infoSection],
  }];

  return {cards: cards};
}

app.listen(PORT, () => {
  console.log(`Server is running in port - ${PORT}`);
});
