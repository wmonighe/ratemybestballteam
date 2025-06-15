# Best Ball Rankings

This repository contains a simple web page that pulls fantasy football rankings
and sentiment scores from a Google Spreadsheet. The data is loaded directly in
the browser and displayed in a table.

## Usage

Open `index.html` in a modern web browser. The page will fetch data from the
public spreadsheet and populate the table with the following columns. Above the
table are slider controls that let you adjust the weighting of each metric when
calculating the **Rating** value. Move the sliders and click **Update** to
recompute ratings.

- **Rating** (weighted combination of wmonighe, ADP, fantasy points, sentiment and VORP percentiles)
- **Player (Position)**
- **ADP** (column J of the `Rankings` sheet, with percentile from column L of that sheet appended in parentheses)
- **wmonighe Rank** (column G of the `Rankings` sheet)
- **Fantasy Points** (column I of the `Rankings` sheet, with the computed fantasy point percentile appended in parentheses as a decimal between 0 and 1)
- **Sentiment** (from column F of the `Sentiment` sheet, with the computed
  sentiment percentile appended in parentheses as a decimal between 0 and 1)
 - **VORP Score** (column Q of the `Rankings` sheet, with percentile from column R appended in parentheses)

Note: values shown in parentheses represent the percentile rank for that metric.

The spreadsheet ID and sheet names are configured directly in `index.html`.

### Team Logos

Each player's row displays the logo of their NFL team to the left of their name.
Logos are loaded directly from FantasyNerds and no additional setup is required.

