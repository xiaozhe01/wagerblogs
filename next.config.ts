import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["live-test.stakeblogs.com"],
  experimental: {
    // Caps the collect/prerender worker count, which is the multiplier on the
    // Postgres connection budget: every worker opens its own pool. Defaults to
    // cores-1 (7 here), and 7 x pool.max of 2 sits exactly on the session
    // pooler's 15-client limit with nothing spare. See STRUCTURE.md
    // "Postgres connection budget".
    cpus: 4,
  },
};

export default withPayload(nextConfig);
