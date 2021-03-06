'use strict';

(function(root, factory)
{
  if('function' === typeof define && define.amd)
  {
    // AMD. Register as an anonymous module
    define([], factory);
  } else if('object' === typeof module && module.exports)
  {
    // Node. Does not work with strict CommonJS, but only CommonJS-like
    // environments that support module.exports, like Node
    module.exports = factory();
  } else
  {
    // Browser globals (root is window)
    root.Dresscode = factory();
  }
})('object' === typeof self ? self : this, function()
{
  var _slice = Array.prototype.slice
      ,_style
      ,_stylesheet
      ,_lookup
      ,_variable_exists
      ,Dresscode
      ;

  Dresscode = {
    variables: {}

    ,exceptions:
    {
      UndefinedVariable: function UndefinedVariable(_variable)
      {
        this.message = 'Undefined variable "' + _variable + '"';
      }
    }

    ,regex:
    {
      INLINE_AT_RULE: /^at-(charset|import|namespace)-([a-z-][a-z0-9-]*)$/
      ,NORMAL_RULE: /^((at-([a-z-][a-z0-9-]*)_)*)((--([a-z-][a-z0-9-]*)_)*)([a-z][a-z-]*)_([a-z0-9-]+)$/
      ,KEBAB_CASE: /-([a-z])/gi
    }

    ,init: function init()
    {
      _lookup          = this.lookup;
      _variable_exists = this.variable_exists;

      if((_style = document.querySelector('style#dresscode')))
      {
        _stylesheet    = _style.sheet;
        this.variables = _style.dataset;
      } else
      {
        _style      = document.head.appendChild(document.createElement('style'));
        _style.id   = 'dresscode';
        _stylesheet = _style.sheet;
      }

      // =================
      // = CONFIGURATION =
      // =================

      // config#clean = false
      // Whether or not to remove original Dresscode style tags
      if(_variable_exists.call(Dresscode, 'clean'))
      {
        this.clean = function clean(_node)
        {
          _node.parentNode.removeChild(_node);
        };
      }

      // config#getDressed = false
      // Whether or not to automatically parse Dresscode elements and compile a
      // stylesheet
      if(_variable_exists.call(Dresscode, 'getDressed'))
      {
        this.dress();
      }

      // config#refreshInterval = null
      // The number of seconds to wait before refreshing the page
      // * Useful for dev mode (omit this option for production)
      (function()
      {
        var _refresh_interval, _meta;

        if((_refresh_interval = _lookup.call(Dresscode, 'refreshInterval', Number)))
        {
          _meta           = document.createElement('meta');
          _meta.httpEquiv = 'refresh';
          _meta.content   = Math.max(1, _refresh_interval);

          document.head.appendChild(_meta);
        }
      })();

      Dresscode.style      = _style;
      Dresscode.stylesheet = _stylesheet;
    }

    ,clean: function clean(){}

    ,lookup: function lookup(_variable_key, _type, _default)
    {
      _type    = _type || String;
      _default = _default || null;

      return this.variables.hasOwnProperty(_variable_key)
        ? _type(this.variables[_variable_key])
        : _default;
    }

    ,variable_exists: function variable_exists(_variable_key)
    {
      return this.variables.hasOwnProperty(_variable_key);
    }

    ,helpers:
    {
      to_camel_case: function to_camel_case(_match, _character_after_hyphen)
      {
        return _character_after_hyphen.toUpperCase();
      }
    }

    ,dress: function dress()
    {
      var _nodes = document.querySelectorAll('[data-dresscode]')
          ,_ruleset
          ,_rule
          ,_keys
          ,_key
          ,i
          ,k
          ;

      this.start_time_ms = Date.now();
      this.output        = '';

      for(i = 0; i < _nodes.length; i++)
      {
        var _node = _nodes[i];

        _ruleset = new this.RuleSet(_node);

        for(_keys = Object.keys(_ruleset.rules), k = 0; k < _keys.length; k++)
        {
          _key  = _keys[k];
          _rule = _key
            + '{'
            + _ruleset.rules[_key].entries.join(';')
            + '}'
            + _ruleset.rules[_key].closing_braces
            ;

          this.output += _rule;

          _stylesheet.insertRule(_rule, _stylesheet.cssRules.length);
        }

        this.clean(_node);
      }

      this.end_time_ms   = Date.now();
      this.dress_time_ms = this.end_time_ms - this.start_time_ms;
    }

    ,RuleSet: function RuleSet(_node)
    {
      var _classname, _rule, i;

      this.variables = _node.dataset;
      this.dresscode = this.variables.dresscode;
      this.classes   = _slice.call(_node.classList);
      this.rules     = {};

      for(i = 0; i < this.classes.length; i++)
      {
        _classname = this.classes[i];

        _rule = {
          match          : Dresscode.regex.NORMAL_RULE.exec(_classname)
          ,key            : ''
          ,at_rules       : ''
          ,pseudos        : ''
          ,property       : ''
          ,value          : ''
          ,closing_braces : ''
        };

        if(_rule.match)
        {
          this.decorate_at_rules(_rule)   // Add formatted @rules to key
              .decorate_dresscode(_rule)  // Add formatted dresscode to key
              .decorate_pseudos(_rule)    // Add formatted pseudo-classes/element to key
              ;

          _rule.property = _rule.match[7];  // Index 7 == CSS declaration property (eg, width)
          _rule.value    = this.parse_value(_rule);

          if(!this.rules.hasOwnProperty(_rule.key))
          {
            this.rules[_rule.key] = {
              entries         : [_rule.property + ':' + _rule.value]
              ,closing_braces : _rule.closing_braces
            };
          } else
          {
            this.rules[_rule.key].entries.push(
              _rule.property + ':' + _rule.value
            );
          }
        }
      }
    }
  };

  Dresscode.RuleSet.prototype = {
    lookup: function lookup(_variable_key, _default)
    {
      _variable_key = _variable_key.replace(Dresscode.regex.KEBAB_CASE, Dresscode.helpers.to_camel_case);
      _default      = _default || null;

      return (
        this.variables[_variable_key]
        || Dresscode.lookup(_variable_key)
        || _default
      );
    }

    ,decorate_at_rules: function decorate_at_rules(_rule)
    {
      // Append formatted @rules, if any, to rule's `key` property
      var _at_rules = _rule.match[1].split('_')  // Index 1 == CSS @rules (eg, at-sm_at-import_)
          ,_variable_key
          ,_variable_value
          ;

      while((_variable_key = _at_rules.shift()))
      {
        // Apply @rules from left to right (outside-in)
        _variable_key   = _variable_key.replace(/^at-/, '');
        _variable_value = this.lookup(_variable_key);

        if((_variable_value = this.lookup(_variable_key)))
        {
          _rule.key            += '@' + _variable_value + '{';
          _rule.closing_braces  = '}' + _rule.closing_braces;
        } else
        {
          throw new Dresscode.exceptions.UndefinedVariable(_variable_key);
        }
      }

      return this;
    }

    ,decorate_dresscode: function decorate_dresscode(_rule)
    {
      _rule.key += '.' + this.dresscode;

      return this;
    }

    ,decorate_pseudos: function decorate_pseudos(_rule)
    {
      // Append formatted pseudo-classes/pseudo-element, if any, to rule's
      // `key` property
      _rule.key += _rule.match[4]  // Index 4 == CSS pseudo classes/element (eg, --hover_--first-child_)
        .replace(/_/g, '')
        .replace(/--/g, ':')
        ;

      return this;
    }

    ,parse_value: function parse_value(_rule)
    {
      var _result    = _rule.match[8]  // Index 8 == CSS declaration value (eg, 300px)
          ,_percent  = /([0-9])pc$/i
          ,_decimal  = /([0-9])p([0-9]+)/i
          ,_variable = /var-([a-z][a-z0-9-]*)/i
          ,_variable_key
          ,_variable_value
          ,_match
          ;

      _result = _result.replace(_percent, '$1%')
                       .replace(_decimal, '$1.$2');

      if((_match = _variable.exec(_result)))
      {
        _variable_key = _match[1];

        if(!(_variable_value = this.lookup(_variable_key)))
        {
          throw new Dresscode.exceptions.UndefinedVariable(_variable_key);
        }

        _result = _result.replace(_variable, _variable_value);
      }

      return _result;
    }
  };

  Dresscode.init();

  return Dresscode;
});
