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
                        LIST: { type: Scratch.ArgumentType.STRING, defaultValue: "userCredentialList" }
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
        const listName = args.LIST;

        // Fetch the external list (this could be a cloud variable, custom data structure, etc.)
        const externalList = getExternalList(listName);  // You should provide this method to get the list dynamically

        if (!externalList) {
            return "Error: List not found";
        }

        // Iterate over the list to find the username and retrieve the corresponding credential ID
        for (let i = 0; i < externalList.length; i += 2) {
            const storedUsername = externalList[i];  // Assuming format is Username -> Credential ID -> Username -> Credential ID ...
            const storedCredentialId = externalList[i + 1];

            if (storedUsername === username) {
                return storedCredentialId;  // Return the corresponding credential ID
            }
        }

        return "No passkey found"; // If no matching username is found
    }
}

// Example of how you might fetch the external list of credential IDs
function getExternalList(listName) {
    // Fetch the list from your cloud variable or external source based on the listName
    // Example: You can use cloudData.getVariable() or any other method to fetch the list

    // Placeholder example for testing purposes
    // Replace this with your actual cloud data or external list fetching logic
    if (listName === "userCredentialList") {
        return [
            "user1", "credential-id-1",
            "user2", "credential-id-2",
            "user3", "credential-id-3"
        ];
    } else {
        return null; // If the list name doesn't exist or isn't found
    }
}

Scratch.extensions.register(new BiometricAuthExtension());
