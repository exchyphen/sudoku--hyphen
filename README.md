# Sudoku-

## Active Link

[Sudoku- by exc](https://exchyphen.github.io/sudoku--hyphen/)

## Description

A tool to play Sudoku on.

## Feature

### Custom Inputs

Using the Set Given button, users can set custom Sudoku boards.
Press "Set Given" to start setting your given numbers. Once you finish, press "Stop Setting Given". The timer will also reset upon finishing setting given inputs.

Any numbers set during Set Given mode cannot be changed outside of Set Given mode.

Duplicates/blocking numbers will be highlighted and will affect "Check Solved" if not resolved.

### Pencil Marking System

Pen marking marks the value of the cell. This is the only number accounted for when checking the board.

Pencil marking are notations for the user only. No pencil markings will be taken into account during checks.
Two systems of pencil marking: Corner and Center pencil markings.

To switch modes without shortcuts, press spacebar or click the mode button. The button text should change to the mode you are on.
If using shortcuts, the mode will change based on the shortcut being held down. Example: if the Shift key is held down, the mode button will change to "Corner".

#### Corner Marking

Shortcut: Shift + #
Delete: Shift + (Backspace or Del), additionally if the number you are trying to delete is already corner marked, use Shift + # to target delete.

General marking intended to mark results of BOX logic.

#### Center Marking

Shortcut: Ctrl + #
Delete: Ctrl + (Backspace or Del), additionally if the number you are trying to delete is already center marked, use Ctrl + # to target delete.

General marking intended to mark results of ROW / COLUMN logic.

### Multiple Highlight

Simply highlight a cell by clicking or using arrow keys.

Add onto currently highlighted cells by using Shift + Click OR Ctrl + Click.
User can also use Shift + Arrow Key or Ctrl + Arrow Key for adding adjacent cells.

Remove undesired highlights by clicking on already highlighted cells.
Mass remove highlights by clicking on a cell that is not highlighted.

### Arrow Keys or WASD

Additional navigation option using Arrow keys or WASD.

Arrow key navigation can also highlight multiple cells using Shift + arrow or Ctrl + arrow.

### Timer

Count-up timer.
Timer to keep track of how long you've been solving this puzzle.

### Multiple Number / Blocking Number Detection

If a pen marking breaks Sudoku rules, all affected cells will be highlighted.
Additionally, if a pen marking blocks any pencil markings, the affected pencil markings will be highlighted.

### Get a random Sudoku puzzle

Create a random Sudoku puzzle.
New random puzzles use Dosuku API.

## Upcoming Features

1. Improved timer with pausing feature. Note if you pause, the board should be covered.
2. Different themes
3. About button with descriptions on the controls.
4. Different sizings (mobile!)
5. Sudoku generator. Currently Dosuku is fine, but would prefer to generate boards myself, preferably ones that have unique solutions and solvable via certain techniques.

## Created By

[exc](https://github.com/exchyphen)
