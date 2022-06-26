const ONDC = require('../ondc-node/dist/index');
const express = require("express");
const app = express();
const config = require("./config");
app.use(express.json());

const context = {
    // host is for protocol server address
    host: config.protocolServerHost,
    // This server acts as a gateway and a buyer for snadbox purpose
    bapId: config.bapId,
    bapUri: config.bapUri,
    // Seller app information
    bppId: config.bppId,
    bppUri: config.bppUri,
    country: config.country,
    city: config.city,
    ttl: config.ttl,
};
const ondc = new ONDC.default.ONDC(context);

// BAP on search callback
app.post("/on_search", (req, res) => {
    console.log("on_search", req.body);
    res.status(200).send();
});

// Implemented this api when we use this server as BPP.
app.post("/search", (req, res) => {
    res.status(200).send({
        context: context,
        message: {
            "catalog": {
                "bpp/descriptor": {
                    "name": "Shop EZ"
                },
                "bpp/providers": [
                    {
                        "id": "pooja_stores",
                        "descriptor": {
                            "name": "Pooja Stores"
                        },
                        "locations": [
                            {
                                "id": "pooja_stores_location",
                                "gps": "12.9349377,77.6055586"
                            }
                        ],
                        "items": [
                            {
                                "id": "item_1",
                                "descriptor": {
                                    "name": "Brown Bread 400 gm"
                                },
                                "location_id": "pooja_stores_location",
                                "price": {
                                    "currency": "INR",
                                    "value": "40"
                                },
                                "category_id": "groceries",
                                "matched": true
                            },
                            {
                                "id": "item_2",
                                "descriptor": {
                                    "name": "Good Life Toned Milk 1L"
                                },
                                "location_id": "pooja_stores_location",
                                "price": {
                                    "currency": "INR",
                                    "value": "60"
                                },
                                "category_id": "groceries",
                                "matched": true
                            }
                        ],
                        "categories": [
                            {
                                "id": "groceries",
                                "descriptor": {
                                    "name": "Groceries"
                                }
                            }
                        ],
                        "exp": "2021-06-23T09:53:38.873Z"
                    },
                    {
                        "id": "food_mall",
                        "descriptor": {
                            "name": "Food Mall"
                        },
                        "locations": [
                            {
                                "id": "food_mall_location",
                                "gps": "12.9349377,77.6055586"
                            }
                        ],
                        "items": [
                            {
                                "id": "bread_400g",
                                "descriptor": {
                                    "name": "Brown Bread 400 gm"
                                },
                                "location_id": "food_mall_location",
                                "price": {
                                    "currency": "INR",
                                    "value": "40"
                                },
                                "category_id": "food",
                                "matched": true
                            },
                            {
                                "id": "gl_milk",
                                "descriptor": {
                                    "name": "Good Life Toned Milk 1L"
                                },
                                "location_id": "food_mall_location",
                                "price": {
                                    "currency": "INR",
                                    "value": "60"
                                },
                                "category_id": "food",
                                "matched": true
                            }
                        ],
                        "categories": [
                            {
                                "id": "food",
                                "descriptor": {
                                    "name": "Food"
                                }
                            }
                        ],
                        "exp": "2021-06-23T09:53:38.873Z"
                    }
                ]
            }
        }
    });
});

app.post("/", (req, res) => {
    console.log("/", req.body);
    console.log("/", req.body.message.intent.item);
    console.log("/", req.body.message.intent.fulfillment);
    res.status(200).send();
});

app.get("/", (req, res) => {
    console.log(req.body);
    res.status(200).send();
});

// Exposed an api to trigger search request
app.get("/init", (req, res) => { randomSearch(); res.status(200).json({}) });

// The lookup api acts as Mock gateway and send the information of local BPP app
app.post("/lookup", (req, res) => {
    res.status(200).send([{
        "subscriber_id": config.bapId,
        "subscriber_url": config.bapUri,
        "type": "bap",
        "signing_public_key": "",
        "valid_until": "",
    }]);
});

app.listen(config.port, (err) => {
    if (!err) {
        console.log(`listening on ${config.port}`);
    }
})

// Different types of search requests
const types = ["item", "provider", "category"];

// The search terms according to types
const names = {
    "item": ["Computer", "iphone", "Cloths", "playstation", "medicine", "shoes", "frame", "bedsheet"],
    "provider": ["Myntra", "Flipkart", "Shah Medicals", "Shah Provisions", "PiYash Electronics", "More", "Chroma"],
    "category": ["Electronics", "Medicines", "Fashion", "Home Appliances"],
};

// Sends an ONDC search request randomly
const randomSearch = async () => {
    try {
        let type = types[Math.floor(Math.random() * 10) % 3];
        console.log(await ondc.search({
            [type]: {
                "descriptor": {
                    "name": names[type][Math.floor(Math.random() * 10) % names[type].length]
                }
            },
            "fulfillment": {
                "end": {
                    "location": {
                        "gps": "12.4535445,77.9283792"
                    }
                }
            }
        }));
    } catch (ex) {
        console.log("FAILED");
    }
};