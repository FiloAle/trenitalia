# Ticket Card Redesign

## Proposed Changes
1. Modify `components/trips/ticket-item.tsx`.
2. Add state for `cardLayout` and `notchX`.
3. Wrap the card in a standard `<View>` or `<Pressable>` with `relative overflow-hidden`.
4. Render the `<Svg>` border background with the cutouts at top and bottom.
5. Render the vertical dashed line `<Svg>` at `notchX`.
6. Remove the current `border-r` from the left column.
7. We will use the same Svg math from TravelSolutionCard adapted for top/bottom notches instead of left/right notches.

I will verify the styling works by inspecting the app.
