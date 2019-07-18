# Embed Tool

A tool that allows editors, sub-editors and other people across the newsroom to generate embeds. There are two parts to this project, the embeds themselves and a tool that helps people generate those embeds.

Looking for the live version? You can [find it here](https://interactive.guim.co.uk/tools/embed-tool/)

## How it works
Each embed that is used by this tool is effectively a template created in Handlebars. The values for which are passed in as url parameters. The tool basically is a bunch of forms that automatically create a url, which in turn populates the template. The advantage of which means that future updates to embeds are then applied universally. It also means the tool generated doesn't need to run on a server and is completely static.

# Development

## Requirements
* [Node](https://nodejs.org/en/download/)

## Running the project
Clone this repo locally and run `npm i` to install dependancies.

Once that's done you can run `npm run local` to run the project locally. The tool will be previewable on [localhost url](http://localhost:8080/tools/embed-tool/).

## Creating a embed
If you would like to add a new embed to the tool, you should create or duplicate an existing embed within `src/embeds`. From this file, a page that allows people to generate the embed will be added to the tool and the embed that will be served will be compiled. Each file in here contains the data structure, the html, the css (in scss format here) and javascript that will make up the embed.

Loosely it looks like this...

```html
<!DOCTYPE html>
<html>
    <head>
        <base href="." target="_blank">
        <title><!-- Embed name --> Embed</title>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">

        <!-- required javascript that tells Guardian platforms the height of the iframe -->
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
            <!-- any javascript that the embeds needs to run -->
            <!-- this should include running Handlebars to create the html -->
        </script>
    </body>
</html>
```

## Data structure
Every section of the above template is pretty generic and self-explanatory. However, the data structure, represented by json, is pretty specific. There are a bunch of examples within the existing set of embeds but here's what each option can be.

### `type`
`string`

This represents the type of embed. Used to group the embeds on the home page of the tools

### `size`
`string`

Sets the suggest weighting for the embed (set in Composer), this is visible in the tool. It also controls preview width in the tool.

Valid options: `thumbnail`, `supporting`, `inline`, `showcase` and `immersive`

### `tip`
`string` *optional*

Used to describe what the embed should be used for. Should be a sentence or two.

### `fields`
`array`

This is an array of different `field` objects with each object representing an editable field for the embeds. Each `field` object in the `fields` array can/should include the below properties

### `name`
`string`

The name of the field. This can be anything but must be unique inside the individual embed

### `type`
`string`

The type of field. A few of these come with extra options that must be provided.

Valid options: `text`, `number`, `textarea`, `checkbox` and `select`

### `options`
`array` *only required when `type` is `select`*

An array of strings or numbers that represent the dropdown options for this select

### `default`
`string` or `boolean` *optional*

Sets the default value for the field. Should be representative of what the actual content should be. Should be a `string` unless the `type` is `checkbox`

### `tip`
`string` *optional*

Will add a note next to the field in the tool. Should be used to give direction

## Deploy
To deploy you can run `npm run deploy` this will deploy both the tool and embeds. Try to avoid making breaking changes to existing embeds. If there's no other way, you'll have to rename (not duplicate, you want the old embed to be removed from the tool) the embed which will preserve the older embed.
