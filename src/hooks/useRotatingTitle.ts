import { useEffect } from "react";

export function useRotatingTitle() {
  useEffect(() => {
    let interval: number;
    const originalTitle = "Hextorq | Academic Project Marketplace";
    const alternateTitles = [
      "💡 Ready for Your Viva?",
      "🚀 Get Project Setup Support",
      "🔥 Elite Engineering Codebases"
    ];
    let currentIndex = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Immediately set the first alternate title
        document.title = alternateTitles[currentIndex];
        currentIndex = (currentIndex + 1) % alternateTitles.length;

        interval = window.setInterval(() => {
          document.title = alternateTitles[currentIndex];
          currentIndex = (currentIndex + 1) % alternateTitles.length;
        }, 3000);
      } else {
        clearInterval(interval);
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      document.title = originalTitle;
    };
  }, []);
}
