# noisemap

This code uses Perlin noise to generate a visualization in HTML, CSS, and JavaScript.

### The Rundown

Essentially, this page displays a 20-by-20 grid of squares. The colors and positions of these squares are periodically updated. Upon each update, the page calculates the Perlin noise value for each square. This value is then translated to a number between 0 and 360, which is then used as the new hue for the square. Furthermore, this number is also translated into a different number between 0 and 70, constantly moving the spaces in a wavy pattern matching the colors neatly.

The net result is that this simulation displays a unique wavy pattern of constantly changing colors, not unlike a sheet billowing in the wind.

### What Needs Done
- [x] Add some interactivity—sliders to control speed, resolution, hue, and the like.
- [x] Stop this thing from grinding to a halt after four to five seconds
- [x] Comment and clean code
- [ ] Fix movement bugs