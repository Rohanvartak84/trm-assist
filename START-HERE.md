# Register Lens — deploy to your Cloudflare account

This package contains the full website and AI backend. It does not contain your API key and has not yet been deployed to your account. Your existing ChatGPT-hosted site is unchanged.

## 1. Extract and open a terminal

Install Node.js 22 or newer if needed: https://nodejs.org/en/download

Extract the ZIP. Open the `register-lens-cloudflare` folder containing `package.json` and `wrangler.jsonc` in VS Code, then choose Terminal → New Terminal. These commands work in a terminal on Windows, macOS or Linux.

## 2. Install and sign in

Run these commands one at a time:

```sh
npm install
npx wrangler login
```

The second command opens Cloudflare sign-in. Choose your account and authorize Wrangler. If your account already has an unrelated Worker named `register-lens`, change the `name` in `wrangler.jsonc` before continuing so it is not overwritten.

## 3. Deploy the protected application

```sh
npm run deploy
```

If prompted, select your Cloudflare account and configure a workers.dev subdomain. Copy the HTTPS URL printed at the end. The website initially displays “Setup incomplete” and denies access until you configure the access password; it does not expose the app or model endpoint during setup.

## 4. Add the two secrets — this is where your API key goes

Use either method A or method B. Do not put real secret values in source files or chat.

### A. Cloudflare dashboard

Open https://dash.cloudflare.com → Workers & Pages → register-lens → Settings → Variables and Secrets → Add.

| Type | Variable name | Value |
|---|---|---|
| Secret | OPENAI_API_KEY | Your existing OpenAI API key |
| Secret | ACCESS_PASSWORD | A new unique random password of at least 20 ASCII characters, generated with a password manager |

Click Deploy to apply the changes. ACCESS_PASSWORD is your website login password; it is separate from your OpenAI API key and Cloudflare password. Choose letters, numbers and punctuation; do not use non-ASCII characters for this prototype's browser login.

### B. Terminal with hidden prompts

```sh
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ACCESS_PASSWORD
```

Each command prompts for the value interactively. Paste your API key only at the first prompt. Enter your new website password at the second prompt. Do not append a value to either command. Each secret command deploys an updated Worker version.

## 5. Open the website and test AI

Open the HTTPS workers.dev URL printed by deployment. The browser displays a sign-in prompt:

- Username: `registerlens`
- Password: the ACCESS_PASSWORD you just saved

The status should say “AI configured”. This indicates that a key exists, not that billing or model access has been verified. The fictional sample loads automatically, using source-only search without spending API usage. Click Ask AI to make your first real model request. You should see a direct technical answer followed by clickable page citations and supporting quotes.

To test your chip, add its text-based PDF manual, enter the correct chip and revision, then ask a question. Remove the sample or import your own PDF; the fictional sample is automatically replaced when real documents are added.

The deployed URL is a separate Cloudflare copy. The chatgpt.site URL continues pointing to the earlier Sites deployment.

## Troubleshooting

- `npm` is not recognized: install Node.js and reopen your terminal.
- Windows blocks `npm.ps1`: select Command Prompt as the terminal, or use `npm.cmd` and `npx.cmd` instead of npm and npx. No execution-policy changes are necessary.
- “Setup incomplete”: ACCESS_PASSWORD is missing or shorter than 20 characters. Set it as a Secret and deploy.
- Repeated sign-in prompt: username must be `registerlens`; check the ACCESS_PASSWORD value. Browsers cache Basic authentication; use a new private/incognito session after changing the password.
- “API key not configured”: check the exact uppercase name OPENAI_API_KEY and deploy the secret change.
- Key rejected: replace the API key secret with a valid key.
- Usage or rate limit: check your API account's billing/quota and retry later. The app intentionally does not retry automatically and multiply costs.
- Model access error: the default is gpt-4.1-mini. Change OPENAI_MODEL in wrangler.jsonc to a Responses API model that supports structured output and your account can access, then deploy again.
- No useful answer: source retrieval is keyword-based. Try the exact register name, check the chip/revision scope, or add the relevant document.

## Privacy and limitations

All routes, including static files and APIs, pass through password verification. Do not change assets.run_worker_first=true. Do not deploy worker/app.mjs directly: worker/index.mjs is the authenticated entrypoint. Keep the website password private; anyone who has it can use the configured API key through the app. This is single-user prototype authentication, not enterprise identity management or a team-account system. Public URLs are reachable but content and model calls require the password. A random password is important; this package does not add a durable login-attempt limiter.

PDF binaries are kept in browser memory and disappear on refresh. Ask AI sends your question, metadata and up to six matching text excerpts to OpenAI through your Worker. Source-only search remains in the browser. There is no application database, prompt logging or persistent document storage. Model requests set store:false; this does not override provider retention policies. Do not send proprietary material unless you are authorized to use it with that provider.

Citations are checked against supplied passages, but this does not guarantee factual accuracy. PDF tables, revision applicability and keyword retrieval remain unvalidated. No OCR is included. Always confirm register values against the original page.

## Validation and future updates

```sh
npm test
npm run check
npm run deploy
```

The checks cover request validation, missing API keys, provider errors, citation validation, retrieval scope, password protection, and static-asset authentication configuration. Live AI billing/model access must be tested after you configure your own key. Never upload node_modules, .dev.vars, .env or secret values to GitHub.

## Official references

- Secrets and dashboard instructions: https://developers.cloudflare.com/workers/configuration/secrets/
- Asset bindings and run_worker_first: https://developers.cloudflare.com/workers/static-assets/binding/
- Wrangler: https://developers.cloudflare.com/workers/wrangler/commands/
