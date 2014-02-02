"use strict";

var configuration = require("configvention"),
    path = require("path"),
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

    resolvePath = function() {
        var args = [].slice.call(arguments),
            parts = [__dirname].concat(args);

        return path.resolve.apply(path, parts);
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
        var templateDirectoryPath = configuration.get("templates-folder"),
            resolved = resolvePath(templateDirectoryPath, filename);

        return resolved;
    },

    getOutputPath = function(filename) {
        var outputDirectoryPath = configuration.get("output-folder"),
            resolved = resolvePath(outputDirectoryPath, filename);

        return resolved;
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
            });
        });
    },

    renderTemplatesToHtml = function(erroneousVotes) {
        renderTemplateToHtml(erroneousVotes, "index.html");
    },

    loadJson = function(path) {
        var resolved = resolvePath(path),
            json = require(path);

        return json
    },

    init = function() {
        var erroneousVotesPath = configuration.get("erroneous-votes") || fail(null, "erroneous-votes was not defined"),
            erroneousVotes = loadJson(erroneousVotesPath);

        renderTemplatesToHtml(erroneousVotes);
    };

init();