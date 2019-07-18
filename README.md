# Embed Tool

A tool that allows editors, sub-editors and other people across the newsroom to generate embeds. There are two parts to this project, the embeds themselves and a tool that helps people generate those embeds.

Looking for the live version? You can [find it here](https://interactive.guim.co.uk/tools/embed-tool/)

## Requirements
* [Node](https://nodejs.org/en/download/)

## Development
Clone this repo locally and run `npm i` to install dependancies.

Once that's done you can run `npm run local` to run the project locally. The tool will be previewable on [localhost url](http://localhost:8080/tools/embed-tool/).

### Creating a embed
If you would like to add a new embed to the tool, you should create or duplicate an existing embed within `src/embeds`. From this file, a page that allows people to generate the embed will be added to the tool and the embed that will be served will be compiled. Each file in here contains the data structure, the html, the css (in scss format here) and javascript that will make up the embed.

Loosely it looks like this...

```html
<!DOCTYPE html>
<html>
    <head>
        <base href="." target="_blank">
        <title><!-- Embed name --> Embed</title>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">

        <script src="https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js"></script>
        <script>
            iframeMessenger.enableAutoResize();
        </script>
        <script type='text/javascript' src="../handlebars.min.js"></script>

        <script type='application/json'>
            <!-- the data structure -->
        </script>

        <script type='application/sass'>
            <!-- sass that is compiled before load -->
        </script>
    </head>

    <body>
        <div class='target'>
            <!-- this is where the template will be injected -->
        </div>

        <script class="template" type="text/x-handlebars-template">
            <!-- a handlebars template that is compiled on load -->
        </script>

        <script type='text/javascript'>
            <!-- any javascript that the embeds need to run, including running Handlebars to create the html -->
        </script>
    </body>
</html>
```

The `src` folder is where all the magic happens. Inside here you'll find the `embeds` folder which includes a file per embed. This file serves as the html and sass that will be served along with the data structure. That data structure will generate the individual page for that embed type in the tool. The types of field are `select`, `text` or `textarea`.

## Deploy
To deploy you can run `npm run deploy` this will deploy both the tool and embeds. Try to avoid making breaking changes to existing embeds. If there's no other way, you'll have to rename (not duplicate, you want the old embed to be removed from the tool) the embed which will preserve the older embed.
