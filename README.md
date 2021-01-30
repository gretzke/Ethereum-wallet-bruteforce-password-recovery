# Ethereum wallet bruteforce password recovery

This tool helps you recover your password of an Ethereum JSON wallet file. You need to specify possible parts of your password and the tool will try out all possible combinations. It will also remeber which passwords it already checked.

## How to use this tool

1. Make sure you have nodejs and npm installed

2. Install dependencies running `npm install`

3. Specify parts of your password using the password file, put every part on a new line: e.g.

```
abc
123
test
```

4. Place your wallet in the root of this project and name it `wallet.json`
5. Run the script: `node recovery.js`
