import { useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState("");

  const sharing = async () => {
    if (!inputAddress.trim()) return;
    
    setIsLoading(true);
    try {
      const tx = await contract.allow(inputAddress);
      await tx.wait(); // Wait for transaction to be mined
      await fetchAccessList(); // Refresh the list after sharing
      setInputAddress(""); // Clear input field
    } catch (error) {
      console.error("Sharing failed:", error);
      alert("Failed to share access. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccessList = async () => {
    if (!contract) return;
    
    try {
      const addressList = await contract.shareAccess();
      setAddresses(addressList);
    } catch (error) {
      console.error("Error fetching access list:", error);
    }
  };

  useEffect(() => {
    fetchAccessList();
  }, [contract]);

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">Share with</div>
        <div className="body">
          <input
            type="text"
            className="address"
            placeholder="Enter Address"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <form id="myForm">
          <select id="selectNumber">
            <option className="address">People With Access</option>
            {addresses.map((address, index) => (
              <option key={index} value={address}>
                {address}
              </option>
            ))}
          </select>
        </form>
        <div className="footer">
          <button
            onClick={() => setModalOpen(false)}
            id="cancelBtn"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={sharing} 
            disabled={isLoading || !inputAddress.trim()}
          >
            {isLoading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;