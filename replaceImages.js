const fs = require('fs');

const path = 'main.js';
let content = fs.readFileSync(path, 'utf-8');

let counter = 1;
// We'll replace the default placeholder URL or any URL in the projects array with the local photos path.
// The placeholders look like: "https://via.placeholder.com/600x400/0a1020/2facff?text=..."
// But if they have been touched, they might look different.
const modified = content.replace(/image:\s*".*?"/g, (match) => {
    const res = `image: "./Service & Projects Photos/${counter}.jpg"`;
    counter++;
    return res;
});

fs.writeFileSync(path, modified);
console.log(`Replaced ${counter - 1} images.`);
