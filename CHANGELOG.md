## 📢 Update: Character Chat Selector v3.5.1

### 🐛 Bug Fixes
- Fixed the remaining D&D5e portrait flicker when Polyglot refreshes existing chat messages after token or actor changes.
- CCS portraits are now applied after D&D5e finishes rendering each chat card, preventing the default square avatar from briefly appearing before the configured portrait.
- Kept the compatibility fallback for older D&D5e typed chat cards and limited D&D-specific avatar wrapper handling to D&D5e.

## 📢 Update: Character Chat Selector v3.5.0

### Changed
- Reworked chat bottom tracking to use one observer for the chat log instead of repeated timers on individual messages.
- Restored Foundry's native chat scroll state and listeners to reduce conflicts with system and module rendering.

### 🐛 Bug Fixes
- Fixed intermittent bottom tracking while D&D5e cards finish rendering.
- Fixed chat flicker and delayed jumps caused by repeated scroll corrections.
- Scrolling upward now keeps the current reading position when new messages arrive or are sent. Bottom tracking resumes after returning to the bottom.
- Preserved D&D5e's avatar wrapper and narrowed header and portrait CSS rules to prevent layout conflicts.

## 📢 Update: Character Chat Selector v3.4.12

### 🐛 Bug Fixes
- Fixed `/as` with no name failing to disable temporary NPC mode after chat input normalization removed the trailing space.

## 📢 Update: Character Chat Selector v3.4.11

### 🐛 Bug Fixes
- Fixed `/em`, `/emote`, and `/me` messages placing the actor name on its own line when Markdown created multiple paragraphs from blank lines.

## 📢 Update: Character Chat Selector v3.4.10

### 🐛 Bug Fixes
- Fixed V14 chat commands (`/r`, `/gm`, `/me`, `/w`, and the module's `/c` actor switch) being treated as plain chat text. V14 wraps chat input in `<p>...</p>` before reaching the chat processor, so the module's command override no longer matched against the literal slash. Input is now normalized before command detection.

## 📢 Update: Character Chat Selector v3.4.9

### 🐛 Bug Fixes
- Fixed a PF2E chat header layout conflict where the module's header styling could override PF2E's grid layout, causing the message author line to appear beside the character name.
- Fixed a CoC7E compatibility issue where the Fight Back weapon dropdown could appear at the top of the chat log because chat message positioning from this module interfered with CoC7E's dropdown placement.

## 📢 Update: Character Chat Selector v3.4.8

### 🐛 Bug Fixes
- The speaker override was too aggressive — it replaced the sender on every outgoing chat message, including ones that other modules constructed with a deliberate speaker. The hook now respects messages that carry a `smartphone-widget` flag, or a generic `character-chat-selector.skip` flag any module can set to preserve its own speaker. This fixes Smartphone Widget's Messages App showing up under the selector's active character instead of the phone contact.

## 📢 Update: Character Chat Selector v3.4.7

### 🐛 Bug Fixes
- Fixed chat editor crash on V14 caused by deprecated global `mergeObject` call (`ReferenceError: mergeObject is not defined`).

## 📢 Update: Character Chat Selector v3.4.6

### Changed
- Now supports Foundry VTT V13 and V14. Previous versions are no longer supported.

### 🐛 Bug Fixes
- Fixed autocomplete crash on V14 due to chat input element changes.
- Fixed 404 errors when autocomplete displayed actors without a portrait image.

## 📢 Update: Character Chat Selector v3.4.5

### 🐛 Bug Fixes

* **PF2E/SF2E Portrait Duplication:** Fixed an issue where PF2E and SF2E chat messages could display duplicate portraits by correctly replacing system portrait containers (e.g. `.portrait.token`) with the module portrait.


## 📢 Update: Character Chat Selector v3.4.4

### 🐛 Bug Fixes

* **Chat Scroll Stability:** Fixed a persistent issue in D&D 5e where the chat log failed to auto-scroll to the very bottom when new messages arrived.
* **Enhanced Optimization:** Implemented more robust rendering optimizations for the chat log to significantly improve performance and responsiveness.



### 📢 Update: Character Chat Selector v3.4.3

### 🐛 Bug Fixes

* **HP Tint Stability:** Fixed a console error (`TypeError: Cannot read properties of null`) that occurred when applying tint effects to messages without portraits. Added a safety check to `HpTintEffect` to ensure the portrait container exists before processing.
* **Settings Persistence:** Fixed an issue where the "Enable Hotkeys" setting would appear unchecked when reopening the configuration menu, even if it was enabled. The setting value is now correctly loaded and displayed.

** 🌏 Localization**

* **PT-BR Update:** Updated Portuguese (Brazil) localization. A huge thanks to Kharmans for the continuous and consistent updates!

## :loudspeaker: Update: Character Chat Selector v3.4.2

:bug: **Bug Fixes**

*   **Personal Themes Visibility:** Fixed a regression from v3.4.1 where custom portrait borders and colors were not displaying correctly on other users' screens (e.g., the GM seeing black borders instead of the player's chosen color). The CSS priority has been adjusted to ensure personal themes override system defaults correctly.
*   **Chat Border Sync:** Fixed logic to ensure the chat message border color correctly reflects the *author's* personal settings when "Allow Personal Themes" is enabled.

:hammer_and_wrench: **System Support**

*   **WFRP4e Compatibility:** Added support for **Warhammer Fantasy Roleplay 4th Edition**.
    *   Added a new setting: **"Hide WFRP4e Default Token"**. This option allows you to hide the default system token image to prevent duplicate portraits (Only visible when running the WFRP4e system).

:earth_asia: **Localization**

*   **PT-BR Update:** Updated Portuguese (Brazil) localization. A huge thanks to **Kharmans** for the continuous and consistent updates!

## :loudspeaker: Update: Character Chat Selector v3.4.1

:bug: **Bug Fixes**

* **Module Compatibility (CSS):** Fixed a major issue where the module's border styles were aggressively applying to **all** chat messages (including system rolls, Midi-QOL cards, etc.). The styles are now strictly isolated to messages handled by this module via a specific class (`.ccs-custom-border`).
* **Chat Bar Duplication:** Fixed a bug where saving settings triggered a full chat log refresh, causing other modules to duplicate their buttons in the chat control bar. The settings menu now updates the UI dynamically without forcing a full re-render.
* **Code Correction:** Fixed a function reference error (`updateSelector` is not a function) that occurred when toggling the "Show Chat Selector" setting.

:earth_asia: **Localization**

* **Missing Translation Keys:** Added missing language keys for the new settings window (Tabs, Section Headers, Live Preview text).
*  **PT-BR Update:** Updated Portuguese (Brazil) localization, thanks to **Kharmans**!
