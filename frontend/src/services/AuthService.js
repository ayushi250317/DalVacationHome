import { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { SRPClient, calculateSignature, getNowString } from 'amazon-user-pool-srp-client';
import { jwtDecode } from "jwt-decode";
import config from './config.json';

export const cognitoClient = new CognitoIdentityProviderClient({
    region: config.region
})

const userPoolId = config.userPoolId.split('_')[1];
const srp = new SRPClient(userPoolId);

export const signUp = async (email, password, first_name, last_name, sec_q, sec_a, cc_key, userType) => {
    const params = {
        ClientId: config.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                "Name": "email",
                "Value": email
            },
            {
                "Name": "given_name",
                "Value": first_name
            },
            {
                "Name": "family_name",
                "Value": last_name
            },
            {
                "Name": "custom:sec_question",
                "Value": sec_q
            },
            {
                "Name": "custom:sec_question_answer",
                "Value": sec_a
            },
            {
                "Name": "custom:caesar_cipher_key",
                "Value": cc_key
            },
            {
                "Name": "custom:user_type",
                "Value": userType
            }
        ],
    };

    try {
        const command = new SignUpCommand(params);
        const response = await cognitoClient.send(command);
        console.log("SignUp success!");
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const login = async (email, password) => {
    const params = {
        AuthFlow: "CUSTOM_AUTH",
        ClientId: config.clientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SRP_A: srp.calculateA(),
        },
        AuthChallengeParameters: {
            CHALLENGE_NAME: "SRP_A",
        },
        // UserPoolId: config.userPoolId
    };

    try {
        const command = new InitiateAuthCommand(params);
        const response = await cognitoClient.send(command);
        const { ChallengeName, ChallengeParameters, Session } = response;
        const authChallengeResponse = login1FAResponseToAuthChallenge(Session, email, password, ChallengeName, ChallengeParameters);
        return authChallengeResponse;
    } catch (error) {
        console.log("Error logging in: ", error);
        throw error;
    }
}

export const login1FAResponseToAuthChallenge = async (session, email, password, challengeName, challengeParameters) => {
    const hkdf = srp.getPasswordAuthenticationKey(challengeParameters.USER_ID_FOR_SRP, password, challengeParameters.SRP_B, challengeParameters.SALT);
    const dateNow = getNowString();
    const signatureString = calculateSignature(hkdf, userPoolId, challengeParameters.USER_ID_FOR_SRP, challengeParameters.SECRET_BLOCK, dateNow);
    const command = new RespondToAuthChallengeCommand({
        ClientId: config.clientId,
        ChallengeName: "PASSWORD_VERIFIER",
        ChallengeResponses: {
            USERNAME: challengeParameters.USER_ID_FOR_SRP,
            PASSWORD_CLAIM_SIGNATURE: signatureString,
            PASSWORD_CLAIM_SECRET_BLOCK: challengeParameters.SECRET_BLOCK,
            TIMESTAMP: dateNow,
        },
        Session: session,
    });

    try {
        const response = await cognitoClient.send(command);
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const securityQuestionAuthChallenge = async (username, session, answer) => {
    const command = new RespondToAuthChallengeCommand({
        ClientId: config.clientId,
        ChallengeName: "CUSTOM_CHALLENGE",
        ChallengeResponses: {
            USERNAME: username,
            ANSWER: answer
        },
        Session: session
    });

    try {
        const response = await cognitoClient.send(command);
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const caesarCipherAuthChallenge = async (username, session, answer) => {
    const command = new RespondToAuthChallengeCommand({
        ClientId: config.clientId,
        ChallengeName: "CUSTOM_CHALLENGE",
        ChallengeResponses: {
            USERNAME: username,
            ANSWER: answer
        },
        Session: session
    });

    try {
        const response = await cognitoClient.send(command);
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const confirmLogin = async (threeFAResponse) => {
    const { AuthenticationResult } = threeFAResponse;
    console.log(AuthenticationResult);
    if (AuthenticationResult) {
        sessionStorage.setItem("idToken", AuthenticationResult.IdToken || '');
        sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || '');
        sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || '');
        console.log("Login tokens added to session storage.")
        if (AuthenticationResult.IdToken !== '') {
            const payload = jwtDecode(AuthenticationResult.IdToken);
            console.log(payload);
            sessionStorage.setItem("userType", payload["custom:user_type"])
            sessionStorage.setItem("given_name", payload.given_name || '');
            sessionStorage.setItem("family_name", payload.family_name || '');
            sessionStorage.setItem("email", payload.email || "");
        }
        window.dispatchEvent(new Event('authChange'));
        try {
          const response = await fetch(
            "https://us-central1-activity-2-f4bb7.cloudfunctions.net/captureLoginEvent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userEmail: sessionStorage.getItem("email"),
                loginTime: new Date().toString(),
              }),
            }
          );
    
          if (!response.ok) {
            throw new Error("Failed to capture login event");
          }
    
          console.log("Login event captured successfully.");
        } catch (error) {
          console.error("Error capturing login event:", error);
          // Optionally handle or display an error message to the user
        }
    }
}

export const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
}
