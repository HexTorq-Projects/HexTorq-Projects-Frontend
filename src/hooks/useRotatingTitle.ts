import { useEffect } from "react";

export function useRotatingTitle() {
  useEffect(() => {
    let interval: number;
    const originalTitle = "Hextorq | Academic Project Marketplace";
    const originalFavicon = "/favicon.svg";
    
    const alternateTitles = [
      "Ready for Your Viva?",
      "Get Project Setup Support",
      "Elite Engineering Codebases",
      "3,800+ Project Templates",
      "AI/ML, Web, IoT & More",
      "Viva-Ready Documentation",
      "Browse Premium Projects",
      "Academic Project Marketplace",
      "14+ Academic Streams",
      "Defend with Confidence"
    ];
    
    const alternateFavicons = [
      "/logos/logo_1_minimal_h_1784617457135.png",
      "/logos/logo_2_x_accent_1784617470476.png",
      "/logos/logo_3_hexagon_h_1784617482266.png",
      "/logos/logo_4_gear_h_1784617493907.png",
      "/logos/logo_5_static_h_1784617506315.png",
      "/logos/logo_6_circuit_h_1784617532118.png",
      "/logos/logo_7_shield_h_1784617542582.png",
      "/logos/logo_8_wave_h_1784617553982.png",
      "/logos/logo_9_diamond_h_1784617618307.png",
      "/logos/logo_10_stacked_h_1784617589220.png"
    ];
    
    let currentIndex = 0;

    const changeFavicon = (src: string) => {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = src;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Immediately set the first alternate title and favicon
        document.title = alternateTitles[currentIndex];
        changeFavicon(alternateFavicons[currentIndex]);
        currentIndex = (currentIndex + 1) % alternateTitles.length;

        interval = window.setInterval(() => {
          document.title = alternateTitles[currentIndex];
          changeFavicon(alternateFavicons[currentIndex]);
          currentIndex = (currentIndex + 1) % alternateTitles.length;
        }, 3000);
      } else {
        clearInterval(interval);
        document.title = originalTitle;
        changeFavicon(originalFavicon);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      document.title = originalTitle;
      changeFavicon(originalFavicon);
    };
  }, []);
}
