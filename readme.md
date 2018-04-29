Clone url content to some dir

## THIS PROJECT IS 【INACTIVE】
This project is not maintained anymore. Please use alternative.

## Install

```
npm install @taluoo/node-clone-url --save
```

## Usage

```
const {clone} = require('@taluoo/node-clone-url');

async function test() {
    let filePath = await clone('https://www.baidu.com/'); // clone(url) return a Promise, which will resolve a file path
    console.log(filePath);
}

test();
```

## TODO

