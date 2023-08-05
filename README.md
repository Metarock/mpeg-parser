# Spalk technical test

This is a simple project that contains sample files and outputs

## Getting Started
For this project, I used pnpm but you may use other packege manager as you pleased.

### To run development
To run the parser we would need to build development environment.  

```
npm run build
#or
yarn build
#or
pnpm build

```

After building, we may use the following command to run the parser in the root of our project

```
cat some_test_file.ts | node build/index.js
```

Or you may simply run it in one command line 

```
npm run build && cat some_test_file.ts | node build/index.js
# or
yarn build && cat some_test_file.ts | node build/index.js
# or 
pnpm build && cat some_test_file.ts | node build/index.js

```

### To run the test

To run the test we may simply 

```
npm run test
#or
yarn test
#or
pnpm test

```
## Techstack Used 
-[Typescript](https://www.typescriptlang.org/docs/) - static type checker; typed Superset of JavaScript <br /> -[Node.js](https://nodejs.org/en/docs) <br />
-[Vitest](https://vitest.dev/guide/) - a unit test framework powered by Vite <br />
-[Prettier](https://prettier.io/docs/en/) - code formatter