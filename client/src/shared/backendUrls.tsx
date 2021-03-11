const BASE_API_URL = "http://localhost:5000";

const socialAuthURL = "/auth";

export const socialAuthEndpoint = `${BASE_API_URL}${socialAuthURL}`;

export const socialAuthGoogleURL = `${socialAuthEndpoint}/google`;

export const socialAuthFacebookURL = `${socialAuthEndpoint}/facebook`;

export const getUserURL = `${BASE_API_URL}/getuser`;

export const logoutURL = `${BASE_API_URL}/logout`;

export const signupURL = `${BASE_API_URL}/signup`;

export const loginURL = `${BASE_API_URL}/login`;
