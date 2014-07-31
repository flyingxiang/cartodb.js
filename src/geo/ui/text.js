cdb.geo.ui.Text = cdb.core.View.extend({

  className: "cartodb-overlay overlay-text",

  events: {
    "click": "stopPropagation"
  },

  default_options: { },

  stopPropagation: function(e) {

    e.stopPropagation();

  },

  initialize: function() {

    _.defaults(this.options, this.default_options);

    this.template = this.options.template;

    var self = this;

    $(window).on("map_resized", function() {
      self._place();
    });

    $(window).on("resize", function() {
      self._place();
    });

  },

  _applyStyle: function() {

    var style      = this.model.get("style");

    var boxColor   = style["box-color"];
    var boxOpacity = style["box-opacity"];
    var boxWidth   = style["box-width"];
    var fontFamily = style["font-family-name"];

    this.$text.css(style);
    this.$text.css("font-size", style["font-size"] + "px");

    var fontFamilyClass = "";

    if      (fontFamily  == "Droid Sans") fontFamilyClass = "droid";
    else if (fontFamily  == "Vollkorn")   fontFamilyClass = "vollkorn";
    else if (fontFamily  == "Open Sans")  fontFamilyClass = "open_sans";
    else if (fontFamily  == "Roboto")     fontFamilyClass = "roboto";

    var rgbaCol = 'rgba(' + parseInt(boxColor.slice(-6,-4),16)
    + ',' + parseInt(boxColor.slice(-4,-2),16)
    + ',' + parseInt(boxColor.slice(-2),16)
    +', ' + boxOpacity + ' )';

    this.$el
    .removeClass("droid")
    .removeClass("vollkorn")
    .removeClass("roboto")
    .removeClass("open_sans");

    this.$el.addClass(fontFamilyClass);
    this.$el.css({
      backgroundColor: rgbaCol,
      maxWidth:        boxWidth
    });

  },

  _place: function() {

    var extra =this.model.get("extra");

    var top   = this.model.get("y");
    var left  = this.model.get("x");

    var bottomPosition = this.model.get("extra").b - this.$el.height();
    var rightPosition  = this.model.get("extra").r - this.$el.width();

    // position percentages
    var pTop  = extra.pTop;
    var pLeft = extra.pLeft;

    var right  = "auto";
    var bottom = "auto";

    var marginTop  = 0;
    var marginLeft = 0;

    var width = extra.width;

    var portraitDominantSide  = extra.portraitDominantSide;
    var landscapeDominantSide = extra.landscapeDominantSide;

    if ((landscapeDominantSide === 'top' && top > 200) || (landscapeDominantSide === 'top' && bottomPosition > 200)) {

      top = "50%";
      marginTop = -this.$el.height()/2;

    }  else {

      if (portraitDominantSide == 'bottom') {
        top = "auto";
        bottom = bottomPosition;
      }

    }

    if ((landscapeDominantSide === 'left' && left > 200) || (landscapeDominantSide === 'right' && rightPosition > 200)) {

      left = "50%";
      marginLeft = -width/2;

    } else {

      if (landscapeDominantSide == 'right') {
        left = "auto";
        right = rightPosition;
      }

    }

    this.$el.css({
      width: width,
      marginLeft: marginLeft,
      marginTop: marginTop,
      top: top,
      left: left,
      right: right,
      bottom: bottom
    });

  },


  render: function() {

    this._place();

    this.$el.html(this.template(_.extend(this.model.attributes, { text: this.model.attributes.extra.rendered_text })));

    this.$text = this.$el.find(".text");

    this._applyStyle();

    return this;

  }

});
