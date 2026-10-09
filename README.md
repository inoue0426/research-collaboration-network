# Research Collaboration Network

Interactive OpenAlex coauthorship explorer for Augustin Luna and Rui Kuang.

## Run
Open `index.html` in a browser or serve the folder with `python -m http.server 8000`. The app requests public OpenAlex data directly; internet access is required.

## Features
- Choose a seed researcher and fetch up to 800 of their latest indexed works.
- Count shared papers, show most recent shared publication year and institutions.
- Filter coauthors and explore an interactive D3 graph.
- Click coauthors for source-linked publication evidence.

## Limitations
- The graph is a **star network**, not a complete multi-hop network.
- Counts are based on the fetched subset of OpenAlex-indexed papers, not complete lifetime coauthorship.
- Institution names may represent historical affiliations; they are not guaranteed current.
- The author is matched by exact name; verify identity and publication results.
- Coauthorship is **not** evidence of a warm introduction.
- The app does not yet rank postdoc fit or map introductions to specific labs.

## GitHub Pages
Repository Settings → Pages → Deploy from a branch → `main` / `(root)`. For private repositories, Pages availability depends on the account plan and repository settings.

## Data
[OpenAlex](https://openalex.org/) public API. No API key is stored.
