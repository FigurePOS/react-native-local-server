#!/bin/sh

echo "Running Android unit tests."

set -e  # Exit immediately if a command exits with a non-zero status

export GRADLE_OPTS="-Xmx6144m -Dorg.gradle.daemon=false"  # Increase heap to avoid OOM; disable daemon for stability

cd android && ./gradlew testDebugUnitTest -Pandroid.useAndroidX=true -Pandroid.enableJetifier=true --no-daemon -Dorg.gradle.jvmargs="-Xmx6144m"

echo "✅ Android tests completed successfully"

