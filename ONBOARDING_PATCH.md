# Onboarding Screens — How to wire up Firebase saving

All 14 existing onboarding screens (NameDOBScreen, GenderScreen, etc.) already have good UI.
You only need to add 3 things to each:

## Pattern to apply to every onboarding screen

```js
// 1. Import the hook at the top
import { useOnboarding } from '../../hooks/useOnboarding';

// 2. Inside the component
const { save, loading, savedProfile } = useOnboarding();

// 3. On the "Continue" / "Next" button press, before navigation.navigate():
await save({ fieldName: value });
```

## Screen-by-screen field names

| Screen | Fields to save |
|--------|----------------|
| NameDOBScreen | `{ name, dob }` |
| GenderScreen | `{ gender }` |
| USLocationScreen | `{ usState, usCity }` |
| IndiaOriginScreen | `{ indiaState, district }` |
| ReligionScreen | `{ religion, caste, subCaste, gothram }` |
| EducationScreen | `{ education, college }` |
| VisaScreen | `{ visaStatus, occupation, employer, annualIncome }` |
| FamilyScreen | `{ familyType, familyStatus, fatherOccupation, motherOccupation, siblings }` |
| HoroscopeScreen | `{ horoscope: { star, rashi, manglik, birthTime, birthPlace } }` |
| DietScreen | `{ diet, drinking, smoking }` |
| PhotosScreen | Already rewritten (see `src/screens/profile/PhotosScreen.js`) |
| AboutScreen | `{ about }` |
| PreferencesScreen | `{ preferences: { ageMin, ageMax, visaStatus, caste, indiaState, diet } }` |
| VerifyScreen | Already rewritten (see `src/screens/profile/VerifyScreen.js`) |

## Prefill from saved profile (resume support)

If the user closes the app mid-onboarding:
```js
const { savedProfile } = useOnboarding();
// Use savedProfile.name as defaultValue for text inputs
// Use savedProfile.gender as default selected option, etc.
```

## Disable button while saving
```js
<Primary
  label="Continue"
  onPress={handleContinue}
  disabled={loading}  // disable while Firestore write is in progress
/>
```
