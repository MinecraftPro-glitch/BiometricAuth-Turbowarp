class BiometricAuthExtension {
    constructor() {
        this.credentialStorage = {}; // Temporarily store credentials in memory for session
    }

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
                    text: "Get stored passkey for [NAME] from [SOURCE]",
                    arguments: {
                        NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" },
                        SOURCE: { type: Scratch.ArgumentType.STRING, defaultValue: "cloud" } // Default to cloud variable
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
            this.credentialStorage[username] = credentialId; // Save it in the session memory

            return credentialId; // Return the created credential ID
        } catch (error) {
            return "Error: " + error.message;
        }
    }

    async authenticate(args) {
        if (!window.PublicKeyCredential) {
            return false;
        }

        const username = args.NAME;
        let credentialId = args.CREDENTIAL_ID || this.credentialStorage[username];

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
        const username = args.NAME;
        const source = args.SOURCE.toLowerCase();

        // Check the source
        if (source === "cloud") {
            // Fetch from TurboWarp cloud variable (example logic)
            return this.fetchFromCloud(username); // Implement fetching from your cloud variable
        } else if (source === "list") {
            // Fetch from a custom list if that's the source
            return this.fetchFromList(username); // Implement custom list fetching logic
        } else {
            // Default to session memory storage
            return this.credentialStorage[username] || "";
        }
    }

    fetchFromCloud(username) {
        // Implement the logic to fetch from your cloud variable (TurboWarp Cloud Data or custom)
        // You can replace this with your actual cloud fetch logic.
        // For example, fetch using your server or WebSocket API.
        return "cloud-fetched-credential-id"; // Replace with actual logic
    }

    fetchFromList(username) {
        // Implement the logic to fetch from a custom list.
        // This can be from a local list or any external data structure you use.
        return "list-fetched-credential-id"; // Replace with actual logic
    }
}

Scratch.extensions.register(new BiometricAuthExtension());
