"use client";

import { Suspense, useRef, useState, Component } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { EffectComposer } from "@react-three/postprocessing";
import { AsciiEffect } from "./ascii-effect";
import { useVideoTexture } from "@react-three/drei";

// Simple Error Boundary for Three.js / WebGL
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("WebGL Error caught in AsciiImage:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || <div className="webgl-fallback">Loading...</div>
      );
    }
    return this.props.children;
  }
}

function ImagePlane({ src, width, height, objectFit = "contain" }) {
  const texture = useLoader(TextureLoader, src);
  if (!texture) return null;

  const aspect = width / height;
  const imageAspect = texture.image
    ? texture.image.width / texture.image.height
    : 1;

  let scaleX, scaleY;
  const isCover = objectFit === "cover";

  if (isCover) {
    if (imageAspect > aspect) {
      scaleY = 4.66;
      scaleX = scaleY * imageAspect;
    } else {
      scaleX = 4.66 * aspect;
      scaleY = scaleX / imageAspect;
    }
  } else {
    if (imageAspect > aspect) {
      scaleX = 4.66 * aspect;
      scaleY = scaleX / imageAspect;
    } else {
      scaleY = 4.66;
      scaleX = scaleY * imageAspect;
    }
  }

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent={true} />
    </mesh>
  );
}

function VideoPlane({
  src,
  width,
  height,
  asciiRef,
  maxDuration,
  objectFit = "contain",
  brightness = 0,
  contrast = 1,
}) {
  const texture = useVideoTexture(src, {
    unsuspend: "canplay",
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "Anonymous",
  });

  const video = texture?.image;

  useFrame(() => {
    if (!asciiRef?.current || !video) return;

    try {
      const actualDuration = maxDuration || video.duration;
      const currentTime = video.currentTime;
      if (isNaN(actualDuration)) return;

      // Handle manual loop for maxDuration
      if (maxDuration && currentTime >= maxDuration) {
        // eslint-disable-next-line react-hooks/immutability
        video.currentTime = 0;
        return;
      }

      let localFade = 0;
      const fadeDuration = 0.5; // seconds

      if (currentTime < fadeDuration) {
        // Fade in
        localFade = -1.0 + currentTime / fadeDuration;
      } else if (currentTime > actualDuration - fadeDuration) {
        // Fade out
        localFade = -(
          (currentTime - (actualDuration - fadeDuration)) /
          fadeDuration
        );
      }

      const fadeBrightness = localFade;

      const effect = asciiRef.current;
      if (effect && effect.uniforms) {
        if (effect.uniforms.has("brightnessAdjust")) {
          effect.uniforms.get("brightnessAdjust").value =
            brightness + fadeBrightness;
        }
        if (effect.uniforms.has("contrastAdjust")) {
          effect.uniforms.get("contrastAdjust").value = contrast;
        }
      }
    } catch (e) {
      // Silently catch frame errors to prevent app-wide crash
    }
  });

  if (!texture) return null;

  const aspect = width / height;
  const videoAspect = video ? video.videoWidth / video.videoHeight : 1;

  let scaleX, scaleY;
  const isCover = objectFit === "cover";

  if (isCover) {
    if (videoAspect > aspect) {
      scaleY = 4.66;
      scaleX = scaleY * videoAspect;
    } else {
      scaleX = 4.66 * aspect;
      scaleY = scaleX / videoAspect;
    }
  } else {
    if (videoAspect > aspect) {
      scaleX = 4.66 * aspect;
      scaleY = scaleX / videoAspect;
    } else {
      scaleY = 4.66;
      scaleX = scaleY * videoAspect;
    }
  }

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent={true} />
    </mesh>
  );
}

function Scene({
  src,
  width,
  height,
  cellSize,
  enableColor,
  densePreset,
  maxDuration,
  objectFit,
  brightness,
  contrast,
}) {
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
  const asciiRef = useRef();

  return (
    <WebGLErrorBoundary
      fallback={
        <div className="ascii-error-fallback">Unable to load ASCII effect</div>
      }
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ preserveDrawingBuffer: true, alpha: true, antialias: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {isVideo ? (
            <VideoPlane
              src={src}
              width={width}
              height={height}
              asciiRef={asciiRef}
              maxDuration={maxDuration}
              objectFit={objectFit}
              brightness={brightness}
              contrast={contrast}
            />
          ) : (
            <ImagePlane
              src={src}
              width={width}
              height={height}
              objectFit={objectFit}
            />
          )}

          <EffectComposer disableNormalPass>
            <AsciiEffect
              ref={asciiRef}
              style={densePreset ? "dense" : "standard"}
              cellSize={cellSize}
              color={enableColor}
              invert={false}
              resolution={new Vector2(width, height)}
              brightness={brightness}
              contrast={contrast}
              postfx={{
                colorPalette: 0,
              }}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </WebGLErrorBoundary>
  );
}

export function AsciiImage({
  src,
  width = 300,
  height = 400,
  cellSize = 12,
  enableColor = true,
  densePreset = true,
  className = "",
  maxDuration = null,
  objectFit = "contain",
  brightness = 0,
  contrast = 1,
}) {
  return (
    <div
      className={`ascii-image-container ${className}`}
      style={{
        width: width,
        height: height,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Scene
        src={src}
        width={width}
        height={height}
        cellSize={cellSize}
        enableColor={enableColor}
        densePreset={densePreset}
        maxDuration={maxDuration}
        objectFit={objectFit}
        brightness={brightness}
        contrast={contrast}
      />
    </div>
  );
}
