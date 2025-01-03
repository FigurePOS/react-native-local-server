

### [0.17.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.17.0...v0.17.1) (2025-01-02)


### Features

* update rxjs version FGR3-5592 ([#77](https://github.com/FigurePOS/react-native-local-server/issues/77)) ([2c73132](https://github.com/FigurePOS/react-native-local-server/commit/2c73132790fc488b0e6035654a14addd2a61a671))


### Chores

* disable ios and android tests FGR3-5592 ([#78](https://github.com/FigurePOS/react-native-local-server/issues/78)) ([df17a42](https://github.com/FigurePOS/react-native-local-server/commit/df17a420c25716244b23984e159299b9a3437ee6))
* upgrade conventional-changelog to match release-it version FGR3-5592 ([#79](https://github.com/FigurePOS/react-native-local-server/issues/79)) ([2f5b5a1](https://github.com/FigurePOS/react-native-local-server/commit/2f5b5a163f69c1b66e18575e9212326a7c8306fd))

## [0.17.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.16.0...v0.17.0) (2024-11-28)


### Bug Fixes

* change mDNS implementation to fix crashes on app reload ([#76](https://github.com/FigurePOS/react-native-local-server/issues/76)) ([1914f2f](https://github.com/FigurePOS/react-native-local-server/commit/1914f2fe53128ad563b080941fd6086b2e8d713e))


### Chores

* **deps:** bump ws from 6.2.2 to 6.2.3 ([#69](https://github.com/FigurePOS/react-native-local-server/issues/69)) ([a98f0dd](https://github.com/FigurePOS/react-native-local-server/commit/a98f0dddeeb7dbdaebd96e581c3cf277a83e13da))
* **deps:** bump ws from 6.2.2 to 6.2.3 in /example ([#68](https://github.com/FigurePOS/react-native-local-server/issues/68)) ([c6988e7](https://github.com/FigurePOS/react-native-local-server/commit/c6988e72ca620bfd9b9560bac790a886412ca7ec))
* release 0.16.0 [skip ci] ([#71](https://github.com/FigurePOS/react-native-local-server/issues/71)) ([7063d58](https://github.com/FigurePOS/react-native-local-server/commit/7063d58a64c10393d1786187111d0ec5e6c9478d))

## [0.16.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.15.0...v0.16.0) (2024-06-18)


### Bug Fixes

* check for browser existence before removing FGR3-4679 ([#67](https://github.com/FigurePOS/react-native-local-server/issues/67)) ([0e41008](https://github.com/FigurePOS/react-native-local-server/commit/0e410085ca68bfb115200b428bc0331c8d7fafa3))
* do not report error when stopping a stopped browser FGR3-4670 ([#70](https://github.com/FigurePOS/react-native-local-server/issues/70)) ([04b808f](https://github.com/FigurePOS/react-native-local-server/commit/04b808f9d3db556c8ac5b509708a6093dd4703c5))


### Chores

* **deps:** bump braces from 3.0.2 to 3.0.3 in /example ([#65](https://github.com/FigurePOS/react-native-local-server/issues/65)) ([833e554](https://github.com/FigurePOS/react-native-local-server/commit/833e554e8f09d4c9d06bd5e27a96d090e0457934))
* **deps:** bump rexml from 3.2.6 to 3.2.8 in /example ([#64](https://github.com/FigurePOS/react-native-local-server/issues/64)) ([e96a35b](https://github.com/FigurePOS/react-native-local-server/commit/e96a35bb0d6c77e6773cccb2acee4c6f04cfadcf))

## [0.15.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.14.4...v0.15.0) (2024-04-17)


### Bug Fixes

* example ios build [skip ci] ([#61](https://github.com/FigurePOS/react-native-local-server/issues/61)) ([033df0a](https://github.com/FigurePOS/react-native-local-server/commit/033df0a7e7135c418fe9f805c174223670961af2))
* **example:** fix android builds ([#62](https://github.com/FigurePOS/react-native-local-server/issues/62)) ([144f835](https://github.com/FigurePOS/react-native-local-server/commit/144f835c6d6ece7225066762ba30f62bf1c32cf6))
* use dnssd for service discovery FGR3-4285 ([#63](https://github.com/FigurePOS/react-native-local-server/issues/63)) ([87bfe80](https://github.com/FigurePOS/react-native-local-server/commit/87bfe80834affabff5c32c0d1b99cf93f080a8f3))


### Chores

* **example:** upgrade rn to v0.73.6 FGR3-4212 [skip ci] ([#60](https://github.com/FigurePOS/react-native-local-server/issues/60)) ([ebc0020](https://github.com/FigurePOS/react-native-local-server/commit/ebc002042d768b1b4a8bb4ffd92e44d4e2ceec76))

### [0.14.4](https://github.com/FigurePOS/react-native-local-server/compare/v0.14.3...v0.14.4) (2024-04-05)


### Bug Fixes

* replace output$ mergeMap to secure only one at time FGR3-4212  ([#59](https://github.com/FigurePOS/react-native-local-server/issues/59)) ([b34e878](https://github.com/FigurePOS/react-native-local-server/commit/b34e878b1a1ea5140951fde54ee628d9fc08046b))

### [0.14.3](https://github.com/FigurePOS/react-native-local-server/compare/v0.14.2...v0.14.3) (2024-04-05)


### Bug Fixes

* handle parsing errors FGR3-4212 ([#58](https://github.com/FigurePOS/react-native-local-server/issues/58)) ([943ef20](https://github.com/FigurePOS/react-native-local-server/commit/943ef2089f2d7bb2655fd464e682aaa680d62d1a))


### Chores

* **deps:** bump @babel/traverse from 7.18.2 to 7.23.2 ([#49](https://github.com/FigurePOS/react-native-local-server/issues/49)) [skip ci] ([c3c9523](https://github.com/FigurePOS/react-native-local-server/commit/c3c95237d61277ddd3ed8ddb7f227712a4c8a0e8))
* **deps:** bump @babel/traverse from 7.18.2 to 7.23.2 in /example ([#50](https://github.com/FigurePOS/react-native-local-server/issues/50)) [skip ci] ([d8b5578](https://github.com/FigurePOS/react-native-local-server/commit/d8b557859849c83bab54de37733f9e968042a2a1))
* **deps:** bump activesupport from 7.0.6 to 7.1.3.2 in /example ([#57](https://github.com/FigurePOS/react-native-local-server/issues/57)) [skip ci] ([30351dd](https://github.com/FigurePOS/react-native-local-server/commit/30351dd5fdbbd2a7922bc459f9de1d17c6ff2b3c))
* **deps:** bump ip from 1.1.8 to 1.1.9 ([#56](https://github.com/FigurePOS/react-native-local-server/issues/56)) [skip ci] ([1c66452](https://github.com/FigurePOS/react-native-local-server/commit/1c66452a86f66c1a231645d69d7aed0609e689cf))
* **deps:** bump ip from 1.1.8 to 1.1.9 in /example ([#55](https://github.com/FigurePOS/react-native-local-server/issues/55)) [skip ci] ([951875e](https://github.com/FigurePOS/react-native-local-server/commit/951875ecc41d5634b451a907d84894af0c57fdd2))
* **deps:** bump react-devtools-core from 4.28.0 to 4.28.4 in /example ([#52](https://github.com/FigurePOS/react-native-local-server/issues/52)) [skip ci] ([7c59ae4](https://github.com/FigurePOS/react-native-local-server/commit/7c59ae487f5ba7dfed5f401c4d9cb06e20d39068))

### [0.14.2](https://github.com/FigurePOS/react-native-local-server/compare/v0.14.1...v0.14.2) (2023-11-01)


### Features

* add handler output stream ([#54](https://github.com/FigurePOS/react-native-local-server/issues/54)) ([e72eadf](https://github.com/FigurePOS/react-native-local-server/commit/e72eadfd3bf4cca9536b6fb8e659c6ade5c7cfaf))


### Chores

* **deps:** bump react-devtools-core from 4.28.0 to 4.28.4 ([#53](https://github.com/FigurePOS/react-native-local-server/issues/53)) ([d2160c4](https://github.com/FigurePOS/react-native-local-server/commit/d2160c46cbb922510e8babd91bb6bed14b092540))
* **deps:** bump word-wrap from 1.2.3 to 1.2.4 ([#47](https://github.com/FigurePOS/react-native-local-server/issues/47)) ([8be48c7](https://github.com/FigurePOS/react-native-local-server/commit/8be48c7a05f4f5ff879939ed6ec759d02d1676c9))
* upgrade ci resource class ([#51](https://github.com/FigurePOS/react-native-local-server/issues/51)) ([d4a0d80](https://github.com/FigurePOS/react-native-local-server/commit/d4a0d80df2d5d33a3de39fef7b1692c7f2eda09f))

### [0.14.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.14.0...v0.14.1) (2023-07-19)


### Chores

* dependabot setup & codeowners ([#37](https://github.com/FigurePOS/react-native-local-server/issues/37)) ([7f90056](https://github.com/FigurePOS/react-native-local-server/commit/7f9005650c772da3b30e0d65a9a4d74d7ee7a82d))
* **deps:** bump @sideway/formula from 3.0.0 to 3.0.1 in /example ([#41](https://github.com/FigurePOS/react-native-local-server/issues/41)) ([206a6ff](https://github.com/FigurePOS/react-native-local-server/commit/206a6ffe4cf339faf1a7ccacccfa22086e52c41c))
* **deps:** bump activesupport from 7.0.4.2 to 7.0.6 in /example ([#42](https://github.com/FigurePOS/react-native-local-server/issues/42)) ([80e6177](https://github.com/FigurePOS/react-native-local-server/commit/80e6177b488909c61846497d3b2d0c48366b2c0b))
* **deps:** bump http-cache-semantics from 4.1.0 to 4.1.1 ([#43](https://github.com/FigurePOS/react-native-local-server/issues/43)) ([2305a6d](https://github.com/FigurePOS/react-native-local-server/commit/2305a6d7b41e8be0d4afea9a3814c54859f8c678))
* **deps:** bump json5 from 2.2.1 to 2.2.3 ([#45](https://github.com/FigurePOS/react-native-local-server/issues/45)) ([e8f4af7](https://github.com/FigurePOS/react-native-local-server/commit/e8f4af73b6bdf74b6b0df54ed5eace4dbb378bf0))
* **deps:** bump semver from 5.7.1 to 5.7.2 ([#40](https://github.com/FigurePOS/react-native-local-server/issues/40)) ([30607dc](https://github.com/FigurePOS/react-native-local-server/commit/30607dc3a39e02cdbf4afb3dcf962094c0e5cd8a))
* **deps:** bump semver from 5.7.1 to 5.7.2 in /example ([#39](https://github.com/FigurePOS/react-native-local-server/issues/39)) ([c0c6eae](https://github.com/FigurePOS/react-native-local-server/commit/c0c6eaeab486f9269ade8e11405117856c4aed4c))
* **deps:** bump tough-cookie from 4.0.0 to 4.1.3 ([#38](https://github.com/FigurePOS/react-native-local-server/issues/38)) ([ecad5ca](https://github.com/FigurePOS/react-native-local-server/commit/ecad5cac8c9f1e2ac03643e05938b0040f1ae12f))
* **deps:** bump ua-parser-js from 0.7.31 to 0.7.35 ([#44](https://github.com/FigurePOS/react-native-local-server/issues/44)) ([84857f2](https://github.com/FigurePOS/react-native-local-server/commit/84857f2c6eaa81a0ea4527ae5a8577b54beaacdc))
* update react native to v0.72.3 ([#46](https://github.com/FigurePOS/react-native-local-server/issues/46)) ([d47979f](https://github.com/FigurePOS/react-native-local-server/commit/d47979f1fbdc01cd476c86bfebaf480f5253c2ab))

## [0.14.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.13.4...v0.14.0) (2023-06-23)


### Features

* add PutToBackground to MessagingStoppedReason ([791c220](https://github.com/FigurePOS/react-native-local-server/commit/791c220905b2b5ac525a51f9422fa1d150926672))
* add service browser example ([#35](https://github.com/FigurePOS/react-native-local-server/issues/35)) ([021f7dd](https://github.com/FigurePOS/react-native-local-server/commit/021f7dd669c73e4aac89fa43ab61164b187edcad))
* allow dynamic port for TCP and Messaging servers ([#34](https://github.com/FigurePOS/react-native-local-server/issues/34)) ([93f560c](https://github.com/FigurePOS/react-native-local-server/commit/93f560caaa7a68cd877a546ea8722585949a5f66))


### Bug Fixes

* improve iOS flaky test ([#36](https://github.com/FigurePOS/react-native-local-server/issues/36)) ([90f45ef](https://github.com/FigurePOS/react-native-local-server/commit/90f45ef91eb8fb7e4f7176cd59e562f385bbb535))


### Chores

* **example:** update react-native to 0.67.5 ([4baabce](https://github.com/FigurePOS/react-native-local-server/commit/4baabceaab2eafa4f796901b19908d3d45ea80fb))
* **example:** update react-native to 0.68.6 ([0295b14](https://github.com/FigurePOS/react-native-local-server/commit/0295b1412a06e18b04b500aee3478d5bdacca632))
* **example:** update react-native to 0.69.8 ([5950993](https://github.com/FigurePOS/react-native-local-server/commit/595099355906130af9ae1b2136ab5351a9bd5823))
* **example:** update react-native to 0.70.6 ([6f7166d](https://github.com/FigurePOS/react-native-local-server/commit/6f7166d7defeb0cab0d460aee959b96e357afbd6))

### [0.13.4](https://github.com/FigurePOS/react-native-local-server/compare/v0.13.3...v0.13.4) (2023-02-03)


### Docs

* update documentation ([#33](https://github.com/FigurePOS/react-native-local-server/issues/33)) ([76c2e40](https://github.com/FigurePOS/react-native-local-server/commit/76c2e40b64579b4caeb3e210b77c4b6bd2a82e27))

### [0.13.3](https://github.com/FigurePOS/react-native-local-server/compare/v0.13.2...v0.13.3) (2023-01-12)


### Chores

* use CI context ([c49f263](https://github.com/FigurePOS/react-native-local-server/commit/c49f263fbe222e1acc1b83923e2a08270f1af098))
* use CI context (fix) ([9b77e5b](https://github.com/FigurePOS/react-native-local-server/commit/9b77e5b2c427068843c747968afe2300bbec5fcf))
* use CI context (fix) ([e59bb8d](https://github.com/FigurePOS/react-native-local-server/commit/e59bb8da917649cb337d2915d59b8b4502d8a127))

### [0.13.2](https://github.com/FigurePOS/react-native-local-server/compare/v0.13.1...v0.13.2) (2022-12-27)


### Features

* **CallerID:** deduplicate multiple packets when receiving a call ([#32](https://github.com/FigurePOS/react-native-local-server/issues/32)) ([7697f36](https://github.com/FigurePOS/react-native-local-server/commit/7697f360a5d9d6787f4c17ba18232c993778b7c9))

### [0.13.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.13.0...v0.13.1) (2022-12-19)


### Features

* add timeout to starting MessagingClient ([acb5a0a](https://github.com/FigurePOS/react-native-local-server/commit/acb5a0ac09d7b29714326a3f5ed5ea77ff3c8e78))

## [0.13.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.12.0...v0.13.0) (2022-12-18)


### Features

* messaging client connect based on service (iOS only) ([#31](https://github.com/FigurePOS/react-native-local-server/issues/31)) ([736509e](https://github.com/FigurePOS/react-native-local-server/commit/736509e824b6f47d939ac1c84ff1fbedd96a70a0))


### Bug Fixes

* fix TCPClient getting stuck in waiting state (iOS) ([e4ff8e7](https://github.com/FigurePOS/react-native-local-server/commit/e4ff8e7d5a6e46cd42d68509f2381400d7c817f1))


### Chores

* release 0.12.0 [skip ci] ([4b7c462](https://github.com/FigurePOS/react-native-local-server/commit/4b7c462be09b501957bd6e7c01052a002efa484e))


### Refactoring

* refactor TCPClient state handling (iOS) ([43902f6](https://github.com/FigurePOS/react-native-local-server/commit/43902f64884e17e13e6927d40fe15120b901b6ae))

## [0.12.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.11.0...v0.12.0) (2022-12-17)


### Features

* implement dropping first x bytes of udp messages, required for callerId in ios release config ([da69aa1](https://github.com/FigurePOS/react-native-local-server/commit/da69aa1f2ebf305eff9f593b74c964b8fe41157e))

## [0.11.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.10.6...v0.11.0) (2022-12-16)


### Features

* add service browsing to MessagingClient ([#28](https://github.com/FigurePOS/react-native-local-server/issues/28)) ([20f9c41](https://github.com/FigurePOS/react-native-local-server/commit/20f9c41a643f981d4a0bfe1d1fb1ff86c5e4c41f))
* add zero-config prototype (Android) ([#26](https://github.com/FigurePOS/react-native-local-server/issues/26)) ([c435a64](https://github.com/FigurePOS/react-native-local-server/commit/c435a64d52801ec5799e33120674241c975c3a8e))
* add zero-config prototype (iOS) ([#27](https://github.com/FigurePOS/react-native-local-server/issues/27)) ([f82e89f](https://github.com/FigurePOS/react-native-local-server/commit/f82e89fb767b586424c6b01a8cb09abe3d6d1920))


### Refactoring

* use NSLog instead of print for debugging ([#29](https://github.com/FigurePOS/react-native-local-server/issues/29)) ([90be4ed](https://github.com/FigurePOS/react-native-local-server/commit/90be4edbe089454f7fec4aeb0c169e315c3fb967))

### [0.10.6](https://github.com/FigurePOS/react-native-local-server/compare/v0.10.5...v0.10.6) (2022-12-06)


### Features

* change the logger verbosity for received message ([35f2454](https://github.com/FigurePOS/react-native-local-server/commit/35f24548da6c4e046ffa6ca282ea82966c952ef3))

### [0.10.5](https://github.com/FigurePOS/react-native-local-server/compare/v0.10.4...v0.10.5) (2022-12-05)


### Bug Fixes

* messaging client loosing subscriptions after restarting ([220552c](https://github.com/FigurePOS/react-native-local-server/commit/220552c87e83d949084836b80f8ede58c5714cf4))
* messaging server loosing subscriptions after restarting ([b7d10d3](https://github.com/FigurePOS/react-native-local-server/commit/b7d10d3d1310005b46a4c5a14a852108e3c94dd6))

### [0.10.4](https://github.com/FigurePOS/react-native-local-server/compare/v0.10.3...v0.10.4) (2022-11-18)


### Refactoring

* update MessagingServiceInformation type ([e67c7cc](https://github.com/FigurePOS/react-native-local-server/commit/e67c7cc502a692352294eab8d03ca9264f69dd3e))

### [0.10.3](https://github.com/FigurePOS/react-native-local-server/compare/v0.10.2...v0.10.3) (2022-11-18)


### Features

* send MessagingServiceInformation from server on new connection ([dbac116](https://github.com/FigurePOS/react-native-local-server/commit/dbac116b7544c91f70d2c7ddcea662d53ccd3140))

### [0.10.2](https://github.com/FigurePOS/react-native-local-server/compare/v0.10.1...v0.10.2) (2022-11-18)


### Features

* make messaging ping functionality less strict ([9fef901](https://github.com/FigurePOS/react-native-local-server/commit/9fef90125f43d981985b4d23d12729fb30002ded))

### [0.10.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.10.0...v0.10.1) (2022-10-24)


### Refactoring

* export composeMessageObject for testing purposes ([55dccb7](https://github.com/FigurePOS/react-native-local-server/commit/55dccb7cd922dec00767322414254ef38dc2e09f))

## [0.10.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.9.0...v0.10.0) (2022-10-03)


### Bug Fixes

* add iOS tag [@available](https://github.com/available)(iOS 12.0, *) ([794b411](https://github.com/FigurePOS/react-native-local-server/commit/794b4115bbe89bcdfad811d294ea59d0fca5d69b))

## [0.9.0](https://github.com/FigurePOS/react-native-local-server/compare/v0.8.1...v0.9.0) (2022-10-03)


### Features

* Caller ID server ([#21](https://github.com/FigurePOS/react-native-local-server/issues/21)) ([65a4ff5](https://github.com/FigurePOS/react-native-local-server/commit/65a4ff53b2be41da4b5505c5d4278426045d7704))
* UDP server - Android ([#18](https://github.com/FigurePOS/react-native-local-server/issues/18)) ([28dd29a](https://github.com/FigurePOS/react-native-local-server/commit/28dd29a6d027e778773881346cac388bee9476d2))
* UDP server - iOS ([#20](https://github.com/FigurePOS/react-native-local-server/issues/20)) ([dcb18a9](https://github.com/FigurePOS/react-native-local-server/commit/dcb18a9c85aca5312f8157de3e43093c6796f408))
* UDP Server - TypeScript ([#19](https://github.com/FigurePOS/react-native-local-server/issues/19)) ([cebd213](https://github.com/FigurePOS/react-native-local-server/commit/cebd2134eb19a14943f1c44e860fdb75374d5430))


### Docs

* README.md and class documentation updated ([#22](https://github.com/FigurePOS/react-native-local-server/issues/22)) ([15faf55](https://github.com/FigurePOS/react-native-local-server/commit/15faf5543f4303ec50f1ae7e3e44cbccb5468a50))


### Refactoring

* Refactor internal operator names ([#24](https://github.com/FigurePOS/react-native-local-server/issues/24)) ([6cf885c](https://github.com/FigurePOS/react-native-local-server/commit/6cf885cf4e32caa9de5c8cfec99bca99d8756567))
* Refactor the way we use LoggerVerbosity ([#23](https://github.com/FigurePOS/react-native-local-server/issues/23)) ([b558fce](https://github.com/FigurePOS/react-native-local-server/commit/b558fce974a6be9605f2e30ed3d2191792d5086f))
* TCP server and client uses generic iOS implementation ([#25](https://github.com/FigurePOS/react-native-local-server/issues/25)) ([587d194](https://github.com/FigurePOS/react-native-local-server/commit/587d1942e7ceb204b1b712adeb9e249776de881d))

### [0.8.1](https://github.com/FigurePOS/react-native-local-server/compare/v0.8.0...v0.8.1) (2022-09-19)


### Bug Fixes

* messaging - clean subscriptions ([38eef43](https://github.com/FigurePOS/react-native-local-server/commit/38eef430facc21f9e29099034461182cc52e1198))

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