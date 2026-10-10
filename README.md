# Research Collaboration Network

A browser-based tool for exploring coauthorship links in [OpenAlex](https://openalex.org/). It has two views: a network of collaborators around selected researchers and a path finder for shared coauthors between Yoshitaka Inoue and a researcher of interest.

**Site (when GitHub Pages is enabled):** https://inoue0426.github.io/research-collaboration-network/

## What you can do

### Explore Network

1. Select **Explore Network** and click **Load combined network**.
2. Explore direct coauthors of Augustin Luna, Rui Kuang, and Tobias Kind. Researchers found among Yoshitaka Inoue's retrieved coauthors are excluded from the candidate list.
3. Filter by institution or region, connection depth, shared-paper count, or name; switch between institution clusters and a collaboration layout.
4. Hover over a node to highlight its coauthorship links. Click a researcher to see connected researchers, broad OpenAlex topics, and linked publication evidence. Click **Explore 2-hop collaborators via this author** to load additional candidates through that researcher.

Institution clusters reflect common affiliations in the retrieved data. Candidate ranking is a heuristic based on shared-paper counts, recency, and path length.

### Find Connections

1. Select **Find Connections**.
2. Enter a researcher's name or ORCID, or choose one of the example researchers. For a name search, check the matched OpenAlex author in the selection menu.
3. Review shared coauthors, a two-hop graph, broad topics for the target and up to 30 intermediaries, and publication evidence on both sides of the path from Yoshitaka Inoue to the selected researcher.

The path finder uses Yoshitaka Inoue's ORCID (`0000-0003-4432-8166`) as its fixed starting point.

## Data and limitations

- The app requests public OpenAlex data directly from the browser. It examines publications from the last 10 years, up to 400 recent indexed works per seed or path-finder author and up to 200 per expanded intermediary. Results can omit older or unindexed connections.
- OpenAlex author topics are broad automated summaries and may not reflect a researcher's current focus. Author records and affiliations may be incomplete or outdated. Verify author identity and current affiliation independently; the app does not confirm that a person is a principal investigator.
- A shared publication or two-hop path does not establish a personal relationship, an available introduction, or willingness to collaborate. Scores are exploratory, not calibrated probabilities.
- API availability and rate limits can affect loading. Responses are cached in the browser's IndexedDB for 24 hours when available; if a request fails, the app may reuse an older cached response. See [OpenAlex API guidance](https://help.openalex.org/api/).

## Run locally

This is a static site with no build step. From the repository root, run:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ in your browser. The page loads D3 from jsDelivr and fetches OpenAlex data, so network access is required.

## Publish with GitHub Pages

In the repository, open **Settings → Pages** and choose **Deploy from a branch**, with branch **main** and folder **/(root)**. GitHub Pages should then show the published URL in that settings page. For this repository, the expected default URL is https://inoue0426.github.io/research-collaboration-network/; the link alone does not confirm that Pages is currently enabled or serving the site.
