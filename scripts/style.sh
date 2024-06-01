#!/bin/bash

set -e

npx tsc
npx prettier --write .
npx eslint --fix .
