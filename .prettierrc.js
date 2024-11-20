module.exports = {
    // We use a larger print width because Prettier's word-wrapping seems to be tuned
    // for plain JavaScript without type annotations
    printWidth: 110,
    singleQuote: false,
    trailingComma: "es5",
    tabWidth: 4,

    plugins: ["prettier-plugin-packagejson", "prettier-plugin-tailwindcss"],
};
