// All password analysis happens here, in the browser only.
// The password is never logged, stored or sent anywhere.

// Obviously common or easy-to-guess patterns.
const COMMON_PATTERNS = [
  "123456",
  "12345678",
  "123456789",
  "password",
  "qwerty",
  "azerty",
  "abc123",
  "letmein",
  "admin",
  "welcome",
  "iloveyou",
  "monkey",
  "dragon",
  "football",
  "princess",
  "sunshine",
];

// Strength levels, ordered from weakest to strongest.
export const STRENGTH_LEVELS = [
  "Very Weak",
  "Weak",
  "Medium",
  "Strong",
  "Very Strong",
];

// Small note so we never over-promise what the score really means.
export const SCORE_DISCLAIMER =
  "This score is an educational estimate based on length and character variety. It does not guarantee resistance against real-world cracking attacks.";

// Returns true when the password repeats the same character
// three times or more in a row (for example "aaa" or "1111").
function hasRepeatedCharacters(password) {
  return /(.)\1{2,}/.test(password);
}

// Returns true when the password contains an easy sequence
// such as "abcd", "1234" or "4321".
function hasSequentialCharacters(password) {
  const lower = password.toLowerCase();

  for (let index = 0; index < lower.length - 2; index += 1) {
    const first = lower.charCodeAt(index);
    const second = lower.charCodeAt(index + 1);
    const third = lower.charCodeAt(index + 2);

    // Forward sequence like "abc" or "123".
    if (second - first === 1 && third - second === 1) {
      return true;
    }

    // Backward sequence like "cba" or "321".
    if (first - second === 1 && second - third === 1) {
      return true;
    }
  }

  return false;
}

// Returns true when the password contains a well-known word
// such as "password" or "qwerty".
function hasCommonPattern(password) {
  if (password.length === 0) {
    return false;
  }

  const lower = password.toLowerCase();
  return COMMON_PATTERNS.some((pattern) => lower.includes(pattern));
}

// Checks the password against every requirement and returns the results.
// Each item also carries a short reason used in the explanation list.
export function getRequirements(password) {
  const isRepeated = hasRepeatedCharacters(password);
  const isSequential = hasSequentialCharacters(password);
  const isCommon = hasCommonPattern(password);

  return [
    {
      id: "length-8",
      label: "At least 8 characters",
      met: password.length >= 8,
      reason: "Too short - use at least 8 characters",
    },
    {
      id: "length-12",
      label: "At least 12 characters",
      met: password.length >= 12,
      reason: "Still short - 12 or more characters is much safer",
    },
    {
      id: "uppercase",
      label: "Contains an uppercase letter",
      met: /[A-Z]/.test(password),
      reason: "Missing an uppercase letter (A-Z)",
    },
    {
      id: "lowercase",
      label: "Contains a lowercase letter",
      met: /[a-z]/.test(password),
      reason: "Missing a lowercase letter (a-z)",
    },
    {
      id: "number",
      label: "Contains a number",
      met: /[0-9]/.test(password),
      reason: "Missing a number (0-9)",
    },
    {
      id: "special",
      label: "Contains a special character",
      met: /[^A-Za-z0-9]/.test(password),
      reason: "Missing a special character (!, @, #, $ ...)",
    },
    {
      id: "no-predictable-pattern",
      label: "Avoids predictable patterns (123456, password, qwerty)",
      met: password.length > 0 && !isCommon && !isSequential,
      reason: isCommon
        ? 'Contains a common word such as "password" or "123456"'
        : 'Contains a predictable sequence such as "abcd" or "1234"',
    },
    {
      id: "no-repeats",
      label: "Avoids repeated characters (aaa, 111)",
      met: password.length > 0 && !isRepeated,
      reason: "Uses the same character three or more times in a row",
    },
  ];
}

// Turns the requirement results into a score from 0 to 5.
// Kept for the simple strength bar.
export function getScore(requirements) {
  return requirements.filter((requirement) => requirement.met).length;
}

// Turns the requirements into a 0 to 100 security score.
// Each requirement adds a share of the total, and a bonus rewards length.
export function getSecurityScore(password, requirements) {
  if (password.length === 0) {
    return 0;
  }

  // Every requirement is worth the same share of the total.
  const metCount = requirements.filter((requirement) => requirement.met).length;
  const baseScore = (metCount / requirements.length) * 100;

  // Small extra bonus for very long passwords (up to 10 more points).
  const lengthBonus = Math.min(Math.max(password.length - 12, 0) * 1.5, 10);

  return Math.min(Math.round(baseScore + lengthBonus), 100);
}

// Returns the label that matches a 0 to 100 score.
export function getScoreLabel(score) {
  if (score === 0) {
    return "No password";
  }
  if (score < 25) {
    return STRENGTH_LEVELS[0];
  }
  if (score < 45) {
    return STRENGTH_LEVELS[1];
  }
  if (score < 65) {
    return STRENGTH_LEVELS[2];
  }
  if (score < 85) {
    return STRENGTH_LEVELS[3];
  }
  return STRENGTH_LEVELS[4];
}

// Builds the "why is it weak" explanation list.
// Unmet requirements become problems, met ones become positive notes.
export function getFeedback(password, requirements) {
  if (password.length === 0) {
    return { problems: [], positives: [] };
  }

  const problems = requirements
    .filter((requirement) => !requirement.met)
    .map((requirement) => requirement.reason);

  const positives = requirements
    .filter((requirement) => requirement.met)
    .map((requirement) => `${requirement.label} - good`);

  return { problems, positives };
}

// Kept for backwards compatibility: returns only the unmet reasons.
export function getSuggestions(password, requirements) {
  return getFeedback(password, requirements).problems;
}

// Character sets used by the generator.
const CHARACTER_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  special: "!@#$%^&*()-_=+[]{};:,.?/",
};

// Picks one random character from a string using the browser crypto API.
// crypto.getRandomValues is far less predictable than Math.random.
function randomCharacter(characters) {
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  return characters[randomValues[0] % characters.length];
}

// Generates a strong password, completely in the browser.
// Returns an empty string when no character type was selected.
export function generatePassword(options) {
  const { length, uppercase, lowercase, numbers, special } = options;

  // Collect the character sets the user asked for.
  const selectedSets = [];
  if (uppercase) selectedSets.push(CHARACTER_SETS.uppercase);
  if (lowercase) selectedSets.push(CHARACTER_SETS.lowercase);
  if (numbers) selectedSets.push(CHARACTER_SETS.numbers);
  if (special) selectedSets.push(CHARACTER_SETS.special);

  if (selectedSets.length === 0) {
    return "";
  }

  const allCharacters = selectedSets.join("");
  const result = [];

  // Start with one character from each selected set so every chosen
  // type is guaranteed to appear in the generated password.
  selectedSets.forEach((set) => {
    result.push(randomCharacter(set));
  });

  // Fill the rest with random characters from every selected set.
  while (result.length < length) {
    result.push(randomCharacter(allCharacters));
  }

  // Shuffle the characters so the guaranteed ones are not always first.
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const swapIndex = randomValues[0] % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result.slice(0, length).join("");
}
