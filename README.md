# Biometric Authentication Extension

## Overview
The **Biometric Authentication Extension** adds passkey-based authentication functionality to Scratch projects using WebAuthn. This extension enables user registration with passkeys and authentication using biometric data such as fingerprint or facial recognition.

## Features
- **Register a Passkey**: Allows users to register a passkey for authentication.
- **Authenticate Users**: Verifies users based on their registered passkey.
- **Retrieve Credential ID**: Fetches a stored credential ID from a list.

## Blocks

### Register Passkey
```plaintext
Register Passkey for [NAME]
```
**Returns:** The credential ID for the registered passkey.

**Example Usage:**
```plaintext
set [credential_id] to (Register Passkey for (username))
```

### Authenticate User
```plaintext
Authenticate [NAME] with passkey [CREDENTIAL_ID]
```
**Returns:** `true` if authentication succeeds, otherwise `false`.

**Example Usage:**
```plaintext
if <Authenticate (username) with passkey (credential_id)> then
  say [Login successful!]
else
  say [Authentication failed]
end
```

### Get Credential ID (THIS DOES NOT WORK, DO NOT USE!!! To authenticate the user, store the credential ID somewhere and then input it directly into the for the authentication using a variable or something)
```plaintext
Get credential ID for [USERNAME] from [LIST]
```
**Returns:** The credential ID associated with the given username from the list.

**Example Usage:**
```plaintext
set [retrieved_id] to (Get credential ID for (username) from (userCredentialList))
```

## Installation
To use this extension, add the JavaScript file to TurboWarp using the **"Load Extension from URL"** feature.

## Requirements
- Browser support for **WebAuthn** (Most modern browsers, including Chrome, Edge, and Firefox).
- TurboWarp or a Scratch modification that allows custom extensions.

## Notes
- This extension does **not** store passkeys persistently; users must manage their credential storage externally.
- If WebAuthn is not supported, an error message will be returned.

## License
This extension is open-source and can be freely modified and distributed.

## Author
Developed for use in Scratch projects to integrate modern authentication methods with passkeys.

