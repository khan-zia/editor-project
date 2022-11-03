## Quick demo at youtube.

I have recorded a 7 minutes demo where I quickly go over the features. Feel free to set playback speed at 1.5x or 2x to save time.

https://youtu.be/H-1UqZRnekw

## How to run the system

I did not commit credentials for my Google's service account. Please make sure to add yours at **`./apps/backend/serviceAccountKey.json`**

- clone the repo
- run `yarn` in the root directory
- run `yarn dev` in the root directory to start both front and backend at the same time.

You can now navigate to [http://localhost:3000](http://localhost:3000) to see the app running.

## Type checking and linting

Run it in all apps from the root by running: `npm run check --workspaces`. You might encounter a few typecheck warnings (about return types) that are from the Slate plugins files that I used.

## Testing

Cypress is used for testing. To visualize tests, install Cypress client or run it headless (in the terminal). To run tests:

- Ensure system is up. Frontend at [http://localhost:3000](http://localhost:3000) and backend at [http://localhost:3001](http://localhost:3001)
- Go to the **`./apps/frontend`** directory and run **`yarn run cypress open`** to run tests via the Cypress client (Chrome or Electron).
- Go to the **`./apps/frontend`** directory and run **`yarn run cypress run`** to run tests in the terminal.

### About tests

I have used JSON Schema based validation. There wasn't much in this test project but basically schema validation when combined with Cypress, allows you to assert against the **exact server response** e.g. object structure, data types or regex patterns for certain values. I have also used snapshots. It stores server response's exact payload as a snapshot for a particular request and then in all subsequent tests, asserts that the payload didn't change.

## General

You might wanna skip spending time at **`./apps/frontend/src/plate`** as that folder contains about two dozen plugins for Slate that I used to achieve the desired features such as retain format when copy pasting to and from Google docs.
