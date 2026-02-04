#!/bin/sh

echo "Running iOS unit tests."

# Run xcodebuild and capture both output and exit code
if xcodebuild \
  -project ios/LocalServer.xcodeproj \
  -scheme Tests \
  test 2>&1 | xcbeautify; then
  echo "✅ iOS tests passed"
  exit 0
else
  echo "❌ iOS tests failed"
  exit 1
fi

