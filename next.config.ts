import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["live-test.stakeblogs.com"],
};

export default withPayload(nextConfig);
