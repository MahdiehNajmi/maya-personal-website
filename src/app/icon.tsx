import { ImageResponse } from "next/og";
import { getAvatarDataUrl } from "@/lib/avatar-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const src = await getAvatarDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#1a365d",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={32}
          height={32}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
    ),
    { ...size },
  );
}
