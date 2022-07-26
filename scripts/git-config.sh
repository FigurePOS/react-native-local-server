#!/bin/sh

echo "Setting git config:"

echo "email: $GITHUB_USER_EMAIL"
git config --global user.email "$GITHUB_USER_EMAIL"

echo "name: $GITHUB_USER_NAME"
git config --global user.name "$GITHUB_USER_NAME"
