# Sudoku-

## Description

A tool to play Sudoku on.

## Feature

### Custom Inputs

Using the Set Given button, users can set custom Sudoku boards.
Press "Set Given" to start setting your given numbers. Once you finish, press "Stop Setting Given". The timer will also reset upon finishing setting given inputs.

Once given numbers are set and user is out of Set Given mode, those numbers cannot be overwritten.

Warning: there is no checks on the givens, you can break Sudoku logic with this. The "Check Solved" button will take this into account though.

### Pencil Marking System

Pen marking is the standard fill in the entire cell.
Pencil marking are notations that are not used as official pen marking numbers.

Two systems: Corner and Center pencil markings.

To switch modes without shortcuts, press spacebar or click the mode button. The button text should change to the mode you are on.

#### Corner Marking

Shortcut: Shift + #
Delete: Shift + (Backspace or Del), additionally if the number you are trying to delete is already corner marked, use Shift + # to target delete.

General marking intended to mark results of BOX logic.

#### Center Marking

Shortcut: Ctrl + #
Delete: Ctrl + (Backspace or Del), additionally if the number you are trying to delete is already center marked, use Ctrl + # to target delete.

General marking intended to mark results of ROW / COLUMN logic.

### Multiple Highlight

Normal highlighting one cell at a time with single click.

Can highlight multiple cells by using Shift + Click OR Ctrl + Click.

Remove undesired highlights by clicking on already highlighted cells.
Mass remove highlights by clicking on a cell that is not highlighted.

### Arrow Keys or WASD

Can navigate the board using Arrow keys or WASD.

Arrow key navigation can also highlight multiple cells using Shift + arrow.

### Timer

Count-up timer.
Timer to keep track of how long you've been solving this puzzle.

### Get a random Sudoku puzzle

Create a random Sudoku puzzle.
New random puzzles use Dosuku API.

## Upcoming Features

1. Improved timer with pausing feature. Note if you pause, the board should be covered.
2. Different themes
3. About button with descriptions on the controls.
4. Dynamically change the mode button text based on modifier pressed.
5. Different sizings (mobile!)
6. Error checking - though this should be more of an option for the user. Some users may want a harder difficulty with no error checking
7. Sudoku generator. Currently Dosuku is fine, but would prefer to generate boards myself, preferably ones that have unique solutions and solvable via certain techniques.

## Created By

[exc](https://github.com/exchyphen)
