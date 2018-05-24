# Embed Template

A template for create editable embeds

## Requirements
* [Node](https://nodejs.org/en/download/)

## Development
Clone this repo locally and run `npm i` to install dependancies.

Once that's done you can run `npm run local` to run the project locally. The tool will be previewable on [localhost url](http://localhost:8080/tools/nfl-graphics/).

The `src` folder is where all the magic happens. Inside here you'll find an `embed` folder which includes sass and html for the embed itself. You'll also find a `tool` folder which contains a single html file for the tool.

## Deploy
To deploy you can run `npm run deploy` this will deploy to the Interactives S3 bucket. If you have made significant changes you can run `npm run deploy -- true` which will increase the version number and upload a unique version of the embed. This ensures you don't break any existing embeds. Note: You'll need aws keys for that account to successfully deploy.

The tool is viewable on [the interactive server](https://interactive.guim.co.uk/tools/nfl-graphics/)
