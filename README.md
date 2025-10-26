# craby-sha256

Demo library for [Craby](https://github.com/leegeunhyeok/craby)

## Overview

```rust
// Rust implementation
use sha2::{Digest, Sha256};

impl CrabySha256Spec for CrabySha256 {
    fn digest(&mut self, data: &str) -> String {
        format!("{:x}", Sha256::digest(data.as_bytes()))
    }
}
```

```ts
// Usage
import { KV } from 'craby-kv';


KV.initialize();
KV.set('key', 'Hello, world!');
KV.get('key'); // 'Hello, world!'
KV.contains('key'); // true
KV.keys(); // ['key']
KV.size(); // 1
KV.remove('key');
KV.clear();
```

<img alt="preview" width="300" src="./preview.png">

## Installation

```bash
npm install craby-kv
```

## License

[MIT](LICENSE)
