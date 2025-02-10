# Biometric Authentication Extension

## Overview
The **Biometric Authentication Extension** adds passkey-based authentication functionality to Scratch projects using WebAuthn. This extension enables user registration with passkeys and authentication using biometric data such as fingerprint or facial recognition.

## To Use
To use the extension download the file **BiometricAuthentication.js** and import it into TurboWarp using the custom Javascript Extension feature. Make sure to check the box "Run without sandbox"

**The extension only works in web browsers if you import this extension into _TurboWarp Desktop App_ it is always going to report an error since it doesn't include _WebAuth_, the block are still going to be visible and you'll be able to code with the extension but the authentication will not work!**


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

