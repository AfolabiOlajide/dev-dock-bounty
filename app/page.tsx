"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/conntract";
import { CustomConnectButton } from "@/components/ConnectButton";
import { CreatorRegistration } from "@/components/CreatorRegisteration";
import { TippingForm } from "@/components/TippingForm";

export default function Home() {
    const [creators, setCreators] = useState<string[]>([]);

    const creatorList = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getAllCreators",
    });

    console.log(creatorList.data)

    useEffect(() => {
        if (creatorList.data) {
            setCreators(creatorList as unknown as string[]);
        }
    }, [creatorList]);

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        Creator Tipping Platform
                    </h1>
                    <CustomConnectButton />
                </div>

                <CreatorRegistration />

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">
                        Registered Creators
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {creators && creators?.map((creator) => (
                            <div
                                key={creator}
                                className="border p-4 rounded-lg"
                            >
                                <p className="font-mono mb-2">{creator}</p>
                                <TippingForm creatorAddress={creator} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
