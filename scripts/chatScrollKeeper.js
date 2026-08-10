/**
 * Keeps a ChatLog pinned only while the user is actually following the bottom.
 * One observer is attached per ChatLog instead of scheduling per-message timers.
 */
export class ChatScrollKeeper {
    static BOTTOM_THRESHOLD = 24;
    static states = new WeakMap();
    static initialized = false;

    static initialize() {
        if (this.initialized) return;
        this.initialized = true;

        const ChatLog = foundry.applications.sidebar.tabs.ChatLog;

        Hooks.on("renderApplicationV2", (app, element) => {
            if (app instanceof ChatLog) this.attach(app, element);
        });

        Hooks.on("closeApplicationV2", (app) => {
            if (app instanceof ChatLog) this.detach(app);
        });

        Hooks.once("ready", () => {
            for (const app of [ui.chat, ui.chat?.popout]) {
                if (app?.rendered && app.element) this.attach(app, app.element);
            }
        });
    }

    static attach(app, root) {
        root = root instanceof HTMLElement ? root : root?.[0];
        const scroller = root?.querySelector?.(".chat-scroll");
        const log = root?.querySelector?.(".chat-log");
        if (!scroller || !log) return false;

        const existing = this.states.get(app);
        if (existing?.scroller === scroller && existing?.log === log) return true;
        this.detach(app);

        const sticky = this.isNearBottom(scroller);
        const state = {
            sticky,
            userDetached: !sticky,
            destroyed: false,
            adjusting: false,
            raf: 0,
            releaseRaf: 0,
            previousScrollHeight: scroller.scrollHeight,
            previousClientHeight: scroller.clientHeight,
            previousScrollTop: scroller.scrollTop
        };

        const updateMetrics = () => {
            state.previousScrollHeight = scroller.scrollHeight;
            state.previousClientHeight = scroller.clientHeight;
            state.previousScrollTop = scroller.scrollTop;
        };

        const cancelScheduledPin = () => {
            if (!state.raf) return;
            cancelAnimationFrame(state.raf);
            state.raf = 0;
        };

        const onWheel = (event) => {
            if (state.destroyed) return;
            if (event.deltaY >= 0) return;
            state.sticky = false;
            state.userDetached = true;
            cancelScheduledPin();
        };

        const onScroll = () => {
            if (state.destroyed) return;
            if (state.adjusting) return;

            const distance = this.distanceFromBottom(scroller);
            const movedUp = scroller.scrollTop < state.previousScrollTop - 1;

            if (distance <= 1) {
                state.sticky = true;
                state.userDetached = false;
            } else if (movedUp) {
                state.sticky = false;
                state.userDetached = true;
                cancelScheduledPin();
            } else if (!state.userDetached && distance <= this.BOTTOM_THRESHOLD) {
                state.sticky = true;
            }

            updateMetrics();
        };

        const pinToBottom = () => {
            state.raf = 0;
            if (state.destroyed || !state.sticky || !scroller.isConnected) return;

            if (this.distanceFromBottom(scroller) <= 1) {
                updateMetrics();
                return;
            }

            state.adjusting = true;
            scroller.scrollTop = scroller.scrollHeight;
            updateMetrics();

            state.releaseRaf = requestAnimationFrame(() => {
                state.releaseRaf = 0;
                state.adjusting = false;
                if (this.distanceFromBottom(scroller) <= 1) {
                    state.sticky = true;
                    state.userDetached = false;
                }
                updateMetrics();
            });
        };

        const schedulePin = () => {
            if (state.destroyed || state.raf || !state.sticky) return;
            state.raf = requestAnimationFrame(pinToBottom);
        };

        const onResize = () => {
            if (state.destroyed) return;
            const previousBottom = Math.max(
                0,
                state.previousScrollHeight - state.previousClientHeight
            );
            const wasAtBottom = Math.abs(
                previousBottom - state.previousScrollTop
            ) <= this.BOTTOM_THRESHOLD;
            const isAtBottom = this.distanceFromBottom(scroller) <= 1;

            if (isAtBottom) {
                state.sticky = true;
                state.userDetached = false;
            } else if (!state.userDetached && (state.sticky || wasAtBottom)) {
                state.sticky = true;
            }

            updateMetrics();
            schedulePin();
        };

        const observer = new ResizeObserver(onResize);
        observer.observe(log);
        observer.observe(scroller);
        scroller.addEventListener("scroll", onScroll, { passive: true });
        scroller.addEventListener("wheel", onWheel, { passive: true });

        this.states.set(app, {
            app,
            log,
            scroller,
            state,
            observer,
            onScroll,
            onWheel,
            schedulePin
        });

        return true;
    }

    static detach(app) {
        const entry = this.states.get(app);
        if (!entry) return;

        entry.state.destroyed = true;
        entry.observer.disconnect();
        entry.scroller.removeEventListener("scroll", entry.onScroll);
        entry.scroller.removeEventListener("wheel", entry.onWheel);

        if (entry.state.raf) cancelAnimationFrame(entry.state.raf);
        if (entry.state.releaseRaf) cancelAnimationFrame(entry.state.releaseRaf);

        this.states.delete(app);
    }

    /**
     * Request an immediate pin for a newly posted message while the user is
     * already following the bottom.
     */
    static requestPin(app, { force = false } = {}) {
        let entry = this.states.get(app);
        if (!entry && app?.element) {
            this.attach(app, app.element);
            entry = this.states.get(app);
        }
        if (!entry) return false;

        if (force) {
            entry.state.sticky = true;
            entry.state.userDetached = false;
        }
        entry.schedulePin();
        return true;
    }

    static isFollowing(app) {
        const entry = this.states.get(app);
        if (!entry) return undefined;
        return entry.state.sticky && !entry.state.userDetached;
    }

    static distanceFromBottom(scroller) {
        return Math.max(
            0,
            scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop
        );
    }

    static isNearBottom(scroller) {
        return this.distanceFromBottom(scroller) <= this.BOTTOM_THRESHOLD;
    }
}
