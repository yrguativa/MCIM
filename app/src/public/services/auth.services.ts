import axios from "axios";
import { LoginOtherDataInput } from "../schemas/loginOtherDataSchemta";

const API_URL = process.env.API_BASE_URL  || 'http://localhost:3000/graphql';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
});

export class AuthService {
    async login(email: string, password: string) {
        try {
            const query = `
                mutation Login($loginInput: LoginInput!) {
                    login(loginInput: $loginInput) {
                        access_token
                        user {
                            id
                            email
                            displayName
                            photoURL
                            identification
                            ministryId
                            phoneNumber
                            authProvider
                            createdAt
                            lastLogin
                            active
                        }
                    }
                }
            `;

            const { data } = await api.post(query, {
                loginInput: { email, password }
            });

            this.setToken(data.data.login.access_token);
            return data.login;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async loginWithGoogle(credential: string) {
        try {
            const query = `
            mutation LoginSocial($loginSocialInput: LoginSocialInput!) {
                loginSocial(loginSocialInput: $loginSocialInput) {
                    identification
                    ministryId
                    phoneNumber
                    roles
                    displayName
                    photoURL
                    accessToken
                    id
                }
            }
            `;

            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        "loginSocialInput": {
                            "credential": credential,
                        }
                    }
                }),
            );

            this.setToken(data.data.loginSocial.accessToken);
            return data;
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    }

    async loginWithApple(appleData: {
        email: string,
        displayName: string,
        photoURL: string,
        identification: string,
        ministryId: string,
        phoneNumber: string
    }) {
        try {
            const query = `
                mutation SocialAuth($socialAuthInput: SocialAuthInput!) {
                    socialAuth(socialAuthInput: $socialAuthInput) {
                        access_token
                        user {
                            id
                            email
                            displayName
                            photoURL
                            identification
                            ministryId
                            phoneNumber
                            authProvider
                            createdAt
                            lastLogin
                            active
                        }
                    }
                }
            `;

            const data = await api.post(query, {
                socialAuthInput: {
                    ...appleData,
                    provider: 'apple'
                }
            });

            this.setToken(data.data.socialAuth.access_token);
            return data.data.socialAuth;
        } catch (error) {
            console.error('Apple login error:', error);
            throw error;
        }
    }

    async register(userData: {
        email: string
        password: string
        identification: string
        ministryId: string
        phoneNumber: string
    }) {
        try {
            const query = `
                mutation Register($registerInput: RegisterInput!) {
                    register(registerInput: $registerInput) {
                        access_token
                        user {
                            id
                            email
                            displayName
                            photoURL
                            identification
                            ministryId
                            phoneNumber
                            authProvider
                            createdAt
                            lastLogin
                            active
                        }
                    }
                }
            `;

            const data = await api.post(query, {
                registerInput: userData
            });

            this.setToken(data.data.register.access_token);
            return data.data.register;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    async updateUser(id: string, otherData: LoginOtherDataInput) {
        try {
            const query = `
            mutation RegisterSocialLogin($registerSocialLoginInput: RegisterSocialLoginInput!) {
                registerSocialLogin(RegisterSocialLoginInput: $registerSocialLoginInput) {
                    createdAt
                }
            }
            `;

            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        "registerSocialLoginInput": {
                            id,
                            ...otherData
                        }
                    }
                }),
            );

            return !data.error ? 1 : 0;

        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const query = `
                query Me {
                    me {
                        id
                        email
                        displayName
                        photoURL
                        identification
                        ministryId
                        phoneNumber
                        authProvider
                        createdAt
                        lastLogin
                        active
                    }
                }
            `;

            const data = await api.post(query);
            return data.data.me;
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('access_token')
    }

    private setToken(token: string) {
        localStorage.setItem('access_token', token)
    }
}
