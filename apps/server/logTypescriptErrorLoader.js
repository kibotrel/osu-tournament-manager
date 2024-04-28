import console from 'node:console';
import { setUncaughtExceptionCaptureCallback } from 'node:process';

setUncaughtExceptionCaptureCallback(console.error);
