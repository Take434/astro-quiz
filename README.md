Definition of Done

### Backend
- read quizzes from json file
- websocket connection to all players and host
- validate answers from clients
- update display leaderboard / display on host
- update on what question  and what question type on client
- rejoin clients to ongoing games
- join clients to ongoing games
### DB
- active games
	- what game
	- on what question
- active clients
	- what name chosen
	- In which game
	- host or player
	- score
- delete active clients after amount of time
### Client
#### Host - desktop
- create a game
	- choose from presets based on json files
- join game
	- qr code to join
	- joined players
	- start button
- question
	- maybe pic depending on question
	- active question
	- timer
	- finished players?
	- stats on right and wrong answers?
	- continue button?
- leaderboard
	- after each question?
- award ceremony
#### Player - mobile
- join game
	- choose name
	- choose avatar?
- question
	- answer fields (depending on question)
	- submit 
- wait screen?
- award ceremony
	- score
	- placement
- rejoin screen
