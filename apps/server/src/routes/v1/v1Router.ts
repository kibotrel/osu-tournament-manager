import type { Router } from 'express';
import express from 'express';

const v1Router: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

export { v1Router };
