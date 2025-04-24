//#Name - Biometric Authentication 
//#Author - Maxolain1020
//#Version - 2.5



class BiometricAuthExtension {
    getInfo() {
        return {
            id: "biometricAuth",
            name: "Biometric Auth",
            blocks: [
                {
                    opcode: "register",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Register Passkey for [NAME]",
                    arguments: {
                        NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" }
                    }
                },
                {
                    opcode: "authenticate",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "Authenticate [NAME] with passkey [CREDENTIAL_ID]",
                    arguments: {
                        NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" },
                        CREDENTIAL_ID: { type: Scratch.ArgumentType.STRING, defaultValue: "" }
                    }
                },
                {
                    opcode: "getCredentialId",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Get credential ID for [USERNAME] from [LIST]",
                    arguments: {
                        USERNAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" },
                        LIST: {
                            type: Scratch.ArgumentType.LIST,
                            defaultValue: "userCredentialList"
                        }
                    }
                }
            ]
        };
    }

    async register(args) {
        if (!window.PublicKeyCredential) {
            return "WebAuthn not supported";
        }

        const username = args.NAME;
        if (!username) return "Error: Username required";

        try {
            let credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rp: { name: "TurboWarp" },
                    user: {
                        id: new Uint8Array(16),
                        name: username,
                        displayName: username
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: { userVerification: "required" }
                }
            });

            let credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

            return credentialId; // Return the credential ID that was created
        } catch (error) {
            return "Error: " + error.message;
        }
    }

    async authenticate(args) {
        if (!window.PublicKeyCredential) {
            return false;
        }

        const username = args.NAME;
        const credentialId = args.CREDENTIAL_ID;

        if (!credentialId) {
            return false;
        }

        try {
            let credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    allowCredentials: [
                        {
                            type: "public-key",
                            id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0))
                        }
                    ],
                    timeout: 60000,
                    userVerification: "required"
                }
            });

            return true; // Authentication successful
        } catch (error) {
            return false;
        }
    }

    getCredentialId(args) {
        const username = args.USERNAME;
        const list = args.LIST;

        // Check the list format
        console.log("List:", list);
        console.log("Searching for username:", username);

        // Iterate through the list, assuming the format [Username, Credential ID, Username, Credential ID, ...]
        for (let i = 1; i <= list.length; i += 2) {
            const storedUsername = list[i - 1]; // Username
            const storedCredentialId = list[i];  // Credential ID

            console.log(`Checking: ${storedUsername} -> ${storedCredentialId}`);

            if (storedUsername === username) {
                console.log("Found:", storedCredentialId);
                return storedCredentialId; // Return the matching credential ID
            }
        }

        console.log("No match found.");
        return "No passkey found"; // If no matching username is found
    }
}

Scratch.extensions.register(new BiometricAuthExtension());
