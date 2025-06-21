import { Suspense, lazy } from "react";
import { getDealerData, getPageContent } from "./lib/data";

// Dynamic imports for heavy components
const InteractiveContent = lazy(() => import("./components/InteractiveContent"));

// Static Site Generation
export const dynamic = 'force-static';

// Loading state component
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

// Main Server Component with Static Generation
export default async function Home() {
  const startTime = Date.now();
  
  try {
    // Server-side data fetching - get dealer URL first, then content
    const dealerUrl = await getDealerData();
    const pageContent = await getPageContent(dealerUrl);
    
    // Add timestamp for debugging cache issues
    const timestamp = new Date().toISOString();
    const loadTime = Date.now() - startTime;

    return (
      <Suspense fallback={<LoadingScreen />}>
        <InteractiveContent pageContent={pageContent} />
        {/* Hidden timestamp for debugging */}
        {/* <div style={{ display: 'none' }} data-timestamp={timestamp} data-load-time={loadTime}>
          Last updated: {timestamp} | Load time: {loadTime}ms | Static Site Generation
        </div> */}
      </Suspense>
    );
  } catch (error) {
    console.error("Error in Home component:", error);
    return <LoadingScreen />;
  }
}
