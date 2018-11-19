const fs   = require('fs');
const path = require('path');

module.exports = {
  load_html: function(_file_stem)
  {
    var _html = fs.readFileSync(path.join(__dirname, 'views', _file_stem + '.html'), 'utf8');

    document.getElementsByTagName('html')[0].innerHTML = _html;
  }
};

