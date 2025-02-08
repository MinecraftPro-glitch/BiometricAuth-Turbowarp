class BiometricAuthExtension {
    constructor() {
        this.credentialStorage = {}; // Store multiple credentials in session memory
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
                    text: "Get stored passkey for [NAME]",
                    arguments: {
                        NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" }
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
            this.credentialStorage[username] = credentialId;

            return credentialId; // Returns the passkey so you can store it
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
        return this.credentialStorage[args.NAME] || "";
    }
}

Scratch.extensions.register(new BiometricAuthExtension());
