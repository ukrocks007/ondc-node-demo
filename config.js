const dotenv = require("dotenv");
const parsed = dotenv.config().parsed;
const data = parsed || {};

module.exports = {
    protocolServerHost: data.PROTOCOL_SERVER_HOST || "http://localhost:5000",
    port: data.PORT || 9988,
    bapId: data.BAP_ID || "localhost",
    bapUri: data.BAP_URI || "http://localhost:9988/",
    bppId: data.BPP_ID || "bpp.com",
    bppUri: data.BPP_URI || "http://localhost:4554",
    country: data.COUNTRY || "IND",
    city: data.CITY || "std:080",
    ttl: data.TTL || "P1M"
};