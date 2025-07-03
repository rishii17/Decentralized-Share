import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";

import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
  
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
  
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
  
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  
        const contract = new Contract(contractAddress, Upload.abi, signer);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
  
    loadProvider();
  }, []);
  
  return (
    <>
     

      <div className="App">
        <h1 style={{ color: "white" }}>Decentralized file sharing system</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
        {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
      </div>
    </>
  );
}

export default App;