## [0.8.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.7.0...v0.8.0) (2022-09-19)


### Bug Fixes

* ios native module ([cc7e435](https://github.com/FigurePOS/react-native-local-server/commit/cc7e435c19b35a1759443d167c0281b92d7830fe))

## [0.7.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.6.1...v0.7.0) (2022-09-19)


### Features

* TCPServer get connection ids method ([#17](https://github.com/FigurePOS/react-native-local-server/issues/17)) ([99083d7](https://github.com/FigurePOS/react-native-local-server/commit/99083d7d7f3f9c4f1851c96408227f1ec643c9b7))


### Bug Fixes

* status events and received messages are logged just once ([#15](https://github.com/FigurePOS/react-native-local-server/issues/15)) ([3fa9b53](https://github.com/FigurePOS/react-native-local-server/commit/3fa9b5341de5e70448e463b75b9c3cb26bdb696b))


### Refactoring

* iOS native TCP module refactored - reject promises instead of using events ([#16](https://github.com/FigurePOS/react-native-local-server/issues/16)) ([233bc43](https://github.com/FigurePOS/react-native-local-server/commit/233bc43da15f4feeead78a3be0dfc16cce355e74))

### [0.6.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.6.0...v0.6.1) (2022-09-14)


### Features

* log status event ([3132bf6](https://github.com/FigurePOS/react-native-local-server/commit/3132bf611aed68f19374d35a6ea0205a0ec84f3d))
* restart function for MessagingServer and MessagingClient ([ba8494a](https://github.com/FigurePOS/react-native-local-server/commit/ba8494ac11ba16ccaa4c4642fa822ac44a8c8729))


### Refactoring

* improve logger messages ([5f609ca](https://github.com/FigurePOS/react-native-local-server/commit/5f609caeba5bb8af7bf588e1e07fbcb790e99423))
* improve ping configuration ([9290b4a](https://github.com/FigurePOS/react-native-local-server/commit/9290b4a4008e3095b46ba52e3063fc0f27dfa31a))


### Tests

* Android tests for network edge cases ([8f3ce25](https://github.com/FigurePOS/react-native-local-server/commit/8f3ce25d768e009bfdf30ec58c147e6b6fc04d16))

## [0.6.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.5.5...v0.6.0) (2022-09-12)


### Features

* reason on stopped events ([#14](https://github.com/FigurePOS/react-native-local-server/issues/14)) ([3f26fb7](https://github.com/FigurePOS/react-native-local-server/commit/3f26fb7dba1a11c2b91d86ebf222f806446b7de8))

### [0.5.5](https://github.com/FigurePOS/react-native-local-server/compare/v0.5.4...v0.5.5) (2022-09-09)


### Features

* logger verbosity ([d63aba7](https://github.com/FigurePOS/react-native-local-server/commit/d63aba7a68efa09e5e8f3743ddc1acf2839036ca))


### Bug Fixes

* fromEvent throwing a warning ([441da99](https://github.com/FigurePOS/react-native-local-server/commit/441da99ff0323e874c1f7a0111f35a9663e8196b))
* stop messaging client on ping timeout ([29e47ff](https://github.com/FigurePOS/react-native-local-server/commit/29e47ff7eee52990372f6fed3c33b3ac640f029d))

### [0.5.4](https://github.com/FigurePOS/react-native-local-server/compare/v0.5.3...v0.5.4) (2022-09-09)


### Features

* ping functionality ([#13](https://github.com/FigurePOS/react-native-local-server/issues/13)) ([fc05d66](https://github.com/FigurePOS/react-native-local-server/commit/fc05d66211f81df33ef2676bdc103a72bb271bf2))

### [0.5.3](https://github.com/FigurePOS/react-native-local-server/compare/v0.5.2...v0.5.3) (2022-09-07)


### Refactoring

* refactored API - output of handlers is not being sent anymore ([#12](https://github.com/FigurePOS/react-native-local-server/issues/12)) ([afbf7d4](https://github.com/FigurePOS/react-native-local-server/commit/afbf7d4c5258df8f88f8b765646e471109d9c68e))

### [0.5.2](https://github.com/FigurePOS/react-native-local-server/compare/v0.5.1...v0.5.2) (2022-08-29)


### Bug Fixes

* package.json types path ([0679746](https://github.com/FigurePOS/react-native-local-server/commit/0679746e410efe976dfefb906e1e9d5ef004dfab))

### [0.5.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.5.0...v0.5.1) (2022-08-29)


### Chores

* add declare module ([6511755](https://github.com/FigurePOS/react-native-local-server/commit/65117559fa55f6e7273f81cb5379fa14a85fa9b8))

## [0.5.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.4.4...v0.5.0) (2022-08-18)


### Bug Fixes

* iOS multiple messages received in one moment ([#11](https://github.com/FigurePOS/react-native-local-server/issues/11)) ([d22485c](https://github.com/FigurePOS/react-native-local-server/commit/d22485c640e2924a027d762f6a2004fa0913f45d))

### [0.4.4](https://github.com/FigurePOS/react-native-local-server/compare/v0.4.3...v0.4.4) (2022-08-12)


### Bug Fixes

* log metadata on ErrorWithMetadata thrown ([13be55b](https://github.com/FigurePOS/react-native-local-server/commit/13be55b5f7e21b2cdbd43c646a3ae510eb6d9f0d))

### [0.4.3](https://github.com/FigurePOS/react-native-local-server/compare/v0.4.2...v0.4.3) (2022-08-11)


### Features

* throw custom error on failed parsing ([c795f4f](https://github.com/FigurePOS/react-native-local-server/commit/c795f4fb750badfec4da72802a3ed315f151c653))

### [0.4.2](https://github.com/FigurePOS/react-native-local-server/compare/v0.4.1...v0.4.2) (2022-08-11)


### Bug Fixes

* Gracefully handle errors in communication ([e884002](https://github.com/FigurePOS/react-native-local-server/commit/e884002f61e2d17d85f230c0bad7075bc6dad9bb))

### [0.4.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.4.0...v0.4.1) (2022-08-09)


### ⚠ BREAKING CHANGES

* introduce statusEvent$ (MessagingServer and MessagingClient) (#10)

### Bug Fixes

* introduce statusEvent$ (MessagingServer and MessagingClient) ([#10](https://github.com/FigurePOS/react-native-local-server/issues/10)) ([a25d223](https://github.com/FigurePOS/react-native-local-server/commit/a25d223ac40081b9fba89098ec9e35ce9af6cb28))

## [0.4.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.3.0...v0.4.0) (2022-08-04)


### Features

* getIpAddress ([#9](https://github.com/FigurePOS/react-native-local-server/issues/9)) ([ba7eecc](https://github.com/FigurePOS/react-native-local-server/commit/ba7eeccb0479b96a9124a3c213828b3ac5057635))


### Chores

* run native unit tests using fastlane ([#8](https://github.com/FigurePOS/react-native-local-server/issues/8)) ([70288eb](https://github.com/FigurePOS/react-native-local-server/commit/70288eb759ab152c675f03a97955fdbe7caa4abd))

## [0.3.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.2.2...v0.3.0) (2022-08-01)


### Features

* better iOS error handling ([#5](https://github.com/FigurePOS/react-native-local-server/issues/5)) ([80dacb4](https://github.com/FigurePOS/react-native-local-server/commit/80dacb4fbc267309af238db0104aa347518800df))


### Tests

* iOS implementation tests ([#7](https://github.com/FigurePOS/react-native-local-server/issues/7)) ([bc6f4eb](https://github.com/FigurePOS/react-native-local-server/commit/bc6f4ebe9652038ad341ea45178634e9c3406695))
* typescript implementation of TCP server and TCP client tested ([#6](https://github.com/FigurePOS/react-native-local-server/issues/6)) ([4667b4f](https://github.com/FigurePOS/react-native-local-server/commit/4667b4f4155af55ea5c3ffd86ec0d2dfbc46bf9d))

### [0.2.2](https://github.com/FigurePOS/react-native-local-server/compare/v0.2.1...v0.2.2) (2022-07-27)


### Chores

* fix .npmrc config ([#4](https://github.com/FigurePOS/react-native-local-server/issues/4)) ([0958ee5](https://github.com/FigurePOS/react-native-local-server/commit/0958ee5cc9604b40bd4c4ea85eccb4b2c51d95c8))

### [0.2.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.2.0...v0.2.1) (2022-07-26)


### Features

* concat data when sending from MessagingServer and MessagingClient ([5fc6b5c](https://github.com/FigurePOS/react-native-local-server/commit/5fc6b5c8a1fb62c9f36f28b28e9e49fc9a3cc821))

## [0.2.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.1.6...v0.2.0) (2022-07-26)


### Features

* TCPServer - close connection ([#3](https://github.com/FigurePOS/react-native-local-server/issues/3)) ([79a82f2](https://github.com/FigurePOS/react-native-local-server/commit/79a82f22d306d1767f16f55883e96e8e80d3d6cf))

### [0.1.6](https://github.com/FigurePOS/react-native-local-server/compare/v0.1.5...v0.1.6) (2022-07-26)


### Bug Fixes

* empty commit ([1ef4449](https://github.com/FigurePOS/react-native-local-server/commit/1ef444995cb92c395918291ba6949a18f33d7ac1))


### Chores

* add .npmrc ([8d546b8](https://github.com/FigurePOS/react-native-local-server/commit/8d546b8c87d0ccfeb4fe61ea825f3c6527a29aec))

### [0.1.5](https://github.com/FigurePOS/react-native-local-server/compare/v0.1.4...v0.1.5) (2022-07-26)


### Chores

* release also to npm ([0f9410b](https://github.com/FigurePOS/react-native-local-server/commit/0f9410b46051e7fe2a329be218f221c96135c6bb))

### [0.1.4](https://github.com/FigurePOS/react-native-local-server/compare/v0.1.3...v0.1.4) (2022-07-26)


### Docs

* CONTRIBUTING.md updated ([#2](https://github.com/FigurePOS/react-native-local-server/issues/2)) ([4cc9af2](https://github.com/FigurePOS/react-native-local-server/commit/4cc9af20aa5311e07d62ad5e562b6d0bd23369d4))

### [0.1.3](https://github.com/FigurePOS/react-native-local-server/compare/v0.1.2...v0.1.3) (2022-07-26)


### Chores

* add --ci flag to release-it command ([62d6f78](https://github.com/FigurePOS/react-native-local-server/commit/62d6f78d398c313a08b81ef766632af06c4a1d05))
* circle ci config git variables ([1bf2974](https://github.com/FigurePOS/react-native-local-server/commit/1bf2974555549885a910076fd8076581d97d640b))
* create ~/.ssh directory on circleci ([c38bc9f](https://github.com/FigurePOS/react-native-local-server/commit/c38bc9fb562302df4287f40d2e07d74b40165576))
* release script ([fce4f43](https://github.com/FigurePOS/react-native-local-server/commit/fce4f43a12b8ef8a94da3581253077772d9cdac1))
* release.sh updated ([01f0f55](https://github.com/FigurePOS/react-native-local-server/commit/01f0f550e0bbbf3dc2d293d5184a3e2829dd190e))

### [0.1.2](https://github.com/FigurePOS/react-native-local-server/compare/v0.1.1...v0.1.2) (2022-07-25)


### Chores

* circleci store test results (android) ([1ddb92b](https://github.com/FigurePOS/react-native-local-server/commit/1ddb92b38f8fe67e342a5a8f445b25362c504da4))
* circleci store test results (ts) ([bae8c84](https://github.com/FigurePOS/react-native-local-server/commit/bae8c84d9d95b41fb598f33ff85b4a3d24b1175c))
* skip ci flag for release message ([9527b54](https://github.com/FigurePOS/react-native-local-server/commit/9527b5477d384dac9df28914658a562d351c1cd3))
* update circleci config ([1aaa965](https://github.com/FigurePOS/react-native-local-server/commit/1aaa9654060829a981d8d604cb6c9ea4ad0a5f31))
* update circleci config (commands) ([f90d3c0](https://github.com/FigurePOS/react-native-local-server/commit/f90d3c091f2f0e1179b687f95fab1d2c641ecb5e))

### 0.1.1 (2022-07-25)


### Features

* yarn scripts updated ([efe2798](https://github.com/FigurePOS/react-native-local-server/commit/efe2798c339cc666fe269dad8aef925bbc1e255b))


### Bug Fixes

* fix linter rules ([38bd612](https://github.com/FigurePOS/react-native-local-server/commit/38bd6129cf7f8e369a6a51dd43da08a40e7f5542))


### Chores

* changed package name ([73fbdfc](https://github.com/FigurePOS/react-native-local-server/commit/73fbdfcc253b44e83a7cfdb0b26e491a506aab74))
* initial commit ([e1b4317](https://github.com/FigurePOS/react-native-local-server/commit/e1b43170beb701183b735e8008cbbe2eb52293a1))

