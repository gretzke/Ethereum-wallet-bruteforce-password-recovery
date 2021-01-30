const cliProgress = require('cli-progress');
const fs = require('fs');
var path = require('path');
const Wallet = require('ethereumjs-wallet').default;
const { getNumberOfCombinations, permute } = require('./util');

let checkedPasswords = {};
let walletFile;
try {
  walletFile = JSON.parse(fs.readFileSync('wallet.json'));
} catch (e) {
  console.error(e);
  console.error('Failed to load wallet file');
  process.exit(1);
}

if (!fs.existsSync('checked_passwords')) {
  fs.mkdirSync('checked_passwords');
}

const passwordFile = path.join('checked_passwords', walletFile.id);
if (fs.existsSync(passwordFile)) {
  try {
    checkedPasswords = JSON.parse(fs.readFileSync(passwordFile));
  } catch (e) {
    console.error(e);
    console.error('Failed to load password file');
    fs.writeFileSync(passwordFile, JSON.stringify(checkedPasswords));
  }
} else {
  fs.writeFileSync(passwordFile, JSON.stringify(checkedPasswords));
}

const passwords = fs
  .readFileSync('passwords')
  .toString()
  .replace(/\r/g, '')
  .split(/\n/)
  .filter((x) => x !== '');

const numConfirmations = getNumberOfCombinations(passwords.length);
console.log(
  'Trying ' +
    numConfirmations +
    ' different combinations. Generating possible passwords, please wait ...\n'
);

const getAllSubsets = (arr) =>
  arr.reduce(
    (subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])),
    [[]]
  );

const passwordCombinations = getAllSubsets(passwords).slice(1);

checkPasswords();

async function checkPasswords() {
  let i = 0;
  let unix = new Date();

  const bar = new cliProgress.SingleBar(
    {
      format:
        ' {bar} {percentage}% | Time left: {eta}s | {value}/{total} | Trying password: {password}',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );
  bar.start(numConfirmations, 0, {
    password: '',
  });

  for (combination of passwordCombinations) {
    permutedCombination = permute(combination);
    for (password of permutedCombination) {
      try {
        i++;
        bar.update(i, { password: password.join('') });
        if (checkedPasswords[password.join('')]) {
          continue;
        }
        await Wallet.fromV3(walletFile, password.join(''));
        bar.stop();
        console.log(
          '\nPassword found! Your wallet password is:\n' + password.join('')
        );
        return;
      } catch (e) {
        if (e.message !== 'Key derivation failed - possibly wrong passphrase') {
          console.error(e);
          bar.stop();
          return;
        } else {
          checkedPasswords[password.join('')] = true;
          fs.writeFileSync(passwordFile, JSON.stringify(checkedPasswords));
        }
      }
    }
  }
}
