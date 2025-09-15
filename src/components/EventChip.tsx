import * as React from "react";
import { type Event, type EventType } from "../types";
import { Popover, PopoverContent } from "./ui/popover";

function getEventChipClass(type: EventType): string {
    switch (type) {
        case "KICKOFF":
            return "event-chip kickoff";
        case "WORK WEEKEND":
            return "event-chip work-weekend";
        case "BOOTCAMP":
            return "event-chip bootcamp";
        case "EDUCATION":
            return "event-chip education";
        case "TOWN HALL":
            return "event-chip town-hall";
        case "DEMO":
            return "event-chip demo";
        default:
            return "event-chip";
    }
}

function getTypeLabelClass(type: EventType): string {
    switch (type) {
        case "KICKOFF":
            return "event-type-label kickoff";
        case "WORK WEEKEND":
            return "event-type-label work-weekend";
        case "BOOTCAMP":
            return "event-type-label bootcamp";
        case "EDUCATION":
            return "event-type-label education";
        case "TOWN HALL":
            return "event-type-label town-hall";
        case "DEMO":
            return "event-type-label demo";
        default:
            return "event-type-label";
    }
}

export function EventChip({ event }: { event: Event }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
    const [isMobilePopover, setIsMobilePopover] = React.useState(false);

    const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = (e) => {
        setPos({ x: e.clientX, y: e.clientY });
        // keep hover behavior for desktop
        if (
            event.subtopics &&
            !(typeof window !== "undefined" && window.innerWidth <= 767)
        )
            setOpen(true);
    };
    const onMouseLeave = () => {
        // don't auto-close on mobile persistent popovers
        if (
            typeof window !== "undefined" &&
            window.innerWidth <= 767 &&
            isMobilePopover
        )
            return;
        setOpen(false);
    };

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        console.log("EventChip onMouseDown", event.topic, {
            clientX: e.clientX,
            clientY: e.clientY,
        });
    };

    const lastPointerType = React.useRef<string | null>(null);
    const suppressBlur = React.useRef(false);

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        lastPointerType.current = e.pointerType;
        if (e.pointerType === "touch") {
            const hasSub = !!event.subtopics;
            const hasPres = !!(event as any).presenters;
            if (!hasSub && !hasPres) return;
            // prevent default to avoid immediate focus/blur races
            e.preventDefault();
            const mobile =
                typeof window !== "undefined" && window.innerWidth <= 767;
            setIsMobilePopover(mobile);
            setOpen(true);
            setPos({ x: e.clientX, y: e.clientY });
            openedAt.current = Date.now();
            // temporarily suppress blur handling
            suppressBlur.current = true;
            window.setTimeout(() => (suppressBlur.current = false), 300);
        }
    };

    // For touch devices, toggle on click/tap. Open if subtopics OR presenters exist.
    const onToggle: React.MouseEventHandler<HTMLDivElement> = (e) => {
        // NOTE: do not stop propagation here so outer handlers (and default browser behavior) still run.
        const hasSub = !!event.subtopics;
        const hasPres = !!(event as any).presenters;
        console.log(
            "EventChip onToggle: hasSub=",
            hasSub,
            "hasPres=",
            hasPres,
            "topic=",
            event.topic
        );
        if (!hasSub && !hasPres) return;
        const mobile =
            typeof window !== "undefined" && window.innerWidth <= 767;
        setIsMobilePopover(mobile);
        setOpen((s) => !s);
        // set an approximate position from touch point
        setPos({
            x: (e.nativeEvent as any).clientX ?? 0,
            y: (e.nativeEvent as any).clientY ?? 0,
        });
    };

    // Close popover when tapping/clicking outside on mobile (persistent behavior)
    const openedAt = React.useRef<number | null>(null);
    React.useEffect(() => {
        if (open) openedAt.current = Date.now();
        if (!open || !isMobilePopover) return;

        const onPointerDown = (ev: PointerEvent) => {
            // ignore the initial pointerdown that caused the open (within 50ms)
            if (openedAt.current && Date.now() - openedAt.current < 50) return;

            const target = ev.target as Node | null;
            const insideChip =
                ref.current && target && ref.current.contains(target);
            const insidePopover =
                popoverRef.current &&
                target &&
                popoverRef.current.contains(target);
            if (!insideChip && !insidePopover) {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open, isMobilePopover]);

    return (
        <Popover>
            <div
                ref={ref}
                tabIndex={0}
                aria-label={`${event.type}: ${event.topic}`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
                onPointerDown={onPointerDown}
                onClick={(e) => {
                    // If the last pointer was touch, we already opened in pointerdown
                    if (lastPointerType.current === "touch") {
                        lastPointerType.current = null;
                        return;
                    }
                    onToggle(e as any);
                }}
                onFocus={() =>
                    (event.subtopics || (event as any).presenters) &&
                    setOpen(true)
                }
                onBlur={() => {
                    // don't close on blur if mobile persistent popover is active
                    if (isMobilePopover) return;
                    setOpen(false);
                }}
                className={
                    getEventChipClass(event.type) + (open ? " chip-open" : "")
                }
            >
                <span className={getTypeLabelClass(event.type)}>
                    {event.type}
                </span>
                <div className="font-semibold">{event.topic}</div>
            </div>

            {open && (event.subtopics || (event as any).presenters) && (
                <PopoverContent
                    ref={(el) => {
                        popoverRef.current = el;
                    }}
                    className={
                        isMobilePopover ? "popover popover-mobile" : "popover"
                    }
                    style={
                        isMobilePopover
                            ? {
                                  left: undefined,
                                  top: undefined,
                                  right: 8,
                                  bottom: 8,
                              }
                            : {
                                  left: (pos?.x ?? 8) + 8,
                                  top: (pos?.y ?? 8) + 8,
                              }
                    }
                >
                    <div>
                        {/* If presenters exist, show them first in the requested format */}
                        {(event as any).presenters ? (
                            <div className="mb-2">
                                <div className="font-semibold">
                                    Paper of the Week Presenters:
                                </div>
                                <div>{(event as any).presenters}</div>
                            </div>
                        ) : null}

                        {/* Then show type + Subtopics label and content */}
                        <div className="font-semibold mt-1">
                            <span className="italic">{event.type}</span>{" "}
                            Subtopics:
                        </div>
                        <div>{formatSubtopics(event.subtopics ?? "")}</div>
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
}

function formatSubtopics(text: string) {
    const parts = text
        .split(/;|\n/g)
        .map((s) => s.trim())
        .filter(Boolean);
    return parts.join("\n");
}
