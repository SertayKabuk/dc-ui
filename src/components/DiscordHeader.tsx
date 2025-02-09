'use client';

import AutoRefresh from "@/components/AutoRefresh";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function DiscordHeader() {
  const router = useRouter();
  
  const handleRefresh = useCallback(async () => {
    router.refresh();
  }, [router]);

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Discord Servers</h1>
      <AutoRefresh 
        interval={60}
        onRefresh={handleRefresh}
      />
    </div>
  );
}