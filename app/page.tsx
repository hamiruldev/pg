import { Suspense } from "react";
import Image from "next/image";
import { getDealerData, getPageContent } from "./lib/data";
import InteractiveContent from "./components/InteractiveContent";

// Server Component for loading state
function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem",
        zIndex: 1000
      }}
    >
      {/* Desktop Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url("/image-loading.png")',
          backgroundSize: "contain",
          backgroundPosition: "center",
          filter: "blur(5px)",
          opacity: 0.5
        }}
        className="desktop-bg"
      />

      {/* Mobile Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url("/image-loading-mb.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px)",
          opacity: 0.5
        }}
        className="mobile-bg"
      />

      {/* Loading Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: "#fff",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
        }}
      >
        <div
          className="loading-spinner"
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid rgba(255,255,255,0.3)",
            borderTop: "5px solid #fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}
        />
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Loading...</p>
      </div>
    </div>
  );
}

// Main Server Component
export default async function Home() {
  try {
    // Server-side data fetching
    const dealerUrl = await getDealerData();
    const pageContent = await getPageContent(dealerUrl);

    return (
      <Suspense fallback={<LoadingScreen />}>
        <InteractiveContent pageContent={pageContent} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in Home component:", error);
    return <LoadingScreen />;
  }
}
