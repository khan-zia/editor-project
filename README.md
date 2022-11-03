## Quick demo at youtube.

## How to run the system

I did not commit credentials for my Google's service account. Please make sure to add yours at **`./apps/backend/serviceAccountKey.json`**

- clone the repo
- run `yarn` in the root directory
- run `yarn dev` in the root directory to start both front and backend at the same time.

You can now navigate to [http://localhost:3000](http://localhost:3000) to see the app running.

## Type checking and linting

Each app has a `check` script that runs the linting and typechecking. Run it in all apps from the root by running: `npm run check --workspaces`.
