VISIT SALONE - IMAGES
=====================

Every picture on the site is an <img> tag whose src says:

    PASTE_YOUR_IMAGE_URL_HERE

Find it in the HTML file, directly under a comment such as
"IMAGE 1: HOME HERO", and replace it with your image address:

    <img src="https://example.com/my-photo.jpg" alt="...">

You can also save a photo in this images/ folder and use:

    <img src="images/my-photo.jpg" alt="...">

Also update the alt text to describe your photo.

Where the images are (counting top to bottom in each file)
- index.html        : 1 hero + 4 destination cards (Freetown, Turtle Islands, Bonthe, Kamberi Hills)
- destinations.html : 6 cards (Freetown, Turtle Islands, Bonthe, Kamberi Hills, Tacugama, Sumbuya)
- about.html        : 1 About image
- services.html     : none
- contact.html      : none (also replace the two PASTE_ social media URLs)

You never need to edit the CSS. Each image sits inside a fixed-ratio box and is
cropped to fill it (object-fit: cover), so any size of photo will fit.
If an image fails to load, the grey placeholder box stays in place.
