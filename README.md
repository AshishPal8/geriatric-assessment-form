# Geriatric Care Assessment Form

A one-page form a visiting nurse fills in when checking on an elderly patient at home.
Built with React 19, TypeScript, Mantine, `@mantine/form` and Zod 4.

**Live demo:** 

All patient data in this repo is invented.

## Running it

Requires Node 24 and Yarn 4 (via Corepack).

```bash
corepack enable
yarn install
yarn dev      # http://localhost:5173
yarn test     # format, lint, typecheck, tests and build
yarn vitest   # tests only
```

## Where things are

```
src/features/assessment/
  schema.ts                 Zod schema from the brief (unchanged rules and messages)
  sampleAssessment.ts       Valid fixture used by "Load sample patient" and the tests
  AssessmentForm.tsx        The form
  schema.test.ts            Age boundary: exactly 60 vs one day short
  AssessmentForm.test.tsx   Load sample, submit, save handler gets the parsed values
src/App.tsx                 Renders the form with a fake 800ms save
```

## Decisions

- **Form values vs `Assessment`.** Empty inputs do not fit `Assessment` (a blank `NumberInput` is `''`, a blank `Select` or `DateInput` is `null`, consent starts as `false`). `AssessmentFormValues` is a mapped type derived from `Assessment`, so there is no second hand-written interface and it follows the schema if fields change.
- **Parsed output.** `schemaResolver` only returns errors, so `transformValues` runs `assessmentSchema.parse`. Mantine calls it only after validation passes, so the submit handler receives the Zod output (for example trimmed strings), typed as `Assessment`.
- **No clamping.** Both `NumberInput`s use `clampBehavior="none"`, so a typed 105 stays 105 and the schema rejects it instead of the input silently changing it.
- **Cross-field errors.** In Zod 4 the `.refine()` checks only run once the field-level checks pass. A blank form shows exactly 9 "required" errors; the age, review date and polypharmacy errors show after the rest of the form is valid.
- **Consent checkbox.** The label is "Consent" with "Patient or representative has given consent" as its description, so both texts from the brief are shown.
- **Mobility labels** are generated from `MOBILITY` (`home_visit` becomes "Home visit"), so adding a value to the array is the only edit needed.
- **Template cleanup.** Removed the router, demo page and demo components (routing is out of scope). With the demo CSS gone there are no `.css` files left, so the `stylelint` script has `--allow-empty-input`; the stylelint config itself is unchanged.

## Time spent

## Time spent

About 1.5 hours, including setup and deployment.

## Not done / next steps


