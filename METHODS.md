
# Flowy.js Function Documentation

| Function Name | Description |
|---------------|-------------|
| `flowy` | Main constructor function that initializes the Flowy library. It creates a drag-and-drop interface for building flowcharts with blocks. Takes parameters for the canvas element, callback functions, and spacing options. |
| `flowy.load` | Core initialization function that sets up the internal state, creates the canvas environment, and attaches all necessary event listeners. This prepares the system for block operations. |
| `flowy.import` | Reconstructs a previously saved flowchart by taking a JSON object with HTML and block data, rebuilding the DOM elements and recreating the internal block representation with proper positioning. |
| `flowy.output` | Serializes the current flowchart into a comprehensive JSON structure containing HTML markup, block positions, relationships, and any user-defined data stored in block elements. |
| `flowy.deleteBlocks` | Removes all blocks from the canvas and resets the internal block array, effectively clearing the entire flowchart while preserving the canvas environment. |
| `flowy.beginDrag` | Handles the start of dragging operations by detecting when a user clicks/touches a block, creates a clone of the original block, and sets up position tracking for the dragged element. |
| `flowy.endDrag` | Processes the completion of a drag operation, determining where to place the block based on proximity to other blocks, creating parent-child relationships, and triggering proper visual updates. |
| `flowy.moveBlock` | Controls block movement during dragging, updates positions, handles scrolling when approaching canvas edges, and provides visual indicators for possible attachment points. |
| `checkAttach` | Determines if a dragged block is positioned appropriately to connect with another block by calculating proximity and overlap with potential parent blocks. |
| `removeSelection` | Removes a dragged block from the DOM when it's not placed in a valid position, canceling the current dragging operation. |
| `firstBlock` | Provides specialized handling for the first block in a flowchart, either in initial placement or rearrangement scenarios, as it has no parent and anchors the flowchart. |
| `drawArrow` | Creates SVG arrow elements to visually connect blocks in parent-child relationships, calculating proper positioning and path coordinates. |
| `updateArrow` | Recalculates and updates the position, size, and path of connector arrows when blocks are moved or rearranged to maintain visual connections. |
| `snap` | Handles the complex logic of snapping blocks into position when released, including calculating proper spacing between sibling blocks, updating positions, and maintaining the visual hierarchy. |
| `touchblock` | Detects when a block is touched/clicked for the purpose of moving existing blocks rather than creating new ones, setting up the initial drag state. |
| `hasParentClass` | Utility function that traverses the DOM upward to check if an element or any of its ancestors has a specific CSS class, used for event delegation. |
| `checkOffset` | Ensures all blocks stay within the visible canvas area by adjusting positions when blocks would otherwise render outside the viewable area. |
| `rearrangeMe` | Comprehensive function that reorganizes all blocks to maintain proper layout hierarchy, spacing, and connections after any change to the flowchart structure. |
| `blockGrabbed` | Wrapper function that calls the user-provided callback when a block is initially grabbed, allowing custom behavior at the start of drag operations. |
| `blockReleased` | Wrapper function that calls the user-provided callback when a block is released, enabling custom behavior when drag operations complete. |
| `blockSnap` | Wrapper function that calls the user-provided validation callback to determine if a block can snap to a particular position, allowing custom rules for block placement. |
| `beforeDelete` | Wrapper function that calls the user-provided validation callback before deleting a block, enabling custom confirmation or prevention logic. |
| `addEventListenerMulti` | Utility function that attaches the same event listener to multiple DOM elements matching a selector, simplifying event binding. |
| `removeEventListenerMulti` | Utility function that removes event listeners from multiple DOM elements matching a selector, providing clean teardown capability. |
