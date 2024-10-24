#!/bin/bash 

find . -name '*.tsx' -exec grep -nH '$1' {} +
