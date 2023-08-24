# noisemap

This code uses Perlin noise to generate a visualization in HTML, CSS, and JavaScript.

### The Rundown

Essentially, this page displays a 20-by-20 grid of squares. The colors of these squares are periodically updated. Upon each update, the page calculates the Perlin noise value for each square. This value is then translated to a number between 0 and 360, which is then used as the new hue for the square.

### What Needs Done
- [ ] Add some interactivity—sliders to control speed, resolution, hue, and the like. There is already a sub-menu being created for this purpose
- [ ] Fix lag
- [ ] Comment and clean code
