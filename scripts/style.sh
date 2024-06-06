#!/bin/bash

set -e

npx tsc
npx prettier --write src/
npx eslint --fix src/
