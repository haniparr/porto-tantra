"use client";

import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { EffectComposer } from "@react-three/postprocessing";
import { AsciiEffect } from "./ascii-effect";
import { useVideoTexture } from "@react-three/drei";

function ImagePlane({ src, width, height }) {
  const texture = useLoader(TextureLoader, src);
  const aspect = width / height;
  const scaleY = 4.66;
  const scaleX = scaleY * aspect;

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function VideoPlane({ src, width, height }) {
  const texture = useVideoTexture(src, {
    unsuspend: "canplay",
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "Anonymous",
  });

  const aspect = width / height;
  const scaleY = 4.66;
  const scaleX = scaleY * aspect;

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Scene({ src, width, height, cellSize, enableColor, densePreset }) {
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%", background: "#000000" }}
      gl={{ preserveDrawingBuffer: true, alpha: true, antialias: false }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#000000"]} />

      <Suspense fallback={null}>
        {isVideo ? (
          <VideoPlane src={src} width={width} height={height} />
        ) : (
          <ImagePlane src={src} width={width} height={height} />
        )}

        <EffectComposer disableNormalPass>
          <AsciiEffect
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
}) {
  return (
    <div
      className={`ascii-image-container ${className}`}
      style={{
        width: width,
        height: height,
        overflow: "hidden",
        backgroundColor: "#000",
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
      />
    </div>
  );
}
