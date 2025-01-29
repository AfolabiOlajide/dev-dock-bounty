"use client";
import React from "react";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/conntract";
import { parseEther } from "viem";

export function TippingForm({ creatorAddress }: { creatorAddress: string }) {
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { writeContract } = useWriteContract();

    const handleTip = () => {
        if (!amount) return;
        setIsLoading(true);

        writeContract({
            abi: CONTRACT_ABI,
            address: CONTRACT_ADDRESS,
            functionName: "tipCreator",
            args: [creatorAddress as `0x${string}`],
            value: parseEther(amount),
        });

        setIsLoading(false);
    };

    return (
        <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Send Tip</h3>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in ETH"
                className="border p-2 rounded mr-2"
            />
            <button
                onClick={handleTip}
                disabled={isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
                {isLoading ? "Sending..." : "Send Tip"}
            </button>
        </div>
    );
}
