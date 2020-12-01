# Eslint

### install

- `$ npm install eslint --save-dev`
- `$ npx eslint --init`
- `$ npx eslint ./file_name.js` // check file
- `$ npx eslint ./file_name.js --fix` // fix by eslint

### 配置注释

```javascript
// bellow comment will make eslint ignore this line
const str = "${name} is  a coder"; // eslint-disable-line no-template-curly-in-string
```

### with gulp

```javascript
const script = () => {
  return (
    src("src/assets/scripts/*.js", { base: "src" })
      // gulp-eslint
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      .pipe(plugins.eslint.failAfterError())
      .pipe(plugins.babel({ presets: ["@babel/preset-ent"] }))
      .pipe(dest("temp"))
      .pipe(bs.reload({ stream: true }))
  );
};
```

### with webpack

```javascript
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  // $ npm install eslint-plugin-react
  extends: ["standard", "plufin:react/recommended"],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {},
};


{
    test: /\.js$/,
    exclude: /node_modules/,
    use: 'eslint-loader',
    enforce: 'pre'
}
```

### support ts

```javascript
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["standard"],
  // syntax parser
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ["@typescript-eslint"],
  rules: {},
};
```

# stylelint

- `npm install stylelint -D`
- `.stylelintrc.js`

```javascript
module.export = {
  // npm install stylelint-config-standard
  // npm install stylelint-config-sass-guidelines -D
  extends: ["stylelint-config-standard", "stylelint-config-sass-guidelines"],
};
```

- `npx stylelint ./index.css`

### prettier

- `npm install prettier -D`
- `npx prettier style.css --write`
  - `npx prettier . --write`

### git hooks

- define operations in file `.git/hooks/pre-commit`

```shell
#!/bin/sh
echo "before commit"
```

- use `husky`
  - `$ npm install husky -D`
  - in `package.json` to config `husky`
  - `$ npm install lint-staged -d`

```json
{
  "script": {
    "test": "eslint ./index.js",
    "precommit": "lint-staged"
  },
  "husky": {
    "hooks": {
      // "pre-commit": "npm run test",
      "pre-commit": "npm run precommit"
    }
  },
  "lint-staged": {
    "*.js": ["eslint", "git add"]
  }
}
```
