import { Sequencer } from '#src/classes/sequencer.class.js';

import { logger } from './logger.dependency.js';

export const sequencer = new Sequencer({ logger });
