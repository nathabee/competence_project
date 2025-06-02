import React from 'react';
type Props = {
    onSuccess?: () => void;
    redirectUrl?: string;
    defaultUsername?: string;
    defaultPassword?: string;
};
export declare function Login({ onSuccess, redirectUrl, defaultUsername, defaultPassword, }: Props): React.JSX.Element;
export {};
