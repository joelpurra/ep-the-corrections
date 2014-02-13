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

            doT.templateSettings.useParams = /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*((?:[_a-z$][\w$]+)(?:\.[_a-z$][\w$]+|\[(?:(?:[_a-z$][\w$]+)|\d+|(["'])(?![^\\]\4).+\4)\])*)\s*$/i;

            var compiledTemplate = doT.template(template),
                output = compiledTemplate(input);

            writeOutput(templateFilename, output, function(error) {
                failOrNot(error);
            });
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
            inputPath =  configuration.get("input-folder") || fail(null, "The configuration for input-folder was not defined."),
            relativePath = configuration.get(dataConfigurationName) || fail(null, "The configuration for " + dataConfigurationName + " was not defined."),
            path = resolvePath(inputPath, relativePath),
            json = loadJson(path);

        renderTemplatesToHtml(json, templateFilename);
    },

    renderFromConfigurations = function() {
        var templatesConfiguration = configuration.get("templates");

        Object.keys(templatesConfiguration).forEach(function(templateFilename, index) {
            var templateConfiguration = templatesConfiguration[templateFilename];

            renderFromConfiguration(templateFilename, templateConfiguration);
        });
    },

    init = function() {
        renderFromConfigurations();
    };

init();