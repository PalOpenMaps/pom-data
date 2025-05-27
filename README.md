# pom-data

This repo contains JSON data and metadata files to be read by Palestine Open Maps (POM), as well as various "raw" source data files.

It contains a Github Actions workflow **.github/workflows/update.yml** to fetch data from a Google Spreadsheet to the **raw-data/** directory and run a series of JS scripts with Deno to read this data, merge it with other static sources (also in the **raw-data/** directory), process it into appropriate JSON formats, and write it to the **data/** directory.

This repo also contains markdown files for the static pages on POM (in the **raw-data/pages** directory), and other static assets (mostly images) in the **assets/** folder.
