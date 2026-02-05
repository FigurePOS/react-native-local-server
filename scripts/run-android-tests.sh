#!/bin/sh

echo "Running Android unit tests."

set -e  # Exit immediately if a command exits with a non-zero status
set -o pipefail  # Ensure that if gradlew fails, the entire pipeline fails

export GRADLE_OPTS="-Xmx4096m -Dorg.gradle.daemon=false"  # Increase heap to avoid OOM; disable daemon for stability

cd android && ./gradlew testDebugUnitTest -Pandroid.useAndroidX=true -Pandroid.enableJetifier=true

echo "✅ Android tests completed successfully"

