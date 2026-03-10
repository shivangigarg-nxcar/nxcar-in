#!/bin/bash
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS='--max-old-space-size=4096'
exec next dev -p 5000 --webpack
