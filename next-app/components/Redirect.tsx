"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.push(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div> </div>;
}
