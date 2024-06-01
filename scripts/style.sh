#!/bin/bash

set -e

npx tsc
npx prettier --write .
