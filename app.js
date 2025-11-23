import express from "express";
import db from "./db/index.js";
import Redis from "ioredis";
import { rules } from "./rules.js";

const app = express();
app.use(express.json());

const insertAlert = db.prepare(`
    INSERT INTO alerts (deviceId, rule, value)
    VALUES (?, ?, ?)
`);

const redis = new Redis();

redis.subscribe("data.new", () => {
    console.log("Alert service subscribed to data.new");
});
  
redis.on("message", (channel, message) => {
    if (channel === "data.new") {
      const data = JSON.parse(message);
      evaluateRules(data);
    }
});

function evaluateRules(data) {
    rules.forEach(r => {
        if (r.check(data)) {
          console.log(`Alert Triggered: ${r.name} on ${data.deviceId} = ${data.temperature || data.humidity}`);
          try {
              insertAlert.run(data.deviceId, r.name, data.temperature || data.humidity || null);
          } catch (err) {
              console.error("DB error:", err.message);
          }
        }
      });
}

app.listen(3002, () => console.log("Alert service listening on 3002"));
