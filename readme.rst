=============
Mobile Python
=============

The primary purpose of this project is to bring the the Python shell with multiple versions into the browser.

Screenshot:

http://dl.dropbox.com/u/8396628/mobile-python.png

Goals
-----

- Bring a cross-browser compatible Python shell experience to the browser
- Allow people to save shell input/output and playback
- Allow people to share with Twitter/Facebook

Todo
----

- Make use of a full python shell, instead of "python -c"
- Allow users to save progress and designate a URL to share
- Twitter/Facebook Integration
- Make arrow keys for command history work cross-browser

Dependencies
------------

* NodeJS - http://nodejs.org/
* Python 2.5, 2.6, 2.7, 3.2

How to use
----------

1. Install NodeJS
2. Put the contents of the repo under a web server of some kind. ex. Apache, Nginx
3. From root project directory run:

    $ node node/shell.js

4. Visit http://localhost/path/to/dir in your favorite browser.

Caveats
-------

- It currently does not completely run like a shell. In the background it uses "python -c"
- Arrow keys to browse command history currently only work in Firefox 
