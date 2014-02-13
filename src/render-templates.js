"use strict";

/*global require: true, process: true, console: true */

var configuration = require("configvention"),
    path = require("path"),
    filesystem = require("fs"),
    doT = require("dot"),
    doTs,

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

    getTemplatesPath = function() {
        var templateDirectoryPath = configuration.get("templates-folder"),
            resolved = resolvePath(templateDirectoryPath);

        return resolved;
    },

    getOutputPath = function(filename) {
        var outputDirectoryPath = configuration.get("output-folder"),
            resolved = resolvePath(outputDirectoryPath, filename);

        return resolved;
    },

    initTemplates = function() {
        var templatesPath = getTemplatesPath();

        doTs = doT.process({
            path: templatesPath,
            templateSettings: {
                useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*((?:[_a-z$][\w$]+)(?:\.[_a-z$][\w$]+|\[(?:(?:[_a-z$][\w$]+)|\d+|(["'])(?![^\\]\4).+\4)\])*)\s*$/i
            }
        });
    },

    getTemplate = function(templateFilename) {
        var basename = path.basename(templateFilename, ".html");

        return doTs[basename];
    },

    writeOutput = function(filename, contents, callback) {
        var path = getOutputPath(filename);

        writeFile(path, contents, callback);
    },

    renderTemplateToHtml = function(input, templateFilename) {
        var compiledTemplate = getTemplate(templateFilename),
            output = compiledTemplate(input);

        writeOutput(templateFilename, output, function(error) {
            failOrNot(error);
        });
    },

    renderTemplatesToHtml = function(json, templateFilename) {
        renderTemplateToHtml(json, templateFilename);
    },

    loadJson = function(path) {
        var resolved = resolvePath(path),
            json = require(resolved);

        return json;
    },

    renderFromConfiguration = function(templateFilename, templateConfiguration) {
        var dataConfigurationName = templateConfiguration.data,
            inputPath = configuration.get("input-folder") || fail(null, "The configuration for input-folder was not defined."),
            relativePath = configuration.get(dataConfigurationName) || fail(null, "The configuration for " + dataConfigurationName + " was not defined."),
            path = resolvePath(inputPath, relativePath),
            json = loadJson(path);

        renderTemplatesToHtml(json, templateFilename);
    },

    renderFromConfigurations = function() {
        var templatesConfiguration = configuration.get("templates");

        Object.keys(templatesConfiguration).forEach(function(templateFilename) {
            var templateConfiguration = templatesConfiguration[templateFilename];

            renderFromConfiguration(templateFilename, templateConfiguration);
        });
    },

    init = function() {
        initTemplates();
        renderFromConfigurations();
    };

init();