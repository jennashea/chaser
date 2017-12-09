# chaser
Hatsune Miku's computer system is under attack! Help her run from the viruses for as long as possible to get the highest score. When her health runs out, it's game over!

This game utilizes HTML, CSS, and JavaScript. It was written by Luis Garcia and Jenna Berlinberg, members of Dr. Ray Toal's favorite CMSI 185 class (Fall semester 2017).   The game is played on a canvas element on HTML with JavaScript linked.

The basic idea is a chaser game. The player moves the mouse, and the player's sprite follows it. The enemies spawn every 3 seconds and they move towards the player at varying speeds. When the player is hit by the enemy, the player's health (the progress bar) goes down. The game ends when the player's health goes to zero.

Every second, the score goes up by a factor of ten. The factor can be increased by using a powerup, which spawn occasionally on the canvas. Once the powerup has collided with the player, the powerup is activated. The three powerups are as follows:
-Health increase: adds 10 back to your health  
-Enemy eraser: removes the 3 oldest enemies from the game
-Score Multiplier: increases the amount of points added to your score each second by 10

We made a Sprite class that extends to the player, the enemies, and the powerups. The powerups extend further to the three types of powerups. Each have their own sprite images, made by our very own Luis Garcia.

This game has a restart button that not only restarts after you lose the game, but anytime you need it. The restart button resets everything in the game to the beginning.

The concept is based around Hatsune Miku of Vocaloid, who is an animated character who makes music. Basically, she is a celebrity computer. Since she is a computer, she would be vulnerable to viruses, so those are our enemies. The powerups are a leek for the score multiplier- a bit of a Miku inside joke, a health box for health (rather obvious), and a harisen (a Japanese fan, used to slap people).

All of the sprite images are made by Luis Garcia, because he is artsy, and Jenna is not. Both Luis and Jenna worked on the code.

Thanks Dr. Toal for all of your help! Hope you enjoy!

Play the game here! https://jennashea.github.io/chaser/
