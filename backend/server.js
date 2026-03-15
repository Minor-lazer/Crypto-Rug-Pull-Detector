const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.post("/scan", async (req, res) => {

  const { address } = req.body

  try {

    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`

    const response = await axios.get(url)

    const pair = response.data.pairs[0]

    const liquidity = pair.liquidity.usd
    const volume = pair.volume.h24
    const price = pair.priceUsd

    let risk = "LOW"
    let reasons = []

    if (liquidity < 50000) {
      risk = "HIGH"
      reasons.push("Low liquidity")
    }

    if (volume < 10000) {
      reasons.push("Low trading volume")
    }

    res.json({
      token: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      liquidity,
      volume,
      price,
      risk,
      reasons
    })

  } catch (error) {

    res.status(500).json({
      error: "Token not found"
    })

  }

})

app.listen(3001, () => {
  console.log("Server running on port 3001")
})