"use client";

import React, { useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import BannerSection from "../bannerSection/component/BannerSection";
import HeroSection from "../heroSection/component/HeroSection";
import AboutSection from "../aboutSection/component/AboutSection";

export default function IntroductionSectionManagement() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "banner";

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Introduction Section
        </h1>
        <nav className="flex items-center text-sm text-gray-500 mt-1">
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 font-medium">Introduction Section</span>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50/50 p-1 rounded-lg">
            <TabsTrigger
              value="banner"
              className={cn(
                "font-bold py-3 transition-all duration-300 ",
                activeTab === "banner"
                  ? "bg-[#005696] text-white shadow-md rounded-md"
                  : "text-gray-500 hover:text-[#0057B8] hover:bg-white/50",
              )}
            >
              Banner Section
            </TabsTrigger>
            <TabsTrigger
              value="hero"
              className={cn(
                "font-bold py-3 transition-all duration-300",
                activeTab === "hero"
                  ? "bg-[#005696] text-white shadow-md rounded-md"
                  : "text-gray-500 hover:text-[#0057B8] hover:bg-white/50",
              )}
            >
              Hero Section
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className={cn(
                "font-bold py-3 transition-all duration-300",
                activeTab === "about"
                  ? "bg-[#005696] text-white shadow-md rounded-md"
                  : "text-gray-500 hover:text-[#0057B8] hover:bg-white/50",
              )}
            >
              About Section
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 transition-all duration-500 ease-in-out">
            <TabsContent value="banner" className="mt-0 focus-visible:outline-none data-[state=inactive]:hidden animate-in fade-in duration-500">
              <BannerSection showHeader={false} />
            </TabsContent>

            <TabsContent value="hero" className="mt-0 focus-visible:outline-none data-[state=inactive]:hidden animate-in fade-in duration-500">
              <HeroSection showHeader={false} showAddButton />
            </TabsContent>

            <TabsContent value="about" className="mt-0 focus-visible:outline-none data-[state=inactive]:hidden animate-in fade-in duration-500">
              <AboutSection showHeader={false} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
