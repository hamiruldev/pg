"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [dealerUrl, setDealerUrl] = useState("");
  const [pageContent, setPageContent] = useState("");
  const carouselTrackRef = useRef(null);
  const carouselRef = useRef(null);

  // First useEffect for initial content loading
  useEffect(() => {
    const handleDealerLoad = async () => {
      try {
        const response = await fetch("/api/update-index");
        const data = await response.json();

        if (!response.ok) {
          console.error("Error:", data.error);
          return;
        }

        setDealerUrl(data.url);

        const contentResponse = await fetch("/api/fetch-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url: data.url })
        });

        const contentData = await contentResponse.json();

        if (!contentResponse.ok) {
          console.error("Error fetching content:", contentData.error);
          return;
        }

        setPageContent(contentData.content);
        setIsLoading(false);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    handleDealerLoad();
  }, []);

  // Second useEffect for first carousel
  useEffect(
    () => {
      if (!pageContent) return;

      const carouselTrack = document.getElementById("carouselTrack");
      if (!carouselTrack) return;

      const items = document.querySelectorAll(".carousel-item");
      const totalItems = items.length;
      let currentIndex = 0;

      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        const translateX = -(currentIndex * 100);
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        carouselTrack.style.transition = "transform 0.5s ease-in-out";
      }, 3000);

      return () => clearInterval(interval);
    },
    [pageContent]
  );

  // Third useEffect for second carousel
  useEffect(
    () => {
      if (!pageContent) return;

      const carousel = document.getElementById("carousel");
      if (!carousel) return;

      let currentIndex2 = 0;
      const totalImages = 5;

      const getImagesPerSlide = () => (window.innerWidth >= 640 ? 3 : 1);

      const updateCarousel = () => {
        const imagesPerSlide = getImagesPerSlide();
        const offset = -currentIndex2 * (100 / imagesPerSlide);
        carousel.style.transform = `translateX(${offset}%)`;
      };

      const nextSlide = () => {
        const imagesPerSlide = getImagesPerSlide();
        const maxIndex = totalImages - imagesPerSlide;
        currentIndex2 = currentIndex2 < maxIndex ? currentIndex2 + 1 : 0;
        updateCarousel();
      };

      const prevSlide = () => {
        const imagesPerSlide = getImagesPerSlide();
        const maxIndex = totalImages - imagesPerSlide;
        currentIndex2 = currentIndex2 > 0 ? currentIndex2 - 1 : maxIndex;
        updateCarousel();
      };

      let autoScrollInterval = setInterval(nextSlide, 3000);

      const restartAutoScroll = () => {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(nextSlide, 3000);
      };

      const handleResize = () => {
        updateCarousel();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        clearInterval(autoScrollInterval);
        window.removeEventListener("resize", handleResize);
      };
    },
    [pageContent]
  );


  
  return (
    <div className="bg-gray-100 font-sans">
      {isLoading &&
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
                margin: "0 auto"
              }}
            />
            <p
              style={{
                marginTop: "1rem",
                fontSize: "1.2rem",
                fontWeight: "bold"
              }}
            >
              Loading...
            </p>
          </div>
        </div>}

      {pageContent &&
        <div
          dangerouslySetInnerHTML={{ __html: pageContent }}
          className="w-full h-full"
        />}

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .desktop-bg {
            display: none;
          }
          .mobile-bg {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .desktop-bg {
            display: block;
          }
          .mobile-bg {
            display: none;
          }
        }

        .text-center,
        .font-bold {
          color: black;
        }

        .text-white {
          color: white !important;
          text-align: center;
        }

        .carousel-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          width: 100%;
          transition: transform 0.5s ease-in-out;
        }

        .carousel-item {
          min-width: 100%;
          position: relative;
          flex-shrink: 0;
        }

        .carousel-item img {
          display: block;
          width: 100%;
          height: auto;
        }

        .carousel-item .bg-black {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .carousel-item button {
          z-index: 10;
        }

        #carousel {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }

        #carousel img {
          flex-shrink: 0;
          width: 100%;
          height: auto;
        }

        @media (min-width: 640px) {
          #carousel img {
            width: 100%;
          }
        }

        html {
          scroll-behavior: smooth;
        }

        .animation-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(229, 62, 62, 1);
          }

          70% {
            transform: scale(1);
            box-shadow: 0 0 0 15px rgba(229, 62, 62, 0);
          }
        }
      `}</style>
    </div>
  );
}
