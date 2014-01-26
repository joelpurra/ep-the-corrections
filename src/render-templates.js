"use strict";

var configuration = require("configvention"),
    filesystem = require("fs"),
    doT = require("dot"),

    fail = function(error, msg) {
        var scriptPath = process.argv[1],
            scriptPathParts = scriptPath.split("/"),
            scriptName = scriptPathParts[scriptPathParts.length - 1];

        if (msg) {
            console.error(scriptName + ": " + msg);
        }

        if (error) {
            console.error(error);
        }

        process.exit(1);
    },

    failOrNot = function(error, msg) {
        if (error) {
            fail(error, msg);
        }
    },

    templateDirectoryPath = "/templates/",
    outputDirectoryPath = "/output/",

    resolvePath = function(path) {
        // TODO: actually resolve path
        return __dirname + path;
    },

    readFile = function(path, callback) {
        filesystem.readFile(path, {
            encoding: "utf8"
        }, callback);
    },

    writeFile = function(path, contents, callback) {
        filesystem.writeFile(path, contents, callback);
    },

    getTemplatePath = function(filename) {
        return resolvePath(templateDirectoryPath + filename);
    },

    getOutputPath = function(filename) {
        return resolvePath(outputDirectoryPath + filename);
    },

    getTemplate = function(filename, callback) {
        var path = getTemplatePath(filename);

        readFile(path, callback);
    },

    writeOutput = function(filename, contents, callback) {
        var path = getOutputPath(filename);

        writeFile(path, contents, callback);
    },

    renderTemplateToHtml = function(input, templateFilename) {
        getTemplate(templateFilename, function(error, template) {
            failOrNot(error);

            var compiledTemplate = doT.template(template),
                output = compiledTemplate(input);

            writeOutput(templateFilename, output, function(error) {
                failOrNot(error);

                //console.log(input);
                console.log(template);
                console.log(compiledTemplate);
                console.log(output);
            });
        });
    },

    renderTemplatesToHtml = function(erroneousVotes) {
        renderTemplateToHtml(erroneousVotes, "index.html");
    },

    init = function() {
        var erroneousVotesPath = configuration.get("erroneous-votes") || fail(null, "erroneous-votes was not defined"),
            erroneousVotes = require(erroneousVotesPath);

        renderTemplatesToHtml(erroneousVotes);
    };

init();