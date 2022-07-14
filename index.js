#!/usr/bin/env node
const lineByLine = require('n-readlines');
const splitargs = require('splitargs');
var geoip = require('geoip-lite');
var uaParser = require('ua-parser-js');
const NodeCache = require( "node-cache" );
const fs = require('fs');
const commandLineArgs = require('command-line-args')

const cache = new NodeCache({ maxKeys: 100000000 });

const optionDefinitions = [
    { name: 'sourceFile', alias: 's', type: String},
    { name: 'destinationFile', alias: 'd', type: String }
  ]
const options = commandLineArgs(optionDefinitions)


const start = () => {

    const sourceFileName =  options.sourceFile ||  __dirname + '/logs/demo.log'

    const destinationFileName = options.destinationFile || __dirname + '/output.csv'
    
    console.log('starting processLogFile')
    console.log(`source ${sourceFileName}`)
    console.log(`destination ${destinationFileName}`)

    processLogFile(sourceFileName, destinationFileName)
}

// Use an in-memory cache to store IP lookups in case of duplicates. The API can take 6-10ms to retrieve a lookup. 
const resolveGeoIp = (ip) => {
    let value = cache.get(ip);
    if ( value == undefined ) {
        const geo = geoip.lookup(ip);
        value = [geo.country || '' ,geo.state || '']
        cache.set(ip, value)
    }
    
    return value
}

const resolveUserAgent = (userAgent) => {
    const ua = uaParser(userAgent)
    return [ua.device.type || '', ua.browser.name || '']
}   

const writeToCsv = (outputFile, values) => {
    const line = values.join(",") + '\n'
    fs.appendFileSync(outputFile, line, { flag: 'a' }, console.log);
}

// TODO: UserAgent can have commas, which can go to final CSV ... does this need to be resolved?
const processLine = (line) => {
    const data = splitargs(line)
    const [ ip, userIdentifier, userId, time, tzOffset, request, status, size, referrer, userAgent ] = data
    const [ country, state ] = resolveGeoIp(ip)
    const [ deviceType, browser ] = resolveUserAgent(userAgent)

    return [ip, userIdentifier, userId, `${time} ${tzOffset}`, `"${request}"`, status, size, `"${referrer}"`, `"${userAgent}"`, country, state, deviceType, browser]
}

// Read an access log file, parse into json
const processLogFile = (sourceFile, destinationFile) => {

    const liner = new lineByLine(sourceFile);

    let line;
    let lineNumber = 0;
     
    while (line = liner.next()) {

        const result = processLine(line.toString('ascii'))
        writeToCsv(destinationFile, result)
        lineNumber++;

    }

    console.log(`processed ${lineNumber} rows`)
}

start()