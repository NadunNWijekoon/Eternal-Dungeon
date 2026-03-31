# Implementation Plan - Graphical Battlescapes

The user wants to replace the abstract arcade neon grid with graphical, atmospheric backgrounds (e.g., forest, ruined village) to make it feel like a real war. 

## User Review Required

> [!IMPORTANT]  
> Before proceeding with the implementation, please review the two generated background concepts I have created for the battlefield:
> 
> **Option 1: Dark Forest Path**
> ![Dark Forest](C:\Users\Nadun N. Wijekoon\.gemini\antigravity\brain\3f9e3dfb-eb2c-4484-a732-bde249ca881d\forest_battlefield_1774934781460.png)
> 
> **Option 2: Ruined Village at Sunset**
> ![Ruined Village](C:\Users\Nadun N. Wijekoon\.gemini\antigravity\brain\3f9e3dfb-eb2c-4484-a732-bde249ca881d\ruined_village_battlefield_1774934813732.png)
> 
> **Which one do you prefer? Or should I make a different type (e.g., Desert, Dungeon Interior)?** We will use the selected image as the background for the `Battlefield.js` component.

## Proposed Changes

### Assets
#### [NEW] `assets/images/battle_bg.png`
- Save the chosen AI-generated image into the project's asset folder so it can be loaded locally.

### Components
#### [MODIFY] [Battlefield.js](file:///c:/Me/Proj/Eternal%20Dungeon/src/game/Battlefield.js)
-   **Remove** the `gridContainer`, `gridLineH`, `gridLineV`, and `scanline` elements.
-   **Add** an `<ImageBackground>` spanning the entire arena area, using the chosen asset.
-   **Add** an atmospheric overlay (e.g., a dark gradient at the bottom so the UI and character sprites still pop clearly).
-   **Adjust** the positions of the `AnimatedUnit` components to align with the path/ground level of the new background image.
-   *(Optional touch)* Add a slow, subtle Ken Burns pan effect (drifting left/right slightly) or particle overlays (dust/embers using Reanimated) to make the background feel "alive" during the fight.

#### [MODIFY] [GameScreen.js](file:///c:/Me/Proj/Eternal%20Dungeon/src/screens/GameScreen.js)
-   Adjust the container styling holding the `Battlefield` to remove the heavy purple borders and replace them with something more thematic (like a distressed stone border or a simple dark shadow box), so it matches the new RPG aesthetic rather than the synth-wave arcade look.

## Verification Plan

### Manual Verification
- Verify the background image loads correctly offline.
- Ensure the hero and enemy sprites are positioned correctly on the "ground" of the image.
- Check that the floating damage numbers are still legible against the new detailed background.
