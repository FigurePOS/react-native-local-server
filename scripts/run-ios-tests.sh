#!/bin/sh

echo "Running iOS unit tests."

set -e  # Exit immediately if a command exits with a non-zero status

xcodebuild \
  -project ios/LocalServer.xcodeproj \
  -scheme Tests \
  test

echo "✅ iOS tests completed successfully"


