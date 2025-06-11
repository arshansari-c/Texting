import {ConfirmList} from '../../models/confirmUser.model.js';

// Generate a 6-digit unique code
const generate6DigitCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Ensure uniqueness within ConfirmList
export const VerifyId = async () => {
  let code, exists;
  do {
    code = generate6DigitCode();
    exists = await ConfirmList.findOne({ VerifyId: code });
  } while (exists);
  return code;
};

export const VerificationCode = async () => {
  let code, exists;
  do {
    code = generate6DigitCode();
    exists = await ConfirmList.findOne({ VerificationCode: code });
  } while (exists);
  return code;
};
