# Arcade Remake
## Interaction Instructions
My interaction method is to use the keyboard to interact: use the W, S, A, and D keys to control Pac-Man to move up, down, left, and right. And make Pac-Man walk along the maze path and then "eat" all four ghosts. When all ghosts are eaten, a message "Mission Success!" will pop up. And you can press the r key to restart a new game.
## Details
### Difference
The point is, unlike the traditional Pac-Man gameplay, where they need to eat rectangular pixels in the channel and avoid ghosts to get points, our gameplay is to "eat" the ghosts.
![A gif of Pacman](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG94enNkMGF3cmlucjB1ZzNuZjM4dzVuZDA1cDd3aWJoazBkdnR4eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/d9QiBcfzg64Io/giphy.gif)
### Technical Implementation
The maze consists of a series of path segments, and Pac-Man's movement is restricted to these paths. Coordinate checks are required to ensure that Pac-Man stays on a valid path.
A simple distance-based check is performed between Pac-Man and the ghost, and the ghost disappears when it is within a certain range of Pac-Man.