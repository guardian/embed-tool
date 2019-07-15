# Embed Tool

A tool that allows people across the newsroom to generate embeds.

## Requirements
* [Node](https://nodejs.org/en/download/)

## Development
Clone this repo locally and run `npm i` to install dependancies.

Once that's done you can run `npm run local` to run the project locally. The tool will be previewable on [localhost url](http://localhost:8080/tools/embed-tool/).

The `src` folder is where all the magic happens. Inside here you'll find the `embeds` folder which includes a file per embed. This file serves as the html and sass that will be served along with the data structure. That data structure will generate the individual page for that embed type in the tool. The types of field are `select`, `text` or `textarea`.

## Deploy
To deploy you can run `npm run deploy` this will deploy both the tool and embeds
