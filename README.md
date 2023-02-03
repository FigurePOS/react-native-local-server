# React Native Local Server

Library for creating a local server on the device running React Native.

The library exposes several classes to ease communication over local network.
* TCP server and client
* UDP server
* Messaging server and client
* Caller ID server (Whozz Calling?)
* Service browser (zero-configuration)

## Installation

Install yarn dependency:
```sh
yarn add @figuredev/react-native-local-server
```

Install iOS dependencies (from ios/ directory):
```sh
pod install
```

## Usage

### TCP server and client
Low level implementation of TCP protocol. There are two classes: server and client.
Once the server is running the client can connect to it.
All data parts has to be delimited by new line character.

See documentation of classes for more information.

### UDP server
Low level implementation of UDP protocol. There is only one call: server.
The server doesn't have to be running in order to send data.

See documentation of the class for more information.

### Messaging server and client
Abstraction above TCP layer using RxJS. There are again two classes: server and client.
Both server and client require a handler when starting. The handler is a function that takes a stream of incoming messages and defined dependencies. This design was inspired by [redux-observable](https://redux-observable.js.org/) library.
Both classes also provides a stream of status events.

See documentation of classes for more information.

### Caller ID server (Whozz Calling?)
Abstraction above UDP layer using RxJS. All incoming calls are provided via stream `CallerIdServer.getIncomingCall$()`.
The server can also simulate incoming call via method `CallerIdServer.simulateCall(call: PhoneCall)`.

See documentation of the class for more information.

### Service browser (zero-configuration)
Implementation of zero-configuration standard for service discovery. This browser allows you discover all available services in provided group.

On iOS you have to specify service groups in Info.plist, the key is `NSBonjourServices`.

See documentation of classes for more information.

## Known Issues

### UDP server
* Android: not receiving broadcast messages
* iOS: not sending broadcast messages

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
