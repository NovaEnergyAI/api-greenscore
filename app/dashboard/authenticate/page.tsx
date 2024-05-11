'use client'

import '@root/global.scss';

import React, { useEffect } from 'react';

import { FormHeading } from '@root/components/ui/typography/forms';
import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import { useUser } from '@root/components/context/UserContext';
import SignInWithWeb3 from '@root/components/ui/signin/SignInWithWeb3';
import SuccessScreen from '@root/components/ui/success/SuccessScreen';


export default function AuthenticateProvider(props){

    const { user } = useUser();
    const router = useRouter(); 

    // Automatically navigate to the "Add Asset" page after a successful sign-in:
    useEffect(() => {
        if(user){
            const timer = setTimeout(() => {
                router.push('/dashboard/add-asset');
            }, 3000); // Delay nav for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [user, router]);

    return (
        <div>
            {user ? (
                <SuccessScreen message="You have successfully signed in!" />
            ) : (
                <>
                <FormHeading>Sign In</FormHeading>
                <ThirdwebSDKProvider activeChain="ethereum" clientId="6c008bdcd6760736ab3ffcd4deb713dd">
                    <SignInWithWeb3 />
                </ThirdwebSDKProvider>
                </>
            )}
        </div>
    );
}