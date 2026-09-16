/**
 * Every page is the same for every visitor: there are no load functions, no
 * backend, and no per-request data anywhere in the app. Rounds and scores live
 * in localStorage (see docs/adr/0001-localstorage-and-printed-report.md), so
 * the server has nothing to look up. Building the five pages once at deploy
 * time lets Vercel serve them from its CDN instead of waking a serverless
 * function per visit, which removes the cold starts and function-invocation
 * failures that a static file cannot have.
 *
 * This changes only where the first chunk of HTML comes from. The app still
 * hydrates and every interaction works exactly as before.
 */
export const prerender = true;
