import { useState } from "react"
import axios from "axios"
import "./App.css"

type ScanResult = {
  token: string
  symbol: string
  liquidity: number
  volume: number
  price: number
  risk: string
  reasons: string[]
}

function App() {

  const [address, setAddress] = useState("")
  const [data, setData] = useState<ScanResult | null>(null)

  const scanToken = async () => {

    const res = await axios.post("http://localhost:3001/scan", {
      address
    })

    setData(res.data)
  }

  return (

    <div className="container">

      <h1 className="title">🛡 CryptoShield</h1>
      <h2>Detect risky tokens before you invest</h2>

      <div className="search">

        <input
          placeholder="Paste token contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button onClick={scanToken}>
          Scan
        </button>

      </div>

      {data && (

        <div className={`result-card ${data.risk === "HIGH" ? "high" : "low"}`}>

          <h2>
            {data.token} ({data.symbol})
          </h2>

          <div className="metrics">

<div className="metric">
  <p>Liquidity</p>
  <h3>${data.liquidity.toLocaleString()}</h3>
  <div className="bar">
    <div
      className="bar-fill liquidity"
      style={{ width: `${Math.min(data.liquidity / 10000, 100)}%` }}
    ></div>
  </div>
</div>

<div className="metric">
  <p>Volume 24h</p>
  <h3>${data.volume.toLocaleString()}</h3>
  <div className="bar">
    <div
      className="bar-fill volume"
      style={{ width: `${Math.min(data.volume / 1000, 100)}%` }}
    ></div>
  </div>
</div>

<div className="metric">
  <p>Price</p>
  <h3>${data.price}</h3>
  <div className="bar">
    <div
      className="bar-fill price"
      style={{ width: `${Math.min(data.price * 100000, 100)}%` }}
    ></div>
  </div>
</div>

</div>

          <h3 className="risk">
            Risk Level: {data.risk}
          </h3>

          <ul>
            {data.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

        </div>

      )}

    </div>
  )
}

export default App