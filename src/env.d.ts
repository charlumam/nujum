/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

// Cloudflare D1 Database type for the env binding
interface CloudflareEnv {
  nujum_db: D1Database;
}

type CloudflareRuntime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

type ClerkAuth = import("@clerk/backend").SignedInAuthObject | import("@clerk/backend").SignedOutAuthObject;

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Locals extends CloudflareRuntime {
    auth(): ClerkAuth;
  }
}
