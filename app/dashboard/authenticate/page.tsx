'use client'

import '@root/global.scss';

import React, { useEffect, useState } from 'react';
import { FormHeading } from '@root/components/ui/typography/forms';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import { useUser } from '@root/context/UserContext';
import SignInWithWeb3 from '@root/components/ui/signin/SignInWithWeb3';
import SuccessScreen from '@root/components/ui/success/SuccessScreen';
import { useCeramicContext } from '@root/context/CeramicContext';
import { authenticateCeramic } from '@root/scripts/authenticate';
import AuthPrompt from "./did-select-popup"

export default function AuthenticateProvider(props){

    const { user } = useUser();
    const clients = useCeramicContext(); 
    const { ceramic, composeClient } = clients;
    // const router = useRouter(); 

    // handles ceramic authentication:
    const handleCeramicAuthentication = async () => {
        try {
            await authenticateCeramic(ceramic, composeClient);

            // Redirect or update state based on successful authentication
            console.log("Ceramic authentication successful");

        } catch(error){
            console.error("Authentication failed! ", error);
        }
    };

    // check if all ready logged in when component mounts:
    useEffect(() => {
        if (localStorage.getItem("logged_in")){
            handleCeramicAuthentication();
        }
    }, []);

    return (
        <div>
            {user ? (
                <SuccessScreen message="You've successfully signed in!" />
            ) : (
                <>
                <h2>Sign In With Web3</h2>
                <ThirdwebSDKProvider activeChain="ethereum" clientId="6c008bdcd6760736ab3ffcd4deb713dd">
                    <SignInWithWeb3 />
                </ThirdwebSDKProvider>
                <AuthPrompt/>
                </>
            )}
        </div>
    );
}