#!/bin/sh

echo "KOKOT"

xcodebuild \
  -project ios/LocalServer.xcodeproj \
  -scheme Tests \
  test \
  | xcbeautify
