var http = require('http');
var child_process = require('child_process');
var connect = require('connect');
var url_lib = require('url');
var spawn = child_process.spawn;


/**
* Spawn a "python -c" child process
*/
function spawn_python(command, version) {
  return spawn(
      'python' + version, 
      ['-c', command]
  );
}

/**
* Parse the URL and pull out the query params
*/
function get_params(url) {
    var parsed_url = url_lib.parse(url, true);
    var params = {
        version: null,
        command: null,
    }
    if (parsed_url.query) {
        if (parsed_url.query.command) {
            params.command =  parsed_url.query.command;
        }
        if (parsed_url.query.version) {
            params.version = parsed_url.query.version;
        }
    }
    return params;
}

/**
* Sanitize the command query parameter
* TODO: use JSON.stringify
*/
function sanitize_command(command) {
  command = command.replace(/\'/ig, "\\'");
  command = command.replace(/\"/ig, '\\"');
  return command
}

/**
* Sanitize the python output
* TODO: use JSON.stringify
*/
function sanitize_output(data) {
  var d = data.toString();
  d = d.replace(/\'/ig, '&quot;');
  d = d.replace(/\"/ig, '&apos;');
  d = d.replace(/\</ig, '&lt;');
  d = d.replace(/\>/ig, '&gt;');
  d = d.replace(/\n/ig, '<br/>');
  d = d.replace(/\s/ig, '&nbsp;');
  return d
}

/**
* Create an HTTP server with a session
*/
var s = connect.createServer(connect.cookieParser(), connect.session({ secret: 'keyboard cat' }),
  function(req, res) {
    var params = get_params(req.url);
    var sid = req.session.id;
  
    // start our html output
    res.writeHead(200, { 'content-type': 'text/plain' });

    if (params.command) {
      // spawn python with command and version
      // TODO: sanitize query string
      var python_shell = spawn_python(params.command, params.version);
      var command = sanitize_command(params.command);

      // kill the child process when the request is done
      req.connection.on('end', function() {
        python_shell.kill();
      })

      python_shell.stderr.on('data', function(data) {
          res.end('shell.set_output(\'{"command" : "' + command + '", "output" : "' + sanitize_output(data) + '"}\')');
      })

      python_shell.stdout.on('data', function(data) {
          res.end('shell.set_output(\'{"command" : "' + command + '", "output": "' + sanitize_output(data) + '"}\')');
      })

      python_shell.on('exit', function(code) {
        if (code == 0) {
          res.end('shell.set_output(\'{"command" : "' + command + '", "output" : ""}\')');
        }
      })
    } else {
      res.write('shell.set_output(\'{"command" : "", "output" : ""}\')');
      res.end();
    }
  }
);

s.listen(8008);