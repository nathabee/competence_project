'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@shared/context/AuthContext';
import { loginUser } from '@shared/api/auth';
export function Login({ onSuccess, redirectUrl = '/home', defaultUsername = '', defaultPassword = '', }) {
    const { login, token } = useAuth();
    const [username, setUsername] = useState(defaultUsername);
    const [password, setPassword] = useState(defaultPassword);
    const [errorMessage, setErrorMessage] = useState(null);
    // ✅ Redirect if already logged in
    useEffect(() => {
        if (token) {
            window.location.href = redirectUrl;
        }
    }, [token, redirectUrl]);
    const handleLogin = async (e) => {
        var _a;
        e === null || e === void 0 ? void 0 : e.preventDefault();
        try {
            const { token, userInfo } = await loginUser(username, password);
            login(token, userInfo);
            if (onSuccess) {
                onSuccess();
            }
            else {
                window.location.href = redirectUrl;
            }
        }
        catch (error) {
            const code = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status;
            setErrorMessage(code === 401 ? 'Invalid username or password' : 'Connection error');
        }
    };
    return (React.createElement("div", { className: "d-flex justify-content-center align-items-center min-vh-100" },
        React.createElement("div", { className: "card", style: { maxWidth: '400px', width: '100%' } },
            React.createElement("div", { className: "card-body" },
                React.createElement("h5", { className: "card-title text-center mb-4" }, "Login"),
                errorMessage && React.createElement("div", { className: "alert alert-danger" }, errorMessage),
                React.createElement("form", { onSubmit: handleLogin },
                    React.createElement("div", { className: "mb-3" },
                        React.createElement("label", { htmlFor: "username", className: "form-label" }, "Identifiant"),
                        React.createElement("input", { type: "text", id: "username", className: "form-control", placeholder: "Identifiant", required: true, autoComplete: "username", value: username, onChange: (e) => setUsername(e.target.value) })),
                    React.createElement("div", { className: "mb-3" },
                        React.createElement("label", { htmlFor: "password", className: "form-label" }, "Mot de passe"),
                        React.createElement("input", { type: "password", id: "password", className: "form-control", placeholder: "Mot de passe", required: true, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value) })),
                    React.createElement("button", { type: "submit", className: "btn btn-primary w-100" }, "Login"))))));
}
