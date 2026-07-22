import { CaptureDraftProvider } from "@/context/CaptureDraftProvider";

export default function CaptureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CaptureDraftProvider>{children}</CaptureDraftProvider>;
}
