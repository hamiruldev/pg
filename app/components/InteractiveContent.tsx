"use client";

import { useEffect, useRef } from "react";

interface InteractiveContentProps {
  pageContent: string;
}

export default function InteractiveContent({ pageContent }: InteractiveContentProps) {
  const carouselTrackRef = useRef(null);
  const carouselRef = useRef(null);

  // First useEffect for first carousel
  useEffect(() => {
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
  }, [pageContent]);

  // Second useEffect for second carousel
  useEffect(() => {
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
  }, [pageContent]);

  return (
    <div className="bg-gray-100 font-sans">
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
      
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