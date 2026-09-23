import { createCurrentAttempt } from "../src/server/attempt-repository";

const attempt = createCurrentAttempt();
console.log(`Local synthetic attempt ready for ${attempt.lessonId}@${attempt.lessonVersion}.`);
