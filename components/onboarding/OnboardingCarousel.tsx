"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setOnboardingCompleted } from "@/lib/onboarding";
import { t } from "@/lib/i18n";
import { FocusMarkIcon, MicIcon } from "@/components/icons";

const SLIDES = [
  { key: "slide1", copy: t.onboarding.slide1, Preview: CapturePreview },
  { key: "slide2", copy: t.onboarding.slide2, Preview: StructurePreview },
  { key: "slide3", copy: t.onboarding.slide3, Preview: TodayPreview },
] as const;

const SWIPE_THRESHOLD_PX = 40;

export function OnboardingCarousel() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const isLast = index === SLIDES.length - 1;

  const goNext = () => setIndex((i) => Math.min(i + 1, SLIDES.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleStart = () => {
    setOnboardingCompleted();
    router.replace("/capture");
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLast) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - left;
    if (tapX < width / 3) goPrev();
    else goNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) goNext();
    else goPrev();
  };

  const { copy, Preview } = SLIDES[index];

  return (
    <div
      className="flex h-dvh w-full flex-col bg-dark-surface px-6"
      style={{
        paddingTop: "calc(var(--safe-top) + 20px)",
        paddingBottom: "calc(var(--safe-bottom) + 28px)",
      }}
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center gap-1.5 text-dark-surface-foreground">
        <FocusMarkIcon className="h-5 w-5" />
        <span className="text-[19px] font-semibold tracking-tight">Focus</span>
      </div>

      {/* The card+text group is vertically centered in the space between the header
          and the bottom controls, so it feels balanced regardless of card height —
          rather than anchored to a fixed offset from the top. A fixed upward
          translate (not a margin) shifts the whole group as one unit, the same
          amount on every slide, without disturbing the bottom controls below it. */}
      <div
        className="flex flex-1 flex-col items-center justify-center"
        style={{ transform: "translateY(-48px)" }}
      >
        {/* Fixed-height, bottom-aligned box: every card's bottom edge (and so its
            gap to the heading) lands in the same place, so the gap stays small and
            consistent even though the three preview cards are very different heights
            (68px / 209px / 186px). */}
        <div className="flex h-[210px] w-full items-end justify-center">
          <Preview />
        </div>

        <div className="mt-5 w-full">
          <h1 className="text-[22px] font-semibold leading-snug text-dark-surface-foreground">
            {copy.title}
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-dark-surface-muted">
            {copy.body}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pb-2">
        {isLast && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
            className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-[16px] font-semibold text-dark-surface transition-transform duration-150 active:scale-[0.98]"
          >
            {t.onboarding.start}
          </button>
        )}

        <div className="flex items-center justify-center gap-1.5">
          {SLIDES.map((slide, i) => (
            <span
              key={slide.key}
              className={`h-1.5 rounded-full bg-dark-surface-foreground transition-all duration-200 ${
                i === index ? "w-6 opacity-100" : "w-1.5 opacity-40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CapturePreview() {
  return (
    <div className="w-full rounded-[20px] bg-surface p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] text-muted">{t.capture.prompt}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-dark-surface">
          <MicIcon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

const STRUCTURE_ITEMS = [
  { title: "Підготувати презентацію", color: "var(--priority-high)", badge: t.composer.priorityHigh },
  { title: "Подзвонити мамі", color: "var(--priority-medium)", badge: t.composer.priorityMedium },
  { title: "Купити продукти", color: "var(--priority-low)", badge: t.composer.priorityLow },
] as const;

function StructurePreview() {
  return (
    <div className="w-full overflow-hidden rounded-[20px] bg-surface shadow-lg">
      {STRUCTURE_ITEMS.map((item, i) => (
        <div
          key={item.title}
          className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-divider" : ""}`}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] text-foreground">{item.title}</p>
            {item.badge && (
              <span
                className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: `color-mix(in srgb, ${item.color} 16%, transparent)`, color: item.color }}
              >
                {item.badge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const TODAY_ITEMS = [
  { title: "Підготувати презентацію", time: "09:00", color: "var(--priority-high)" },
  { title: "Подзвонити мамі", time: "11:00", color: "var(--priority-medium)" },
  { title: "Зустріч з командою", time: "14:00", color: "var(--priority-low)" },
] as const;

function TodayPreview() {
  return (
    <div className="w-full overflow-hidden rounded-[20px] bg-surface shadow-lg">
      <div className="border-b border-divider px-4 py-3">
        <span className="text-[13px] font-semibold text-foreground">{t.nav.today}</span>
      </div>
      {TODAY_ITEMS.map((item, i) => (
        <div
          key={item.title}
          className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-divider" : ""}`}
        >
          <span
            className="h-4 w-4 shrink-0 rounded-full border-[1.5px]"
            style={{ borderColor: item.color }}
          />
          <span className="min-w-0 flex-1 truncate text-[14px] text-foreground">{item.title}</span>
          <span className="shrink-0 text-[12px] text-muted">{item.time}</span>
        </div>
      ))}
    </div>
  );
}
