const { getConn, getRedisConn } = require("../app");

async function getCacheBuySeat() {
  const conn = await getConn();
  const redisConn = await getRedisConn();

  // cacheBuySeat = bit string "00100..10" length 20 represent B01..B20
  let cacheBuySeat = await redisConn.get("cacheBuySeat");
  if (!cacheBuySeat) {
    let seatBitMap = Array(20).fill(false);
    const buySeatRes = await conn.query(
      "SELECT seat FROM TICKETS WHERE zone = 'BUY'"
    );
    buySeatRes[0].map((item) => {
      const index = parseInt(item.seat.replace("B", ""));
      seatBitMap[index - 1] = true;
    });
    // REDIS : redis only accept text -> make it stringify
    cacheBuySeat = JSON.stringify(seatBitMap);
    redisConn.set("cacheBuySeat", cacheBuySeat);
  }
  return cacheBuySeat;
}

module.exports = getCacheBuySeat;
