var Shell = Class.$extend({
    __init__ : function() {
        this.url = "http://localhost:8008/";
        this.cmd_q = [];
        this.cmd_q_pointer = 0;
        this.version = '2.7'

        // set up some default elements
        this._skel = $('div#shell');

        // default prompt
        this._shell_input = null;
        this._prompt = null;
        this.prefix = '>>> ';
        this.input = '<input onfocus="this.value = this.value;" id="shell_input" type="text" name="command" value="" />';

        // render the shell prompt and set events
    this.start();
    },
  start : function() {
      this.render_version();
      this.render_prompt();
      this.set_events();            
  },
  clear : function () {
      this.cmd_q_pointer = 0;
      this.cmd_q = [];
      this._skel.empty();
  },
  set_version: function(version) {
      this.version = version;
  },
    set_events : function() {
        var _this = this;
        this._input.keypress(function(eh) {
            if (eh.keyCode == 13) {
                var command = $(this).val();
                _this.cmd_q_pointer = 0;
                _this.get_output(command);
                _this.cmd_q.push(command);
            }
            if (eh.keyCode == 38) {
                if (_this.cmd_q_pointer == 0) {
                    _this.cmd_q_pointer = _this.cmd_q.length - 1
                    $(this).val(_this.cmd_q[_this.cmd_q_pointer]);
                } else {
                    _this.cmd_q_pointer--;
                    $(this).val(_this.cmd_q[_this.cmd_q_pointer]);
                }
                $(this).focus();
            }
            if (eh.keyCode == 40) {
                if (_this.cmd_q_pointer != (_this.cmd_q.length - 1)) {
                    _this.cmd_q_pointer++;
                    $(this).val(_this.cmd_q[_this.cmd_q_pointer]);
                }
            }
        })
    },
    restart_prompt: function(command) {
        this._prompt.removeAttr('id');
        this._input.remove();
        this._prompt.append(command);
        this.render_prompt();
        this.set_events();              
    },
    render_version : function() {
        var version = '<p>Python ' + this.version + '</p>';
        this._skel.append(version);
    },
    render_prompt : function() {
        var prompt = '<p id="prompt">' + this.prefix + this.input + '</p>';
        this._skel.append(prompt);
        this._prompt = $('div#shell p#prompt');
        this._input = this._prompt.find('input#shell_input');
        this._input.focus();
    },
    get_output : function(command) {
        var _this = this;
        $.ajax({
            url: _this.url,
            cache: false,
            dataType: "jsonp",
            jsonpCallback: "shell.set_output",
            data: {
                command: command,
                version: _this.version
            }
        });             
    },
    set_output : function(data) {
        data = $.parseJSON(data);
        var output = '<p class="output">' + data.output + '</p>';
        this._skel.append(output);
        this.restart_prompt(data.command);
    }
})
var shell = Shell();

$('a.python-version').click(function() {
   $('a.python-version').each(function() {
       $(this).removeClass('selected');
   });
   $(this).addClass('selected');

   var version = $(this).attr('data-version');
   shell.set_version(version);
   shell.clear();
   shell.start();
   return false;
});