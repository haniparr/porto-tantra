"use client";

import { Suspense, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { EffectComposer } from "@react-three/postprocessing";
import { AsciiEffect } from "./ascii-effect";
import { useVideoTexture } from "@react-three/drei";

function ImagePlane({ src, width, height, objectFit = "contain" }) {
  const texture = useLoader(TextureLoader, src);
  const aspect = width / height;
  const imageAspect = texture.image.width / texture.image.height;

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
}) {
  const texture = useVideoTexture(src, {
    unsuspend: "canplay",
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "Anonymous",
  });

  const video = texture.image;

  useFrame(() => {
    if (!asciiRef?.current || !video) return;

    const actualDuration = maxDuration || video.duration;
    const currentTime = video.currentTime;
    if (isNaN(actualDuration)) return;

    // Handle manual loop for maxDuration
    if (maxDuration && currentTime >= maxDuration) {
      video.currentTime = 0;
      return;
    }

    let brightness = 0;
    const fadeDuration = 0.5; // seconds

    if (currentTime < fadeDuration) {
      // Fade in
      brightness = -1.0 + currentTime / fadeDuration;
    } else if (currentTime > actualDuration - fadeDuration) {
      // Fade out
      brightness = -(
        (currentTime - (actualDuration - fadeDuration)) /
        fadeDuration
      );
    }

    const effect = asciiRef.current;
    if (effect.uniforms) {
      effect.uniforms.get("brightnessAdjust").value = brightness;
    }
  });

  const aspect = width / height;
  const videoAspect = texture.image.videoWidth / texture.image.videoHeight;

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
}) {
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
  const asciiRef = useRef();

  return (
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
            postfx={{
              colorPalette: 0,
            }}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
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
      />
    </div>
  );
}
