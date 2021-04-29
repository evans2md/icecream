Node based server

to launch, from terminal:
>node server.js

Then to play the game, go to the following in a web-browser (preferably chrome):
http://localhost:8080


The game is based on the Baloon Analog Risk Task (BART; Lejuez et al., 2002; http://www.impulsivity.org/measurement/BART) 

In the ice cream game, your goal is to sell as many scoops of ice scream as possible on each trial. The more scoops you sell, the more points you earn (*YAY!*). But! Be careful! At ANY point, your tower of ice cream may become too tall and fall over (*SPLAT!*), leaving you with NOTHING to sell (0 points for that trial). You have a limited number of trials, but enough ice cream for up to 64 scoops for each trial.


On each trial, subject can choose to increase the value of their ice cream by adding another scoop (linear increase). Risk is determined by selecting a number from range 1-64 with random sampling without return (exponential increase); if 64 is selected, the ice cream falls. Thus the risk-cost ratio becomes negative at 32 scoops, and increases with each additional scoop.




Evaluation of a behavioral measure of risk taking:
     the Balloon Analogue Risk Task (BART).
     Lejuez CW, Read JP, Kahler CW, Richards JB, Ramsey SE, Stuart GL, Strong DR, Brown RA (2002)
     Journal of Experimental Psychology: Applied, 8, 75-84.  PubMed ID 12075692

