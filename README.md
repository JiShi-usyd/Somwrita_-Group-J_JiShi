# Arcade Remake
## Interaction Instructions
My interaction method is to use the keyboard to interact: use the W, S, A, and D keys to control Pac-Man to move up, down, left, and right. And make Pac-Man walk along the maze path and then "eat" all four ghosts. When all ghosts are eaten, a message "Mission Success!" will pop up. And you can press the r key to restart a new game.
## Details
### Difference
The point is, unlike the traditional Pac-Man gameplay, where they need to eat rectangular pixels in the channel and avoid ghosts to get points, our gameplay is to "eat" the ghosts.

![A gif of Pacman](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG94enNkMGF3cmlucjB1ZzNuZjM4dzVuZDA1cDd3aWJoazBkdnR4eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/d9QiBcfzg64Io/giphy.gif)
### Animation
In this project, I animated Pacman's position, the ghost's state, and the game over state. 
#### Technical Implementation
Pacman's animation is implemented by changing its direction through keyboard input. The movement updates its coordinates according to the current direction, and a new position is drawn each frame to create the illusion of animation. 
Ghosts are initialized at random path positions, each with an `alive` state set to `true`. When Pacman gets close to a ghost, the `checkEatGhosts()` function detects the collision based on distance and sets the ghost’s `alive` status to `false`. 
The game ends when all ghosts are eaten, and the `gameOver` flag becomes `true`. This state is checked in the `draw()` loop, which then displays a success message overlay.
Pacman's movement is constrained to a series of predefined maze paths. Coordinate checks are performed to ensure that Pacman remains on a valid path before updating its position.