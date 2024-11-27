"use client";
 
/*import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
 
export default function Home() {
  return (
    
    <main className="flex items-center justify-center min-h-screen">
    <div className="border hover:border-slate-900 rounded">
      <WalletMultiButton style={{}} />
    </div>
    </main>
    
  );
} */

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { WalletSendTransactionError } from '@solana/wallet-adapter-base';
import { SendTransactionError, sendAndConfirmTransaction } from '@solana/web3.js';


const connection = new Connection("https://rpc.testnet.soo.network/rpc", "confirmed");

const Home = () => {
  const [isSending, setIsSending] = useState(false);
  const { publicKey, sendTransaction, connected } = useWallet();

  const sendToken = async () => {
    if (!connected || !publicKey) {
      alert("Wallet is not connected");
      return;
    }

    setIsSending(true);

    const tokenMintAddress = new PublicKey("DvhNHdqpHvUFpxm7LtAWZYMGSV4MPAygJrM5YZ2Aixjg"); // Replace with your token mint address
    const senderWallet = Keypair.fromSecretKey(new Uint8Array([
      64,  45, 161, 163, 124,  19, 208, 228,  21,  74,  25,
      213, 189,  58,  73,  62,  52,  15, 238,  81, 162, 204,
      130, 137,  67, 241,  79, 235, 185, 110, 255, 220, 235,
       88, 247, 189,  14, 105, 236,  40, 189,  62, 219, 249,
      150, 160,  18, 162, 247, 121, 193, 232, 149, 151, 229,
      220, 117,  39, 108, 237,  26, 179,  83, 232
    ]));

    try {
      const senderTokenAccount = await getAssociatedTokenAddress(
        tokenMintAddress,
        senderWallet.publicKey
      );
    
      const recipientTokenAccount = await getAssociatedTokenAddress(
        tokenMintAddress,
        publicKey
      );
    
      const tx = new Transaction().add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          senderWallet.publicKey,
          10, // Amount to send (adjust as needed)
          [],
          TOKEN_PROGRAM_ID
        )
      );
    
      // Send the transaction
      const signature = await sendTransaction(tx, connection);
      console.log("Transaction signature:", signature);
      alert("Transaction sent: " + signature);
    
    } catch (error) {
      if (error instanceof SendTransactionError) {
        console.error("Transaction failed:", error);
        alert("Transaction failed: " + error.message);
      } else if (error instanceof Error) {
        console.error("Error sending token:", error.message);
        alert("Error: " + error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("Unexpected error occurred.");
      }
    } finally {
      setIsSending(false);
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded p-4">
        <WalletMultiButton />
        {connected && !isSending && (
          <button
            onClick={sendToken}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
          >
            Send Tokens
          </button>
        )}
        {isSending && <p>Sending token...</p>}
      </div>
    </div>
  );
};

export default Home;
