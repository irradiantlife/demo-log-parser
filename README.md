# demo-log-parser


# Instructions

## Setup:
 This program was written with:
  `npm: '8.11.0'
  node: '16.16.0'`
It's recommended to use these.

--in a terminal, at project root:
 run `npm install`
 run `npm link` to create the CLI tool.

## Usage:
-- use CLI arguments to specify source and destination, or ensure there is a valid logs/demo.log present
--run `process-log`
-- observe a file is created or appended at the destination
# Considerations:

## Time drains:
The first part of the assignment, I spent a lot of time exploring a solution using JS modules. Eventually I started over and focused on a CLI with simple 'require' statements.

The other big time-suck was the log parsing. Per the assignment overview, I really wanted to find a library that would cleanly create json objects from rows, however, I didn't see anything popular that 1) included userAgent and 2) wasn't middleware for a web server. After a while I decided to just handle splitting the line and move on.

## Dependencies

`geoip-lite` was chosen for IP to Geo lookup. This matched the suggestion in the assignment overview.
`n-readlines` was chosen to process the source files line-by-line. It does not load the entire file into memory, and has a convenient loader and usage pattern.
`node-cache` was chosen for an in-memory key-value cache. It is likely that there will be a high level of duplicate IP addresses in any log file. GeoIP-lite performance is 6-10ms per call and may be subject to throttling.
`splitargs` was chosen to solve the need for splitting the log lines on spaces, except where enclosed in quotes. I was surprised to find there are not more common CLF-to-JSON utilities w/o moving to a streaming solution.
`ua-parser-js` was chosen to extract device and browser from user agent. Its npm numbers are so high that I did not consider options.


## furthere explorations:

-- input arguments for file names
-- docker
-- unit tests
-- count cache hits



# Assignment:


== Overview ==
Create a log parser that can:
Read an access log file
Resolve Country and State from IP address (IE MaxMind GeoLite2 Free)
Translate useragent to device type (Mobile, Desktop, Tablet) and Browser (Safari, Chrome, etc)
Combine new Geo & Device fields with existing fields on access log file and output/export a CSV
The goal of this test is to showcase your ability to leverage existing libraries without writing an exhaustive amount of code. Reach out to us if you need additional direction.
Below is a sample access log you can use if you don't have one.
https://cti-developer-dropbox.s3.amazonaws.com/gobankingrates.com.access.log
 
== Requirements ==
Any libraries must be installed via a package manager
Must be run from the cli
Provide instructions on how to build and run
Must be written in either PHP, Python or NodeJS
Commit to Github/GitLab and provide link for ConsumerTrack Staff to Review


