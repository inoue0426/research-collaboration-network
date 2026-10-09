# Research Collaboration Network

GitHub Pages app for exploring OpenAlex coauthorship connections from **Augustin Luna** and **Rui Kuang**.

## Features
- Combined direct-coauthor graph, with both seed researchers visible.
- Institution and region filters for Broad, Dana-Farber, Harvard, MIT, Stanford, Boston/Cambridge, and the Bay Area.
- Heuristic ranking using direct shared-paper counts, publication recency, and hop distance.
- Click an author to view linked shared-publication evidence.
- On-demand second-hop exploration: click a direct coauthor, then **Explore 2-hop collaborators**.

## Caveats
- This is **not** a verified PI directory, and does not assert a personal connection or willingness to introduce.
- OpenAlex `last_known_institutions` may be historical or incomplete. The filter is an affiliation hint, not verified current employment.
- Author matching uses exact display names and should be verified for homonyms.
- Counts use up to 400 latest indexed works per seed and 200 per expanded intermediate, so they are incomplete.
- Scores are exploratory, not calibrated probabilities. Two-hop links are via the named intermediary and do not imply that an introduction is possible.
- The browser uses OpenAlex's public API; availability and rate limits may affect loading. See https://help.openalex.org/api/.

## Publish
Settings → Pages → Deploy from branch → main → root. No build required.
