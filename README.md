# maimai-score-details

Shows percent lost per note type in the score details section in maimai DX NET.

![Example](screenshot.png)

The percentages show how much was lost from 101%. Perfect breaks have two timing
windows and great breaks have three, so this shows the min/max possible loss for
each.

The left column shows how much was lost in total from that note type and also
the max possible percent from that note type.

## How to use

(View this page from <https://spiritsunite.github.io/maimai-score-details/>)

1. Bookmark this link by dragging the link to the bookmarks bar: [maimai score details](javascript:void(function(){if(['maimaidx-eng.com','maimaidx.jp'].indexOf(document.location.host)>=0&&(document.location.pathname.indexOf('/maimai-mobile/record/playlogDetail')>=0))document.body.appendChild(document.createElement('script')).src='https://spiritsunite.github.io/maimai-score-details/score-details.js'})();).
2. Go to a score page in maimai DX NET.
3. Open the bookmark on the page.

Alternatively, if you use Firefox, you can just install the extension: <https://addons.mozilla.org/en-US/firefox/addon/maimai-score-details/>

Chrome extension also coming soon™.

## maimai Scoring System

The 101% can be broken down into two parts:
* 100% base score which takes into account performance on all notes (and disregards critical perfect)
* 1% break score which only takes into account break performance

### Base Score (100%)

Suppose a tap is worth 1 point. Then holds are 2 points, slides are 3 points, touches are 1 point and breaks are 5 points. This gives us a total score for a chart by summing these point values. For every note *except* breaks, greats are x0.8 and goods are x0.5. For breaks, greats are subdivided into three timing windows, which give x0.8, x0.6 and x0.5 respectively, and goods give x0.4. For all notes, perfect and critical perfect both give full value, and misses lose the full value. The following two tables summarise this information.

|         |Perfect|Great (x0.8)|Good (x0.5)|Miss|
|---------|-------|------------|-----------|----|
|Tap/Touch|1      |0.8         |0.5        |0   |
|Hold     |2      |1.6         |1          |0   |
|Slide    |3      |2.4         |1.5        |0   |


|     |Perfect|High Great (x0.8)|Mid Great (x0.6)|Low Great (x0.5)|Good (x0.4)|Miss|
|-----|-------|-----------------|----------------|----------------|-----------|----|
|Break|5      |4                |3               |2.5             |2          |0   |

The final base score is just the score percent achieved of the total base score.

### Break Score (1%)

Now suppose each break is worth 1 point. Here, the three judgements for great don't matter, but now perfect is subdivided into two timing windows[^1]. Then, the point values for each judgement are as follows:

|     |Critical|High Perfect|Low Perfect|Great|Good|Miss|
|-----|--------|------------|-----------|-----|----|----|
|Break|1       |0.75        |0.5        |0.4  |0.3 |0   |

The final break percent added to the total achievement is just 1% multiplied by the break score as a percent.

[^1]: In finale, critical perfect breaks were worth 2600 points, high perfect was 2550, and low perfect was 2500, so sometimes you'll see terms like -50, which means all AP+ except one high perfect break (as that loses 50 points).
