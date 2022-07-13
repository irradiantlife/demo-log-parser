#!/usr/bin/env node
const lineByLine = require('n-readlines');
const splitargs = require('splitargs');
var geoip = require('geoip-lite');
var uaParser = require('ua-parser-js');
const NodeCache = require( "node-cache" );

const cache = new NodeCache({ maxKeys: 100000000 });

const start = () => {
    console.log('starting process')

    // TODO: use CLI to read filenames
    const sourceFileName =  __dirname + '/logs/gobankingrates.com.access.log'
    console.log(`processing ${sourceFileName}`)

    const destinationFileName = './output.csv'

    processLogFile(sourceFileName, destinationFileName)
}

// Use an in-memory cache to store IP lookups in case of duplicates. The API can take 6-10ms to retrieve a lookup. 
const resolveGeoIp = async (ip) => {
    let value = cache.get(ip);
    if ( value == undefined ) {
        const geo = geoip.lookup(ip);
        value = [geo.country || '' ,geo.state || '']
    }
    
    return value
}

const resolveUserAgent = async (userAgent) => {
    const ua = uaParser(userAgent)
    return [ua.device.type || '', ua.browser.name || '']
}   


const writeToCsv = (outputFile, values) => {
    console.log(values)
    console.log(values.join(","))
}


// really couldn't find a nice log fileparser that did what I like.
// This method isn't ideal, either
// UserAgent can have commas, which will go to final CSV
const processLine = (line) => {
    const data = splitargs(line)
    const [ ip, userIdentifier, userId, time, tzOffset, request, status, size, referrer, userAgent ] = data
    const [ country, state ] = await resolveGeoIp(ip)
    const [ deviceType, browser ] = await resolveUserAgent(userAgent)

    // The inline formatting could be improved
    return [ip, userIdentifier, userId, `${time} ${tzOffset}`, `"${request}"`, status, size, `"${referrer}"`, `"${userAgent}"`, country, state, deviceType, browser]

}

// Read an access log file, parse into json
const processLogFile = (sourceFile, destinationFile) => {

    const liner = new lineByLine(sourceFile);

    let line;
    let lineNumber = 0;
     
    while (line = liner.next()) {

        const result =  processLine(line.toString('ascii'))
        writeToCsv(result, destinationFile)
        lineNumber++;

        if (lineNumber > 10) break
    }
}

// synchronous closing statement
const finish = () => {
    console.log('reached end')
    process.exit()
  }


start()
finish()