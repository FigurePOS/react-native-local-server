#!/bin/sh

echo "Running iOS unit tests."

set -e  # Exit immediately if a command exits with a non-zero status
set -o pipefail  # Ensure that if xcodebuild fails, the entire pipeline fails

xcodebuild \
  -project ios/LocalServer.xcodeproj \
  -scheme Tests \
  test \
  | xcbeautify

echo "✅ iOS tests completed successfully"



