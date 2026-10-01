# Register Lens — Complete Cloudflare Workers AI project

This version uses Meta Llama 3.3 70B hosted by Cloudflare. No OpenAI API key is needed. Your PC does not need to run the model.

## Deploy the complete project

This ZIP contains the entire website, backend, PDF.js assets, sample PDFs, configuration and tests. It is not an update-only archive.

1. Extract the ZIP on your computer.
2. Add the extracted contents to your GitHub repository root. package.json and wrangler.jsonc must be at the root, alongside public/, worker/ and tests/. Do not upload the ZIP itself or add an extra containing folder.
3. For the complete project, use GitHub Desktop: clone your repository, copy the extracted contents into that local repository, review changes, commit, and push. There are over 100 files, so browser uploads require multiple batches while preserving folder paths. Do not commit node_modules or real secret files.
4. In Cloudflare Workers & Pages, connect the GitHub repository if it is not already connected. Use Worker name register-lens, branch main, root repository directory, an empty build command, and deploy command npx wrangler deploy. Do not use the static ZIP uploader.
5. Keep your existing ACCESS_PASSWORD secret. If missing, add ACCESS_PASSWORD as a Secret under your Worker’s Settings → Variables and Secrets. Use a unique password of at least 20 ASCII characters, then deploy the change.
6. Open your Cloudflare website. Username: registerlens. Password: the ACCESS_PASSWORD you set.
7. The status should show “AI binding ready”. Click Ask AI with the sample question and check for an answer with a clickable supporting citation. Then test your own manual.

## Optional command-line deployment

With Node.js 22 or later installed, run these from the extracted project directory:

```bash
npm ci
npm test
npx wrangler login
npx wrangler secret put ACCESS_PASSWORD
npm run deploy
```

If Wrangler asks to create the Worker while setting the secret, accept. No OpenAI key is required. Real inference runs in your Cloudflare account and consumes its AI allowance.

The wrangler configuration adds an AI binding named AI automatically. No separate model key is required. An old OPENAI_API_KEY secret is unused and can be removed. OPENAI_MODEL is also unused. Do not change the Worker name if your existing deployment is named register-lens.

## Free usage

Cloudflare Workers AI includes 10,000 neurons of usage per day, not 10,000 questions. On Workers Free, calls fail once the allowance is exhausted, until the next reset at 00:00 UTC (05:30 India time). If your account is on Workers Paid, usage above the allowance is billable; this app does not enforce a separate spending cap. Monitor the Workers AI dashboard.

## What changed

- worker/app.mjs: Workers AI binding replaces the OpenAI API request; validates JSON, quote text and citation IDs; limits prompt size for the model's 24k context.
- wrangler.jsonc: AI binding and Llama model configuration.
- public/app.mjs and public/index.html: updated connection status and provider/privacy text.
- tests/backend.test.mjs and tests/auth.test.mjs: Workers AI mock coverage and existing authentication checks.

The answer appears first; citations underneath open the relevant PDF page. Quote validation confirms a quote appears in the supplied source; it does not prove the model's interpretation is correct. No-evidence responses may omit citations.

## Troubleshooting

- AI binding missing: deploy the updated wrangler.jsonc alongside the updated backend.
- Website says setup incomplete: set ACCESS_PASSWORD to at least 20 ASCII characters.
- Provider error: check Workers AI usage, limits and model availability in Cloudflare.
- Context too large: ask a more specific question or use source-only search. Serialized question, metadata and excerpts are limited conservatively to 20,000 UTF-8 bytes; oversized requests are not silently truncated.
- Response could not be verified: the model returned invalid JSON, an unknown source ID or a quote not found in the passages. Retry or read the linked source pages using source-only search.

## Privacy and access

All website and API routes remain password protected through worker/index.mjs. Keep assets.run_worker_first=true. This is a single-user prototype, without a durable login-attempt limiter or enterprise identity system.

PDF binaries stay in browser memory. Ask AI sends the question, metadata and matching passages to Cloudflare Workers AI. Source-only search stays in the browser. The application does not persist prompts or answers. Provider data policies still apply.

## Validation

Run `npm ci`, `npm test`, and `npm run check` with Node 22 or later. Tests mock Workers AI and do not measure real model accuracy. The deployment dry-run does not make a live AI call. A real end-to-end AI check must be done after deployment to your Cloudflare account.

References:
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/configuration/bindings/
- https://developers.cloudflare.com/workers-ai/features/json-mode/
- https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/
