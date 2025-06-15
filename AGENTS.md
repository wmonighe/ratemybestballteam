# Root Agent Instructions

This repository contains the source code for the Best Ball rankings web app.

## Project Requirements
- Build a web page that loads fantasy football rankings from the **Rankings** tab of the Google Sheet at [this spreadsheet](https://docs.google.com/spreadsheets/d/1rNouBdE-HbWafu-shO_5JLPSrLhr-xuGpXYfyOI-2oY/edit?gid=1912864828#gid=1912864828).
- Pull the sentiment score from the **Sentiment** tab. The sentiment score is stored in **column F** of that sheet. If a player does not have a score there, fall back to the value in **column H** on the **Rankings** tab.
- Pull **wmonighe Rank** from **column G** of the **Rankings** tab of the Google Sheet.

## Development Notes
- Thoroughly check for regressions and merge conflicts before committing and pushing code. Error-free code is supremely important; take the time needed to ensure quality.
- Always run available tests or checks (currently `git status --short`) to confirm a clean working tree before completing a PR.

## Unabated API Reference (v.2.0)
Updated 1/17/25
Overview
The Unabated API provides programmatic access to all of Unabated’s Game Odds and Props market, game state, and scoring data. Some key features and points of the API are:
A “snapshot” endpoint to retrieve the current lines for all markets across all sports that Unabated offers. This includes all sportsbook, team, and player metadata.
A “changes” endpoint to retrieve market line changes that occurred since a specified timestamp.
No additional data latency beyond that which we have on our backend as we pull information from sportsbooks. These latency categories are specified in the sportsbook metadata, and can also be seen in our Game Odds and Props Odds UI as colored dots in the grid headers:
Green = Real-time
Yellow = Under 30 seconds
Orange = Over 30 seconds
There are no call limits or API throttling, but you should not call these endpoints more than 1 time per second as there will be no change in information during that time and would just be wasted compute time on our servers and your client.
You can leverage the endpoints to serve your needs. If you want to be staying on top of every market movement you would use a combination of the Snapshot Endpoint and Changes Endpoint as described in the section below. Or, if you are just interested in taking occasional snapshots of the markets you can simplify your implementation by just calling the Snapshot Endpoint. If you want to get the data more frequently than every 30 seconds then for performance reasons you should use the Snapshot Endpoint to get the initial odds and metadata coupled with Changes Endpoint to get ongoing changes. You can also use the Snapshot Endpoint as a refresh point for example in a case where your processing was interrupted and you need to get back to the current market state.
Accessing Unabated Game Odds
Snapshot Endpoint
A complete snapshot of current game odds can be retrieved from the following URL via a GET request. Note that authentication is required here; substitute the API key you received from the Unabated team in place of YOUR_API_KEY:
Game Odds Markets
https://partner-api.unabated.com/v2/markets/gameOdds?x-api-key=YOUR_API_KEY
Props Markets
https://partner-api.unabated.com/v2/markets/playerProps?x-api-key=YOUR_API_KEY
Golf Odds Markets (currently in Preview mode, endpoint or interface may change)
https://partner-api.unabated.com/api/markets/golfOdds?x-api-key=YOUR_API_KEY
The structure of the data returned from this URL is described in detail in the section of this document titled Full Game Odds JSON Description.
Changes Endpoint
After retrieving odds from this URL, you can retrieve incremental updates to those odds on an ongoing basis. The following URL will retrieve the subset of odds that have changed within the last several seconds. Note that authentication is required here as well:
Game Odds Markets
https://partner-api.unabated.com/v2/markets/changes?x-api-key=YOUR_API_KEY
Props Markets
https://partner-api.unabated.com/v2/markets/playerProps/changes?x-api-key=YOUR_API_KEY
Golf Odds Markets (currently in Preview mode, endpoint or interface may change)
https://partner-api.unabated.com/api/markets/golfOdds?x-api-key=YOUR_API_KEY
The structure of the data returned from this URL is described in detail in the section of this document titled Incremental Game Odds JSON Description.
One of the top-level fields in the response is a number, lastTimestamp (note: this number is not interpretable as a Unix timestamp). You should add this timestamp to the changes URL to get all the changes that have occurred since the last time you called it, like so:
https://partner-api.unabated.com/v2/markets/changes/68327798229687600?x-api-key=YOUR_API_KEY
Putting this together, you can construct a program that continuously updates odds from Unabated by following these steps:
Call gameOdds to get an initial full snapshot of odds for all events currently on the calendar for that day and several upcoming days.
Call changes with no arguments to get an initial set of incremental changes.
Continue calling changes in a loop, adding the top-level lastTimestamp value seen in the previous response from changes.
Repeat step 3 for as long as you wish to keep getting updated odds, no more than once per second.
Notes:
Unabated updates odds approximately once per second. Therefore, you should avoid calling changes more frequently than once per second from your program.
If your program is paused for a while, the lastTimestamp value you have may become stale. In that event, changes will not be able to return incremental changes. It will fail and indicate this with a top-level resultCode value of "Failed". When this happens, you will need to restart the process from step 1.
Reference Data Description
Bet Types
To get a list of all bet types available do an HTTP GET to:
https://partner-api.unabated.com/v2/betTypes?x-api-key=YOUR_API_KEY
URL Parameters:
Field
Type
Description
changedSince
String
The datetime after which changes or additions occurred to the bet types (in UTC time, ISO 8601 format). Will only return those rows. If null/empty, then all bet types are returned.
Response Fields:
Attribute
Type
Description
name
String
The display name of the prop.
internalName
String
The internal name used for the prop.
nameShort
String
A shortened version of the prop name.
nameMobile
String
A mobile-friendly version of the name.
description
String or null
A detailed description of the prop, if available.
marketTypeId
Integer
The type ID of the market.
0 = Not Used 
1 = Game Odds
2 = Team Futures
3 = Props
4 = Player Futures
active
Boolean
Indicates if the bet type is currently active.
leagues
Array of Integer
The league ids to which the bet type is applicable.
createdOn
String
The creation date and time in ISO 8601 format.
createdBy
String or null
The identifier of the creator, if any.
modifiedOn
String
The last modification date and time in ISO 8601 format.
modifiedBy
String or null
The identifier of the last modifier, if any.
id
Integer
The unique identifier for the prop.
Market Sources
To get a list of all market sources (sportsbooks) available do an HTTP GET to:
https://partner-api.unabated.com/v2/marketSources?x-api-key=YOUR_API_KEY
URL Parameters:
Field
Type
Description
changedSince
String
The datetime after which changes or additions occurred to the market sources (in UTC time, ISO 8601 format). Will only return those rows. If null/empty, then all market sources that your API key has access to are returned.
Response Fields:
Attribute
Type
Description
name
String
The name of the market source (e.g., sportsbook).
logoUrl
String
URL to the logo image of the market source.
thumbnailUrl
String
URL to the thumbnail image of the market source.
siteUrl
String or null
URL to the website of the market source, if available.
isActive
Boolean
Indicates if the market source is currently active.
statusId
Integer
The status identifier of the market source.
1 = Real-time
2 = <30s latency
3 = >30s latency
propsStatusId
Integer
The status identifier for props of the market source.
1 = Real-time
2 = <30s latency
3 = >30s latency
futuresStatusId
Integer
The status identifier for futures of the market source.
1 = Real-time
2 = <30s latency
3 = >30s latency
createdOn
String
The creation date and time in ISO 8601 format.
createdBy
String or null
The identifier of the creator, if any.
modifiedOn
String
The last modification date and time in ISO 8601 format.
modifiedBy
String or null
The identifier of the last modifier, if any.
id
Integer
The unique identifier for the market source.
Teams
To get a list of all teams available do an HTTP GET to:
https://partner-api.unabated.com/v2/teams?x-api-key=YOUR_API_KEY
URL Parameters:
Field
Type
Description
leagues
String
Comma-delimited list of League Ids (see Leagues table above). If null/empty then data from all leagues is returned.
changedSince
String
The datetime after which changes or additions occurred to the teams (in UTC time, ISO 8601 format). Will only return those rows. If null/empty, then all teams are returned.
Response Fields:
Attribute
Type
Description
name
String
The name of the team.
abbreviation
String
The abbreviation of the team name.
logoUrl
String
URL to the logo image of the team.
leagueId
Integer
The identifier of the league the team belongs to.
divisionId
Integer or null
The identifier of the division the team belongs to, if any.
divisionAbbreviation
String or null
The abbreviation of the division name, if any.
conferenceAbbreviation
String or null
The abbreviation of the conference name, if any.
createdOn
String
The creation date and time in ISO 8601 format.
createdBy
String or null
The identifier of the creator, if any.
modifiedOn
String
The last modification date and time in ISO 8601 format.
modifiedBy
String or null
The identifier of the last modifier, if any.
id
Integer
The unique identifier for the team.
Players
To get a list of all players available do an HTTP GET to:
https://partner-api.unabated.com/v2/players?x-api-key=YOUR_API_KEY
URL Parameters:
Field
Type
Description
leagues
String
Comma-delimited list of League Ids (see Leagues table above). If null/empty then data from all leagues is returned.
changedSince
String
The datetime after which changes or additions occurred to the players (in UTC time, ISO 8601 format). Will only return those rows. If null/empty, then all players are returned.
Response Fields:
Attribute
Type
Description
headshotUrl
String or null
URL to the player's headshot image, if available.
firstName
String
The first name of the player.
lastName
String
The last name of the player.
preferredName
String or null
The preferred name of the player, if available.
jerseyNumber
Integer or null
The jersey number of the player, if available.
country
String or null
The country of the player.
height
Integer
The height of the player in inches.
weight
Integer
The weight of the player in pounds.
position
String or null
The position of the player, if available.
birthDate
String
The birth date of the player in ISO 8601 format.
leagueId
Integer
The identifier of the league the player belongs to.
team
String or null
The team the player belongs to, if any.
createdOn
String
The creation date and time in ISO 8601 format.
createdBy
Integer or null
The identifier of the creator, if any.
modifiedOn
String
The last modification date and time in ISO 8601 format.
modifiedBy
Integer or null
The identifier of the last modifier, if any.
id
Integer
The unique identifier for the player.
Upcoming Events
To get a list of upcoming events do an HTTP GET to the following URL. This will return all scheduled, cancelled, postponed, and delayed events, that are within our “markets window”, that have not yet started. The “markets window” is defined.
https://partner-api.unabated.com/v2/events/upcoming?x-api-key=YOUR_API_KEY
URL Parameters:
Field
Type
Description
leagues
String
Comma-delimited list of League Ids (see Leagues table above). If null/empty then data from all leagues is returned.
changedSince
String
The datetime after which changes or additions occurred to the events (in UTC time, ISO 8601 format). Will only return those rows. If null/empty, then all events are returned.
Response Fields:
Attribute
Type
Description
name
String
The name of the event.
eventStart
String
The start date and time of the event in ISO 8601 format.
eventStartOverride
String or null
The overridden start date and time, if any.
eventEnd
String or null
The end date and time of the event, if any.
eventEndOverride
String or null
The overridden end date and time, if any.
statusId
Integer
Enumeration describing the state of the event:
1: Pre-game
2: Live
3: Final
4: Delayed
5: Postponed
6: Cancelled
statusIdOriginal
Integer
The original status identifier of the event.
statusIdOverride
Integer or null
The overridden status identifier, if any.
leagueId
Integer
The identifier of the league the event belongs to.
venueId
Integer or null
The identifier of the venue, if any.
seasonId
Integer
The identifier of the season.
seasonPartId
Integer
The identifier of the part of the season.
gameClock
String or null
The current game clock, if any.
periodTypeId
Integer or null
The identifier of the period type, if any.
overtimeNumber
Integer or null
The number of overtimes, if any.
eventTeams
Array
An array of team objects participating in the event.
createdOn
String
The creation date and time in ISO 8601 format.
createdBy
Integer or null
The identifier of the creator, if any.
modifiedOn
String
The last modification date and time in ISO 8601 format.
modifiedBy
Integer or null
The identifier of the last modifier, if any.
id
Integer
The unique identifier for the event.
Event Teams Attribute Descriptions
Attribute
Type
Description
eventId
Integer
The identifier of the event.
sideId
Integer
The side identifier (0 for home, 1 for away).
score
Integer or null
The score of the team, if any.
rotationNumber
Integer
The rotation number of the team.
name
String
The name of the team.
abbreviation
String
The abbreviation of the team name.
logoUrl
String
URL to the logo image of the team.
leagueId
Integer
The identifier of the league the team belongs to.
divisionId
Integer or null
The identifier of the division the team belongs to, if any.
divisionAbbreviation
String or null
The abbreviation of the division name, if any.
conferenceAbbreviation
String or null
The abbreviation of the conference name, if any.
createdOn
String
The creation date and time in ISO 8601 format.
createdBy
String or null
The identifier of the creator, if any.
modifiedOn
String
The last modification date and time in ISO 8601 format.
modifiedBy
String or null
The identifier of the last modifier, if any.
id
Integer
The unique identifier for the team.
Full Game Odds JSON Description
Here is a more complete description of the JSON object returned from gameOdds.
Game Odds JSON Structure
At the highest level the Game Odds JSON has sections for:
Market Sources
Teams
Game Odds Events
Also implied in this JSON are Market and Market Line objects. Following is a description of all these sections/objects.
Market Object
The concept of a Market is a unique combination of the following things:
Event
Side (Away/Home, Over/Under)
Bet Type
Period Type
Alternate Number (for future use, not used at this time)
Pregame/Live
Market Line Object
A Market Line is a unique combination of:
Market
Market Source (typically a sportsbook or exchange)
A detailed field description of the JSON associated with a market line is provided below.
Market Sources Section
Market Sources are typically sportsbooks or exchanges, but could be a consensus line as well (Unabated Line for example). The detailed market source data can be found in the marketSources section.
Teams Section
The teams section includes detailed team data that is referenced by team id in the gameOddsEvents section.
Game Odds Events Section
The gameOddsEvents section is where you can find all the market data for all the market sources. It is a keyed object of this format:
lg{league-id}:pt{period-type-id}:{pregame/live}
For example, all the NFL first half pre-game lines would be under the key lg1:pt2:pregame. And all the NBA in-game full game lines would be under the key lg3:pt1:live.
Within each of these keys is an array of Game Odds Event objects which hold the information for every game and market line.
Game Odds Event Object Fields
Field
Type
Description
eventId
Integer
The unique static key of the event/game
eventStart
Datetime
The scheduled start time of the game (in UTC)
eventEnd
Datetime
The end time of the game (in UTC). For future use.
statusId
Integer
Enumeration describing the state of the event:
1: Pre-game
2: Live
3: Final
4: Delayed
5: Postponed
6: Cancelled
gameClock
String
Contains a description of the game state. Typically the game clock. Example: 12:45 1H
periodTypeId
Integer
Period Type (see Period Types table for valid values) that the game is currently in.
overtimeNumber
Integer
A number indicating how many overtime periods the game went to. Examples: An MLB game that goes to the 12th inning will have the number 12. A CFB game which goes into 3 overtimes will have a 3.
eventTeams
Keyed Object
Key: Side Index (see Side Index table for valid values) Value: An Event Team object, which has the following fields:
eventTeams.id
Integer
The team id from the Teams section of the top-level JSON.
eventTeams.rotationNumber
Integer
The standard Don Best id that is used by brick-and-mortar sportsbooks to identify a betting line.
eventTeams.score
Integer
The number of points that team scored in the game.
gameOddsMarketSourceLines
Keyed Object
Key: Format described below Value: A Market Line object (see description in “Market Line Object Fields” below)
The market line information is in the gameOddsMarketSourceLines section as a keyed object with the following key structure:
si{side-index}:ms{market-source-id}:an{alternate-line-index}
Within that is another keyed object that is formatted as bt{bet-type-id}. For example, a Sharp Book P spread line for the home team would look something like this:
"si1:ms7:an0": {
"bt2": {
Market Line Object here
}
}
​
Note that the alternate line index is not in use at this time, and the only relevant key right now is an0.
Market Line Object Fields
Field
Type
Description
marketLineId
Integer
The unique static key of the Market Line
isBlurred
Boolean
This is used for the web interface and can be ignored in the API.
true: data is fake/obfuscated
false: data is real
So in all cases a properly authenticated API connection should always have a true value.
marketId
Integer
The unique static key of the Market
marketSourceId
Integer
The unique static key of the Market Source
points
Decimal
The points that the line is set at. Examples: 52.5 total points, -7.5 spread.
price
Integer
The price in American odds format
americanPrice
Integer
The price in American odds format
sourcePrice
Decimal
The price in the native format of the market source
sourceFormat
Integer
Enumeration of odds format types: 1 = American, 2 = Decimal, 3 = Percent, 4 = Probability, 5 = Sporttrade (0 to 100)
alternateNumber
Integer
For future use. Should always be 0.
statusId
Integer
Describes if the market line is on/off the board: 1: Available, 2: Unavailable
sequenceNumber
Integer (64-bit)
Unique key based on timestamp indicating the order of when the market line change came in.
createdOn
Datetime
When the market line was first created (in UTC)
modifiedOn
Datetime
When the market line was last modified (in UTC)
Full Props Odds JSON Description
Here is a more complete description of the JSON object returned from playerProps.
Root Object: propsPeopleEvents
Ex. lg5:pt1:pregame: League is MLB, period type is full-game, and odds are pregame
Event Object (within lg{league_id}:pt{period_type_id}:{pregame/live} array)
Attribute
Type
Description
eventId
Integer
Unique identifier for the event.
eventStart
String
Start time of the event in ISO 8601 format.
eventName
String
Name of the event.
personId
Integer
Identifier for the person involved in the event.
teamId
Integer
Identifier for the team.
playerPosition
String or null
Position of the player.
eventTeams
Object
Contains details of the teams involved in the event.
propsMarketSourcesLines
Object
Contains details of the props market lines for the event.
eventTeams Object
0: Details of the first team.
id: Integer - Team identifier.
rotationNumber: Integer or null - Rotation number (if any).
score: Integer or null - Team score (if any).
1: Details of the second team.
id: Integer - Team identifier.
rotationNumber: Integer or null - Rotation number (if any).
score: Integer or null - Team score (if any).
propsMarketSourcesLines Object
Ex. si0:ms2:an0: Side is home/over, market source id is 2.
Market Line Object (within si{side_id}:ms{market_source_id}:an0 object)
Attribute
Type
Description
marketLineId
Integer
Unique identifier for the market line.
marketId
Integer
Identifier for the market.
marketSourceId 
Integer
Identifier for the market source.
points 
Decimal or null
Points associated with the market line.             
price
Decimal
Price of the market line.
americanPrice
Decimal
American price format.
sourcePrice
Decimal
Original source price.
sourceFormat
Integer
Format of the source price.
sourceData
String
URL to the source data.
alternateNumber
Integer
Alternate number (if any).
statusId
Integer
Status identifier of the market line.
sequenceNumber
Integer
Sequence number of the market line.
overrideType
String or null
Override type (if any).
tm
String
Timestamp of the market line in ISO 8601 format.
alternateLines
Market Line Object array, or null or empty array
Alternate lines (if any).
bestAltPoints
Decimal or null
Best alternate points (if any).
bestAltPrice
Decimal or null
Best alternate price (if any).
bestAltSourcePrice
Decimal or null
Best alternate source price (if any).
createdOn
String
Creation timestamp in ISO 8601 format.
createdBy
String or null
Creator identifier (if any).
modifiedOn
String
Modification timestamp in ISO 8601 format.
modifiedBy
String or null
Modifier identifier (if any).
id
Integer or null
Unique identifier (if any).
Reference Data
Leagues
League Id
League Name
1
NFL
2
CFB
3
NBA
4
CBB
5
MLB
6
NHL
7
WNBA
8
PGA
Period Types
Period Type Id
Period Type Name
1
Full Game
2
First Half
3
Second Half
4
First Quarter
5
Second Quarter
6
Third Quarter
7
Fourth Quarter
8
First Period
9
Second Period
10
Third Period
11
First Inning
12
Second Inning
13
Third Inning
14
Fourth Inning
15
Fifth Inning
16
Sixth Inning
17
Seventh Inning
18
Eighth Inning
19
Ninth Inning
20
First Five Innings
21
Fourth Period
22
Round 1
23
Round 2
24
Round 3
25
Round 4
Bet Types
Here is a sample of the most commonly bet types. This is not an exhaustive list as the available bet types change frequently. Utilize the endpoint to keep a current list on your servers.
Find out current list of supported Bet Types here.
Side Index
Side Id
Side Description
0
Away Team or Over
1
Home Team or Under
Incremental Game Odds JSON Description
Here is a more complete description of the JSON object returned from changes.
Incremental Game Odds JSON Structure
Field
Type
Description
lastTimestamp
Number
A value that can be used to poll for the next set of changes.
resultCode
String
Indicates whether the request was successful. Values: "Success" or "Failed".
results
Array
Contains recent changes to game odds. The elements of the array are ordered from oldest to most recent, so they should be processed in the order they were returned. Each element of this array is a JSON object with the following fields (you will see other fields besides these, but they can be ignored):
results.marketSources
Array
Any market sources that have recently changed. It is relatively rare for this array to be non-empty. When it is, it is usually because a market source has been temporarily disabled or re-enabled by Unabated.
results.events
Array
Any events that have recently changed. The most common changes to events are to their pregame/live/final status and score/time remaining.
results.gameOdds.gameOddsEvents
Object
Any odds that have recently changed. This object has the same structure as detailed in the Game Odds Events Section portion of this document.
