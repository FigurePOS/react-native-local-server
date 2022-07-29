#!/bin/sh

echo "Running iOS unit tests."

xcodebuild \
  -project ios/LocalServer.xcodeproj \
  -scheme Tests \
  test \
  | xcbeautify
