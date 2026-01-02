import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import logo from "./assets/logo.png";

const baseRpcUrl =
  "https://base-mainnet.infura.io/v3/42a4da41266c4e2ea61a2af90c2b5b13";

const baseProvider = new ethers.JsonRpcProvider(baseRpcUrl);

function App() {
  const [address, setAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [amountCoin, setAmountCoin] = useState(0);

  function handleAddressChange(event) {
    setAddress(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Validate address
    if (!address || address.trim() === "") {
      return;
    }

    try {
      // Query to the base chain and see how many transactions on base they created
      const txCount = await baseProvider.getTransactionCount(address);
      let calculatedAmountCoin = 0;

      if (txCount > 100 && txCount < 400) {
        calculatedAmountCoin = txCount * 25;
      } else if (txCount >= 400 && txCount < 1000) {
        calculatedAmountCoin = txCount * 50;
      } else if (txCount >= 1000) {
        calculatedAmountCoin = txCount * 100;
      } else {
        calculatedAmountCoin = 0;
      }

      // Only show popup if eligible (amountCoin > 0)
      if (calculatedAmountCoin > 0) {
        setAmountCoin(calculatedAmountCoin);
        setShowPopup(true);
      }

      // Console log for debugging
      console.log(
        `Address: ${address}, Transaction Count: ${txCount}, Amount Coin: ${calculatedAmountCoin}`
      );
    } catch (error) {
      console.error("Error fetching transaction count:", error);
    }
  }

  function closePopup() {
    setShowPopup(false);
  }

  return (
    <div className="app-container">
      <div className="app-grid">
        <div className="grid-item header-section">
          <img src={logo} alt="Logo" className="app-logo" />
          <h1>Welcome our customers</h1>
        </div>

        <div className="grid-item form-section">
          <form onSubmit={handleSubmit} className="address-form">
            <input
              type="text"
              placeholder="fill your address"
              value={address}
              onChange={handleAddressChange}
              className="address-input"
            />
            <button type="submit" className="check-button">
              check
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <span className="close-btn" onClick={closePopup}>
                &times;
              </span>
            </div>
            <div className="popup-body">
              <img src={logo} alt="Logo" className="congrats-icon" />
              <h2>Congratulations!</h2>
              <p>You are eligible for</p>
              <div className="amount-display">
                {amountCoin.toLocaleString()} coin
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
