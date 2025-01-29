"use client";
import React from "react";
import {
    useAccount,
    useWriteContract,
    useReadContract,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/conntract";
import { useState, useEffect } from "react";

export function CreatorRegistration() {
    const { address } = useAccount();
    const [isAlreadyCreator, setIsAlreadyCreator] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const creatorStatus = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "isCreator",
        args: [address as `${string}`],
    });
    console.log(address)
    console.log(creatorStatus)
    const { writeContract } = useWriteContract();

    const register = () => {
        setIsLoading(true);
        writeContract({
            abi: CONTRACT_ABI,
            address: CONTRACT_ADDRESS,
            functionName: "registerCreator",
            args: [],
        });
        setIsLoading(false);
    };

    useEffect(() => {
        if (creatorStatus) {
            setIsAlreadyCreator(true);
        }
    }, [creatorStatus]);

    return (
        <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Creator Registration</h2>
            {!isAlreadyCreator ? (
                <button
                    onClick={() => register()}
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? "Registering..." : "Register as Creator"}
                </button>
            ) : (
                <p className="text-green-500">
                    You are already registered as a creator!
                </p>
            )}
        </div>
    );
}
