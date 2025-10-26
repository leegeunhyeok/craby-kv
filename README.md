# craby-sha256

Demo library for [Craby](https://github.com/leegeunhyeok/craby)

## Overview

```rust
// Rust implementation
use kv::{Bucket, Config, Raw, Store};

const BUCKET_NAME: &str = "craby_kv";

pub struct CrabyKv {
    ctx: Context,
    bucket: Option<Bucket<'static, Raw, Raw>>,
}

impl CrabyKv {
    fn get_bucket(&self) -> &Bucket<'static, Raw, Raw> {
        self.bucket.as_ref().expect("Bucket not initialized")
    }
}

impl CrabyKvSpec for CrabyKv {
    fn initialize(&mut self) -> Void {
        let cfg = Config::new(Path::new(&self.ctx.data_path));
        let store = Store::new(cfg).expect("Failed to create store");
        self.bucket = Some(
            store
                .bucket(Some(BUCKET_NAME))
                .expect("Failed to get bucket"),
        );
    }

    fn clear(&mut self) -> Void {
        self.get_bucket().clear().expect("Failed to clear bucket");
    }

    fn contains(&mut self, key: &str) -> Boolean {
        self.get_bucket()
            .contains(&key.to_raw())
            .expect("Failed to check if key exists")
    }

    fn get(&mut self, key: &str) -> Nullable<String> {
        match self.get_bucket().get(&key.to_raw()) {
            Ok(Some(value)) => {
                Nullable::<String>::some(String::from_utf8_lossy(&value).to_string())
            }
            Ok(None) => Nullable::<String>::none(),
            Err(e) => throw!("Failed to get value: {}", e.to_string()),
        }
    }

    fn keys(&mut self) -> Array<String> {
        self.get_bucket()
            .iter()
            .map(|it| {
                let key = it
                    .expect("Failed to get item")
                    .key::<Raw>()
                    .expect("Failed to get key");
                String::from_utf8_lossy(&key).to_string()
            })
            .collect::<Array<String>>()
    }

    fn remove(&mut self, key: &str) -> Void {
        self.get_bucket()
            .remove(&key.to_raw())
            .expect("Failed to remove key");
    }

    fn set(&mut self, key: &str, value: &str) -> Void {
        self.get_bucket()
            .set(&key.to_raw(), &value.to_raw())
            .expect("Failed to set value");
    }

    fn size(&mut self) -> Number {
        self.get_bucket().len() as Number
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
