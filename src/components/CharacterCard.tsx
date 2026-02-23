"use client";

import Image from "next/image";
import { useState } from "react";

type CharacterCardProps = {
  name: string;
  description: string;
  imageSrc: string;
  variant: "core" | "method";
};

export default function CharacterCard({
  name,
  description,
  imageSrc,
  variant,
}: CharacterCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
      <div className="relative mb-4 h-44 overflow-hidden rounded-xl border border-dashed border-gray-300 bg-amber-50/60">
        {!imageFailed ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-4"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500">
            이미지 준비 중
          </div>
        )}
      </div>
      <div className="mb-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
        {variant}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{description}</p>
    </article>
  );
}
